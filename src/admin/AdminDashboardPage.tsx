import {
  BarChart3, FileText, FolderOpen, Grid2X2, Images, Mail, Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface DashboardCounts {
  enquiries: number;
  newEnquiries: number;
  projects: number;
  publishedPages: number;
}
type ConnectionState = "checking" | "connected" | "error" | "unconfigured";

export function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({ enquiries: 0, newEnquiries: 0, projects: 0, publishedPages: 0 });
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [connection, setConnection] = useState<ConnectionState>(isSupabaseConfigured ? "checking" : "unconfigured");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const results = await Promise.all([
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("gallery_projects").select("id", { count: "exact", head: true }),
        supabase.from("website_content").select("page", { count: "exact", head: true }).eq("status", "published"),
      ]);

      const failure = results.find((result) => result.error)?.error;
      if (!active) return;
      if (failure) {
        setError(failure.message);
        setConnection("error");
      } else {
        setConnection("connected");
        setCounts({
        enquiries: results[0].count ?? 0,
        newEnquiries: results[1].count ?? 0,
        projects: results[2].count ?? 0,
        publishedPages: results[3].count ?? 0,
      });
      }
      setLoading(false);
    }

    void load().catch((loadError: Error) => {
      if (active) {
        setError(loadError.message);
        setConnection("error");
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const stats = [
    { title: "Website connection", value: connection === "checking" ? "Checking…" : connection === "connected" ? "Connected" : connection === "error" ? "Unavailable" : "Not configured", hint: connection === "connected" ? "Supabase backend" : connection === "error" ? "Check System Settings" : "Supabase backend", icon: Settings, status: connection === "connected" },
    { title: "Total enquiries", value: counts.enquiries, hint: `${counts.newEnquiries} new`, icon: Mail },
    { title: "Gallery projects", value: counts.projects, hint: "Project records", icon: Images },
    { title: "Published pages", value: counts.publishedPages, hint: "Current published content", icon: FileText },
  ];

  const actions = [
    { label: "Edit Homepage", to: "/admin/content/home", icon: FileText },
    { label: "Manage Services", to: "/admin/services", icon: Grid2X2 },
    { label: "Manage Project Gallery", to: "/admin/gallery", icon: Images },
    { label: "Update Logo", to: "/admin/logos", icon: FolderOpen },
    { label: "View Enquiries", to: "/admin/enquiries", icon: Mail },
    { label: "Website Settings", to: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">OVERVIEW</p><h1>Dashboard</h1><p>Manage website content and incoming enquiries.</p></div>
        <a className="admin-button admin-button--primary" href="/" rel="noreferrer" target="_blank">Preview Website <ArrowUpRightIcon /></a>
      </div>

      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Dashboard metrics and CMS actions will become available after backend setup.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">Could not load dashboard data: {error}</div>}

      <section aria-label="Website overview" className="admin-stats">
        {stats.map(({ title, value, hint, icon: Icon, status }) => (
          <article className="admin-stat" key={title}>
            <span className="admin-stat__icon"><Icon aria-hidden="true" size={19} /></span>
            <div><strong>{loading ? "…" : error && title !== "Website connection" ? "—" : value}</strong><span>{title}</span><span>{status ? <i className="admin-status">{hint}</i> : hint}</span></div>
          </article>
        ))}
      </section>

      <div className="admin-grid admin-grid--dashboard">
        <div className="admin-card">
          <div className="admin-card__heading"><div><h2>Quick Actions</h2><p>Common website management tasks.</p></div></div>
          <div className="admin-quick-grid">
            {actions.map(({ label, to, icon: Icon }) => <Link key={to} to={to}><Icon aria-hidden="true" size={20} />{label}</Link>)}
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card__heading"><div><h2>Live Preview</h2><p>Current public Corporate Technology website.</p></div><i className="admin-status">Live</i></div>
          <iframe className="admin-preview" loading="lazy" src="/" title="Live Muanotronics public website preview" />
          <div className="admin-preview-actions">
            <a className="admin-button" href="/" rel="noreferrer" target="_blank">Open Full Website <ArrowUpRightIcon /></a>
            <Link className="admin-button" to="/admin/content">Edit Content</Link>
          </div>
        </div>
      </div>
      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-card__heading"><div><h2>Administration</h2><p>Manage the site without changing its public design.</p></div></div>
        <div className="admin-section-links">
          <Link to="/admin/content"><FileText size={19} /><span>Website Content<small>Draft, preview and publish page content</small></span></Link>
          <Link to="/admin/enquiries"><Mail size={19} /><span>Enquiries<small>Review and respond to customer requests</small></span></Link>
          <Link to="/admin/analytics"><BarChart3 size={19} /><span>Analytics<small>Reporting module status</small></span></Link>
        </div>
      </div>
    </>
  );
}

function ArrowUpRightIcon() {
  return <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 16 16" width="15"><path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}
