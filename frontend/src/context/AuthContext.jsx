import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../features/auth/services/authApi";
import { marketplaceStore } from "../Services/marketplaceStore";

const AuthContext = createContext(null);
const SESSION_KEY = "auth_user";

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

  const login = async (credentials) => {
    const userData = await apiLoginUser(credentials);
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const userData = await apiRegisterUser(formData);
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
