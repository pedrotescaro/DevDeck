'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { XPFloatToast } from './XPFloatToast';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type PublishState = 'idle' | 'submitting' | 'success';

interface PublishButtonProps {
  disabled?: boolean;
  state: PublishState;
  xpReward?: number;
  className?: string;
  labelOverrides?: Partial<Record<PublishState, string>>;
}

const labels: Record<PublishState, string> = {
  idle: 'Postar',
  submitting: 'Postando...',
  success: 'Postado ✓',
};

export function PublishButton({
  disabled,
  state,
  xpReward = 15,
  className,
  labelOverrides,
}: PublishButtonProps) {
  const reduced = useReducedMotion();
  const isEmpty = disabled && state === 'idle';
  const buttonLabels = { ...labels, ...labelOverrides };

  return (
    <div className="relative">
      <XPFloatToast amount={xpReward} visible={state === 'success'} />
      <motion.button
        type="submit"
        disabled={disabled || state === 'submitting'}
        className={cn(
          'dd-focus-ring dd-gpu relative bg-dd-accent text-white text-xs font-bold px-5 py-2 rounded-full',
          'shadow-md shadow-blue-500/10 transition-[opacity,background-color] duration-200 cursor-pointer',
          'hover:bg-blue-600',
          isEmpty && 'opacity-40 scale-95 pointer-events-none',
          state === 'success' && 'bg-dd-green hover:bg-dd-green',
          state === 'submitting' && 'opacity-80 cursor-wait',
          className
        )}
        whileHover={!isEmpty && state === 'idle' ? { scale: 1.03 } : undefined}
        whileTap={!reduced && state !== 'submitting' ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        {buttonLabels[state]}
      </motion.button>
    </div>
  );
}

export type { PublishState };
