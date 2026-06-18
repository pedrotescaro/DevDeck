'use client';

import { getLanguageColor, getLanguageLabel } from './LanguageTag';

interface LanguageTrailBarProps {
  language: string;
  xp: number;
  level: number;
  maxXp: number;
}

export function LanguageTrailBar({ language, xp, level, maxXp }: LanguageTrailBarProps) {
  const color = getLanguageColor(language);
  const label = getLanguageLabel(language);
  const percent = maxXp > 0 ? Math.min((xp / maxXp) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-4">
      {/* Language name */}
      <span className="text-xs font-bold w-24 shrink-0 truncate" style={{ color }}>
        {label}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-dd-surface rounded-full overflow-hidden dd-liquid-track">
        <div
          className="h-full rounded-full dd-liquid-fill transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* XP text */}
      <span className="text-dd-muted text-[10px] font-semibold font-mono w-20 text-right shrink-0">
        {xp.toLocaleString()}/{maxXp.toLocaleString()} XP
      </span>

      {/* Level */}
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0 font-mono"
        style={{
          backgroundColor: `${color}1A`,
          color: color,
          border: `1px solid ${color}33`,
        }}
      >
        Lv.{level}
      </span>
    </div>
  );
}
