import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
import { authAPI } from "../../services/apiService";
import {
  setLoading,
  setUser,
  setError,
  clearError,
} from "../../redux/slices/authslice";
import "../../css/auth/Auth.css";

const Login = ({ onClose, onSwitchToSignup, onSwitchToForgotPassword }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authAPI.login(formData);

      dispatch(
        setUser({
          user: response.data.user,
          token: response.data.token,
        })
      );

      onClose(); // Close modal on success
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="auth-modal-header">
          <h2>Welcome Back</h2>
          <p>Login to continue to Synthesia</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {error && <div className="error-message">{error}</div>}

          {/* Email Input */}
          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-link">
            <span onClick={onSwitchToForgotPassword}>Forgot Password?</span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Switch to Signup */}
          <p className="auth-switch">
            Don't have an account?{" "}
            <span onClick={onSwitchToSignup}>Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
