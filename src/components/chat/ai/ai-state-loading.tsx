'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AI State Loading — sequential product steps for longer operations
 * (e.g. repository analysis). Only generic UX states are shown; never
 * internal reasoning, tokens or prompts.
 */

const DEFAULT_STEPS = [
  'Analisando contexto...',
  'Consultando fontes...',
  'Organizando informações...',
  'Preparando resposta...',
];

interface AiStateLoadingProps {
  steps?: string[];
  interval?: number;
  className?: string;
}

export function AiStateLoading({
  steps = DEFAULT_STEPS,
  interval = 2600,
  className,
}: AiStateLoadingProps) {
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (steps.length <= 1) return;
    const timer = window.setInterval(
      () => setCurrent((c) => Math.min(c + 1, steps.length - 1)),
      interval
    );
    return () => window.clearInterval(timer);
  }, [steps, interval]);

  return (
    <div role="status" aria-live="polite" className={cn('flex flex-col gap-2', className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex items-center gap-2 text-xs"
          >
            {done ? (
              <motion.span
                initial={reduced ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Check className="size-3.5 text-dd-green" />
              </motion.span>
            ) : (
              <span
                className={cn(
                  'size-3.5 shrink-0 rounded-full border',
                  active ? 'border-dd-text/30 border-t-dd-text' : 'border-dd-border/70',
                  active && !reduced && 'animate-spin'
                )}
              />
            )}
            <span
              className={cn(
                'leading-snug transition-colors',
                done ? 'text-dd-muted' : active ? 'font-medium text-dd-text' : 'text-dd-muted/50'
              )}
            >
              {step}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
