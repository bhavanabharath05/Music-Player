import { useReducer, useRef, useState } from "react";
import { audioReducer } from "./audioReducer";

const initialAudioState = {
  currentIndex: null,
  currentSong: null,
  isPlaying: false,
  isMuted: false,
  volume: 1,
  playbackSpeed: 1,
  loopEnabled: false,
  shuffleEnabled: false,
  currentTime: 0,
};

const useAudioPlayer = (songs = []) => {
  const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const playSongAtIndex = async (index) => {
    if (!songs || !songs[index]) return;

    const audio = audioRef.current;
    if (!audio) return;

    const song = songs[index];

    dispatch({
      type: "SET_CURRENT_TRACK",
      payload: { index, song },
    });

    // Stop previous audio safely
    audio.pause();
    audio.src = song.audio;
    audio.currentTime = 0;

    // Apply persisted settings
    audio.volume = audioState.volume;
    audio.playbackRate = audioState.playbackSpeed;
    audio.muted = audioState.isMuted;

    try {
      await audio.play();
      dispatch({ type: "PLAY" });
    } catch (err) {
      // ✅ ignore AbortError, it is expected
      if (err.name !== "AbortError") {
        console.error("Audio play failed:", err);
      }
    }
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      dispatch({ type: "PLAY" });
    } else {
      audio.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    dispatch({ type: "SET_CURRENT_TIME", payload: time });
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    dispatch({ type: audio.muted ? "MUTE" : "UNMUTE" });
  };

  const handleChangeVolume = (vol) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = vol;
    dispatch({ type: "SET_VOLUME", payload: vol });
  };

  const handleChangeSpeed = (speed) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: speed });
  };

  // ✅ FIX: Added missing handlePrevious function
  const handlePrevious = () => {
    if (!songs || songs.length === 0) return;

    const prevIndex =
      audioState.currentIndex - 1 >= 0
        ? audioState.currentIndex - 1
        : songs.length - 1;

    playSongAtIndex(prevIndex);
  };

  const handleNext = () => {
    if (!songs || songs.length === 0) return;

    // 🔀 SHUFFLE MODE
    if (audioState.shuffleEnabled && songs.length > 1) {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === audioState.currentIndex);

      playSongAtIndex(randomIndex);
      return;
    }

    // ▶️ NORMAL NEXT
    const nextIndex =
      audioState.currentIndex + 1 < songs.length
        ? audioState.currentIndex + 1
        : 0;

    playSongAtIndex(nextIndex);
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // 🔁 LOOP CURRENT SONG
    if (audioState.loopEnabled) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    // ▶️ OTHERWISE GO NEXT
    handleNext();
  };

  // ✅ FIX: Added missing toggle functions
  const handleToggleLoop = () => {
    dispatch({ type: "TOGGLE_LOOP" });
  };

  const handleToggleShuffle = () => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
  };

  return {
    audioRef,

    playerState: {
      ...audioState,
      duration,
    },

    playerControls: {
      playSongAtIndex,
      handleTogglePlay,
      handleNext,
      handlePrevious, // ✅ FIX: Now exported
      handleSeek,
    },

    playerFeatures: {
      onToggleMute: handleToggleMute,
      onChangeVolume: handleChangeVolume,
      onChangeSpeed: handleChangeSpeed,
      onToggleLoop: handleToggleLoop, // ✅ FIX: Now exported
      onToggleShuffle: handleToggleShuffle, // ✅ FIX: Now exported
    },

    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  };
};

export default useAudioPlayer;