import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getSongs,
  getPlaylistTag,
  toggleFavourite,
} from "../controllers/songController.js";

const songrouter = express.Router();

// ✅ Get all songs
songrouter.get("/", getSongs);

// ✅ FIX: Changed from /playlist/:tag to /tag/:tag
songrouter.get("/tag/:tag", getPlaylistTag);

// ✅ Also keep /playlist/:tag for backwards compatibility
songrouter.get("/playlist/:tag", getPlaylistTag);

// ✅ Toggle favourite
songrouter.post("/favourites", protect, toggleFavourite);

// ✅ Get favourites
songrouter.get("/favourites", protect, (req, res) => {
  res.json(req.user.favourites || []);
});

export default songrouter;