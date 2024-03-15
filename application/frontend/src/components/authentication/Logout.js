import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import createAxiosInstance from "src/api/axiosInstance";

import useToken from "./useToken";

const Logout = () => {
  const { removeToken } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to clear the JWT access token
    const clearAccessToken = async () => {
      try {
        // Use Axios instance to make the request
        const axiosInstance = createAxiosInstance();

        // Make a POST request to backend to clear the access token
        await axiosInstance.post("/api/logout");
        navigate("/login");
      } catch (error) {
        // Handle any errors here
        console.error("Error clearing access token:", error);
      }
    };

    // Call the function to clear the access token
    clearAccessToken();

    // Remove the token from client-side storage
    removeToken();
  }, []);
};

export default Logout;
