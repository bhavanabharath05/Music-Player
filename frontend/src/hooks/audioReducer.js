export const audioReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSong: action.payload.song,
        currentTime: 0,
        isLoading: true,
      };

    case "PLAY":
      return {
        ...state,
        isPlaying: true,
        isLoading: false,
      };

    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
      };

    case "SET_CURRENT_TIME":
      return {
        ...state,
        currentTime: action.payload,
      };

    case "SET_VOLUME":
      return {
        ...state,
        volume: action.payload,
      };

    case "MUTE":
      return {
        ...state,
        isMuted: true,
      };

    case "UNMUTE":
      return {
        ...state,
        isMuted: false,
      };

    /* ✅ FIXED NAME */
    case "SET_PLAYBACK_SPEED":
      return {
        ...state,
        playbackSpeed: action.payload,
      };

    case "TOGGLE_LOOP":
      return {
        ...state,
        loopEnabled: !state.loopEnabled,
      };

    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        shuffleEnabled: !state.shuffleEnabled,
      };

    default:
      return state;
  }
};
