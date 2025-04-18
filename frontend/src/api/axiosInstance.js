import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("jsonwebtoken");
      const payload = jwtDecode(token);
      const tenantId = payload?.tenantId;

      config.headers = {
        'x-tenant-id': tenantId,
      };
      
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error parsing token:", error);
      return config; // Proceed without the token if there's an error
    }

  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;
