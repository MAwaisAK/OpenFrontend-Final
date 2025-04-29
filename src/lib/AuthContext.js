// File: /lib/AuthContext.js
"use client";
import { useState, createContext, useContext, useEffect } from "react";
import { fetchLogout, fetchMe } from "../app/api"; // Adjust the path as needed

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        if (!me || Object.keys(me).length === 0) {
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
          setUser(me);
        }
      } catch (error) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (data) => {
    setLoggedIn(true);
    setUser(data.user);

    // Save tokens
    localStorage.setItem("access-token", data.accessToken);
    localStorage.setItem("refresh-token", data.refreshToken);
  };

  const logout = async () => {
    setLoggedIn(false);
    setUser(null);

    await fetchLogout();

    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
  };

  const isAdmin = user?.role === "admin";

  const values = {
    loggedIn,
    user,
    isAdmin,
    login,
    logout,
  };

  if (loading) {
    return null; // Or return a loading spinner/component
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };