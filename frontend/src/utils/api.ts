import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:5000/api",
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
