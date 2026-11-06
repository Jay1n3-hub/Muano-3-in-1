import { Images, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { GalleryProject } from "../lib/cms";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { MediaAssetPicker } from "./MediaAssetPicker";
import { useAdminAuth } from "./AuthContext";

type ProjectDraft = Omit<GalleryProject, "id" | "created_at" | "updated_at" | "created_by">;

const emptyProject: ProjectDraft = {
  title: "",
  description: "",
  category: "",
  location: "",
  project_year: "",
  image_paths: [],
  image_alt_text: "",
  display_order: 0,
  is_published: false,
};

export function AdminGalleryPage() {
  const { session } = useAdminAuth();
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [draft, setDraft] = useState<ProjectDraft>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data, error: loadError } = await supabase.from("gallery_projects").select("*").order("display_order").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setProjects((data ?? []) as GalleryProject[]);
    setLoading(false);
  }

  useEffect(() => {
    void load().catch((loadError: Error) => {
      setError(loadError.message);
      setLoading(false);
    });
  }, []);

  function startNew() {
    setError("");
    setNotice("");
    setDraft({ ...emptyProject, display_order: projects.length });
    setEditingId("");
  }

  function edit(project: GalleryProject) {
    setError("");
    setNotice("");
    setDraft({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      project_year: project.project_year,
      image_paths: project.image_paths,
      image_alt_text: project.image_alt_text,
      display_order: project.display_order,
      is_published: project.is_published,
    });
    setEditingId(project.id);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setError("Supabase is not configured."); return; }
    if (!draft.image_paths.length) { setError("Add at least one project photo before saving."); return; }
    setBusy(true);
    setError("");
    setNotice("");

    for (const storagePath of draft.image_paths.filter((path) => !/^https?:\/\//i.test(path))) {
      const { data: asset, error: assetError } = await supabase.from("media_assets")
        .select("id").eq("storage_path", storagePath).eq("is_published", true).maybeSingle();
      if (assetError) { setError(assetError.message); setBusy(false); return; }
      if (!asset) { setError(`This image is not published yet. Select it in the project photo picker to publish it, then save the project.`); setBusy(false); return; }
    }

    const values = {
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category.trim(),
      location: draft.location.trim(),
      project_year: draft.project_year.trim(),
      image_alt_text: draft.image_alt_text.trim(),
      updated_at: new Date().toISOString(),
      ...(editingId ? {} : { created_by: session?.user.id }),
    };
    const result = editingId
      ? await supabase.from("gallery_projects").update(values).eq("id", editingId)
      : await supabase.from("gallery_projects").insert(values);
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }

    setNotice(draft.is_published ? "Project published to the website." : "Project saved as a draft.");
    setEditingId(null);
    setDraft(emptyProject);
    window.dispatchEvent(new Event("muanotronics:content-published"));
    await load();
    setBusy(false);
  }

  async function remove(project: GalleryProject) {
    if (!supabase || !window.confirm(`Delete “${project.title}” from the project gallery?`)) return;
    setError("");
    setNotice("");
    const { error: deleteError } = await supabase.from("gallery_projects").delete().eq("id", project.id);
    if (deleteError) setError(deleteError.message);
    else {
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setNotice("Project removed from the gallery. Its photos remain in media storage.");
      window.dispatchEvent(new Event("muanotronics:content-published"));
    }
  }

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">WEBSITE MANAGEMENT</p><h1>Project Gallery</h1><p>Add completed projects and choose which ones appear on the public gallery page.</p></div>
        <button className="admin-button admin-button--primary" disabled={!isSupabaseConfigured || editingId !== null} onClick={startNew} type="button"><Plus size={15} /> Add Project</button>
      </div>
      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Connect the backend to manage gallery projects.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success" role="status">{notice}</div>}

      {editingId !== null && (
        <form className="admin-card admin-gallery-editor" onSubmit={save}>
          <div className="admin-card__heading"><div><h2>{editingId ? "Edit Project" : "New Project"}</h2><p>Project images are reused from your site's media storage.</p></div></div>
          <div className="admin-form--editor">
            <label className="admin-field"><span>Project title *</span><input onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} required value={draft.title} /></label>
            <label className="admin-field"><span>Category / service</span><input onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} placeholder="CCTV, Access Control…" value={draft.category} /></label>
            <label className="admin-field"><span>Location</span><input onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} value={draft.location} /></label>
            <label className="admin-field"><span>Year completed</span><input onChange={(event) => setDraft((current) => ({ ...current, project_year: event.target.value }))} value={draft.project_year} /></label>
            <label className="admin-field admin-field--wide"><span>Project description</span><textarea onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} value={draft.description} /></label>
            <MediaAssetPicker category="gallery" label="Project photos" multiple onChange={(value) => setDraft((current) => ({ ...current, image_paths: Array.isArray(value) ? value : [value].filter(Boolean) }))} value={draft.image_paths} />
            <label className="admin-field admin-field--wide"><span>Photo alternative text</span><input onChange={(event) => setDraft((current) => ({ ...current, image_alt_text: event.target.value }))} placeholder="Describe the project photo for accessibility" value={draft.image_alt_text} /></label>
          </div>
          <div className="admin-editor-actions">
            <label className="admin-check"><input checked={draft.is_published} onChange={(event) => setDraft((current) => ({ ...current, is_published: event.target.checked }))} type="checkbox" /> Show on the public gallery</label>
          </div>
          <div className="admin-editor-actions">
            <button className="admin-button admin-button--primary" disabled={busy || !isSupabaseConfigured} type="submit"><Save size={15} /> {busy ? "Saving…" : "Save Project"}</button>
            <button className="admin-button" disabled={busy} onClick={() => { setEditingId(null); setDraft(emptyProject); }} type="button">Cancel</button>
          </div>
        </form>
      )}

      <section aria-label="Gallery projects" className="admin-gallery-projects">
        {loading ? <div className="admin-loading">Loading projects…</div> : !projects.length ? (
          <div className="admin-card admin-empty-state"><Images size={30} /><h2>No projects yet</h2><p>Add a completed project to start building the public gallery.</p><button className="admin-button admin-button--primary" onClick={startNew} type="button"><Plus size={15} /> Add your first project</button></div>
        ) : projects.map((project) => (
          <article className="admin-card admin-gallery-project" key={project.id}>
            <div className="admin-gallery-project__images">{project.image_paths.slice(0, 3).map((path) => (
              <GalleryProjectImage key={path} path={path} title={project.title} />
            ))}{project.image_paths.length > 3 && <span className="admin-gallery-project__more">+{project.image_paths.length - 3}</span>}</div>
            <div className="admin-gallery-project__body">
              <div><span className={`admin-badge${project.is_published ? "" : " admin-badge--draft"}`}>{project.is_published ? "Published" : "Draft"}</span>{project.category && <span className="admin-gallery-project__category">{project.category}</span>}</div>
              <h2>{project.title}</h2>
              <p>{[project.location, project.project_year].filter(Boolean).join(" · ") || "Project details not added"}</p>
              <div className="admin-gallery-project__actions"><button className="admin-button admin-button--small" disabled={editingId !== null} onClick={() => edit(project)} type="button">Edit project</button><button aria-label={`Delete ${project.title}`} className="admin-icon-button admin-icon-button--danger" onClick={() => void remove(project)} type="button"><Trash2 size={14} /></button></div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function GalleryProjectImage({ path, title }: { path: string; title: string }) {
  const [url, setUrl] = useState(/^https?:\/\//i.test(path) ? path : "");

  useEffect(() => {
    if (!path || /^https?:\/\//i.test(path) || !supabase) return;
    let active = true;
    void supabase.storage.from("site-media").createSignedUrl(path, 3600).then(({ data, error: signError }) => {
      if (!active) return;
      if (signError) console.error(`Could not load gallery preview for ${title}.`, signError.message);
      else setUrl(data.signedUrl);
    });
    return () => { active = false; };
  }, [path, title]);

  return url ? <img alt={title} src={url} /> : <span aria-label="Image preview loading" className="admin-gallery-project__image-placeholder" />;
}
