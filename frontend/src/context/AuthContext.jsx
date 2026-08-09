import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../services/authApi";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

const SESSION_USER_KEY = "auth_user";
const SESSION_TOKEN_KEY = "jwt_token";

const normalizeUser = (data) => {
  if (!data) return null;
  const userId = data.userId || data.id || data.profileId;
  const username = data.username || data.userName || (data.email ? data.email.split("@")[0] : "");
  const fullName = data.fullName || data.name || username;
  const rawRole = (data.role || "CLIENT").toUpperCase();
  const role = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;

  return {
    id: userId,
    userId: userId,
    username: username,
    userName: username,
    name: fullName,
    fullName: fullName,
    email: data.email || "",
    role: role,
    bio: data.bio || data.bioData || "",
    bioData: data.bio || data.bioData || "",
    skills: data.skills || "",
    experience: data.experienceYears !== undefined ? data.experienceYears : (data.experience || 0),
    experienceYears: data.experienceYears !== undefined ? data.experienceYears : (data.experience || 0),
    profileAvatarURL: data.profileAvatarUrl || data.profileAvatarURL || "",
    profileAvatarUrl: data.profileAvatarUrl || data.profileAvatarURL || "",
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_USER_KEY);
      return savedUser ? normalizeUser(JSON.parse(savedUser)) : null;
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
      // Refresh profile data from User Service
      apiClient
        .get("/users/profile")
        .then((res) => {
          const profileData = res.data?.data || res.data;
          if (profileData && (profileData.userId || profileData.id)) {
            const normalized = normalizeUser(profileData);
            setUser((prev) => ({ ...prev, ...normalized }));
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(normalized));
          }
        })
        .catch((err) => {
          // Fallback to /auth/me if User Service profile is not ready
          apiClient
            .get("/auth/me")
            .then((res) => {
              const authMeData = res.data?.data || res.data;
              if (authMeData && (authMeData.userId || authMeData.id)) {
                const normalized = normalizeUser(authMeData);
                setUser((prev) => ({ ...prev, ...normalized }));
                localStorage.setItem(SESSION_USER_KEY, JSON.stringify(normalized));
              }
            })
            .catch((e) => {
              console.warn("Failed to re-validate user session on mount", e);
            });
        });
    }
  }, [token]);

  const login = async (credentials) => {
    const authData = await apiLoginUser(credentials);
    const jwtToken = authData.token || authData.data?.token;
    const normalizedUser = normalizeUser(authData);

    setToken(jwtToken);
    setUser(normalizedUser);

    localStorage.setItem(SESSION_TOKEN_KEY, jwtToken);
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(normalizedUser));

    return normalizedUser;
  };

  const register = async (formData) => {
    const authData = await apiRegisterUser(formData);
    const jwtToken = authData.token || authData.data?.token;
    const normalizedUser = normalizeUser(authData);

    if (jwtToken && normalizedUser) {
      setToken(jwtToken);
      setUser(normalizedUser);
      localStorage.setItem(SESSION_TOKEN_KEY, jwtToken);
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(normalizedUser));
      return normalizedUser;
    }

    // Auto-login fallback
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
        setUser: (u) => {
          const norm = normalizeUser(u);
          setUser(norm);
          if (norm) {
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(norm));
          }
        },
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
