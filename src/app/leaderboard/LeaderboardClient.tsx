'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Braces,
  Check,
  ChevronDown,
  Code2,
  Flame,
  Globe2,
  LockKeyhole,
  Medal,
  Shield,
  Trophy,
  Zap,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { StreakPopover } from '@/components/StreakPopover';

interface LeaderboardRow {
  rank: number;
  username: string;
  avatar_url?: string | null;
  xp: number;
  level: number;
}

interface LeaderboardClientProps {
  initialUser: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
    streak?: number;
  } | null;
  initialLeaderboard: LeaderboardRow[];
}

type RankingScope =
  | 'GLOBAL'
  | 'JS'
  | 'TS'
  | 'PYTHON'
  | 'RUST'
  | 'GO'
  | 'CPP'
  | 'JAVA'
  | 'KOTLIN'
  | 'SWIFT';

const RANKING_OPTIONS: Array<{ value: RankingScope; label: string }> = [
  { value: 'GLOBAL', label: 'Global' },
  { value: 'JS', label: 'JavaScript' },
  { value: 'TS', label: 'TypeScript' },
  { value: 'PYTHON', label: 'Python' },
  { value: 'RUST', label: 'Rust' },
  { value: 'GO', label: 'Go' },
  { value: 'CPP', label: 'C++' },
  { value: 'JAVA', label: 'Java' },
  { value: 'KOTLIN', label: 'Kotlin' },
  { value: 'SWIFT', label: 'Swift' },
];

const QUICK_SCOPES: Array<{
  value: RankingScope;
  label: string;
  icon: typeof Globe2;
}> = [
  { value: 'GLOBAL', label: 'Global', icon: Globe2 },
  { value: 'JS', label: 'JavaScript', icon: Code2 },
  { value: 'PYTHON', label: 'Python', icon: Braces },
  { value: 'TS', label: 'TypeScript', icon: Shield },
];

const XP_MILESTONES = [100, 500, 1_000, 2_500, 5_000] as const;

function formatXp(value: number) {
  return Math.max(0, value).toLocaleString('pt-BR');
}

function medalClasses(rank: number) {
  if (rank === 1) return 'border-yellow-300 bg-yellow-400 text-amber-950 shadow-yellow-500/20';
  if (rank === 2) return 'border-slate-200 bg-slate-300 text-slate-800 shadow-slate-300/15';
  return 'border-orange-300 bg-orange-400 text-orange-950 shadow-orange-500/20';
}

function XpMilestoneStrip({ totalXp }: { totalXp: number }) {
  const activeIndex = XP_MILESTONES.reduce<number>(
    (current, milestone, index) => (totalXp >= milestone ? index : current),
    0
  );

  return (
    <div
      aria-label="Marcos de XP"
      className="flex min-h-[104px] items-end justify-center gap-3 sm:gap-4"
    >
      {XP_MILESTONES.map((milestone, index) => {
        const isCurrent = index === activeIndex;
        const isReached = totalXp >= milestone;

        return (
          <div
            key={milestone}
            className={`flex flex-col items-center gap-2 transition-transform ${
              isCurrent ? '-translate-y-1' : ''
            }`}
          >
            <div
              role="img"
              aria-label={
                isCurrent
                  ? `${isReached ? 'Marco atual' : 'Próximo marco'}: ${formatXp(milestone)} XP`
                  : `${formatXp(milestone)} XP ${isReached ? 'alcançado' : 'bloqueado'}`
              }
              className={`relative flex items-center justify-center border-2 border-b-[6px] shadow-lg ${
                isCurrent
                  ? 'h-[82px] w-[72px] rounded-[24px] border-blue-300 bg-blue-500 text-white shadow-blue-500/20'
                  : isReached
                    ? 'h-[64px] w-[58px] rounded-[20px] border-blue-500/45 bg-blue-500/20 text-blue-300 shadow-blue-500/10'
                    : 'h-[64px] w-[58px] rounded-[20px] border-dd-border bg-dd-surface text-dd-muted shadow-black/10'
              }`}
            >
              <Shield
                aria-hidden="true"
                className={isCurrent ? 'h-11 w-11 fill-white/10' : 'h-8 w-8 fill-current/10'}
                strokeWidth={2.2}
              />
              {isCurrent && isReached ? (
                <Check
                  aria-hidden="true"
                  className="absolute h-6 w-6 text-white"
                  strokeWidth={3.5}
                />
              ) : !isReached ? (
                <LockKeyhole aria-hidden="true" className="absolute h-4 w-4" />
              ) : null}
            </div>
            <span
              className={`hidden font-mono text-[9px] font-black sm:block ${
                isCurrent ? 'text-blue-400' : 'text-dd-muted'
              }`}
            >
              {formatXp(milestone)} XP
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RankingRow({ row, isViewer }: { row: LeaderboardRow; isViewer: boolean }) {
  const isPodium = row.rank <= 3;

  return (
    <Link
      href={`/profile/${encodeURIComponent(row.username)}`}
      aria-label={`${row.rank}º lugar, ${row.username}, ${formatXp(row.xp)} XP`}
      className={`group grid min-h-[72px] grid-cols-[42px_48px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 sm:grid-cols-[48px_52px_minmax(0,1fr)_110px] sm:px-4 ${
        isViewer ? 'bg-blue-500/10 ring-1 ring-inset ring-blue-500/20' : 'hover:bg-dd-surface/70'
      }`}
    >
      <div className="flex items-center justify-center">
        {isPodium ? (
          <span
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-b-[4px] shadow-md ${medalClasses(
              row.rank
            )}`}
          >
            <Medal aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
            <span className="absolute text-[10px] font-black">{row.rank}</span>
          </span>
        ) : (
          <span className="font-mono text-sm font-black text-blue-400">{row.rank}</span>
        )}
      </div>

      <AuthorAvatar
        username={row.username}
        avatar_url={row.avatar_url}
        size="lg"
        className="!h-11 !w-11 border-2 border-dd-border transition-transform group-hover:scale-105 sm:!h-12 sm:!w-12"
      />

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p
            className={`truncate text-sm font-black sm:text-[15px] ${
              isViewer ? 'text-blue-400' : 'text-dd-text'
            }`}
          >
            {row.username}
          </p>
          {isViewer && (
            <span className="shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-white">
              Você
            </span>
          )}
        </div>
        <p className="mt-1 text-[10px] font-bold text-dd-muted">Nível {row.level}</p>
      </div>

      <span
        className={`text-right font-mono text-xs font-black sm:text-sm ${
          isViewer ? 'text-blue-400' : 'text-dd-text'
        }`}
      >
        {formatXp(row.xp)} XP
      </span>
    </Link>
  );
}

export function LeaderboardClient({ initialUser, initialLeaderboard }: LeaderboardClientProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>(initialLeaderboard);
  const [scope, setScope] = useState<RankingScope>('GLOBAL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scope === 'GLOBAL') {
      setLeaderboard(initialLeaderboard);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?language=${scope}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Não foi possível carregar o ranking.');
        setLeaderboard(await response.json());
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching leaderboard:', error);
          setLeaderboard([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchLeaderboard();
    return () => controller.abort();
  }, [initialLeaderboard, scope]);

  const scopeLabel = RANKING_OPTIONS.find((option) => option.value === scope)?.label ?? 'Global';
  const viewerRow = initialUser
    ? leaderboard.find((row) => row.username === initialUser.username)
    : undefined;
  const nextMilestone = useMemo(
    () => XP_MILESTONES.find((milestone) => milestone > (initialUser?.total_xp ?? 0)),
    [initialUser?.total_xp]
  );

  return (
    <div className="dd-platform-shell dd-platform-shell--fullscreen selection:bg-blue-500/35 selection:text-white">
      <Sidebar user={initialUser} showDivider={false} />

      <div className="mx-auto flex w-full min-w-0 flex-grow items-start justify-center bg-dd-bg xl:max-w-[1320px] xl:justify-start">
        <main className="flex min-h-screen w-full min-w-0 max-w-[760px] flex-grow flex-col bg-dd-bg pb-24 md:pb-8">
          <header className="px-4 pb-3 pt-7 sm:px-7 sm:pt-8">
            <XpMilestoneStrip totalXp={initialUser?.total_xp ?? 0} />

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-black tracking-tight text-dd-text sm:text-[28px]">
                Ranking de XP
              </h1>
              <p className="mx-auto mt-2 max-w-[480px] text-sm font-bold leading-6 text-dd-text sm:text-base">
                Veja os desenvolvedores com mais experiência no DevDeck.
              </p>
              <p className="mt-1.5 text-xs font-black text-yellow-400">
                {nextMilestone
                  ? `Próximo marco: ${formatXp(nextMilestone)} XP`
                  : 'Todos os marcos de XP foram alcançados!'}
              </p>
            </div>

            <div className="mt-6 border-b border-dd-border" />

            <label className="relative mt-4 block xl:hidden">
              <span className="sr-only">Filtrar ranking por linguagem</span>
              <select
                aria-label="Filtrar ranking por linguagem"
                value={scope}
                onChange={(event) => setScope(event.target.value as RankingScope)}
                className="min-h-11 w-full appearance-none rounded-2xl border border-dd-border bg-dd-surface px-4 pr-10 text-sm font-black text-dd-text outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
              >
                {RANKING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-dd-muted"
              />
            </label>
          </header>

          <section
            aria-label={`Classificação ${scopeLabel}`}
            aria-busy={loading}
            className="px-3 pb-6 sm:px-6"
          >
            {loading ? (
              <div className="space-y-2 py-2" aria-live="polite">
                <p className="sr-only">Carregando classificação...</p>
                {Array.from({ length: 7 }, (_, index) => (
                  <div
                    key={index}
                    className="dd-skeleton h-[72px] w-full rounded-2xl"
                    aria-hidden="true"
                  />
                ))}
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-1">
                {leaderboard.map((row) => (
                  <RankingRow
                    key={row.username}
                    row={row}
                    isViewer={initialUser?.username === row.username}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-dd-border px-6 py-14 text-center">
                <Trophy aria-hidden="true" className="mx-auto h-9 w-9 text-dd-muted" />
                <p className="mt-3 text-sm font-black text-dd-text">
                  Ainda não há perfis neste ranking.
                </p>
                <p className="mt-1 text-xs font-semibold text-dd-muted">
                  Inicie uma trilha de {scopeLabel} para aparecer aqui.
                </p>
              </div>
            )}
          </section>
        </main>

        <aside className="sticky top-0 hidden h-screen w-[380px] shrink-0 overflow-y-auto bg-dd-bg p-5 scrollbar-none xl:block">
          <div className="grid grid-cols-4 gap-2 px-1 pb-5">
            <div
              className="flex items-center justify-center gap-1.5 text-dd-muted"
              title={scopeLabel}
            >
              <Globe2 aria-hidden="true" className="h-4 w-4 text-blue-400" />
              <span className="max-w-[48px] truncate text-[10px] font-black uppercase">
                {scope === 'GLOBAL' ? 'Global' : scope}
              </span>
            </div>
            <StreakPopover
              streak={initialUser?.streak ?? 0}
              triggerClassName="dd-focus-ring flex items-center justify-center gap-1.5 rounded-lg p-1 text-dd-text transition-colors hover:bg-orange-500/10"
            >
              <Flame aria-hidden="true" className="h-4 w-4 fill-orange-500 text-orange-500" />
              <span className="font-mono text-[11px] font-black">{initialUser?.streak ?? 0}</span>
            </StreakPopover>
            <div className="flex items-center justify-center gap-1.5 text-dd-text" title="Posição">
              <Trophy aria-hidden="true" className="h-4 w-4 text-blue-400" />
              <span className="font-mono text-[11px] font-black">{viewerRow?.rank ?? '—'}</span>
            </div>
            <div
              className="flex items-center justify-center gap-1.5 text-dd-text"
              title={`${formatXp(initialUser?.total_xp ?? 0)} XP total`}
            >
              <Zap aria-hidden="true" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="max-w-[42px] truncate font-mono text-[11px] font-black">
                {formatXp(initialUser?.total_xp ?? 0)}
              </span>
            </div>
          </div>

          <section
            aria-labelledby="ranking-picker-title"
            className="rounded-[22px] border-2 border-b-4 border-dd-border bg-dd-sidebar-bg p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="ranking-picker-title" className="text-sm font-black text-dd-text">
                Escolha o ranking
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wide text-blue-400">
                {scopeLabel}
              </span>
            </div>

            {initialUser && (
              <div className="mt-5 flex flex-col items-center text-center">
                <div className="relative">
                  <AuthorAvatar
                    username={initialUser.username}
                    avatar_url={initialUser.avatar_url}
                    size="lg"
                    className="!h-[78px] !w-[78px] border-[3px] border-blue-500/40 shadow-[0_10px_28px_rgba(0,131,254,0.16)]"
                  />
                  <span className="absolute -bottom-1 -right-4 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-b-4 border-blue-300 bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                    <Shield aria-hidden="true" className="h-6 w-6 fill-white/10" />
                  </span>
                </div>
                <Link
                  href={`/profile/${encodeURIComponent(initialUser.username)}`}
                  className="mt-3 max-w-full truncate text-sm font-black text-dd-text hover:text-blue-400"
                >
                  @{initialUser.username}
                </Link>
                <p className="mt-1 text-[10px] font-bold text-dd-muted">
                  {viewerRow ? `${viewerRow.rank}º lugar` : 'Fora do top 10'} ·{' '}
                  {formatXp(viewerRow?.xp ?? initialUser.total_xp)} XP
                </p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Atalhos de ranking">
              {QUICK_SCOPES.map((option) => {
                const Icon = option.icon;
                const selected = scope === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`Ranking ${option.label}`}
                    title={option.label}
                    onClick={() => setScope(option.value)}
                    className={`flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
                      selected
                        ? 'border-blue-400 bg-blue-500/15 text-blue-400 shadow-[0_3px_0_rgba(0,131,254,0.35)]'
                        : 'border-dd-border bg-dd-bg text-dd-muted hover:border-blue-500/35 hover:text-dd-text'
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    <span className="w-full truncate text-[8px] font-black uppercase">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="relative mt-4 block">
              <span className="mb-2 block text-[9px] font-black uppercase tracking-wider text-dd-muted">
                Todas as linguagens
              </span>
              <select
                aria-label="Selecionar ranking por linguagem"
                value={scope}
                onChange={(event) => setScope(event.target.value as RankingScope)}
                className="min-h-11 w-full appearance-none rounded-xl border border-dd-border bg-dd-bg px-3 pr-9 text-xs font-black text-dd-text outline-none transition-colors hover:border-blue-500/35 focus-visible:ring-2 focus-visible:ring-blue-500/70"
              >
                {RANKING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3.5 right-3 h-4 w-4 text-dd-muted"
              />
            </label>
          </section>

          <nav
            aria-label="Links relacionados ao ranking"
            className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-3 px-3 text-[9px] font-black uppercase tracking-wide text-dd-muted"
          >
            <Link href="/feed" className="hover:text-blue-400">
              Feed
            </Link>
            <Link href="/trails" className="hover:text-blue-400">
              Trilhas
            </Link>
            <Link href="/duels" className="hover:text-blue-400">
              Duelos
            </Link>
            <Link href="/guilds" className="hover:text-blue-400">
              Comunidades
            </Link>
            {initialUser && (
              <Link
                href={`/profile/${encodeURIComponent(initialUser.username)}`}
                className="hover:text-blue-400"
              >
                Meu perfil
              </Link>
            )}
            <Link href="/settings" className="hover:text-blue-400">
              Configurações
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}
