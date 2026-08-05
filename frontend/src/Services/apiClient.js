import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage to every request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      // Redirect commented out for development/testing:
      // if (window.location.pathname !== "/login") {
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
