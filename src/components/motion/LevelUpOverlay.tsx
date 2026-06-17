"use client";

import { AnimatePresence, motion } from "framer-motion";
import { levelUpOverlayVariants, levelUpBadgeVariants } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeVariants } from "@/lib/motion";

interface LevelUpOverlayProps {
  visible: boolean;
  level: number;
  title?: string;
  onDone?: () => void;
}

const LEVEL_TITLES: Record<number, string> = {
  1: "Iniciante",
  2: "Aprendiz",
  3: "Praticante",
  5: "Desenvolvedor",
  8: "Veterano",
  10: "Especialista",
  15: "Mestre",
  20: "Lenda",
  25: "Arquiteto",
  30: "Visionario",
};

function getTitleForLevel(level: number): string {
  const keys = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const key of keys) {
    if (level >= key) return LEVEL_TITLES[key];
  }
  return "Iniciante";
}

export function LevelUpOverlay({ visible, level, title, onDone }: LevelUpOverlayProps) {
  const reduced = useReducedMotion();
  const displayTitle = title || getTitleForLevel(level);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          variants={reduced ? fadeVariants : levelUpOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {!reduced && <div className="dd-level-flash" aria-hidden />}

          <motion.div
            className="flex flex-col items-center gap-3 pointer-events-auto"
            variants={reduced ? fadeVariants : levelUpBadgeVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/30 dd-badge-entrance">
              <span className="text-3xl font-black text-white">{level}</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-black text-dd-text">
                Level {level} desbloqueado!
              </p>
              <p className="text-sm text-dd-muted font-medium">
                Voce agora e um <span className="text-orange-400 font-bold">{displayTitle}</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
