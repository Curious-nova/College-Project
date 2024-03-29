import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoutes = () => {
  const [loggedIn, setLoggedIn] = useState(null); // Changed initial state to null

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:8080/", {
          withCredentials: true,
        });
        if (response.data.status === "success") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching authentication status:", error);
        setLoggedIn(false);
      }
    };

    checkAuthentication();
  }, []);

  // Added condition to handle the initial loading state
  if (loggedIn === null) {
    return null; // or loading indicator
  }

  // Render based on the authentication status
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
