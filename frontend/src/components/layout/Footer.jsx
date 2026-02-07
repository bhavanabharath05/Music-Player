import React from "react";
import SongDetail from "../player/SongDetail.jsx";
import ControlArea from "../player/ControlArea.jsx";
import Features from "../player/Features.jsx";

import "../../css/footer/Footer.css";

const Footer = ({ playerState, playerControls, playerFeatures }) => {
  console.log("Footer rendered");

  if (!playerState) return null;

  const currentSong = playerState.currentSong;

  return (
    <footer className="footer-root footer-glow">
      {/* Song info OR placeholder */}
      {currentSong ? (
        <SongDetail currentSong={currentSong} />
      ) : (
        <div className="footer-empty">Select a song to play</div>
      )}

      {/* ✅ ALWAYS RENDER */}
      <ControlArea
        playerState={playerState}
        playerControls={playerControls}
      />

      <Features
        playerState={playerState}
        playerFeatures={playerFeatures}
      />
    </footer>
  );
};

export default Footer;
