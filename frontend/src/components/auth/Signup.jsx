import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaTimes } from "react-icons/fa";
import { authAPI } from "../../services/apiService";
import {
  setLoading,
  setUser,
  setError,
  clearError,
} from "../../redux/slices/authslice";
import "../../css/auth/Auth.css";

const Signup = ({ onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    dispatch(clearError());
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authAPI.signup(formData);

      dispatch(
        setUser({
          user: response.data.user,
          token: response.data.token,
        })
      );

      onClose(); // Close modal on success
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
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
          <h2>Create Account</h2>
          <p>Sign up to get started with Synthesia</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {error && <div className="error-message">{error}</div>}

          {/* Avatar Upload */}
          <div className="avatar-upload-section">
            <div className="avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" />
              ) : (
                <FaUser size={40} />
              )}
            </div>
            <label htmlFor="avatar-input" className="avatar-upload-label">
              <FaCamera />
              <span>Upload Photo</span>
            </label>
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Name Input */}
          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Switch to Login */}
          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={onSwitchToLogin}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
