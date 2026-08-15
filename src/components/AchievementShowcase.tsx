'use client';

import Link from 'next/link';
import {
  BadgeCheck,
  BookOpen,
  Bug,
  CircleSlash2,
  Code,
  Coffee,
  Crown,
  Flame,
  GitBranch,
  SearchCode,
  ShieldCheck,
  Sparkles,
  Trophy,
  WandSparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AchievementBadge {
  slug: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  earned_at?: string | null;
}

interface AchievementVisual {
  icon: LucideIcon;
  background: string;
  shadow: string;
  iconColor: string;
  level: number;
}

const FALLBACK_VISUAL: AchievementVisual = {
  icon: Trophy,
  background: '#ffc800',
  shadow: '#d99f00',
  iconColor: '#ee9700',
  level: 1,
};

const ACHIEVEMENT_VISUALS: Record<string, AchievementVisual> = {
  code_streak: {
    icon: Flame,
    background: '#ff4b4b',
    shadow: '#d93c3c',
    iconColor: '#ffb020',
    level: 9,
  },
  typescript_wizard: {
    icon: WandSparkles,
    background: '#003875',
    shadow: '#002a5c',
    iconColor: '#60a5fa',
    level: 10,
  },
  python_master: {
    icon: Crown,
    background: '#ffc800',
    shadow: '#d99f00',
    iconColor: '#f09b00',
    level: 10,
  },
  rust_practitioner: {
    icon: ShieldCheck,
    background: '#ffc800',
    shadow: '#d99f00',
    iconColor: '#f09b00',
    level: 5,
  },
  speed_coder: {
    icon: Trophy,
    background: '#ffc800',
    shadow: '#d99f00',
    iconColor: '#f09b00',
    level: 7,
  },
  hello_world: {
    icon: Code,
    background: '#1cb0f6',
    shadow: '#168ccc',
    iconColor: '#ffffff',
    level: 1,
  },
  segfault_survivor: {
    icon: Bug,
    background: '#ce82ff',
    shadow: '#a568cc',
    iconColor: '#7a3ca5',
    level: 3,
  },
  git_push_force: {
    icon: GitBranch,
    background: '#ff9600',
    shadow: '#d67e00',
    iconColor: '#ffffff',
    level: 5,
  },
  rustacean_approved: {
    icon: BadgeCheck,
    background: '#ff6b35',
    shadow: '#d3562b',
    iconColor: '#ffffff',
    level: 5,
  },
  stack_overflow_ban: {
    icon: CircleSlash2,
    background: '#ff4b4b',
    shadow: '#d93c3c',
    iconColor: '#ffffff',
    level: 1,
  },
  debug_ninja: {
    icon: SearchCode,
    background: '#9069cd',
    shadow: '#7253a6',
    iconColor: '#ffffff',
    level: 8,
  },
  coffee_overflow: {
    icon: Coffee,
    background: '#2b70c9',
    shadow: '#225aa1',
    iconColor: '#ffffff',
    level: 4,
  },
  community_educator: {
    icon: BookOpen,
    background: '#58cc02',
    shadow: '#46a302',
    iconColor: '#ffffff',
    level: 1,
  },
};

const ACHIEVEMENT_ORDER = [
  'code_streak',
  'typescript_wizard',
  'python_master',
  'rust_practitioner',
  'speed_coder',
  'hello_world',
  'git_push_force',
  'rustacean_approved',
  'segfault_survivor',
  'debug_ninja',
  'coffee_overflow',
  'community_educator',
  'stack_overflow_ban',
];

function sortAchievements(badges: AchievementBadge[]) {
  const order = new Map(ACHIEVEMENT_ORDER.map((slug, index) => [slug, index]));
  return [...badges].sort(
    (left, right) =>
      (order.get(left.slug) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(right.slug) ?? Number.MAX_SAFE_INTEGER)
  );
}

function AchievementCard({ badge, compact }: { badge: AchievementBadge; compact: boolean }) {
  const visual = ACHIEVEMENT_VISUALS[badge.slug] ?? FALLBACK_VISUAL;
  const Icon = visual.icon;
  const earned = Boolean(badge.earned_at);
  const usesDarkBackground = badge.slug === 'typescript_wizard';

  return (
    <div
      role="img"
      aria-label={`${badge.label}, nível ${visual.level}${earned ? ', conquistada' : ''}`}
      title={`${badge.label}: ${badge.description}`}
      className="group min-w-0 pb-1"
    >
      <div
        className={`relative flex w-full flex-col items-center justify-between overflow-hidden rounded-[18px] px-2.5 pb-2.5 pt-3 transition-transform group-hover:-translate-y-1 ${
          compact ? 'h-[112px]' : 'h-[158px]'
        }`}
        style={{
          backgroundColor: visual.background,
          color: visual.iconColor,
          boxShadow: `0 5px 0 ${visual.shadow}`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_46%,rgba(255,255,255,0.14)_47%,rgba(255,255,255,0.14)_63%,transparent_64%)]"
        />
        {earned && (
          <Sparkles
            aria-hidden="true"
            className={`absolute right-2 top-2 opacity-80 ${compact ? 'h-3.5 w-3.5' : 'h-5 w-5'}`}
            strokeWidth={3}
          />
        )}
        <Icon
          aria-hidden="true"
          className={`relative drop-shadow-sm ${compact ? 'h-9 w-9' : 'h-13 w-13'}`}
          strokeWidth={3.2}
        />
        <div className="relative w-full text-center leading-none">
          <p
            className={`line-clamp-2 font-black leading-[1.05] ${
              usesDarkBackground ? 'text-white' : 'text-black/85'
            } ${compact ? 'text-[9px]' : 'text-[11px]'}`}
          >
            {badge.label}
          </p>
          <p
            className={`mt-1 font-black uppercase tracking-tight ${
              usesDarkBackground ? 'text-blue-100/85' : 'text-black/65'
            } ${compact ? 'text-[8px]' : 'text-[9px]'}`}
          >
            Nível {visual.level}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AchievementShowcase({
  badges,
  variant = 'full',
  viewAllHref,
  unframed = false,
}: {
  badges: AchievementBadge[];
  variant?: 'compact' | 'full';
  viewAllHref?: string;
  unframed?: boolean;
}) {
  const compact = variant === 'compact';
  const visibleBadges = sortAchievements(badges).slice(0, compact ? 3 : undefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className={`${compact ? 'text-base' : 'text-xl'} font-black text-dd-text`}>
          Conquistas
        </h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-black uppercase tracking-wide text-blue-400 transition-colors hover:text-blue-300"
          >
            Ver todas
          </Link>
        )}
      </div>

      <div
        className={
          unframed ? '' : `rounded-[20px] border-2 border-dd-border ${compact ? 'p-3' : 'p-5'}`
        }
      >
        {visibleBadges.length === 0 ? (
          <p className="py-8 text-center text-xs font-bold text-dd-muted">
            Nenhuma conquista disponível ainda.
          </p>
        ) : (
          <div
            className={`grid ${
              compact ? 'grid-cols-3 gap-2.5' : 'grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5'
            }`}
          >
            {visibleBadges.map((badge) => (
              <AchievementCard key={badge.slug} badge={badge} compact={compact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
