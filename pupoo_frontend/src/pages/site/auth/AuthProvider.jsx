// AuthProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { tokenStore } from "../../../app/http/tokenStore";
import { authApi } from "./api/authApi";
import { onAuthExpired } from "../../../app/http/interceptors";

const AuthContext = createContext(null);

const DEBUG_AUTH = false; // ← 디버깅 필요하면 true로 변경

export function AuthProvider({ children }) {
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [isAuthed, setIsAuthed] = useState(() => !!tokenStore.getAccess());

  const snapshot = (tag) => {
    if (!DEBUG_AUTH) return;
    const access = tokenStore.getAccess();
    console.log(`[AuthProvider] ${tag}`, {
      isAuthed,
      hasAccess: !!access,
      accessHead: access ? String(access).slice(0, 12) + "..." : null,
      pathname: window.location.pathname,
      ts: new Date().toISOString(),
    });
  };

  useEffect(() => {
    snapshot("MOUNT");

    // 새로고침/재진입 시 accessToken이 메모리에서 사라졌을 수 있으므로
    // refresh_token(HttpOnly 쿠키)로 accessToken을 복구 시도한다.
    const bootstrap = async () => {
      try {
        if (!tokenStore.getAccess()) {
          const data = await authApi.refresh();
          const accessToken = data?.accessToken;
          if (accessToken) {
            tokenStore.setAccess(accessToken);
            setIsAuthed(true);
          }
        }
      } catch (e) {
        // refresh 실패면 비로그인 상태 유지
        tokenStore.clear();
        setIsAuthed(false);
      } finally {
        setIsBootstrapped(true);
      }
    };

    bootstrap();

    const sync = (reason) => {
      const has = !!tokenStore.getAccess();
      if (DEBUG_AUTH)
        console.log(`[AuthProvider] sync(${reason}) -> setIsAuthed(${has})`);
      setIsAuthed(has);
    };

    sync("mount");

    const onFocus = () => sync("focus");
    const onVisibility = () => {
      if (document.visibilityState === "visible") sync("visibility");
    };

    const offAuthExpired = onAuthExpired(() => {
      tokenStore.clear();
      setIsAuthed(false);
    });

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      offAuthExpired();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      if (DEBUG_AUTH) console.log("[AuthProvider] UNMOUNT");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    snapshot("STATE_CHANGE");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  const login = () => {
    if (DEBUG_AUTH)
      console.log("[AuthProvider] login() called -> setIsAuthed(true)");
    setIsAuthed(true);
    snapshot("AFTER login()");
  };

  const logoutLocal = () => {
    if (DEBUG_AUTH)
      console.log("[AuthProvider] logoutLocal() called -> clear token");
    tokenStore.clear();
    setIsAuthed(false);
    snapshot("AFTER logoutLocal()");
  };

  const logout = async () => {
    if (DEBUG_AUTH)
      console.log("[AuthProvider] logout() called -> call server");
    try {
      await authApi.logout();
    } catch (e) {
      if (DEBUG_AUTH)
        console.log(
          "[AuthProvider] logout() server FAIL (ignored)",
          e?.message,
        );
    } finally {
      tokenStore.clear();
      setIsAuthed(false);
      snapshot("AFTER logout()");
    }
  };

  const value = useMemo(
    () => ({ isAuthed, isBootstrapped, login, logout, logoutLocal }),
    [isAuthed, isBootstrapped],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
