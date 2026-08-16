'use client';

import Image from 'next/image';
import { StreakPopover } from '@/components/StreakPopover';

interface StreakBadgeProps {
  streak: number;
  language?: string;
}

export function StreakBadge({ streak, language }: StreakBadgeProps) {
  const shouldPulse = streak >= 7;

  return (
    <StreakPopover
      streak={streak}
      align="center"
      triggerClassName={`dd-focus-ring inline-flex items-center gap-1.5 rounded-full border border-dd-amber/20 bg-dd-amber/10 px-3 py-1 text-xs font-medium text-dd-amber ${
        shouldPulse ? 'animate-pulse' : ''
      }`}
    >
      <Image
        src="/assets/trails/streak-flame.png"
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 shrink-0 object-contain"
      />

      <span className="font-bold">{streak}</span>
      <span>{streak === 1 ? 'dia' : 'dias'}</span>
      {language && <span className="text-dd-amber/70">· {language}</span>}
    </StreakPopover>
  );
}
