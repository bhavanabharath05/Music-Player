import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post("/api/auth/signup", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  getMe: () => api.get("/api/auth/me"),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  resetPassword: (token, password) => 
    api.post(`/api/auth/reset-password/${token}`, { password }),
  updateProfile: (userData) => api.patch("/api/user/profile", userData),
};

export default api;