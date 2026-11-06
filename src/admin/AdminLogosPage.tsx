import DOMPurify from "dompurify";
import { Check, History, ImagePlus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminAuth } from "./AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface BrandAsset {
  id: string;
  name: string;
  asset_type: string;
  file_path: string;
  alt_text: string;
  is_active: boolean;
  is_default: boolean;
  preview_url: string;
  uploaded_at: string;
}

const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSize = 5 * 1024 * 1024;

export function AdminLogosPage() {
  const { session } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data, error: loadError } = await supabase.from("brand_assets")
      .select("id,name,asset_type,file_path,alt_text,is_active,is_default,uploaded_at")
      .order("uploaded_at", { ascending: false });
    if (loadError) { setError(loadError.message); setLoading(false); return; }

    const logos = ((data ?? []) as BrandAsset[]).filter((asset) =>
      !asset.asset_type.startsWith("Favicon")
      && !asset.asset_type.includes("×")
      && !asset.asset_type.startsWith("Apple touch")
      && !asset.asset_type.startsWith("Formal corporate logo"));
    const withPreviews = await Promise.all(logos.map(async (asset) => {
      const { data: signed, error: signError } = await supabase!.storage.from("brand-assets")
        .createSignedUrl(asset.file_path, 3600);
      if (signError) {
        setError(`Could not preview ${asset.name}: ${signError.message}`);
        return { ...asset, preview_url: "" };
      }
      return { ...asset, preview_url: signed.signedUrl };
    }));
    setAssets(withPreviews);
    setLoading(false);
  }

  useEffect(() => {
    void load().catch((loadError: Error) => {
      setError(loadError.message);
      setLoading(false);
    });
  }, []);

  async function upload(file?: File) {
    if (!file || !supabase) return;
    setError("");
    setNotice("");
    if (!session?.user.id) { setError("Sign in again before uploading a logo."); return; }
    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    if (!isSvg && !allowedTypes.includes(file.type)) { setError("Choose an SVG, PNG, JPG or WebP logo."); return; }
    if (file.size > maxSize) { setError("Logos must be 5 MB or smaller."); return; }

    setBusy(true);
    let body: File | Blob = file;
    let contentType = isSvg ? "image/svg+xml" : file.type;
    if (isSvg) {
      const clean = DOMPurify.sanitize(await file.text(), { USE_PROFILES: { svg: true, svgFilters: true } });
      if (!clean.includes("<svg")) { setError("The SVG could not be safely sanitised."); setBusy(false); return; }
      body = new Blob([clean], { type: "image/svg+xml" });
      contentType = "image/svg+xml";
    }

    const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");
    const path = `${session.user.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("brand-assets").upload(path, body, { contentType });
    if (uploadError) { setError(uploadError.message); setBusy(false); return; }

    const { data: asset, error: insertError } = await supabase.from("brand_assets").insert({
      name: file.name.replace(/\.[^.]+$/, ""),
      asset_type: "Primary logo",
      file_path: path,
      alt_text: "Muanotronics",
      background_suitability: "both",
      uploaded_by: session.user.id,
    }).select("id,name,asset_type,file_path,alt_text,is_active,is_default,uploaded_at").single();
    if (insertError) {
      const { error: cleanupError } = await supabase.storage.from("brand-assets").remove([path]);
      setError(cleanupError ? `${insertError.message}; uploaded file cleanup failed: ${cleanupError.message}` : insertError.message);
      setBusy(false);
      return;
    }

    const { error: defaultError } = await supabase.rpc("set_default_brand_asset", { target_id: asset.id });
    if (defaultError) {
      setError(`Logo uploaded, but it could not be set as the current logo: ${defaultError.message}`);
      await load();
      setBusy(false);
      return;
    }

    await load();
    setNotice("Logo updated. Your previous logo is kept in the history.");
    window.dispatchEvent(new Event("muanotronics:brand-updated"));
    setBusy(false);
  }

  async function restore(asset: BrandAsset) {
    if (!supabase || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const { error: updateError } = await supabase.rpc("set_default_brand_asset", { target_id: asset.id });
    if (updateError) setError(updateError.message);
    else {
      await load();
      setNotice("Previous logo restored as the current logo.");
      window.dispatchEvent(new Event("muanotronics:brand-updated"));
    }
    setBusy(false);
  }

  const currentLogo = assets.find((asset) => asset.is_default);
  const previousLogos = assets.filter((asset) => !asset.is_default);

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">BRANDING</p><h1>Logo</h1><p>Upload a new logo or restore a previous one.</p></div>
      </div>
      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Configure the backend to manage the logo.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success" role="status">{notice}</div>}

      <div className="admin-logo-manager">
        <section aria-label="Upload logo" className="admin-card admin-logo-uploader">
          <div className="admin-card__heading"><div><h2>Upload logo</h2><p>SVG, PNG, JPG or WebP · 5 MB maximum</p></div></div>
          <input accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp" hidden onChange={(event) => {
            void upload(event.target.files?.[0]).catch((uploadError: Error) => { setError(uploadError.message); setBusy(false); });
            event.currentTarget.value = "";
          }} ref={inputRef} type="file" />
          <button className="admin-logo-upload-button" disabled={!isSupabaseConfigured || busy} onClick={() => inputRef.current?.click()} type="button">
            <ImagePlus size={27} />
            <strong>{busy ? "Updating logo…" : "Choose a logo to upload"}</strong>
            <span>Your new logo becomes current. The previous logo stays available to restore.</span>
            <span className="admin-button admin-button--primary"><Upload size={15} /> Choose file</span>
          </button>
        </section>

        <section aria-label="Current and previous logos" className="admin-logo-history">
          <article className="admin-card admin-logo-current">
            <div className="admin-card__heading"><div><h2>Current logo</h2><p>Shown on your website</p></div><Check aria-hidden="true" size={18} /></div>
            {loading ? <div className="admin-loading">Loading logo…</div> : currentLogo ? (
              <div className="admin-logo-history__preview">
                {currentLogo.preview_url ? <img alt={currentLogo.alt_text} src={currentLogo.preview_url} /> : <span>Preview unavailable</span>}
                <strong>{currentLogo.name}</strong>
              </div>
            ) : <p className="admin-empty">No current logo has been uploaded.</p>}
          </article>

          <article className="admin-card">
            <div className="admin-card__heading"><div><h2><History aria-hidden="true" size={16} /> Previous logos</h2><p>Restore an earlier logo at any time</p></div></div>
            {loading ? <div className="admin-loading">Loading logo history…</div> : previousLogos.length ? (
              <div className="admin-logo-history__list">{previousLogos.map((asset) => (
                <div className="admin-logo-history__item" key={asset.id}>
                  <div className="admin-logo-history__thumbnail">
                    {asset.preview_url ? <img alt={asset.alt_text} src={asset.preview_url} /> : <span>Preview unavailable</span>}
                  </div>
                  <span title={asset.name}>{asset.name}</span>
                  <button className="admin-button admin-button--small" disabled={busy || !isSupabaseConfigured} onClick={() => void restore(asset)} type="button">Restore</button>
                </div>
              ))}</div>
            ) : <p className="admin-empty">Previous logos will appear here after you upload a new one.</p>}
          </article>
        </section>
      </div>
    </>
  );
}
