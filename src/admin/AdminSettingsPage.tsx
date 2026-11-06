import { AlertTriangle, CheckCircle2, Database, LockKeyhole, Save, Shield } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useAdminAuth } from "./AuthContext";
import { MediaAssetPicker } from "./MediaAssetPicker";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type SettingsTab = "general" | "contact" | "seo" | "security" | "system";
type SettingsValues = Record<string, string>;

const tabLabels: Record<SettingsTab, string> = {
  general: "General Website",
  contact: "Contact Details",
  seo: "SEO",
  security: "Admin & Security",
  system: "System & Integrations",
};

const fields: Record<Exclude<SettingsTab, "security" | "system">, { key: string; label: string; multiline?: boolean; options?: { value: string; label: string }[] }[]> = {
  general: [
    { key: "website_title", label: "Website title" },
    { key: "display_company_name", label: "Display company name" },
    { key: "tagline", label: "Tagline" },
    { key: "default_logo_id", label: "Default logo asset ID" },
    { key: "website_url", label: "Website URL" },
    { key: "default_language", label: "Default language" },
  ],
  contact: [
    { key: "email", label: "Contact email" },
    { key: "telephone", label: "Telephone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "location", label: "Business address", multiline: true },
    { key: "google_maps_url", label: "Google Maps URL" },
    { key: "business_hours", label: "Business hours", multiline: true },
    { key: "social_links", label: "Social profile URLs (one per line)", multiline: true },
    { key: "footer_description", label: "Footer description", multiline: true },
    { key: "footer_copyright", label: "Footer copyright" },
  ],
  seo: [
    { key: "default_seo_title", label: "Default SEO title" },
    { key: "default_meta_description", label: "Default meta description", multiline: true },
    { key: "homepage_seo_title", label: "Homepage SEO title" },
    { key: "homepage_meta_description", label: "Homepage meta description", multiline: true },
    { key: "social_sharing_image", label: "Social sharing image" },
    {
      key: "allow_search_indexing",
      label: "Search indexing preference",
      options: [
        { value: "", label: "Use deployment default" },
        { value: "true", label: "Allow indexing" },
        { value: "false", label: "Block indexing" },
      ],
    },
  ],
};

export function AdminSettingsPage() {
  const { profile, session } = useAdminAuth();
  const [tab, setTab] = useState<SettingsTab>("general");
  const [values, setValues] = useState<SettingsValues>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data, error: loadError } = await supabase.from("website_settings").select("key,value");
      if (!active) return;
      if (loadError) setError(loadError.message);
      else {
        const next: SettingsValues = {};
        data?.forEach((row) => {
          const value = row.value as Record<string, unknown>;
          Object.entries(value).forEach(([key, fieldValue]) => {
            next[`${row.key}.${key}`] = typeof fieldValue === "string" ? fieldValue : JSON.stringify(fieldValue);
          });
        });
        setValues(next);
      }
      setLoading(false);
    }
    void load().catch((loadError: Error) => { if (active) { setError(loadError.message); setLoading(false); } });
    return () => { active = false; };
  }, []);

  function value(key: string) { return values[`${tab}.${key}`] ?? ""; }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase || tab === "security" || tab === "system") return;
    setBusy(true); setError(""); setNotice("");
    const row: Record<string, string> = {};
    for (const field of fields[tab]) row[field.key] = value(field.key);
    const { error: saveError } = await supabase.from("website_settings").upsert({
      key: tab,
      value: row,
      is_public: true,
      updated_by: session?.user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });
    if (saveError) setError(saveError.message);
    else {
      setNotice(`${tabLabels[tab]} settings saved.`);
      window.dispatchEvent(new Event("muanotronics:content-published"));
    }
    setBusy(false);
  }

  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">CONFIGURATION</p><h1>Settings</h1><p>Website configuration, contact details and security in one place.</p></div></div>
      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Settings cannot be loaded or saved.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success">{notice}</div>}
      <div className="admin-tabs" aria-label="Settings sections" role="tablist">
        {(Object.keys(tabLabels) as SettingsTab[]).map((key) => <button aria-selected={tab === key} key={key} onClick={() => setTab(key)} role="tab" type="button">{tabLabels[key]}</button>)}
      </div>
      {loading ? <div className="admin-loading">Loading settings…</div> : (
        <form className="admin-card admin-settings-card" onSubmit={save}>
          <div className="admin-card__heading"><div><h2>{tabLabels[tab]}</h2><p>{tab === "system" ? "Connection and deployment health." : tab === "security" ? "Administrator identity and access control." : "Only public-facing fields are stored in public settings."}</p></div></div>
          {tab === "security" ? <SecuritySettings role={profile?.role ?? "editor"} email={profile?.email ?? ""} /> : tab === "system" ? <SystemSettings /> : (
            <>
              {tab === "general" && <div className="admin-notice admin-notice--warning">Do not use the unconfirmed legal-name variant until the stakeholder confirms registration.</div>}
              <div className="admin-form--editor">
                {fields[tab].map((field) => <label className={`admin-field${field.multiline ? " admin-field--wide" : ""}`} key={field.key}>
                  <span>{field.label}</span>
                  {tab === "seo" && field.key === "social_sharing_image"
                    ? <MediaAssetPicker category="general" label={field.label} onChange={(image) => setValues((current) => ({ ...current, [`${tab}.${field.key}`]: Array.isArray(image) ? image[0] ?? "" : image }))} value={value(field.key)} />
                    : field.options
                    ? <select onChange={(event) => setValues((current) => ({ ...current, [`${tab}.${field.key}`]: event.target.value }))} value={value(field.key)}>{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                    : field.multiline
                    ? <textarea onChange={(event) => setValues((current) => ({ ...current, [`${tab}.${field.key}`]: event.target.value }))} rows={3} value={value(field.key)} />
                    : <input onChange={(event) => setValues((current) => ({ ...current, [`${tab}.${field.key}`]: event.target.value }))} value={value(field.key)} />}
                </label>)}
              </div>
              <div className="admin-editor-actions"><button className="admin-button admin-button--primary" disabled={busy || !isSupabaseConfigured} type="submit"><Save size={15} /> Save Settings</button></div>
            </>
          )}
        </form>
      )}
    </>
  );
}

function SecuritySettings({ role, email }: { role: string; email: string }) {
  return (
    <div className="admin-security-grid">
      <article><span><Shield size={20} /></span><div><strong>Current role</strong><p>{role.replace("_", " ")}</p></div></article>
      <article><span><LockKeyhole size={20} /></span><div><strong>Signed-in account</strong><p>{email}</p></div></article>
      <div className="admin-notice admin-notice--warning">
        Administrator accounts must be created through Supabase Auth and explicitly assigned in <code>admin_users</code> by a trusted operator. Self-registration and client-side role changes are disabled. Password recovery uses Supabase Auth email configuration.
      </div>
      <div className="admin-notice admin-notice--success"><CheckCircle2 size={15} /> Administrator access is verified against the database on protected route entry.</div>
    </div>
  );
}

function SystemSettings() {
  const [database, setDatabase] = useState<"checking" | "online" | "error" | "unconfigured">(isSupabaseConfigured ? "checking" : "unconfigured");
  const [storage, setStorage] = useState<"checking" | "online" | "error" | "unconfigured">(isSupabaseConfigured ? "checking" : "unconfigured");

  useEffect(() => {
    let active = true;
    async function check() {
      if (!supabase) return;
      const [databaseResult, storageResult] = await Promise.all([
        supabase.from("website_settings").select("key", { head: true, count: "exact" }),
        supabase.storage.from("site-media").list("", { limit: 1 }),
      ]);
      if (!active) return;
      setDatabase(databaseResult.error ? "error" : "online");
      setStorage(storageResult.error ? "error" : "online");
    }
    void check().catch(() => {
      if (active) { setDatabase("error"); setStorage("error"); }
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="admin-system-grid">
      <SystemStatus icon={<Database size={18} />} label="Database" status={database} detail="Supabase database and settings table access." />
      <SystemStatus icon={<ImageIcon />} label="Storage" status={storage} detail="Private site-media bucket access." />
      <p className="admin-notice admin-notice--warning">Private keys, service-role credentials and database passwords are never displayed or embedded in this application.</p>
    </div>
  );
}

function SystemStatus({ icon, label, status, detail }: { icon: React.ReactNode; label: string; status: string; detail: string }) {
  const result = status === "online" ? "Connected" : status === "checking" ? "Checking…" : status === "error" ? "Unavailable" : "Not configured";
  return <p className={`admin-system-status${status === "online" ? " admin-system-status--ok" : " admin-system-status--warning"}`}>
    {status === "online" ? <CheckCircle2 size={18} /> : status === "error" || status === "unconfigured" ? <AlertTriangle size={18} /> : icon}
    <span><strong>{label}: {result}</strong><small>{detail}{status === "unconfigured" ? " Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY." : ""}</small></span>
  </p>;
}

function ImageIcon() {
  return <Database size={18} />;
}
