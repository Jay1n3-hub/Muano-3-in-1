import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { LogoStyle } from "../context/LogoContext";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function LogoArtwork({
  style,
  light = false,
  name = "Muanotronics",
  tagline = "ELECTRONICS SOLUTIONS",
}: { style: LogoStyle; light?: boolean; name?: string; tagline?: string }) {
  return (
    <span aria-hidden="true" className={`brand__artwork brand__artwork--${style}${light ? " brand__artwork--light" : ""}`}>
      <svg className="brand__mark" fill="none" viewBox="0 0 42 42">
        <path d="M15 4H4v11M4 27v11h11M27 4h11v11M38 27v11H27" />
      </svg>
      {style !== "icon" && (
        <span className="brand__type">
          <span className="brand__name">{name}</span>
          {style !== "compact" && <span className="brand__tag">{tagline}</span>}
        </span>
      )}
    </span>
  );
}

export function Brand({ light = false, previewStyle }: { light?: boolean; previewStyle?: LogoStyle }) {
  const [uploadedLogo, setUploadedLogo] = useState("");
  const { settings } = usePublishedSiteData();
  const style = previewStyle ?? "primary";
  const general = settings.general ?? {};
  const name = String(general.display_company_name || "Muanotronics");
  const tagline = String(general.tagline || "ELECTRONICS SOLUTIONS");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;
    async function loadLogo() {
      const [logoResult, faviconResult] = await Promise.all([
        supabase!.from("brand_assets").select("file_path").eq("is_active", true).eq("is_default", true).maybeSingle(),
        supabase!.from("brand_assets").select("file_path,asset_type").eq("is_active", true).eq("is_favicon_default", true).maybeSingle(),
      ]);
      if (logoResult.error) console.error("Could not load the active Muanotronics logo.", logoResult.error.message);
      else if (logoResult.data) {
        const { data: signed, error: signedError } = await supabase!.storage.from("brand-assets").createSignedUrl(logoResult.data.file_path, 3600);
        if (signedError) console.error("Could not load the active Muanotronics logo.", signedError.message);
        else if (active) setUploadedLogo(signed.signedUrl);
      } else if (active) setUploadedLogo("");

      const { data: favicon, error: faviconError } = faviconResult;
      if (faviconError) {
        console.error("Could not load the active Muanotronics favicon.", faviconError.message);
        return;
      }
      if (favicon) {
        const { data: faviconUrl, error: faviconSignError } = await supabase!.storage.from("brand-assets").createSignedUrl(favicon.file_path, 3600);
        if (faviconSignError) {
          console.error("Could not load the active Muanotronics favicon.", faviconSignError.message);
          return;
        }
        if (active) {
          const rel = favicon.asset_type === "Apple touch icon" ? "apple-touch-icon" : "icon";
          let icon = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
          if (!icon) {
            icon = document.createElement("link");
            icon.rel = rel;
            document.head.append(icon);
          }
          icon.href = faviconUrl.signedUrl;
          icon.type = favicon.asset_type.toLowerCase().includes("svg") ? "image/svg+xml" : favicon.asset_type.toLowerCase().includes("ico") ? "image/x-icon" : "image/png";
        }
      }
    }
    void loadLogo().catch((error: Error) => console.error("Could not load the active Muanotronics brand assets.", error.message));
    const refresh = () => {
      void loadLogo().catch((error: Error) => console.error("Could not refresh Muanotronics brand assets.", error.message));
    };
    window.addEventListener("muanotronics:brand-updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("muanotronics:brand-updated", refresh);
    };
  }, []);

  return (
    <Link
      aria-label="Muanotronics home"
      className={`brand brand--${style}${light ? " brand--light" : ""}`}
      to="/"
    >
      {uploadedLogo
        ? <img alt={`${name} ${tagline}`} className={`brand__uploaded-logo${light ? " brand__uploaded-logo--light" : ""}`} src={uploadedLogo} />
        : <LogoArtwork light={light} name={name} style={style} tagline={tagline} />}
    </Link>
  );
}
