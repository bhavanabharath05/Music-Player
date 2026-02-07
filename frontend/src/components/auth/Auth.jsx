import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authslice.js";
import "../../css/auth/Auth.css";

const Auth = ({ onOpenLogin, onOpenSignup }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="auth-container">
      {/* STATUS MESSAGE */}
      {!isAuthenticated && (
        <span className="auth-status">Not signed in</span>
      )}

      {!user ? (
        <>
          <button
            className="auth-btn login"
            onClick={onOpenLogin}
          >
            Login
          </button>

          <button
            className="auth-btn signup"
            onClick={onOpenSignup}
          >
            Signup
          </button>
        </>
      ) : (
        <button
          className="auth-btn logout"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Auth;
