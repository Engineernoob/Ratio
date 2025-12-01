"use client";

import { AnimatePresence, motion } from "framer-motion";

export type TrackKey = "apprentice" | "journeyman" | "archon";

export interface TrackInfo {
  title: string;
  mantra: string;
  cadence: string;
  focus: string[];
  signal: string;
  target: string;
}

interface TrackSelectorProps {
  tracks: Record<TrackKey, TrackInfo>;
  activeTrack: TrackKey;
  onChange: (track: TrackKey) => void;
}

export function TrackSelector({
  tracks,
  activeTrack,
  onChange,
}: TrackSelectorProps) {
  return (
    <div className="track-selector">
      <div className="track-pill-row">
        {(Object.keys(tracks) as TrackKey[]).map((trackKey, index) => {
          const track = tracks[trackKey];
          const isActive = trackKey === activeTrack;
          return (
            <motion.button
              key={trackKey}
              className={`track-pill ${isActive ? "active" : ""}`}
              onClick={() => onChange(trackKey)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 210, damping: 18 }}
            >
              <div className="track-pill-title">{track.title}</div>
              <div className="track-pill-mantra">{track.mantra}</div>
              <div className="track-pill-index">{index + 1}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="track-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrack}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="track-panel-heading">
              <div className="track-panel-title">
                {tracks[activeTrack].title}
              </div>
              <div className="track-panel-cadence">
                {tracks[activeTrack].cadence}
              </div>
            </div>
            <div className="track-panel-grid">
              <div className="track-panel-card">
                <div className="track-label">Signal</div>
                <div className="track-value">{tracks[activeTrack].signal}</div>
              </div>
              <div className="track-panel-card">
                <div className="track-label">Target</div>
                <div className="track-value">{tracks[activeTrack].target}</div>
              </div>
              <div className="track-panel-card focus">
                <div className="track-label">Focus</div>
                <div className="track-focus-list">
                  {tracks[activeTrack].focus.map((item) => (
                    <span key={item} className="track-focus-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
