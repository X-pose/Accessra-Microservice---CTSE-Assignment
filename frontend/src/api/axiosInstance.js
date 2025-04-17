import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jsonwebtoken");
    const payload = JSON.parse(token);
    const accessToken = payload?.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;
