import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateFavourite } from "../../redux/slices/authslice";
import "../../css/footer/ControlArea.css";

const ControlArea = ({ playerState, playerControls }) => {
  if (!playerState || !playerControls) return null;

  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector(
    (state) => state.auth
  );

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
  } = playerState;

  const {
    handleNext,
    handlePrevious,
    handleTogglePlay,
    handleSeek,
  } = playerControls;

  // ✅ FIX: Better song ID handling
  const currentSongId = currentSong?.id || currentSong?._id;

  // ✅ FIX: More robust liked check
  const isLiked = Boolean(
    currentSongId &&
      user?.favourites?.some((fav) => {
        const favId = fav.id || fav._id;
        return favId === currentSongId;
      })
  );

  console.log("ControlArea - Current Song ID:", currentSongId);
  console.log("ControlArea - Is Liked:", isLiked);
  console.log("ControlArea - User Favourites:", user?.favourites);

  const handleLike = async () => {
    if (!isAuthenticated || !currentSong) {
      console.warn("Cannot like: User not authenticated or no song selected");
      return;
    }

    if (!token) {
      console.error("Cannot like: No auth token found");
      return;
    }

    try {
      // ✅ FIX: Ensure we have a proper ID
      const songId = currentSong.id || currentSong._id;
      
      if (!songId) {
        console.error("Cannot like: Song has no ID");
        return;
      }

      // ✅ FIX: Send complete song data
      const songData = {
        id: songId,
        name: currentSong.name || "Unknown Song",
        artist_name: currentSong.artist_name || currentSong.artistName || "Unknown Artist",
        image: currentSong.image || currentSong.artwork || "",
        duration: currentSong.duration || 0,
        audio: currentSong.audio || currentSong.url || "",
        releasedate: currentSong.releasedate || currentSong.release_date || "",
      };

      console.log("Sending like request with song data:", songData);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/songs/favourites`,
        { song: songData },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log("Like successful, updated favourites:", res.data);
      
      // ✅ FIX: Update Redux state immediately
      dispatch(updateFavourite(res.data));
      
    } catch (error) {
      console.error("Like failed:", error);
      
      if (error.response) {
        console.error("Server error:", error.response.status);
        console.error("Error data:", error.response.data);
        
        if (error.response.status === 500) {
          alert("Server error. Please check backend logs.");
        } else if (error.response.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else {
          alert(`Failed to add to favourites: ${error.response.data?.message || "Unknown error"}`);
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("Cannot reach server. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        alert("Failed to add to favourites. Please try again.");
      }
    }
  };

  const progressPercent = duration
    ? (currentTime / duration) * 100
    : 0;

  return (
    <div className="control-root">
      {/* Buttons */}
      <div className="control-buttons">
        <button
          className="control-icon-btn"
          onClick={handlePrevious}
          disabled={!currentSong}
        >
          <TbPlayerTrackPrevFilled size={24} />
        </button>

        <button
          className="control-play-btn"
          onClick={handleTogglePlay}
          disabled={!currentSong}
        >
          {isPlaying ? (
            <GiPauseButton size={42} />
          ) : (
            <FaCirclePlay size={42} />
          )}
        </button>

        <button
          className="control-icon-btn"
          onClick={handleNext}
          disabled={!currentSong}
        >
          <TbPlayerTrackNextFilled size={24} />
        </button>

        {/* ✅ FIX: Heart button - always show when authenticated */}
        {isAuthenticated && (
          <button
            className={`control-icon-btn ${isLiked ? 'control-liked' : ''}`}
            onClick={handleLike}
            disabled={!currentSong}
            title={isLiked ? "Remove from favourites" : "Add to favourites"}
          >
            {isLiked ? (
              <FaHeart size={22} className="heart-icon-liked" />
            ) : (
              <FaRegHeart size={22} className="heart-icon" />
            )}
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime || 0}
          className="control-progress"
          onChange={(e) =>
            handleSeek?.(Number(e.target.value))
          }
          style={{
            background: `linear-gradient(to right,
              #a855f7 ${progressPercent}%,
              #111 ${progressPercent}%)`,
          }}
          disabled={!currentSong}
        />

        <div className="control-times">
          <span>
            {Math.floor(currentTime / 60)}:
            {String(Math.floor(currentTime % 60)).padStart(2, "0")}
          </span>
          <span>
            {Math.floor(duration / 60)}:
            {String(Math.floor(duration % 60)).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
