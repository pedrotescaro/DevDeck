'use client';

import { cn } from '@/lib/cn';
import { useCharCounter } from '@/hooks/useCharCounter';

interface CharCounterProps {
  text: string;
  limit: number;
  className?: string;
}

export function CharCounter({ text, limit, className }: CharCounterProps) {
  const { count, visible, color, shake } = useCharCounter(text, limit);

  if (!visible) return null;

  return (
    <span
      className={cn(
        'text-[10px] font-mono font-medium tabular-nums transition-colors duration-150',
        color === 'default' && 'text-dd-muted',
        color === 'amber' && 'text-amber-400',
        color === 'red' && 'text-red-500',
        shake && 'dd-char-shake',
        className
      )}
    >
      {count}/{limit}
    </span>
  );
}
