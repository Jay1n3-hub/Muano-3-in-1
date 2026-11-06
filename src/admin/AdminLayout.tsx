import {
  BarChart3, ChevronDown, FileText, FolderOpen, Grid2X2, Images, LayoutDashboard,
  LogOut, Mail, Menu, Settings, Shield, X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AuthContext";

const navigation = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Website Content", to: "/admin/content", icon: FileText },
  { label: "Services Manager", to: "/admin/services", icon: Grid2X2 },
  { label: "Project Gallery", to: "/admin/gallery", icon: Images },
  { label: "Logo Manager", to: "/admin/logos", icon: FolderOpen },
  { label: "Enquiries", to: "/admin/enquiries", icon: Mail },
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3, badge: "Soon" },
];

export function AdminLayout() {
  const { profile, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function logout() {
    try {
      await signOut();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Could not sign out.");
    }
  }

  return (
    <div className="admin-shell">
      {sidebarOpen && <button aria-label="Close admin menu" className="admin-sidebar__scrim" onClick={() => setSidebarOpen(false)} type="button" />}
      <aside className={`admin-sidebar${sidebarOpen ? " admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-login__brand-mark" aria-hidden="true">M</span>
          <span><strong>Muanotronics</strong><small>ELECTRONICS SOLUTIONS</small></span>
          <button aria-label="Close menu" className="admin-sidebar__close" onClick={() => setSidebarOpen(false)} type="button"><X size={19} /></button>
        </div>
        <nav aria-label="Administration">
          {navigation.map(({ label, to, icon: Icon, end, badge }) => (
            <NavLink end={end} key={to} onClick={() => setSidebarOpen(false)} to={to}>
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
              {badge && <small>{badge}</small>}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__help">
          <Shield aria-hidden="true" size={23} />
          <strong>Protected workspace</strong>
          <span>Only authorised administrators can access website management.</span>
        </div>
        <button className="admin-sidebar__logout" onClick={logout} type="button"><LogOut size={17} /> Sign out</button>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button aria-label="Open menu" className="admin-topbar__menu" onClick={() => setSidebarOpen(true)} type="button"><Menu size={21} /></button>
          <label className="admin-search">
            <span className="sr-only">Search admin pages</span>
            <input onKeyDown={(event) => { if (event.key === "Enter") navigate(`/admin/enquiries?search=${encodeURIComponent(event.currentTarget.value)}`); }} placeholder="Search enquiries…" type="search" />
          </label>
          <div className="admin-topbar__profile">
            <span className="admin-avatar">{(profile?.display_name || profile?.email || "A").slice(0, 1).toUpperCase()}</span>
            <span><strong>{profile?.display_name || "Administrator"}</strong><small>{profile?.role.replace("_", " ")}</small></span>
            <ChevronDown aria-hidden="true" size={15} />
          </div>
          <a className="admin-button admin-button--primary admin-topbar__website" href="/" rel="noreferrer" target="_blank">View Website <ArrowIcon /></a>
        </header>
        {signOutError && <p className="admin-global-error" role="alert">{signOutError}</p>}
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 16 16" width="15"><path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}
