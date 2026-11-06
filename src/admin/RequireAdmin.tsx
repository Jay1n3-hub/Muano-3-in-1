import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AuthContext";

export function RequireAdmin() {
  const { configured, loading, profile, session, error, refreshProfile } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAdminAuth();

  if (!configured) return <Navigate replace to="/admin/login" state={{ from: location }} />;
  if (loading) return <div className="admin-loading" role="status">Checking administrator access…</div>;
  if (!session) return <Navigate replace state={{ from: location }} to="/admin/login" />;
  if (!profile) {
    return (
      <main className="admin-access-denied">
        <h1>Administrator access required</h1>
        <p>{error ?? "This account does not have an active administrator role."}</p>
        <div className="admin-editor-actions">
          <button className="admin-button admin-button--primary" onClick={() => void refreshProfile()} type="button">Retry access check</button>
          <button className="admin-button" onClick={async () => { await signOut(); navigate("/admin/login", { replace: true }); }} type="button">Sign out and return to sign in</button>
        </div>
      </main>
    );
  }
  return <Outlet />;
}
