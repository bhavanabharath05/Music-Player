import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import ForgotPassword from "./components/auth/ForgotPassword.jsx";

import Homepage from "./pages/Homepage.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";

import {
  setLoading,
  clearError,
  setUser,
  logout,
  setError,
} from "./redux/slices/authslice.js";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ DEFINE storedToken
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!storedToken || user) return;

      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        dispatch(
          setUser({
            user: res.data,
            token: storedToken,
          })
        );
      } catch (error) {
        console.error("Fetch failed:", error);

        if (error.response?.status === 401) {
          dispatch(logout());
          dispatch(
            setError(
              error.response?.data?.message ||
                "Session expired. Please login again"
            )
          );
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, storedToken, user]);

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Homepage />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
