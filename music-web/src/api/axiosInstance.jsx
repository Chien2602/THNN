import axios from "axios";

// Hàm refresh token
const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  try {
    const response = await axios.post("http://localhost:3001/refresh-token", {
      refresh: refresh,
    });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("Lỗi khi refresh token:", err);
    return null;
  }
};

const api = axios.create({
  baseURL: "http://localhost:3001/api/",
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;