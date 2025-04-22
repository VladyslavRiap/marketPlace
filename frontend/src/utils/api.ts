import axios from "axios";

const api = axios.create({
  baseURL: "https://marketplace-production-9538.up.railway.app/api",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "https://marketplace-production-9538.up.railway.app/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url === "/auth/login") {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await refreshApi.post("/auth/refresh-token");

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
