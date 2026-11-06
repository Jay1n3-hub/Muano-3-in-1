import DOMPurify from "dompurify";
import { Check, Star, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminAuth } from "./AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface BrandAsset {
  id: string;
  name: string;
  asset_type: string;
  file_path: string;
  alt_text: string;
  background_suitability: string;
  is_active: boolean;
  is_default: boolean;
  is_favicon_default: boolean;
  preview_url: string;
}

const logoKinds = [
  "Primary logo", "Formal corporate logo (legal name unconfirmed)", "Compact logo",
  "Stacked logo", "Icon-only logo", "Favicon SVG", "Favicon ICO", "16 × 16 PNG",
  "32 × 32 PNG", "Apple touch icon", "192 × 192 icon", "512 × 512 icon",
];

export function AdminLogosPage() {
  const { session } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [selectedKind, setSelectedKind] = useState(logoKinds[0]);
  const [name, setName] = useState(logoKinds[0]);
  const [alt, setAlt] = useState("Muanotronics Electronics Solutions");
  const [suitability, setSuitability] = useState("both");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data, error: loadError } = await supabase.from("brand_assets").select("*").order("uploaded_at", { ascending: false });
    if (loadError) { setError(loadError.message); setLoading(false); return; }
    const rows = (data ?? []) as BrandAsset[];
    const signed = await Promise.all(rows.map(async (asset) => {
      const { data: result, error: signError } = await supabase!.storage.from("brand-assets").createSignedUrl(asset.file_path, 3600);
      if (signError) {
        setError(`Could not preview ${asset.name}: ${signError.message}`);
        return asset;
      }
      return { ...asset, preview_url: result.signedUrl };
    }));
    setAssets(signed);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function upload(file?: File) {
    if (!file || !supabase) return;
    setError(""); setNotice("");
    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    const isIcon = file.type === "image/x-icon" || file.type === "image/vnd.microsoft.icon" || file.name.toLowerCase().endsWith(".ico");
    const allowed = isSvg || isIcon || ["image/png", "image/jpeg", "image/webp"].includes(file.type);
    if (!allowed) { setError("Choose an SVG, PNG, JPG, WebP or ICO brand image."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Brand images must be 5 MB or smaller."); return; }
    let body: File | Blob = file;
    let contentType = isSvg ? "image/svg+xml" : isIcon ? "image/x-icon" : file.type;
    if (isSvg) {
      const raw = await file.text();
      const clean = DOMPurify.sanitize(raw, { USE_PROFILES: { svg: true, svgFilters: true } });
      if (!clean.includes("<svg")) { setError("The SVG could not be safely sanitised."); return; }
      body = new Blob([clean], { type: "image/svg+xml" });
      contentType = "image/svg+xml";
    }

    setBusy(true);
    const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");
    const path = `${session?.user.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("brand-assets").upload(path, body, { contentType });
    if (uploadError) { setError(uploadError.message); setBusy(false); return; }
    const { error: insertError } = await supabase.from("brand_assets").insert({
      name: name.trim() || selectedKind,
      asset_type: selectedKind,
      file_path: path,
      alt_text: alt.trim(),
      background_suitability: suitability,
      uploaded_by: session?.user.id,
    });
    if (insertError) {
      const { error: cleanupError } = await supabase.storage.from("brand-assets").remove([path]);
      setError(cleanupError ? `${insertError.message}; uploaded file cleanup failed: ${cleanupError.message}` : insertError.message);
    } else {
      setNotice("Brand asset uploaded. Existing master artwork has not been changed.");
      await load();
    }
    setBusy(false);
  }

  async function setDefault(asset: BrandAsset) {
    if (!supabase) return;
    const isFavicon = asset.asset_type.startsWith("Favicon") || asset.asset_type.includes("×") || asset.asset_type.startsWith("Apple touch");
    if (!isFavicon && asset.asset_type.startsWith("Formal corporate logo")) {
      setError("The formal Pty Ltd logo must not be activated until the registered legal name is confirmed.");
      return;
    }
    setError(""); setNotice("");
    const { error: updateError } = await supabase.rpc(isFavicon ? "set_default_favicon_asset" : "set_default_brand_asset", { target_id: asset.id });
    if (updateError) setError(updateError.message);
    else {
      await load();
      setNotice(isFavicon ? "Default favicon updated." : "Default logo updated. The public website uses the active default brand asset.");
      window.dispatchEvent(new Event("muanotronics:brand-updated"));
    }
  }

  async function update(asset: BrandAsset, values: Partial<BrandAsset>) {
    if (!supabase) return;
    if (asset.is_default && values.is_active === false) { setError("Choose another default logo before deactivating this asset."); return; }
    const { error: updateError } = await supabase.from("brand_assets").update(values).eq("id", asset.id);
    if (updateError) setError(updateError.message);
    else { await load(); setNotice("Brand asset updated."); }
  }

  async function remove(asset: BrandAsset) {
    if (!supabase || !window.confirm(`Delete ${asset.name}?`)) return;
    if (asset.is_default || asset.is_favicon_default) { setError("Choose another default logo or favicon before deleting this asset."); return; }
    const { error: storageError } = await supabase.storage.from("brand-assets").remove([asset.file_path]);
    if (storageError) { setError(storageError.message); return; }
    const { error: rowError } = await supabase.from("brand_assets").delete().eq("id", asset.id);
    if (rowError) setError(`File removed, but the brand asset record could not be deleted: ${rowError.message}`);
    else { setAssets((current) => current.filter((item) => item.id !== asset.id)); setNotice("Brand asset deleted."); }
  }

  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">BRANDING</p><h1>Logo Manager</h1><p>Manage approved brand artwork and favicon files.</p></div><button className="admin-button admin-button--primary" disabled={!isSupabaseConfigured || busy} onClick={() => inputRef.current?.click()} type="button"><Upload size={15} /> Upload Brand Asset</button></div>
      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Configure the backend to manage brand assets.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success">{notice}</div>}
      <input accept=".svg,.png,.jpg,.jpeg,.webp,.ico,image/svg+xml,image/png,image/jpeg,image/webp,image/x-icon" hidden onChange={(event) => void upload(event.target.files?.[0])} ref={inputRef} type="file" />
      <div className="admin-card admin-logo-upload">
        <div className="admin-card__heading"><div><h2>Add an approved logo or favicon</h2><p>SVG uploads are sanitised before storage. Keep the master artwork elsewhere as the source.</p></div></div>
        <div className="admin-form--editor">
          <label className="admin-field"><span>Asset type</span><select onChange={(event) => { setSelectedKind(event.target.value); setName(event.target.value); }} value={selectedKind}>{logoKinds.map((kind) => <option key={kind}>{kind}</option>)}</select></label>
          <label className="admin-field"><span>Asset name</span><input onChange={(event) => setName(event.target.value)} value={name} /></label>
          <label className="admin-field admin-field--wide"><span>Alternative text</span><input onChange={(event) => setAlt(event.target.value)} value={alt} /></label>
          <label className="admin-field"><span>Background suitability</span><select onChange={(event) => setSuitability(event.target.value)} value={suitability}><option value="both">Light and dark</option><option value="light">Light background</option><option value="dark">Dark background</option></select></label>
        </div>
        <div className="admin-editor-actions"><button className="admin-button admin-button--primary" disabled={busy || !isSupabaseConfigured} onClick={() => inputRef.current?.click()} type="button">{busy ? "Uploading…" : "Choose file and upload"}</button></div>
      </div>
      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-card__heading"><div><h2>Uploaded brand assets</h2><p>The legal name variant remains inactive until confirmed by the stakeholder.</p></div></div>
        {loading ? <div className="admin-loading">Loading brand assets…</div> : !assets.length ? <div className="admin-empty">No logo assets uploaded yet. The public site continues using its original vector mark.</div> : (
          <div className="admin-logo-grid">{assets.map((asset) => <article className="admin-logo-card" key={asset.id}>
            <div className="admin-logo-previews"><div className="admin-preview-box"><img alt={asset.alt_text} src={asset.preview_url} /></div><div className="admin-preview-box admin-preview-box--dark"><img alt={asset.alt_text} src={asset.preview_url} /></div></div>
            <div className="admin-logo-card__body">
              <label className="admin-field"><span>Name</span><input defaultValue={asset.name} onBlur={(event) => { if (event.target.value !== asset.name) void update(asset, { name: event.target.value }); }} /></label>
              <label className="admin-field"><span>Alt text</span><input defaultValue={asset.alt_text} onBlur={(event) => { if (event.target.value !== asset.alt_text) void update(asset, { alt_text: event.target.value }); }} /></label>
              <label className="admin-check"><input checked={asset.is_active} onChange={(event) => void update(asset, { is_active: event.target.checked })} type="checkbox" /> Active</label>
              <div className="admin-editor-actions">
                <button className={`admin-button${asset.is_default || asset.is_favicon_default ? " admin-button--primary" : ""}`} onClick={() => void setDefault(asset)} type="button">{asset.is_default || asset.is_favicon_default ? <><Check size={14} /> Default</> : <><Star size={14} /> Set Default</>}</button>
                <button aria-label={`Delete ${asset.name}`} className="admin-icon-button admin-icon-button--danger" onClick={() => void remove(asset)} type="button"><X size={15} /></button>
              </div>
            </div>
          </article>)}</div>
        )}
      </div>
    </>
  );
}
