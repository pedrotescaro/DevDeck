'use client';

import { X, Heart, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LessonHeaderProps {
  currentStepIndex: number;
  totalSteps: number;
  lives: number;
  maxLives: number;
  combo: number;
  earnedXp: number;
  onExitClick: () => void;
}

export function LessonHeader({
  currentStepIndex,
  totalSteps,
  lives,
  maxLives,
  combo,
  earnedXp,
  onExitClick,
}: LessonHeaderProps) {
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentStepIndex / Math.max(1, totalSteps)) * 100)
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b border-dd-border/80 bg-dd-bg/95 backdrop-blur-md px-4 py-3 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Exit Button */}
        <button
          type="button"
          onClick={onExitClick}
          aria-label="Sair da lição"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-dd-muted hover:text-dd-text hover:bg-dd-surface/80 active:scale-95 transition-all cursor-pointer"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Progress Bar Container */}
        <div className="flex-1 max-w-md h-3.5 bg-dd-surface rounded-full overflow-hidden border border-dd-border/60 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {/* Stats Indicators: Hearts, Combo, XP */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Combo Indicator */}
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-black text-amber-500 shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{combo}x combo</span>
            </motion.div>
          )}

          {/* Session XP */}
          {earnedXp > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-black text-yellow-500">
              <span>+{earnedXp} XP</span>
            </div>
          )}

          {/* Lives / Hearts (5 corações individuais) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dd-surface/80 border border-dd-border/80 shadow-sm"
            aria-label={`${lives} de ${maxLives} vidas restantes`}
          >
            {Array.from({ length: maxLives }).map((_, index) => {
              const isAlive = index < lives;
              return (
                <Heart
                  key={index}
                  className={`h-4 w-4 transition-colors duration-200 ${
                    isAlive
                      ? 'fill-red-500 text-red-500'
                      : 'fill-neutral-400 text-neutral-400 dark:fill-neutral-600 dark:text-neutral-600'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
