'use client';
import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

const counterVariants = {
  initial: (dir: number) => ({
    y: dir > 0 ? 14 : -14,
    opacity: 0,
  }),
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -14 : 14,
    opacity: 0,
  }),
};

export function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const prevValueRef = useRef(value);
  const direction = value >= prevValueRef.current ? 1 : -1;

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  if (reduced) {
    return <span className={`tabular-nums ${className}`}>{value}</span>;
  }

  return (
    <span
      className={`relative inline-flex overflow-hidden h-[18px] items-center tabular-nums leading-none select-none ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={value}
          custom={direction}
          variants={counterVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block leading-none"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
