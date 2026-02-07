import React from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { TbArrowsShuffle } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";

import "../../css/footer/Feature.css";

const Features = ({ playerState, playerFeatures }) => {
  if (!playerState || !playerFeatures) return null;

  const {
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  } = playerState;

  const {
    onToggleMute,
    onToggleLoop,
    onToggleShuffle,
    onChangeSpeed,
    onChangeVolume,
  } = playerFeatures;

  return (
    <div className="features-root">
      <div className="features-row">
        {/* Mute */}
        <button
          className="features-btn"
          aria-label={isMuted ? "unmute" : "mute"}
          onClick={() => onToggleMute?.()}
        >
          {isMuted ? (
            <IoVolumeMuteOutline size={20} />
          ) : (
            <IoVolumeHighOutline size={20} />
          )}
        </button>

        {/* Shuffle */}
        <button
          className={
            shuffleEnabled
              ? "features-btn features-btn-active"
              : "features-btn"
          }
          aria-label="shuffle"
          onClick={() => onToggleShuffle?.()}
        >
          <TbArrowsShuffle size={20} />
        </button>

        {/* Loop */}
        <button
          className={
            loopEnabled
              ? "features-btn features-btn-active"
              : "features-btn"
          }
          aria-label="loop"
          onClick={() => onToggleLoop?.()}
        >
          <RiLoopRightLine size={18} />
        </button>

        {/* Playback Speed */}
        <select
          className="features-speed-select"
          value={playbackSpeed}
          onChange={(e) =>
            onChangeSpeed?.(Number(e.target.value))
          }
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      {/* Volume */}
      <div className="features-volume-wrapper">
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((volume || 0) * 100)}
          onChange={(e) =>
            onChangeVolume?.(Number(e.target.value) / 100)
          }
          className="features-volume-range"
          style={{
            background: `linear-gradient(to right,
              #a855f7 ${(volume || 0) * 100}%,
              #111 ${(volume || 0) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Features;
