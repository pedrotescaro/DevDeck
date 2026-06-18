"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface BookmarkButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  className?: string;
  onViewAll?: () => void;
}

export function BookmarkButton({ isSaved, onToggle, className, onViewAll }: BookmarkButtonProps) {
  const reduced = useReducedMotion();
  const [saved, setSaved] = useState(isSaved);
  const [showToast, setShowToast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateSoundState = () => {
      setSoundEnabled(localStorage.getItem("devdeck-sound") !== "false");
    };

    updateSoundState();

    window.addEventListener("storage", updateSoundState);
    window.addEventListener("devdeck-sound-changed", updateSoundState);

    return () => {
      window.removeEventListener("storage", updateSoundState);
      window.removeEventListener("devdeck-sound-changed", updateSoundState);
    };
  }, []);

  const { playSound } = useSoundEffects(soundEnabled);

  const handleClick = () => {
    const willSave = !saved;
    setSaved(willSave);
    onToggle();
    if (willSave) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      playSound("bookmark");
    }
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleClick}
        className={cn(
          "dd-touch dd-focus-ring w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0",
          saved
            ? "text-orange-500 hover:bg-orange-500/10"
            : "text-dd-muted hover:text-dd-text hover:bg-orange-500/10",
          className
        )}
        whileTap={reduced ? undefined : { scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        title={saved ? "Remover dos salvos" : "Salvar"}
      >
        <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
      </motion.button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="bookmark-toast"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-dd-surface border border-dd-border rounded-lg px-3 py-1.5 shadow-lg z-50"
          >
            <p className="text-[10px] font-bold text-dd-text">
              Salvo nos seus bookmarks
              {onViewAll && (
                <button
                  type="button"
                  onClick={onViewAll}
                  className="ml-2 text-dd-accent hover:underline"
                >
                  Ver todos
                </button>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
