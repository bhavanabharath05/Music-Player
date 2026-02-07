import express from "express";
import protect from "../middleware/authMiddleware.js";

import { 
  forgotPassword, 
  getMe, 
  login, 
  resetPassword, 
  signup, 
  updateProfile 
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ FIX: Changed from /profile to match index.js routing
// This will be accessed as /api/user/profile
router.patch("/profile", protect, updateProfile);

export default router;