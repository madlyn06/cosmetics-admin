import axios from "axios";
import queryString from "query-string";

const env = "dev";
const baseURL =
  env === "dev"
    ? "http://localhost:8000/api"
    : "https://cosmetics-be.onrender.com/api";
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "content-type": "application/json"
  },
  paramsSerializer: (params) => queryString.stringify(params)
});
axiosClient.interceptors.request.use(async (config) => {
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
