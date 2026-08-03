import { createContext, useContext, useState } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../services/authApi";

const AuthContext = createContext(null);

const SESSION_USER_KEY = "auth_user";
const SESSION_TOKEN_KEY = "jwt_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse auth user session", e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(SESSION_TOKEN_KEY) || null;
  });

  const login = async (credentials) => {
    // credentials: { userNameOrEmail, password }
    const responseData = await apiLoginUser(credentials);
    const jwtToken = responseData.token;
    const userData = responseData.user;

    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem(SESSION_TOKEN_KEY, jwtToken);
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData));

    return userData;
  };

  const register = async (formData) => {
    const userData = await apiRegisterUser(formData);
    
    // Auto-login after registration
    return await login({
      userNameOrEmail: formData.userName || formData.email,
      password: formData.password,
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem(SESSION_TOKEN_KEY);
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role.toUpperCase() === requiredRole.toUpperCase();
  };

  const role = user?.role ? user.role.toUpperCase() : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: isAuthenticated(),
        hasRole,
        login,
        register,
        logout,
        setUser,
      }}
    >
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
