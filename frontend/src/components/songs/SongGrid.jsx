import React from "react";
import "../../css/songs/SongGrid.css";
import SongCard from "./SongCard.jsx";

const SongGrid = ({ songs = [], onSelectFavourite }) => {
  if (!songs.length) {
    return (
      <div className="song-grid-empty">
        <p className="song-grid-title">No favourite songs yet 🎵</p>
        <p className="song-grid-subtext">
          Start exploring and add songs to your favourites!
        </p>
      </div>
    );
  }

  return (
    <div className="song-grid-wrapper">
      <h3 className="song-grid-heading">Your Favourites</h3>

      <div className="song-grid">
        {songs.map((song, index) => (
          <SongCard
            key={song._id}
            song={song}
            onSelectFavourite={() =>
              onSelectFavourite(songs, index)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SongGrid;
