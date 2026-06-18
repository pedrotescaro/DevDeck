'use client';

import { useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useXPFloat() {
  const [floatingXP, setFloatingXP] = useState<{ amount: number; x: number; y: number } | null>(
    null
  );
  const reduced = useReducedMotion();

  const showXP = useCallback(
    (amount: number, element: HTMLElement) => {
      if (reduced) return;

      const rect = element.getBoundingClientRect();
      setFloatingXP({
        amount,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });

      setTimeout(() => setFloatingXP(null), 800);
    },
    [reduced]
  );

  return { showXP, floatingXP };
}
