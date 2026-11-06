import { ArrowUpRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, profile, loading: authLoading, error: authError, recoveryPending, signOut } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const resetPasswordMode = recoveryPending;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (session && profile && !authLoading && !recoveryPending) return <Navigate replace to="/admin" />;

  async function signOutCurrentSession() {
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "Could not sign out.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Administrator sign-in is unavailable because Supabase is not configured.");
      setBusy(false);
      return;
    }

    if (resetPasswordMode) {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) setError(updateError.message);
      else {
        setMessage("Password updated. You can now continue to the administrator dashboard.");
        setTimeout(() => navigate("/admin", { replace: true }), 500);
      }
      setBusy(false);
      return;
    }

    if (recovery) {
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (recoveryError) setError(recoveryError.message);
      else setMessage("If this address belongs to an administrator account, password reset instructions will be sent.");
      setBusy(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      setBusy(false);
      return;
    }

    setBusy(false);
  }

  return (
    <main className="admin-login">
      <div className="admin-login__top">
        <Link aria-label="Muanotronics home" className="admin-login__brand" to="/">
          <span className="admin-login__brand-mark" aria-hidden="true">M</span>
          <span><strong>Muanotronics</strong><small>ELECTRONICS SOLUTIONS</small></span>
        </Link>
        <a className="admin-login__visit" href="/" rel="noreferrer" target="_blank">
          Visit Main Website <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </div>

      <section aria-labelledby="admin-login-title" className="admin-login__card">
        <div className="admin-login__icon"><LockKeyhole aria-hidden="true" size={23} /></div>
        <p className="admin-eyebrow">SECURE ADMINISTRATION</p>
        <h1 id="admin-login-title">{resetPasswordMode ? "Choose a new password" : recovery ? "Reset your password" : "Administrator Login"}</h1>
        <p className="admin-login__intro">
          {resetPasswordMode ? "Choose a new password for your administrator account." : recovery ? "Enter your administrator email to request a password reset." : "Sign in to manage the Muanotronics website."}
        </p>

        {!isSupabaseConfigured && (
          <div className="admin-notice admin-notice--warning" role="status">
            Backend not configured. Add the Supabase URL and publishable key to your environment to enable administrator sign-in.
          </div>
        )}
        {session && !profile && !authLoading && !recoveryPending && (
          <div className="admin-notice admin-notice--error" role="alert">
            {authError ?? "This signed-in account does not have an active administrator profile."}
            <button className="admin-login__recovery" onClick={() => void signOutCurrentSession()} type="button">Sign out</button>
          </div>
        )}
        {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
        {message && <div className="admin-notice admin-notice--success" role="status">{message}</div>}

        <form className="admin-form" onSubmit={submit}>
          <label>
            <span>Email address</span>
            <input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required={!resetPasswordMode} type="email" value={email || session?.user.email || ""} />
          </label>
          {!recovery && (
            <label>
              <span>{resetPasswordMode ? "New password" : "Password"}</span>
              <span className="admin-password-field">
                <input autoComplete={resetPasswordMode ? "new-password" : "current-password"} minLength={8} onChange={(event) => setPassword(event.target.value)} required type={showPassword ? "text" : "password"} value={password} />
                <button aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
          )}
          <button className="admin-button admin-button--primary admin-login__submit" disabled={busy || !isSupabaseConfigured} type="submit">
            {busy ? "Please wait…" : resetPasswordMode ? "Update Password" : recovery ? "Send Reset Instructions" : "Sign In"}
          </button>
        </form>

        {!resetPasswordMode && <button className="admin-login__recovery" onClick={() => { setRecovery(!recovery); setError(""); setMessage(""); }} type="button">{recovery ? "Back to sign in" : "Forgot password?"}</button>}
        <p className="admin-login__security">Administrator accounts are provisioned securely. Public registration is disabled.</p>
      </section>

      <footer className="admin-login__footer">© {new Date().getFullYear()} Muanotronics Electronics Solutions</footer>
    </main>
  );
}
