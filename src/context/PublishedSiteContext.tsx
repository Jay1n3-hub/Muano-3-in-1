import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import {
  Camera, Fence, Headset, LockKeyhole, Megaphone, Shield, ShieldAlert, ShieldCheck,
  Settings2, UsersRound, Wrench, type LucideIcon,
} from "lucide-react";
import { services as localServices, type SecurityService } from "../data/services";
import type { GalleryProject } from "../lib/cms";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type JsonRecord = Record<string, unknown>;
interface PublishedSiteData {
  content: Record<string, JsonRecord>;
  settings: Record<string, JsonRecord>;
  services: SecurityService[];
  projects: (GalleryProject & { image_urls: string[] })[];
  error: string;
  refresh: () => Promise<void>;
}

const iconMap: Record<string, LucideIcon> = {
  Camera, Fence, Headset, LockKeyhole, Megaphone, Shield, ShieldAlert, ShieldCheck, Settings2, UsersRound, Wrench,
};

const SiteDataContext = createContext<PublishedSiteData | null>(null);

export function PublishedSiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, JsonRecord>>({});
  const [settings, setSettings] = useState<Record<string, JsonRecord>>({});
  const [publishedServices, setPublishedServices] = useState<SecurityService[]>(localServices);
  const [galleryProjects, setGalleryProjects] = useState<(GalleryProject & { image_urls: string[] })[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    if (!isSupabaseConfigured || !supabase) return;
    const [contentResult, settingsResult, servicesResult, galleryResult] = await Promise.all([
      supabase.from("website_content").select("page,content,seo_title,seo_description").eq("status", "published"),
      supabase.from("website_settings").select("key,value").eq("is_public", true),
      supabase.from("services").select("*").eq("is_active", true).eq("is_published", true).order("display_order"),
      supabase.from("gallery_projects").select("*").eq("is_published", true).order("display_order").order("created_at", { ascending: false }),
    ]);

    const failures = [contentResult.error, settingsResult.error, servicesResult.error].filter(Boolean);
    if (failures.length) {
      const message = failures.map((failure) => failure!.message).join("; ");
      setError(message);
      console.error("Could not load published Muanotronics content.", message);
      return;
    }
    if (galleryResult.error) {
      console.error("Could not load published gallery projects. Apply the project gallery database migration.", galleryResult.error.message);
      setGalleryProjects([]);
    }

    const nextContent: Record<string, JsonRecord> = {};
    contentResult.data?.forEach((row) => {
      nextContent[row.page] = {
        ...((row.content ?? {}) as JsonRecord),
        seo_title: row.seo_title ?? "",
        seo_description: row.seo_description ?? "",
      };
    });
    const nextSettings: Record<string, JsonRecord> = {};
    settingsResult.data?.forEach((row) => { nextSettings[row.key] = (row.value ?? {}) as JsonRecord; });
    setContent(nextContent);
    setSettings(nextSettings);

    let imageError = "";
    if (servicesResult.data) {
      const mapped = await Promise.all(servicesResult.data.map(async (row) => {
        let image = row.main_image;
        if (image && !/^https?:\/\//i.test(image)) {
          const { data: signed, error: signedError } = await supabase!.storage.from("site-media").createSignedUrl(image, 3600);
          if (signedError) {
            imageError = `Could not load service image “${row.name}”: ${signedError.message}`;
          } else image = signed.signedUrl;
        }
        return {
          slug: row.slug,
          title: row.name,
          shortTitle: row.name,
          summary: row.short_description,
          description: row.short_description,
          detail: row.full_description,
          features: row.features ?? [],
          benefits: row.benefits ?? [],
          image: image || "",
          imageAlt: row.image_alt_text || row.name,
          seoTitle: row.seo_title || "",
          seoDescription: row.seo_description || "",
          icon: iconMap[row.icon] ?? Shield,
        } satisfies SecurityService;
      }));
      setPublishedServices(mapped);
    }

    if (galleryResult.data) {
      const mappedProjects = await Promise.all((galleryResult.data as GalleryProject[]).map(async (project) => {
        const image_urls = await Promise.all(project.image_paths.map(async (path) => {
          if (/^https?:\/\//i.test(path)) return path;
          const { data: signed, error: signedError } = await supabase!.storage.from("site-media").createSignedUrl(path, 3600);
          if (signedError) {
            imageError = `Could not load gallery image for “${project.title}”: ${signedError.message}`;
            return "";
          }
          return signed.signedUrl;
        }));
        return { ...project, image_urls: image_urls.filter(Boolean) };
      }));
      setGalleryProjects(mappedProjects);
    }
    setError(imageError);
  }

  useEffect(() => {
    void refresh().catch((loadError: Error) => setError(loadError.message));
    const reload = () => { void refresh().catch((loadError: Error) => setError(loadError.message)); };
    window.addEventListener("muanotronics:content-published", reload);
    return () => window.removeEventListener("muanotronics:content-published", reload);
  }, []);

  const value = useMemo(() => ({ content, settings, services: publishedServices, projects: galleryProjects, error, refresh }), [content, settings, publishedServices, galleryProjects, error]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function PublishedSiteLayout() {
  return <PublishedSiteProvider><Outlet /></PublishedSiteProvider>;
}

export function usePublishedSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error("usePublishedSiteData must be used within PublishedSiteProvider.");
  return context;
}

export function usePublicImage(path: string | undefined) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    if (!path) { setUrl(""); return; }
    if (/^https?:\/\//i.test(path)) { setUrl(path); return; }
    if (!supabase) { setUrl(""); return; }
    void supabase.storage.from("site-media").createSignedUrl(path, 3600).then(({ data, error: signError }) => {
      if (!active) return;
      if (signError) setError(signError.message);
      else setUrl(data.signedUrl);
    }).catch((signError: Error) => { if (active) setError(signError.message); });
    return () => { active = false; };
  }, [path]);

  return { url: url || (/^https?:\/\//i.test(path ?? "") ? path ?? "" : ""), error };
}
