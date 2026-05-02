import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, setApiToken } from "@/api/client";
import { usePersistentState } from "@/hooks/usePersistentState";

const AuthContext = createContext(null);

const defaultAuthState = {
  mode: "guest",
  token: "",
  user: null,
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = usePersistentState("fitforge_auth", defaultAuthState);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApiToken(authState.token);
  }, [authState.token]);

  useEffect(() => {
    const restoreSession = async () => {
      if (!authState.token) {
        setAuthReady(true);
        return;
      }

      try {
        setApiToken(authState.token);
        const payload = await apiFetch("/auth/me");
        setAuthState((current) => ({
          ...current,
          mode: "user",
          user: payload.user,
        }));
      } catch (error) {
        setAuthState(defaultAuthState);
        setApiToken("");
      } finally {
        setAuthReady(true);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const payload = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setAuthState({
        mode: "user",
        token: payload.token,
        user: payload.user,
      });
      setApiToken(payload.token);
      return payload.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials) => {
    setLoading(true);
    try {
      const payload = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setAuthState({
        mode: "user",
        token: payload.token,
        user: payload.user,
      });
      setApiToken(payload.token);
      return payload.user;
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setAuthState((current) => ({
      ...current,
      mode: "guest",
      token: "",
      user: null,
    }));
    setApiToken("");
  };

  const logout = () => {
    setAuthState(defaultAuthState);
    setApiToken("");
  };

  const updateAuthenticatedUser = (user) => {
    setAuthState((current) => ({
      ...current,
      mode: current.token ? "user" : "guest",
      user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        authReady,
        loading,
        isAuthenticated: authState.mode === "user" && Boolean(authState.token),
        login,
        signup,
        logout,
        continueAsGuest,
        updateAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
};

