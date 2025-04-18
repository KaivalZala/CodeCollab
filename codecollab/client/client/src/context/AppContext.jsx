import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedin(false);
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        setUserData(data.user);
        setIsLoggedin(true);
      }
    } catch (error) {
      toast.error("Authentication failed, please login again");
      setIsLoggedin(false);
      localStorage.removeItem("token");
    }
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
        return data.user;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
