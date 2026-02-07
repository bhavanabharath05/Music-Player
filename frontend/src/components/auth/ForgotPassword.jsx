import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEnvelope, FaTimes, FaCheckCircle } from "react-icons/fa";
import { authAPI } from "../../services/apiService";
import { setLoading, setError, clearError } from "../../redux/slices/authslice";
import "../../css/auth/Auth.css";

const ForgotPassword = ({ onClose, onBackToLogin }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      await authAPI.forgotPassword(email);
      
      setSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email.";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (success) {
    return (
      <div className="auth-modal-overlay" onClick={onClose}>
        <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>

          <div className="auth-modal-header">
            <FaCheckCircle size={60} style={{ color: "#4ade80", marginBottom: "15px" }} />
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to {email}</p>
          </div>

          <button className="submit-btn" onClick={onBackToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="auth-modal-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="auth-switch">
            Remember your password?{" "}
            <span onClick={onBackToLogin}>Back to Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
