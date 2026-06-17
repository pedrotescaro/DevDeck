"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface LevelUpOptions {
  newLevel: number;
  title: string;
}

export function useLevelUp() {
  const [levelUp, setLevelUp] = useState<LevelUpOptions | null>(null);
  const reduced = useReducedMotion();

  const triggerLevelUp = useCallback((options: LevelUpOptions) => {
    setLevelUp(options);
    setTimeout(() => setLevelUp(null), 3000);
  }, []);

  return { triggerLevelUp, levelUp, reduced };
}
