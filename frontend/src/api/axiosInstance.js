import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jsonwebtoken");

    if (token && token.split('.').length === 3) {
      try {
        const payload = jwtDecode(token);
        const tenantId = payload?.tenantId;

        config.headers = {
          ...config.headers,
          'x-tenant-id': tenantId,
          'Authorization': `Bearer ${token}`,
        };
      } catch (err) {
        console.error("Failed to decode JWT:", err.message);
      }
    } else {
      console.warn("Token is missing or malformed.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);



export default axiosInstance;
