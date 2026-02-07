import React from "react";
import { useSelector } from "react-redux";

import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import SongList from "../player/SongList";

import "../../css/mainArea/MainArea.css";

const MainArea = ({
  view,
  songs = [],
  songsToDisplay = [],
  setSearchSongs,
  currentIndex,
  onSelectSong,
  onSelectFavourite,
  onSelectTag,
  onOpenLogin,
  onOpenSignup,
}) => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        <Auth 
          onOpenLogin={onOpenLogin}
          onOpenSignup={onOpenSignup}
        />

        {view === "home" && <Playlist onSelectTag={onSelectTag} />}

        {view === "search" && (
          <SearchBar songs={songs} setSearchSongs={setSearchSongs} />
        )}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && (
          <SongList
            songs={view === "search" ? songsToDisplay : songs}
            currentIndex={currentIndex}
            onSelectSong={onSelectSong}
          />
        )}

        {view === "favourite" && (
          <SongList
            songs={auth.user?.favourites ?? []}
            currentIndex={currentIndex}
            onSelectSong={onSelectSong}
            onSelectFavourite={onSelectFavourite}
          />
        )}
      </div>
    </div>
  );
};

export default MainArea;
