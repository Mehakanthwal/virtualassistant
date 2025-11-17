import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext();

function UserContextProvider({ children }) {
  const serverUrl = "http://localhost:8000"; // backend URL

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    else localStorage.removeItem("userData");
  }, [userData]);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      const returnedUser = result?.data?.user ?? result?.data ?? null;
      setUserData(returnedUser);
    } catch {
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const getGeminiResponse = async (userInput) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command: userInput },
        { withCredentials: true }
      );
      return result?.data ?? null;
    } catch (error) {
      console.error("askToAssistant error:", error);
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        handleCurrentUser,
        loadingUser,
        getGeminiResponse,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContextProvider;
