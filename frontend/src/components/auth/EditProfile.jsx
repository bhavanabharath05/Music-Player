import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Input from "../common/input.jsx";
import { setUser, setError, clearError } from "../../redux/slices/authslice";

import "../../css/auth/EditProfile.css"; // ✅ FIX: Uncommented CSS import

const EditProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  /* ===============================
     Local state
  =============================== */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ===============================
     Prefill user data
  =============================== */
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreviewImage(user.avatar || "");
    }
  }, [user]);

  /* ===============================
     Image upload → base64
  =============================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

  /* ===============================
     Submit handler
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const payload = {};

    if (name !== user.name) payload.name = name;
    if (email !== user.email) payload.email = email;
    if (base64Image) payload.avatar = base64Image;

    if (showPasswordFields) {
      if (!currentPassword || !newPassword) {
        dispatch(setError("Both current and new password are required"));
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, // ✅ FIX: Using VITE_BACKEND_URL
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        setUser({
          user: res.data.user,
          token: token,
        })
      );

      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || "Profile update failed. Try again.";
      dispatch(setError(message));
    }
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="edit-avatar">
            <img src={previewImage || "/default-avatar.png"} alt="avatar" />
            <label className="upload-btn">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password toggle */}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPasswordFields((prev) => !prev)}
          >
            {showPasswordFields ? "Cancel Password Change" : "Change Password"}
          </button>

          {showPasswordFields && (
            <>
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </>
          )}

          <div className="edit-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
