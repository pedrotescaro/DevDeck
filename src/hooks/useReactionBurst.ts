'use client';

import { useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function useReactionBurst() {
  const [bursting, setBursting] = useState(false);
  const reduced = useReducedMotion();

  const triggerBurst = useCallback(
    (color: string = '#f97316') => {
      if (reduced) return;
      setBursting(true);
      setTimeout(() => setBursting(false), 400);
    },
    [reduced]
  );

  const particles = bursting
    ? PARTICLE_ANGLES.map((deg) => ({
        angle: deg,
        tx: `${Math.cos((deg * Math.PI) / 180) * 16}px`,
        ty: `${Math.sin((deg * Math.PI) / 180) * 16}px`,
        animation: 'dd-particle 400ms ease-out forwards',
      }))
    : [];

  return { triggerBurst, particles, bursting };
}
