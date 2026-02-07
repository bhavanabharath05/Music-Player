import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import useAudioPlayer from "../hooks/useAudioPlayer";

import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu.jsx";
import MainArea from "../components/layout/MainArea";
import EditProfile from "../components/auth/EditProfile.jsx";
import LoginModal from "../components/auth/Login.jsx";
import SignupModal from "../components/auth/Signup.jsx";
import ForgotPasswordModal from "../components/auth/ForgotPassword.jsx";

import "../css/pages/HomePage.css";

const Homepage = () => {
  /* ===============================
     VIEW & DATA STATE
  =============================== */
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const auth = useSelector((state) => state.auth);

  /* ===============================
     ACTIVE SONG LIST
  =============================== */
  const activeSongs = view === "search" ? searchSongs : songs;

  /* ===============================
     AUDIO PLAYER HOOK
  =============================== */
  const {
    audioRef,
    playerState,
    playerControls,
    playerFeatures,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  } = useAudioPlayer(activeSongs);

  /* ===============================
     FETCH ALL SONGS ON MOUNT
  =============================== */
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/songs`
        );
        setSongs(res.data || []);
      } catch (error) {
        console.error("Failed to fetch songs", error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  /* ===============================
     HANDLE PLAYLIST/TAG SELECTION
  =============================== */
  const handleSelectTag = async (tag) => {
    console.log("Tag selected:", tag);
    
    try {
      setLoading(true);
      
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/songs/tag/${tag}`
      );
      
      console.log("Tag response:", res.data);
      
      if (res.data && res.data.length > 0) {
        setSongs(res.data);
      } else {
        console.warn("No songs found for tag:", tag);
        alert(`No songs found for ${tag}. Showing all songs.`);
        
        const allSongs = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/songs`
        );
        setSongs(allSongs.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch songs by tag:", error);
      
      if (error.response?.status === 404) {
        alert(`Tag "${tag}" not found.`);
      } else {
        alert("Failed to load songs. Please try again.");
      }
      
      try {
        const allSongs = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/songs`
        );
        setSongs(allSongs.data || []);
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     HANDLE FAVOURITE SELECTION
  =============================== */
  const handleSelectFavourite = (favouriteSongs, index) => {
    console.log("Favourite selected:", index);
    playerControls.playSongAtIndex(index);
  };

  /* ===============================
     MODAL SWITCHING FUNCTIONS
  =============================== */
  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  const handleSwitchToForgotPassword = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotPassword(true);
  };

  const closeAllModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotPassword(false);
    setShowEditProfile(false);
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="homepage-root">
      {/* AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="homepage-main-wrapper">
        {/* SIDEBAR */}
        <div className="homepage-sidebar">
          <SideMenu
            view={view}
            setView={setView}
            onEditProfile={() => setShowEditProfile(true)}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="homepage-content">
          <MainArea
            view={view}
            songs={activeSongs}
            songsToDisplay={searchSongs}
            currentIndex={playerState.currentIndex}
            setSearchSongs={setSearchSongs}
            onSelectSong={(index) => {
              console.log("Homepage received index:", index);
              playerControls.playSongAtIndex(index);
            }}
            onSelectFavourite={handleSelectFavourite}
            onSelectTag={handleSelectTag}
            onOpenLogin={() => setShowLogin(true)}
            onOpenSignup={() => setShowSignup(true)}
          />
          
          {/* Loading indicator */}
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Loading songs...</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER PLAYER */}
      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />

      {/* MODALS */}
      {showLogin && (
        <LoginModal
          onClose={closeAllModals}
          onSwitchToSignup={handleSwitchToSignup}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={closeAllModals}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={closeAllModals}
          onBackToLogin={handleSwitchToLogin}
        />
      )}

      {showEditProfile && (
        <EditProfile onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
};

export default Homepage;
