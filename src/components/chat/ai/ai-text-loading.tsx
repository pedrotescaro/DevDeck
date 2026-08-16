'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * AI Text Loading — subtle rotating status line shown while the assistant
 * is thinking. Occupies the same position where the answer will render so
 * there is no big layout shift. Keeps internal chain-of-thought private;
 * only generic product states are displayed.
 */

const DEFAULT_MESSAGES = ['Pensando...', 'Analisando...', 'Preparando resposta...'];

interface AiTextLoadingProps {
  messages?: string[];
  /** Label shown once before cycling (e.g. mode-specific context). */
  label?: string;
  interval?: number;
  className?: string;
}

export function AiTextLoading({
  messages = DEFAULT_MESSAGES,
  label,
  interval = 2400,
  className,
}: AiTextLoadingProps) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), interval);
    return () => window.clearInterval(timer);
  }, [messages, interval]);

  const current = messages[index];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center gap-2 text-sm text-dd-muted', className)}
    >
      <motion.span
        aria-hidden="true"
        animate={reduced ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="text-dd-text"
      >
        ✦
      </motion.span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="whitespace-nowrap"
        >
          {label ? `${label} — ${current}` : current}
        </motion.span>
      </AnimatePresence>

      <span
        aria-hidden="true"
        className={cn(
          'ml-0.5 inline-block h-3.5 w-[2px] rounded-full bg-dd-muted/50',
          !reduced && 'animate-pulse'
        )}
      />
    </div>
  );
}
