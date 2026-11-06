import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import type { AdminProfile } from "../lib/cms";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface AuthState {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  profile: AdminProfile | null;
  error: string | null;
  recoveryPending: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [recoveryPending, setRecoveryPending] = useState(false);
  const sessionUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      sessionUserId.current = data.session?.user.id ?? null;
      setSession(data.session);
      if (!data.session) setLoading(false);
    }).catch((sessionError: Error) => {
      if (active) {
        setError(sessionError.message);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const nextUserId = nextSession?.user.id ?? null;
      const userChanged = sessionUserId.current !== nextUserId;
      sessionUserId.current = nextUserId;
      setSession(nextSession);
      setRecoveryPending(event === "PASSWORD_RECOVERY");
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setError(null);
        setLoading(false);
      } else if (userChanged) {
        setProfile(null);
        setError(null);
        setLoading(Boolean(nextSession));
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !session) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let timeoutId: number | undefined;
    try {
      const profileRequest = supabase
        .from("admin_users")
        .select("auth_user_id,email,display_name,role,is_active")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error("Administrator access check timed out. Check your connection and try again.")), 12000);
      });
      const { data, error: profileError } = await Promise.race([profileRequest, timeout]);

      if (profileError) {
        setProfile(null);
        setError(profileError.message);
        return;
      }

      setProfile(data?.is_active ? data as AdminProfile : null);
      setError(data && !data.is_active ? "This administrator account is inactive." : null);
    } catch (profileError) {
      setProfile(null);
      setError(profileError instanceof Error ? profileError.message : "Administrator access check failed.");
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    void refreshProfile().catch((profileError: Error) => {
      setProfile(null);
      setError(profileError.message);
      setLoading(false);
    });
  }, [session?.user.id, refreshProfile]);

  async function signOut() {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
  }

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    loading,
    session,
    profile,
    error,
    recoveryPending,
    refreshProfile,
    signOut,
  }), [loading, session, profile, error, recoveryPending, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  return context;
}
