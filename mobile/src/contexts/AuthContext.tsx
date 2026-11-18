import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getProfile, login, logout, restoreToken } from "@/services/auth";

type AuthContextValue = { token: string | null; profile: any; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await restoreToken();
        if (saved) {
          const user = await getProfile();
          if (active) { setToken(saved); setProfile(user); }
        }
      } catch { await logout(); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  async function signIn(email: string, password: string) {
    const result = await login(email, password);
    const user = await getProfile();
    setToken(String(result.token ?? result.accessToken ?? result.jwt));
    setProfile(user);
  }
  async function signOut() { await logout(); setToken(null); setProfile(null); }

  return <AuthContext.Provider value={{ token, profile, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return value;
}