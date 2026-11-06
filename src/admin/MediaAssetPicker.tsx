import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminAuth } from "./AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface MediaAsset {
  id: string;
  file_name: string;
  storage_path: string;
  alt_text: string;
  is_published: boolean;
  preview: string;
}

interface MediaAssetPickerProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  category: "homepage" | "about" | "services" | "gallery" | "general";
  multiple?: boolean;
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 10 * 1024 * 1024;

export function MediaAssetPicker({ label, value, onChange, category, multiple = false }: MediaAssetPickerProps) {
  const { session } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedPaths = Array.isArray(value) ? value : value ? [value] : [];
  const currentExternal = selectedPaths.filter((path) => /^https?:\/\//i.test(path));

  async function loadAssets() {
    if (!supabase) { setLoading(false); return; }
    const { data, error: loadError } = await supabase.from("media_assets")
      .select("id,file_name,storage_path,alt_text,is_published")
      .order("uploaded_at", { ascending: false })
      .limit(100);
    if (loadError) {
      setError(loadError.message);
      setLoading(false);
      return;
    }

    const withPreviews = await Promise.all((data ?? []).map(async (asset) => {
      const { data: signed, error: signError } = await supabase!.storage.from("site-media")
        .createSignedUrl(asset.storage_path, 3600);
      if (signError) {
        setError(`Could not load preview for ${asset.file_name}: ${signError.message}`);
        return null;
      }
      return { ...asset, preview: signed.signedUrl };
    }));
    setAssets(withPreviews.filter((asset): asset is MediaAsset => asset !== null));
    setLoading(false);
  }

  useEffect(() => {
    void loadAssets().catch((loadError: Error) => {
      setError(loadError.message);
      setLoading(false);
    });
  }, []);

  async function upload(file?: File) {
    if (!file || !supabase) return;
    setError("");
    if (!session?.user.id) { setError("Sign in again before uploading media."); return; }
    if (!allowedTypes.includes(file.type)) { setError("Choose a JPG, PNG or WebP image."); return; }
    if (file.size > maxSize) { setError("Images must be 10 MB or smaller."); return; }

    setBusy(true);
    const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");
    const path = `${session?.user.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const { data: inserted, error: insertError } = await supabase.from("media_assets").insert({
      file_name: file.name,
      storage_path: path,
      file_type: file.type,
      file_size: file.size,
      alt_text: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      category,
      is_published: true,
      uploaded_by: session?.user.id,
    }).select("id,file_name,storage_path,alt_text").single();
    if (insertError) {
      const { error: cleanupError } = await supabase.storage.from("site-media").remove([path]);
      setError(cleanupError
        ? `${insertError.message}; uploaded file cleanup failed: ${cleanupError.message}`
        : insertError.message);
      setBusy(false);
      return;
    }

    const { data: signed, error: signError } = await supabase.storage.from("site-media")
      .createSignedUrl(inserted.storage_path, 3600);
    if (signError) {
      setError(`Image uploaded, but its preview could not be loaded: ${signError.message}`);
      setBusy(false);
      return;
    }
    const asset = { ...inserted, is_published: true, preview: signed.signedUrl };
    setAssets((current) => [asset, ...current]);
    onChange(multiple ? [...selectedPaths, asset.storage_path] : asset.storage_path);
    setBusy(false);
  }

  async function toggle(asset: MediaAsset) {
    const path = asset.storage_path;
    if (!asset.is_published) {
      if (!supabase) return;
      setError("");
      const { error: publishError } = await supabase.from("media_assets").update({ is_published: true }).eq("id", asset.id);
      if (publishError) { setError(publishError.message); return; }
      setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, is_published: true } : item));
    }
    if (multiple) {
      onChange(selectedPaths.includes(path)
        ? selectedPaths.filter((selected) => selected !== path)
        : [...selectedPaths, path]);
    } else {
      onChange(selectedPaths.includes(path) ? "" : path);
    }
  }

  function clear(path: string) {
    if (multiple) onChange(selectedPaths.filter((selected) => selected !== path));
    else onChange("");
  }

  return (
    <div className="admin-media-picker admin-field--wide">
      <div className="admin-media-picker__heading">
        <span>{label}{multiple ? " (select any number)" : ""}</span>
        <button className="admin-button admin-button--small" disabled={!isSupabaseConfigured || busy} onClick={() => inputRef.current?.click()} type="button">
          <ImagePlus size={14} /> {busy ? "Uploading…" : "Upload image"}
        </button>
        <input accept={allowedTypes.join(",")} hidden onChange={(event) => { void upload(event.target.files?.[0]).catch((uploadError: Error) => { setError(uploadError.message); setBusy(false); }); event.currentTarget.value = ""; }} ref={inputRef} type="file" />
      </div>
      <p className="admin-media-picker__help">JPG, PNG or WebP · 10 MB maximum. Uploaded images are stored in the site media bucket and published for use.</p>
      {error && <p className="admin-notice admin-notice--error" role="alert">{error}</p>}
      {loading ? <p className="admin-loading">Loading published images…</p> : assets.length === 0 && currentExternal.length === 0
        ? <p className="admin-empty">No images yet. Upload project photos here.</p>
        : (
          <div className="admin-media-picker__grid">
            {currentExternal.map((url) => (
              <article className="admin-media-picker__asset" key={url}>
                <img alt="" src={url} />
                <span>Existing external image</span>
                <button aria-label={`Remove ${label}`} className="admin-media-picker__remove" onClick={() => clear(url)} type="button"><X size={14} /></button>
              </article>
            ))}
            {assets.map((asset) => {
              const selected = selectedPaths.includes(asset.storage_path);
              return (
                <button
                  aria-pressed={selected}
                  className={`admin-media-picker__asset${selected ? " admin-media-picker__asset--selected" : ""}`}
                  key={asset.id}
                  onClick={() => { void toggle(asset).catch((toggleError: Error) => setError(toggleError.message)); }}
                  title={asset.file_name}
                  type="button"
                >
                  <img alt={asset.alt_text} src={asset.preview} />
                  <span>{asset.file_name}</span>
                  {!asset.is_published ? <span>Click to publish and select</span> : selected && <span className="admin-media-picker__selected">Selected</span>}
                </button>
              );
            })}
          </div>
        )}
    </div>
  );
}
