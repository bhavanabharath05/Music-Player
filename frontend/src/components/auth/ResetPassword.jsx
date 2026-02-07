import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Input from "../common/input.jsx";

const ResetPassword = () => {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "error" | "success"
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setStatus("loading");
      setMessage("Resetting password...");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${token}`,
        { password }
      );

      setStatus("success");
      setMessage("Password reset successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-wrapper">
      <h1 className="reset-title">Reset Password</h1>

      <form className="reset-form" onSubmit={handleReset}>
        <Input
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && (
          <p className={`reset-message ${status}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="reset-submit-btn"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
