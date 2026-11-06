import { ArrowDownToLine, Eye, FileClock, FileText, Globe, Save, Send, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdminAuth } from "./AuthContext";
import { MediaAssetPicker } from "./MediaAssetPicker";
import { usePublicImage } from "../context/PublishedSiteContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type FieldKind = "text" | "multiline" | "list" | "image";
interface ContentField { key: string; label: string; kind?: FieldKind; required?: boolean; multiple?: boolean }
interface ContentPageConfig { label: string; description: string; fields: ContentField[] }
type ContentMap = Record<string, unknown>;

const pageConfig: Record<string, ContentPageConfig> = {
  home: {
    label: "Homepage",
    description: "Edit the hero, calls to action and technology feature strip.",
    fields: [
      { key: "hero_label", label: "Hero label" },
      { key: "hero_heading", label: "Main heading", required: true },
      { key: "hero_description", label: "Description", kind: "multiline", required: true },
      { key: "hero_image", label: "Hero image", kind: "image" },
      { key: "hero_image_alt", label: "Hero image alt text" },
      { key: "hero_focal_position", label: "Image focal position" },
      { key: "primary_cta_text", label: "Primary CTA text" },
      { key: "primary_cta_destination", label: "Primary CTA destination" },
      { key: "secondary_cta_text", label: "Secondary CTA text" },
      { key: "secondary_cta_destination", label: "Secondary CTA destination" },
      { key: "feature_strip_heading", label: "Feature strip heading" },
      { key: "feature_strip_items", label: "Feature strip items (one per line)", kind: "list" },
    ],
  },
  about: {
    label: "About Us",
    description: "Manage company introduction, imagery and approach items.",
    fields: [
      { key: "page_heading", label: "Page heading", required: true },
      { key: "section_heading", label: "Section heading" },
      { key: "introduction", label: "Company introduction", kind: "multiline", required: true },
      { key: "description", label: "Company description", kind: "multiline" },
      { key: "main_image", label: "Main image", kind: "image" },
      { key: "secondary_images", label: "Secondary images", kind: "image", multiple: true },
      { key: "image_alt_text", label: "Image alternative text" },
      { key: "cta_text", label: "CTA text" },
      { key: "cta_destination", label: "CTA destination" },
      { key: "approach_heading", label: "Our Approach heading" },
      { key: "approach_items", label: "Approach items (one per line)", kind: "list" },
    ],
  },
  "why-us": {
    label: "Why Choose Us",
    description: "Edit the page introduction, feature items and service process.",
    fields: [
      { key: "main_heading", label: "Main heading", required: true },
      { key: "supporting_description", label: "Supporting description", kind: "multiline" },
      { key: "main_image", label: "Main image", kind: "image" },
      { key: "feature_items", label: "Features (one item per line)", kind: "list" },
      { key: "process_heading", label: "Process heading" },
      { key: "process_steps", label: "Process steps (one per line)", kind: "list" },
    ],
  },
  contact: {
    label: "Contact",
    description: "Manage the public contact page information and instructions.",
    fields: [
      { key: "heading", label: "Page heading", required: true },
      { key: "description", label: "Introduction", kind: "multiline" },
      { key: "quote_instructions", label: "Quote instructions", kind: "multiline" },
      { key: "site_visit_instructions", label: "Site visit instructions", kind: "multiline" },
      { key: "contact_email", label: "Contact email" },
      { key: "contact_phone", label: "Contact phone" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "location", label: "Business address" },
      { key: "business_hours", label: "Business hours", kind: "multiline" },
    ],
  },
  gallery: {
    label: "Gallery",
    description: "Manage the public project gallery introduction.",
    fields: [
      { key: "heading", label: "Gallery heading", required: true },
      { key: "page_title", label: "Page title", required: true },
      { key: "introduction", label: "Introduction", kind: "multiline" },
      { key: "contact_button", label: "Contact button label" },
    ],
  },
};

interface Revision { id: string; content: ContentMap; published_at: string; published_by: string | null; seo_title: string; seo_description: string }

export function AdminContentPage() {
  const { page } = useParams();
  const config = page ? pageConfig[page] : undefined;
  const { session } = useAdminAuth();
  const [content, setContent] = useState<ContentMap>({});
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [draftExists, setDraftExists] = useState(false);
  const [loading, setLoading] = useState(Boolean(config));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewImagePath = String(content.hero_image ?? content.main_image ?? "");
  const { url: previewImageUrl } = usePublicImage(previewImagePath);

  useEffect(() => {
    if (!config || !page || !supabase) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    setError("");
    setNotice("");
    setContent({});
    setSeoTitle("");
    setSeoDescription("");
    setRevisions([]);
    setDraftExists(false);
    async function load() {
      const [draftResult, publishedResult, historyResult] = await Promise.all([
        supabase!.from("content_drafts").select("content,seo_title,seo_description").eq("page", page!).maybeSingle(),
        supabase!.from("website_content").select("content,seo_title,seo_description").eq("page", page!).maybeSingle(),
        supabase!.from("content_revisions").select("id,content,published_at,published_by,seo_title,seo_description").eq("page", page!).order("published_at", { ascending: false }).limit(10),
      ]);
      if (!active) return;
      const failure = draftResult.error ?? publishedResult.error ?? historyResult.error;
      if (failure) setError(failure.message);
      else {
        const source = draftResult.data ?? publishedResult.data;
        if (source) {
          setContent((source.content ?? {}) as ContentMap);
          setSeoTitle(source.seo_title ?? "");
          setSeoDescription(source.seo_description ?? "");
        }
        setDraftExists(Boolean(draftResult.data));
        setRevisions((historyResult.data ?? []) as Revision[]);
      }
      setLoading(false);
    }
    void load().catch((loadError: Error) => { if (active) { setError(loadError.message); setLoading(false); } });
    return () => { active = false; };
  }, [config, page]);

  if (!page || !config) {
    return (
      <>
        <div className="admin-page-heading"><div><p className="admin-eyebrow">CONTENT</p><h1>Website Content</h1><p>Choose a page to edit, preview and publish.</p></div></div>
        <div className="admin-section-links">
          {Object.entries(pageConfig).map(([key, item]) => <Link key={key} to={`/admin/content/${key}`}><FileText size={19} /><span>{item.label}<small>{item.description}</small></span></Link>)}
        </div>
      </>
    );
  }
  const activeConfig = config;

  function displayValue(field: ContentField) {
    const value = content[field.key];
    return field.kind === "list" ? (Array.isArray(value) ? value.join("\n") : String(value ?? "")) : String(value ?? "");
  }

  function updateField(field: ContentField, value: string | string[]) {
    setContent((current) => ({
      ...current,
      [field.key]: field.kind === "list" && typeof value === "string"
        ? value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
        : value,
    }));
  }

  async function saveDraft(event?: FormEvent) {
    event?.preventDefault();
    if (!supabase || !page) { setError("Supabase is not configured."); return; }
    setBusy(true); setError(""); setNotice("");
    const { error: saveError } = await supabase.from("content_drafts").upsert({
      page, content, seo_title: seoTitle, seo_description: seoDescription, updated_by: session?.user.id, updated_at: new Date().toISOString(),
    }, { onConflict: "page" });
    if (saveError) setError(saveError.message);
    else { setDraftExists(true); setNotice("Draft saved."); }
    setBusy(false);
  }

  async function publish() {
    if (!supabase || !page) { setError("Supabase is not configured."); return; }
    const missing = activeConfig.fields.filter((field) => field.required && !String(content[field.key] ?? "").trim()).map((field) => field.label);
    if (missing.length) { setError(`Complete required fields before publishing: ${missing.join(", ")}.`); return; }
    const imageReferences = activeConfig.fields
      .filter((field) => field.kind === "image")
      .flatMap((field) => {
        const value = content[field.key];
        return Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
      })
      .map((value) => value.trim())
      .filter((value) => value && !/^https?:\/\//i.test(value));
    for (const storagePath of imageReferences) {
      const { data: media, error: mediaError } = await supabase.from("media_assets")
        .select("id").eq("storage_path", storagePath).eq("is_published", true).maybeSingle();
      if (mediaError) { setError(`Could not validate media “${storagePath}”: ${mediaError.message}`); return; }
      if (!media) { setError(`Publish the image “${storagePath}” in the image picker before using it here.`); return; }
    }
    if (!window.confirm(`Publish the ${activeConfig.label} changes? Visitors will see the new content immediately.`)) return;
    setBusy(true); setError(""); setNotice("");
    const { error: publishError } = await supabase.rpc("publish_website_content", {
      target_page: page, next_content: content, next_seo_title: seoTitle, next_seo_description: seoDescription,
    });
    if (publishError) setError(publishError.message);
    else {
      setDraftExists(false);
      setNotice("Published successfully.");
      window.dispatchEvent(new Event("muanotronics:content-published"));
      const { data, error: historyError } = await supabase.from("content_revisions")
        .select("id,content,published_at,published_by,seo_title,seo_description")
        .eq("page", page).order("published_at", { ascending: false }).limit(10);
      if (historyError) setError(`Published, but revision history could not be refreshed: ${historyError.message}`);
      else setRevisions((data ?? []) as Revision[]);
    }
    setBusy(false);
  }

  async function discardDraft() {
    if (!supabase || !page || !draftExists) return;
    if (!window.confirm("Discard this draft and restore the currently published content?")) return;
    setBusy(true); setError(""); setNotice("");
    const { error: deleteError } = await supabase.from("content_drafts").delete().eq("page", page);
    if (deleteError) setError(deleteError.message);
    else {
      setDraftExists(false);
      const { data, error: readError } = await supabase.from("website_content").select("content,seo_title,seo_description").eq("page", page).maybeSingle();
      if (readError) setError(readError.message);
      else {
        setContent((data?.content ?? {}) as ContentMap);
        setSeoTitle(data?.seo_title ?? "");
        setSeoDescription(data?.seo_description ?? "");
        setNotice("Draft discarded.");
      }
    }
    setBusy(false);
  }

  return (
    <>
      <div className="admin-page-heading">
      <div><p className="admin-eyebrow"><Link to="/admin/content">WEBSITE CONTENT</Link></p><h1>{activeConfig.label}</h1><p>{activeConfig.description}</p></div>
        <span className={draftExists ? "admin-badge admin-badge--draft" : "admin-badge"}>{draftExists ? "Draft changes" : "Published content"}</span>
      </div>
      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Backend not configured. Set up Supabase to save drafts or publish changes.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success" role="status">{notice}</div>}
      {loading ? <div className="admin-loading">Loading page content…</div> : (
        <div className="admin-grid admin-grid--dashboard">
          <form className="admin-card" onSubmit={saveDraft}>
            <div className="admin-card__heading"><div><h2>Page content</h2><p>Changes remain private until published.</p></div></div>
            <div className="admin-form--editor">
              {activeConfig.fields.map((field) => (
                field.kind === "image"
                  ? <MediaAssetPicker
                    category={page === "home" ? "homepage" : page === "about" ? "about" : page === "gallery" ? "gallery" : "general"}
                    key={field.key}
                    label={field.label}
                    multiple={field.multiple}
                    onChange={(value) => updateField(field, value)}
                    value={Array.isArray(content[field.key]) ? content[field.key] as string[] : String(content[field.key] ?? "")}
                  />
                  : <label className={`admin-field${field.kind === "multiline" || field.kind === "list" ? " admin-field--wide" : ""}`} key={field.key}>
                    <span>{field.label}{field.required ? " *" : ""}</span>
                    {field.kind === "multiline" || field.kind === "list"
                      ? <textarea onChange={(event) => updateField(field, event.target.value)} rows={field.kind === "list" ? 5 : 4} value={displayValue(field)} />
                      : <input onChange={(event) => updateField(field, event.target.value)} value={displayValue(field)} />}
                  </label>
              ))}
              <label className="admin-field admin-field--wide"><span>SEO title</span><input onChange={(event) => setSeoTitle(event.target.value)} value={seoTitle} /></label>
              <label className="admin-field admin-field--wide"><span>SEO description</span><textarea onChange={(event) => setSeoDescription(event.target.value)} rows={3} value={seoDescription} /></label>
            </div>
            <div className="admin-editor-actions">
              <button className="admin-button" disabled={busy || !isSupabaseConfigured} type="submit"><Save size={15} /> Save Draft</button>
              <button className="admin-button admin-button--primary" disabled={busy || !isSupabaseConfigured} onClick={(event) => { event.preventDefault(); void publish(); }} type="button"><Send size={15} /> Publish</button>
              <button className="admin-button" onClick={() => setPreviewOpen(!previewOpen)} type="button"><Eye size={15} /> {previewOpen ? "Hide Preview" : "Preview"}</button>
              {draftExists && <button className="admin-button" disabled={busy} onClick={() => void discardDraft()} type="button"><Trash2 size={15} /> Discard Draft</button>}
            </div>
          </form>

          <aside className="admin-grid">
            {previewOpen && <div className="admin-card"><div className="admin-card__heading"><h2>Draft preview</h2></div><div className="admin-content-preview"><h2>{String(content.hero_heading ?? content.main_heading ?? content.page_heading ?? content.heading ?? "Page preview")}</h2><p>{String(content.hero_description ?? content.introduction ?? content.supporting_description ?? content.description ?? "")}</p>{previewImageUrl && <img alt={String(content.hero_image_alt ?? content.image_alt_text ?? "")} src={previewImageUrl} />}</div></div>}
            <div className="admin-card">
              <div className="admin-card__heading"><div><h2>Publication</h2><p>Confirm content before making it public.</p></div><Globe size={18} /></div>
              <p className="admin-help-copy">Published content becomes available to the public site. Drafts are restricted to administrators.</p>
              <button className="admin-button admin-button--primary" disabled={busy || !isSupabaseConfigured} onClick={() => void publish()} type="button"><Send size={15} /> Publish Changes</button>
            </div>
            <div className="admin-card">
              <div className="admin-card__heading"><div><h2>Revision History</h2><p>Most recent published versions.</p></div><FileClock size={18} /></div>
              {!revisions.length ? <p className="admin-empty">No published revisions yet.</p> : <div className="admin-revisions">{revisions.map((revision) => <button key={revision.id} onClick={() => { setContent(revision.content); setSeoTitle(revision.seo_title); setSeoDescription(revision.seo_description); setNotice("Revision loaded into the editor. Save it as a draft or publish it to restore."); }} type="button"><span>{new Date(revision.published_at).toLocaleString()}</span><ArrowDownToLine size={15} /></button>)}</div>}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
