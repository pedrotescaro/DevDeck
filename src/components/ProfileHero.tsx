'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Edit3, Flame, GraduationCap, Sparkles, Trophy, Zap } from 'lucide-react';
import { FollowButton } from '@/components/motion/FollowButton';
import { LevelBadge, getLevelFromTotalXp } from '@/components/LevelBadge';
import { getTrailLanguageMetadata, TrailLanguageLogo } from '@/app/trails/TrailLanguageLogo';
import { AVATAR_BACKGROUNDS, normalizeAvatarConfig } from '@/lib/avatar';
import { StreakPopover } from '@/components/StreakPopover';

interface ProfileHeroProps {
  currentUserId: string;
  profile: {
    id: string;
    username: string;
    bio?: string | null;
    institution?: string | null;
    pronouns?: string | null;
    created_at: string;
    total_xp: number;
    streak_days?: number;
    avatar_url?: string | null;
    avatar_config?: unknown;
  };
  trails: Array<{ language: string; xp: number; level: number }>;
  following: boolean;
  followers: number;
  followingCount: number;
  weeklyActivity?: ReadonlyMap<number, number>;
  onEdit: () => void;
  onFollowToggle: () => Promise<void>;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

const languageColors: Record<string, string> = {
  JAVASCRIPT: '#ffc800',
  TYPESCRIPT: '#1cb0f6',
  PYTHON: '#58cc02',
  JAVA: '#ff7043',
  RUST: '#ce82ff',
  GO: '#2fc5d4',
};

function joinedLabel(value: string) {
  const date = new Date(value);
  return `Por aqui desde ${date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
}

export function ProfileHero({
  currentUserId,
  profile,
  trails,
  following,
  followers,
  followingCount,
  weeklyActivity,
  onEdit,
  onFollowToggle,
  onShowFollowers,
  onShowFollowing,
}: ProfileHeroProps) {
  const isOwner = currentUserId === profile.id;
  const startedTrails = trails.filter((trail) => trail.xp > 0);
  const topTrails = startedTrails.slice(0, 3);
  const languageLogos = startedTrails.slice(0, 6);
  const avatar = normalizeAvatarConfig(profile.avatar_config, profile.username);
  const bannerColor = AVATAR_BACKGROUNDS[avatar.background];
  const initials = profile.username.trim().slice(0, 2).toUpperCase() || 'DD';

  return (
    <section className="w-full px-4 pb-6 pt-5 sm:px-7 sm:pt-9 lg:px-9 lg:pt-[50px]">
      <div
        className="relative flex h-[245px] w-full items-end justify-center overflow-hidden rounded-[28px] border-2 border-b-4 border-black/20 sm:h-[280px] lg:h-[295px]"
        style={{ backgroundColor: bannerColor }}
      >
        <div className="relative z-10 mb-7 flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-[36px] border-[6px] border-white/25 bg-black/15 text-5xl font-black text-white shadow-[0_14px_0_rgba(0,0,0,0.18)] sm:h-[210px] sm:w-[210px]">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={`Foto de ${profile.username}`}
              width={220}
              height={220}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <span aria-label={`Iniciais de ${profile.username}`}>{initials}</span>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-black/18 to-transparent" />
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="truncate text-2xl font-black tracking-tight text-dd-text sm:text-3xl">
              {profile.username}
            </h1>
            <LevelBadge totalXp={profile.total_xp} className="text-[10px]" />
          </div>
          <p className="mt-1 text-sm font-bold text-dd-muted">@{profile.username}</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-dd-muted">
            <Calendar className="h-4 w-4 text-sky-400" />
            {joinedLabel(profile.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isOwner ? (
            <button
              type="button"
              onClick={onEdit}
              className="dd-focus-ring inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-b-4 border-dd-border bg-dd-surface px-4 text-xs font-black uppercase text-dd-text transition-transform hover:-translate-y-0.5"
            >
              <Edit3 className="h-4 w-4" />
              Editar perfil
            </button>
          ) : (
            <FollowButton isFollowing={following} onToggle={onFollowToggle} />
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="max-w-2xl text-sm font-semibold leading-6 text-dd-text">
          {profile.bio ||
            'Aprendendo, praticando e compartilhando código com a comunidade DevDeck.'}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-dd-muted">
            {profile.institution && (
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-sky-400" /> {profile.institution}
              </span>
            )}
            {profile.pronouns && <span>{profile.pronouns}</span>}
            <button type="button" onClick={onShowFollowing} className="hover:text-sky-400">
              <strong className="text-dd-text">{followingCount}</strong> seguindo
            </button>
            <button type="button" onClick={onShowFollowers} className="hover:text-sky-400">
              <strong className="text-dd-text">{followers}</strong> seguidores
            </button>
          </div>

          {languageLogos.length > 0 && (
            <div
              aria-label="Linguagens das trilhas iniciadas"
              className="flex flex-wrap items-center gap-2.5 sm:justify-end"
            >
              {languageLogos.map((trail) => {
                const metadata = getTrailLanguageMetadata(trail.language);
                return (
                  <span
                    key={trail.language}
                    role="img"
                    aria-label={`${metadata.label}, nível ${trail.level}`}
                    title={`${metadata.label} · Nível ${trail.level} · ${trail.xp} XP`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-b-[3px] border-dd-border bg-dd-sidebar-bg"
                  >
                    <TrailLanguageLogo language={trail.language} className="h-7 w-7" />
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-xl font-black text-dd-text">Estatísticas</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StreakPopover
          streak={profile.streak_days ?? 0}
          weeklyActivity={weeklyActivity}
          align="start"
          triggerClassName="dd-focus-ring flex min-h-24 w-full items-center gap-3 rounded-[22px] border-2 border-b-4 border-dd-border bg-dd-sidebar-bg p-4 text-left transition-transform hover:-translate-y-0.5"
        >
          <Flame
            className="h-9 w-9 shrink-0 text-[#ff9600]"
            fill="currentColor"
            strokeWidth={2.5}
          />
          <span className="min-w-0">
            <span className="block truncate text-xl font-black text-dd-text">
              {profile.streak_days ?? 0}
            </span>
            <span className="block text-xs font-bold text-dd-muted">Dias de ofensiva</span>
          </span>
        </StreakPopover>
        <StatCard
          icon={Zap}
          color="#ffc800"
          value={profile.total_xp.toLocaleString('pt-BR')}
          label="Total de XP"
        />
        <StatCard
          icon={Trophy}
          color="#58cc02"
          value={`Nível ${getLevelFromTotalXp(profile.total_xp)}`}
          label="Nível global"
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-dd-text">Trilhas de aprendizagem</h2>
        <Link
          href="/trails"
          className="text-xs font-black uppercase tracking-wide text-sky-400 hover:text-sky-300"
        >
          Ver trilhas
        </Link>
      </div>
      {topTrails.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {topTrails.map((trail) => {
            const percent = Math.min(
              100,
              Math.round((trail.xp / Math.max(500, trail.level * 500)) * 100)
            );
            const color = languageColors[trail.language] ?? '#1cb0f6';
            const metadata = getTrailLanguageMetadata(trail.language);
            return (
              <div
                key={trail.language}
                className="rounded-[22px] border-2 border-b-4 border-dd-border bg-dd-sidebar-bg p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: `conic-gradient(${color} ${percent}%, #2b3640 0)` }}
                  >
                    <div
                      role="img"
                      aria-label={`Logo ${metadata.label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-dd-sidebar-bg"
                    >
                      <TrailLanguageLogo language={trail.language} className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black capitalize text-dd-text">
                      {trail.language.toLowerCase()}
                    </p>
                    <p className="text-xs font-bold text-dd-muted">Nível {trail.level}</p>
                    <p className="mt-1 text-sm font-black" style={{ color }}>
                      {percent}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-[22px] border-2 border-b-4 border-dd-border bg-dd-sidebar-bg p-5 text-sm font-bold text-dd-muted">
          <Sparkles className="h-6 w-6 text-sky-400" /> Comece uma trilha para exibir seu progresso
          aqui.
        </div>
      )}
    </section>
  );
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: typeof Flame;
  color: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex min-h-24 items-center gap-3 rounded-[22px] border-2 border-b-4 border-dd-border bg-dd-sidebar-bg p-4">
      <Icon className="h-9 w-9 shrink-0" style={{ color }} fill="currentColor" strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="truncate text-xl font-black text-dd-text">{value}</p>
        <p className="text-xs font-bold text-dd-muted">{label}</p>
      </div>
    </div>
  );
}
