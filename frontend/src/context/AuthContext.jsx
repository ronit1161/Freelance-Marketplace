import { createContext, useContext, useState } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../services/authApi";

const AuthContext = createContext(null);

const SESSION_KEY = "auth_user";
const TOKEN_KEY = "jwt_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      return savedSession ? JSON.parse(savedSession) : null;
    } catch (e) {
      console.error("Failed to parse auth session", e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token") || null;
  });

  const login = async (credentials) => {
    const data = await apiLoginUser(credentials);
    const jwtToken = data?.token || data?.jwt || data?.accessToken;
    const userData = data?.user || {
      id: data?.id,
      email: data?.email || credentials.email,
      name: data?.fullName || data?.name || "User",
      role: (data?.role || "CLIENT").toUpperCase(),
    };

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem(TOKEN_KEY, jwtToken);
    }
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const data = await apiRegisterUser(formData);
    const jwtToken = data?.token || data?.jwt || data?.accessToken;
    const userData = data?.user || {
      id: data?.id,
      email: formData.email,
      name: formData.name || formData.fullName,
      role: (formData.role || "CLIENT").toUpperCase(),
    };

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem(TOKEN_KEY, jwtToken);
    }
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!(user && (token || localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token")));

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
