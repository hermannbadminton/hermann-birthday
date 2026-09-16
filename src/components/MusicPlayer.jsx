/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Pause, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import musicFile from "../assets/nhacsinhnhat.mp3";

const MusicNote = ({ id, onComplete }) => {
  const notes = ["🎵", "🎶", "🏸", "🎂"];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const randomX = Math.random() * 60 - 30;

  return (
    <motion.span
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: -90,
        x: randomX,
        scale: [0.5, 1.2, 1, 0.8],
        rotate: [0, 15, -15, 0],
      }}
      transition={{ duration: 2.8, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute text-rose-500 pointer-events-none text-base select-none z-0"
    >
      {note}
    </motion.span>
  );
};

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const id = Date.now();
        setNotes((prev) => [...prev.slice(-10), id]);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const removeNote = (id) => {
    setNotes((prev) => prev.filter((noteId) => noteId !== id));
  };

  const wasInterruptedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleGlobalPlay = (e) => {
      if (e.detail !== "main-music") {
        if (resumeTimeoutRef.current) {
          clearTimeout(resumeTimeoutRef.current);
          resumeTimeoutRef.current = null;
        }
        setIsPlaying((prev) => {
          if (prev) {
            audioRef.current?.pause();
            wasInterruptedRef.current = true;
            return false;
          }
          return prev;
        });
      }
    };

    const handleGlobalPause = (e) => {
      if (e.detail !== "main-music") {
        if (wasInterruptedRef.current) {
          resumeTimeoutRef.current = setTimeout(() => {
            if (wasInterruptedRef.current) {
              audioRef.current?.play().catch((err) => console.log(err));
              setIsPlaying(true);
              wasInterruptedRef.current = false;
            }
          }, 3000);
        }
      }
    };

    window.addEventListener("global-play", handleGlobalPlay);
    window.addEventListener("global-pause", handleGlobalPause);
    return () => {
      window.removeEventListener("global-play", handleGlobalPlay);
      window.removeEventListener("global-pause", handleGlobalPause);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      wasInterruptedRef.current = false;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      setIsPlaying(false);
    } else {
      window.dispatchEvent(
        new CustomEvent("global-play", { detail: "main-music" })
      );
      wasInterruptedRef.current = false;
      audioRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Playback blocked:", err));
    }
  };

  return (
    <div className="relative flex flex-col items-center pointer-events-auto">
      <audio ref={audioRef} src={musicFile} loop playsInline preload="auto" />
      {/* Floating Notes Container */}
      <div className="relative w-full h-0 flex justify-center">
        <AnimatePresence>
          {notes.map((id) => (
            <MusicNote key={id} id={id} onComplete={removeNote} />
          ))}
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-10 h-10 bg-white/90 backdrop-blur-md shadow-lg rounded-full ${
          isPlaying
            ? "text-rose-600 border-rose-400 bg-rose-50"
            : "text-gray-500 border-gray-200"
        } hover:bg-white transition-all flex items-center justify-center border shadow-rose-200/50 z-10 pointer-events-auto cursor-pointer`}
        aria-label="Toggle music"
        title={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc"}
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Pause size={18} />
          </motion.div>
        ) : (
          <Music size={18} />
        )}

        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
