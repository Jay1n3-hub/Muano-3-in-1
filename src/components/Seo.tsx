import { useEffect } from "react";
import { usePublicImage, usePublishedSiteData } from "../context/PublishedSiteContext";

const emptySettings: Record<string, unknown> = {};

interface SeoProps {
  title: string;
  description: string;
}

export function Seo({ title, description }: SeoProps) {
  const { settings } = usePublishedSiteData();
  const general = settings.general ?? emptySettings;
  const seo = settings.seo ?? emptySettings;
  const socialImagePath = String(seo.social_sharing_image ?? "").trim();
  const { url: socialImageUrl } = usePublicImage(socialImagePath);

  useEffect(() => {
    const resolvedTitle = title || String(seo.default_seo_title || general.website_title || "Muanotronics");
    const resolvedDescription = description || String(seo.default_meta_description || "");
    document.title = resolvedTitle;
    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (descriptionTag) descriptionTag.content = resolvedDescription;
    if (ogTitle) ogTitle.content = resolvedTitle;
    if (ogDescription) ogDescription.content = resolvedDescription;

    const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
    if (socialImageUrl && ogImage) ogImage.content = socialImageUrl;

    const indexingPreference = String(seo.allow_search_indexing ?? "").toLowerCase();
    if (indexingPreference === "true" || indexingPreference === "false") {
      let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.append(robots);
      }
      robots.content = indexingPreference === "true" ? "index, follow" : "noindex, nofollow";
    }

    const language = String(general.default_language ?? "");
    if (/^[a-z]{2}(?:-[A-Z]{2})?$/.test(language)) document.documentElement.lang = language;
  }, [title, description, general, seo, socialImageUrl]);

  return null;
}
