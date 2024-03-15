import { useState } from "react";
import jwtDecode from "jwt-decode";

function useToken() {
  function getToken() {
    return localStorage.getItem("token") || null;
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  }

  function removeToken() {
    localStorage.removeItem("token");
    setToken(null);
  }

  // Function to check if the token is expired
  function isTokenExpired(token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      return true; // Treat it as expired for safety
    }
  }

  return {
    setToken: saveToken,
    token,
    removeToken,
    isTokenExpired,
  };
}

export default useToken;
