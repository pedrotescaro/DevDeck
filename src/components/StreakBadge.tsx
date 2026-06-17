'use client';

interface StreakBadgeProps {
  streak: number;
  language?: string;
}

export function StreakBadge({ streak, language }: StreakBadgeProps) {
  const shouldPulse = streak >= 7;

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-dd-amber/10 text-dd-amber border border-dd-amber/20 rounded-full px-3 py-1 text-xs font-medium ${
        shouldPulse ? 'animate-pulse' : ''
      }`}
    >
      {/* Flame icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="shrink-0"
      >
        <path d="M12 23c-3.6 0-7-2.4-7-7 0-3.1 2.1-5.7 3.4-7.2.5-.6 1.5-.3 1.5.5v1.5c0 .8.6 1.5 1.4 1.5.5 0 1-.3 1.2-.8l1.8-4.3c.3-.7 1.3-.8 1.7-.1C18.3 11 19 13.2 19 16c0 4.6-3.4 7-7 7z" />
      </svg>

      <span className="font-bold">{streak}</span>
      <span>{streak === 1 ? 'dia' : 'dias'}</span>
      {language && (
        <span className="text-dd-amber/70">· {language}</span>
      )}
    </div>
  );
}
