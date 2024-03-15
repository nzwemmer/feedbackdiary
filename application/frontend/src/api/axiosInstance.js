// axiosInstance.js
import axios from "axios";

const createAxiosInstance = (token) => {
  const axiosInstance = axios.create({
    baseURL: "/", // The API base URL
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Include the token in headers if available
    },
  });

  return axiosInstance;
};

export default createAxiosInstance;
