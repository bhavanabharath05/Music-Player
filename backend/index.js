import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: '10mb' })); // ✅ FIX: Increased limit for base64 images

// Connect your Database
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);

// ✅ FIX: Add /api/user route for profile updates
app.use("/api/user", authRoutes);

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Music Player API is running!" });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Cannot ${req.method} ${req.url}` 
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error" 
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
);