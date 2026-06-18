'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface XPFloatToastProps {
  amount: number;
  visible: boolean;
}

export function XPFloatToast({ amount, visible }: XPFloatToastProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={reduced ? { opacity: 0 } : { opacity: 0, y: -48 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-dd-green pointer-events-none whitespace-nowrap z-10"
        >
          +{amount} XP
        </motion.span>
      )}
    </AnimatePresence>
  );
}
