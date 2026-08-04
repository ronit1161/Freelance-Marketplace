import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../services/authApi";
import apiClient from "../services/apiClient";

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

  useEffect(() => {
    if (token) {
      apiClient
        .get("/users/me")
        .then((res) => {
          const freshUser = res.data?.data || res.data;
          if (freshUser && freshUser.id) {
            setUser(freshUser);
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(freshUser));
          }
        })
        .catch((err) => {
          console.warn("Failed to re-validate user session on mount", err);
        });
    }
  }, [token]);

  const login = async (credentials) => {
    // credentials: { userNameOrEmail, email, password }
    const responseData = await apiLoginUser(credentials);
    const jwtToken = responseData.data?.token || responseData.token;
    const userData = responseData.data?.user || responseData.user;

    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem(SESSION_TOKEN_KEY, jwtToken);
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData));

    return userData;
  };

  const register = async (formData) => {
    const responseData = await apiRegisterUser(formData);
    const authData = responseData.data || responseData;

    if (authData?.token && authData?.user) {
      setToken(authData.token);
      setUser(authData.user);
      localStorage.setItem(SESSION_TOKEN_KEY, authData.token);
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(authData.user));
      return authData.user;
    }

    // Auto-login fallback after registration using email
    return await login({
      email: formData.email,
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
