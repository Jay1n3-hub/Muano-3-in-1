import { ArrowDown, ArrowUp, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import type { ManagedService } from "../lib/cms";
import { MediaAssetPicker } from "./MediaAssetPicker";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const emptyService: Omit<ManagedService, "id"> = {
  name: "", slug: "", short_description: "", full_description: "", main_image: "",
  secondary_images: [], image_alt_text: "", icon: "Shield", features: [], benefits: [],
  display_order: 0, is_active: true, is_published: false, seo_title: "", seo_description: "",
};

export function AdminServicesPage() {
  const { id } = useParams();
  const [services, setServices] = useState<ManagedService[]>([]);
  const [service, setService] = useState<ManagedService | Omit<ManagedService, "id">>(emptyService);
  const [editing, setEditing] = useState(Boolean(id));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data, error: loadError } = await supabase.from("services").select("*").order("display_order");
    if (loadError) setError(loadError.message);
    else {
      const rows = (data ?? []) as ManagedService[];
      setServices(rows);
      if (id) {
        const current = rows.find((item) => item.id === id);
        if (current) { setService(current); setEditing(true); }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    setNotice("");
    setService(emptyService);
    setEditing(Boolean(id));
    void load();
  }, [id]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setError("Supabase is not configured."); return; }
    setBusy(true); setError(""); setNotice("");
    const imagePaths = [service.main_image, ...service.secondary_images]
      .filter((image) => image && !/^https?:\/\//i.test(image));
    for (const storagePath of imagePaths) {
      const { data: media, error: mediaError } = await supabase.from("media_assets")
        .select("id").eq("storage_path", storagePath).eq("is_published", true).maybeSingle();
      if (mediaError) { setError(mediaError.message); setBusy(false); return; }
      if (!media) { setError(`This image is not published yet. Select it in the image picker to publish it, then save the service.`); setBusy(false); return; }
    }
    const payload = {
      name: service.name.trim(),
      slug: service.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
      short_description: service.short_description.trim(),
      full_description: service.full_description.trim(),
      main_image: service.main_image.trim(),
      secondary_images: service.secondary_images,
      image_alt_text: service.image_alt_text.trim(),
      icon: service.icon.trim() || "Shield",
      features: service.features,
      benefits: service.benefits,
      display_order: Number(service.display_order),
      is_active: service.is_active,
      is_published: service.is_published,
      seo_title: service.seo_title.trim(),
      seo_description: service.seo_description.trim(),
    };
    const result = "id" in service
      ? await supabase.from("services").update(payload).eq("id", service.id)
      : await supabase.from("services").insert(payload);
    if (result.error) setError(result.error.message);
    else {
      setNotice("Service saved.");
      if (!("id" in service)) setEditing(false);
      window.dispatchEvent(new Event("muanotronics:content-published"));
      await load();
    }
    setBusy(false);
  }

  async function remove(item: ManagedService) {
    if (!supabase || !window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("services").delete().eq("id", item.id);
    if (deleteError) setError(deleteError.message);
    else {
      setServices((current) => current.filter((entry) => entry.id !== item.id));
      setNotice("Service deleted.");
      window.dispatchEvent(new Event("muanotronics:content-published"));
    }
  }

  async function move(item: ManagedService, direction: -1 | 1) {
    if (!supabase) return;
    const index = services.findIndex((entry) => entry.id === item.id);
    const other = services[index + direction];
    if (!other) return;
    const updates = await Promise.all([
      supabase.from("services").update({ display_order: other.display_order }).eq("id", item.id),
      supabase.from("services").update({ display_order: item.display_order }).eq("id", other.id),
    ]);
    const failure = updates.find((result) => result.error)?.error;
    if (failure) setError(failure.message);
    else {
      await load();
      window.dispatchEvent(new Event("muanotronics:content-published"));
    }
  }

  if (!id && !editing) {
    return (
      <>
        <div className="admin-page-heading"><div><p className="admin-eyebrow">WEBSITE MANAGEMENT</p><h1>Services Manager</h1><p>Manage services and their public status.</p></div><button className="admin-button admin-button--primary" disabled={!isSupabaseConfigured} onClick={() => { setService({ ...emptyService, display_order: services.length }); setEditing(true); }} type="button"><Plus size={15} /> Add Service</button></div>
        {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Configure the backend to manage services.</div>}
        {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
        {notice && <div className="admin-notice admin-notice--success">{notice}</div>}
        {loading ? <div className="admin-loading">Loading services…</div> : (
          <div className="admin-card">
            {!services.length ? <p className="admin-empty">No services are stored in the CMS yet.</p> : (
              <div className="admin-table-wrap"><table className="admin-table">
                <thead><tr><th>Order</th><th>Service</th><th>Slug</th><th>Active</th><th>Published</th><th>Actions</th></tr></thead>
                <tbody>{services.map((item, index) => <tr key={item.id}>
                  <td><button aria-label={`Move ${item.name} up`} className="admin-icon-button" disabled={!index} onClick={() => void move(item, -1)} type="button"><ArrowUp size={14} /></button><button aria-label={`Move ${item.name} down`} className="admin-icon-button" disabled={index === services.length - 1} onClick={() => void move(item, 1)} type="button"><ArrowDown size={14} /></button></td>
                  <td><strong>{item.name}</strong></td><td>{item.slug}</td><td>{item.is_active ? "Active" : "Inactive"}</td><td>{item.is_published ? "Published" : "Draft"}</td>
                  <td className="admin-table-actions"><Link className="admin-button admin-button--small" to={`/admin/services/${item.id}`}>Edit</Link>{item.is_published && <a aria-label={`Preview ${item.name}`} className="admin-icon-button" href={`/services/${item.slug}/`} rel="noreferrer" target="_blank"><ExternalLink size={14} /></a>}<button aria-label={`Delete ${item.name}`} className="admin-icon-button admin-icon-button--danger" onClick={() => void remove(item)} type="button"><Trash2 size={14} /></button></td>
                </tr>)}</tbody>
              </table></div>
            )}
          </div>
        )}
        {editing && <ServiceEditor service={service} setService={setService} onCancel={() => setEditing(false)} onSave={save} busy={busy} error={error} notice={notice} />}
      </>
    );
  }

  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow"><Link to="/admin/services">SERVICES MANAGER</Link></p><h1>{"id" in service ? `Edit ${service.name}` : "Add Service"}</h1><p>Update service details and publication status.</p></div></div>
      {loading ? <div className="admin-loading">Loading service…</div> : <ServiceEditor service={service} setService={setService} onCancel={() => { setEditing(false); setService(emptyService); }} onSave={save} busy={busy} error={error} notice={notice} />}
    </>
  );
}

function ServiceEditor({ service, setService, onCancel, onSave, busy, error, notice }: {
  service: ManagedService | Omit<ManagedService, "id">;
  setService: (value: React.SetStateAction<ManagedService | Omit<ManagedService, "id">>) => void;
  onCancel: () => void;
  onSave: (event: FormEvent) => void;
  busy: boolean;
  error: string;
  notice: string;
}) {
  function update(key: keyof typeof emptyService, value: unknown) {
    setService((current) => ({ ...current, [key]: value }));
  }

  return (
    <form className="admin-card" onSubmit={onSave}>
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success">{notice}</div>}
      <div className="admin-form--editor">
        <Field label="Service name *" value={service.name} onChange={(value) => update("name", value)} required />
        <Field label="Slug *" value={service.slug} onChange={(value) => update("slug", value)} required />
        <Field label="Short description *" value={service.short_description} onChange={(value) => update("short_description", value)} required />
        <Field label="Icon name" value={service.icon} onChange={(value) => update("icon", value)} />
        <Field label="Full description" wide multiline value={service.full_description} onChange={(value) => update("full_description", value)} />
        <MediaAssetPicker category="services" label="Main image" onChange={(value) => update("main_image", Array.isArray(value) ? value[0] ?? "" : value)} value={service.main_image} />
        <Field label="Image alt text" value={service.image_alt_text} onChange={(value) => update("image_alt_text", value)} />
        <MediaAssetPicker category="services" label="Secondary images" multiple onChange={(value) => update("secondary_images", Array.isArray(value) ? value : [value].filter(Boolean))} value={service.secondary_images} />
        <Field label="Features (one per line)" multiline value={service.features.join("\n")} onChange={(value) => update("features", lines(value))} />
        <Field label="Benefits (one per line)" multiline value={service.benefits.join("\n")} onChange={(value) => update("benefits", lines(value))} />
        <Field label="SEO title" value={service.seo_title} onChange={(value) => update("seo_title", value)} />
        <Field label="SEO description" multiline value={service.seo_description} onChange={(value) => update("seo_description", value)} />
        <Field label="Display order" value={String(service.display_order)} onChange={(value) => update("display_order", Number(value))} type="number" />
      </div>
      <div className="admin-editor-actions">
        <label className="admin-check"><input checked={service.is_active} onChange={(event) => update("is_active", event.target.checked)} type="checkbox" /> Active</label>
        <label className="admin-check"><input checked={service.is_published} onChange={(event) => update("is_published", event.target.checked)} type="checkbox" /> Published</label>
      </div>
      <div className="admin-editor-actions">
        <button className="admin-button admin-button--primary" disabled={busy || !isSupabaseConfigured} type="submit"><Save size={15} /> Save Service</button>
        <button className="admin-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, multiline = false, wide = false, required = false, type = "text" }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; wide?: boolean; required?: boolean; type?: string;
}) {
  return <label className={`admin-field${wide || multiline ? " admin-field--wide" : ""}`}><span>{label}</span>{multiline
    ? <textarea onChange={(event) => onChange(event.target.value)} required={required} value={value} />
    : <input onChange={(event) => onChange(event.target.value)} required={required} type={type} value={value} />}</label>;
}

function lines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}
