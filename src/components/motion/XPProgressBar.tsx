"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface XPProgressBarProps {
  percent: number;
  colorClass: string;
  level?: number;
  onLevelUp?: () => void;
}

export function XPProgressBar({
  percent,
  colorClass,
  level,
  onLevelUp,
}: XPProgressBarProps) {
  const reduced = useReducedMotion();
  const prevLevel = useRef(level);
  const [showFlash, setShowFlash] = useState(false);
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => {
    if (level != null && prevLevel.current != null && level > prevLevel.current) {
      setShowFlash(true);
      setBadgePop(true);
      onLevelUp?.();
      const flashTimer = setTimeout(() => setShowFlash(false), 200);
      const badgeTimer = setTimeout(() => setBadgePop(false), 600);
      prevLevel.current = level;
      return () => {
        clearTimeout(flashTimer);
        clearTimeout(badgeTimer);
      };
    }
    prevLevel.current = level;
  }, [level, onLevelUp]);

  return (
    <>
      {showFlash && !reduced && <div className="dd-level-flash" aria-hidden />}
      <div className="dd-liquid-track h-1.5 w-full rounded-full bg-slate-800">
        <motion.div
          className={cn("dd-liquid-fill h-full w-full rounded-full", colorClass)}
          initial={false}
          animate={{ scaleX: Math.min(1, Math.max(0, percent / 100)) }}
          transition={
            reduced
              ? { duration: 0.01 }
              : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </div>
      {level != null && badgePop && !reduced && (
        <motion.span
          initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
          animate={{ scale: [0.5, 1.15, 1], rotate: [-8, 4, 0], opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sr-only"
        >
          Nível {level}
        </motion.span>
      )}
    </>
  );
}
