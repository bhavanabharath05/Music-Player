import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../css/auth/Input.css";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>

      <div className="input-container">
        <input
          type={
            type === "password"
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="input-field"
        />

        {type === "password" && (
          <button
            type="button"
            className="input-eye-btn"
            onClick={toggleShowPassword}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
