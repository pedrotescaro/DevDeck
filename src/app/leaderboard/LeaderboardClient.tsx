'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

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

export function LeaderboardClient({ initialUser, initialLeaderboard }: LeaderboardClientProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>(initialLeaderboard);
  const [language, setLanguage] = useState<string>('GLOBAL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (language === 'GLOBAL' && leaderboard === initialLeaderboard) return;

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const url =
          language === 'GLOBAL' ? '/api/leaderboard' : `/api/leaderboard?language=${language}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [language]);

  // Dividir o ranking em Top 3 e Restante
  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Ordenar o Top 3 para exibição visual no Podium: [Rank 2, Rank 1, Rank 3]
  const podiumOrder = [];
  const secondPlace = top3.find((u) => u.rank === 2);
  const firstPlace = top3.find((u) => u.rank === 1);
  const thirdPlace = top3.find((u) => u.rank === 3);

  if (secondPlace) podiumOrder.push(secondPlace);
  if (firstPlace) podiumOrder.push(firstPlace);
  if (thirdPlace) podiumOrder.push(thirdPlace);

  // Fallback se não tiver todos os 3
  const displayPodium = podiumOrder.length > 0 ? podiumOrder : top3;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased selection:bg-orange-500/35 selection:text-white">
      <Sidebar user={initialUser} />

      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        {/* Coluna Central */}
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen pb-24 md:pb-8 flex flex-col min-w-0 bg-dd-bg">
          {/* Header Fixo */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 p-3.5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <Link
                href="/feed"
                className="p-2 hover:bg-dd-surface rounded-full transition-colors text-dd-text"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-sm font-black text-dd-text">Quadro de Líderes</h1>
                <p className="text-[10px] text-dd-muted font-semibold mt-0.5">
                  Classificação {language === 'GLOBAL' ? 'Global' : language}
                </p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs rounded-full border border-dd-border bg-dd-surface px-3.5 py-1.5 text-dd-text focus:border-orange-500 focus:outline-none transition-all font-bold cursor-pointer"
            >
              <option value="GLOBAL">Geral / Global</option>
              <option value="TS">TypeScript</option>
              <option value="JS">JavaScript</option>
              <option value="PYTHON">Python</option>
              <option value="RUST">Rust</option>
              <option value="GO">Go</option>
              <option value="CPP">C++</option>
              <option value="JAVA">Java</option>
              <option value="KOTLIN">Kotlin</option>
              <option value="SWIFT">Swift</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-4" />
              <p className="text-dd-muted text-xs font-semibold">Carregando classificação...</p>
            </div>
          ) : (
            <div className="p-4.5 space-y-6">
              {/* Podium Top 3 */}
              {top3.length > 0 && (
                <div className="grid grid-cols-3 gap-3 items-end max-w-xl mx-auto pt-2">
                  {displayPodium.map((row) => {
                    const isFirst = row.rank === 1;
                    const isSecond = row.rank === 2;
                    const isThird = row.rank === 3;

                    let cardStyle = 'border-dd-border bg-dd-sidebar-bg/60';
                    let medalColor = 'text-dd-muted';
                    let rankTitle = '';
                    let heightClass = '';

                    if (isFirst) {
                      cardStyle =
                        'border-orange-500/30 bg-dd-sidebar-bg shadow-[0_0_20px_rgba(249,115,22,0.15)]';
                      medalColor = 'text-orange-400';
                      rankTitle = '👑 Mestre';
                      heightClass = 'h-52 z-10 scale-[1.03]';
                    } else if (isSecond) {
                      cardStyle = 'border-dd-border bg-dd-sidebar-bg/60';
                      medalColor = 'text-[#c0c0c0]';
                      rankTitle = '🥈 Vice';
                      heightClass = 'h-44';
                    } else if (isThird) {
                      cardStyle = 'border-dd-border bg-dd-sidebar-bg/60';
                      medalColor = 'text-[#cd7f32]';
                      rankTitle = '🥉 Bronze';
                      heightClass = 'h-38';
                    }

                    return (
                      <div
                        key={row.username}
                        className={`flex flex-col items-center justify-center border rounded-2xl p-3 transition-all duration-300 hover:translate-y-[-2px] ${cardStyle} ${heightClass}`}
                      >
                        <span className="text-[8px] font-black text-dd-muted tracking-wider uppercase mb-1.5 block">
                          {rankTitle}
                        </span>

                        <div className="relative mb-2 shrink-0">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs select-none ${
                              isFirst
                                ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/40'
                                : isSecond
                                  ? 'bg-dd-blue/20 text-dd-blue ring-2 ring-dd-blue/30'
                                  : 'bg-[#c5844a]/20 text-[#c5844a] ring-2 ring-[#c5844a]/30'
                            }`}
                          >
                            {row.username.slice(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border border-dd-border bg-dd-bg flex items-center justify-center font-black text-[9px] ${medalColor}`}
                          >
                            {row.rank}
                          </span>
                        </div>

                        <Link
                          href={`/profile/${row.username}`}
                          className="text-dd-text font-black hover:text-orange-400 transition-colors text-xs truncate w-full text-center"
                        >
                          @{row.username}
                        </Link>

                        <div className="mt-1 text-center shrink-0">
                          <span className="text-dd-amber text-[9px] font-bold uppercase font-mono block">
                            Lvl {row.level}
                          </span>
                          <span className="text-dd-text text-[10px] font-black font-mono">
                            {row.xp.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List Table for Remaining (Twitter List style) */}
              <div className="border border-dd-border rounded-2xl overflow-hidden divide-y divide-dd-border/60 bg-dd-sidebar-bg/25">
                {remaining.length === 0 && top3.length <= leaderboard.length ? (
                  <div className="p-8 text-center text-dd-muted text-xs">
                    Nenhum outro desenvolvedor no ranking ainda.
                  </div>
                ) : (
                  remaining.map((row) => (
                    <div
                      key={row.username}
                      className="flex items-center justify-between p-3.5 hover:bg-dd-surface/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 font-black text-center text-xs text-dd-muted">
                          #{row.rank}
                        </span>
                        <Link
                          href={`/profile/${row.username}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform shrink-0">
                            {row.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black text-dd-text group-hover:underline">
                              @{row.username}
                            </p>
                            <p className="text-[9px] text-dd-amber font-bold font-mono mt-0.5">
                              Nível {row.level}
                            </p>
                          </div>
                        </Link>
                      </div>
                      <span className="font-mono font-bold text-xs text-orange-500">
                        {row.xp.toLocaleString()} XP
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Coluna Direita (Widgets) */}
        <aside className="hidden lg:block w-80 p-4 space-y-4 shrink-0 border-l border-dd-border/80 min-h-screen bg-dd-bg">
          {/* Widget 1: Como Subir no Ranking */}
          <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4.5 space-y-3.5">
            <h3 className="text-xs font-black text-dd-text uppercase tracking-wider border-b border-dd-border/50 pb-2">
              Como Pontuar
            </h3>
            <div className="space-y-3 text-[10px] text-dd-muted leading-normal">
              <div className="flex gap-2">
                <span className="text-orange-500 font-bold shrink-0">·</span>
                <p>
                  <strong className="text-dd-text">Publicações:</strong> Compartilhe conhecimento e
                  responda dúvidas de outros devs.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-orange-500 font-bold shrink-0">·</span>
                <p>
                  <strong className="text-dd-text">Duelos (+20 XP):</strong> Desafie oponentes em
                  batalhas de algoritmo e ganhe votos.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-orange-500 font-bold shrink-0">·</span>
                <p>
                  <strong className="text-dd-text">Quizzes (+10 XP):</strong> Mantenha a ofensiva
                  diária resolvendo quizzes rápidos.
                </p>
              </div>
            </div>
          </div>

          {/* Widget 2: Seu Desempenho */}
          {initialUser && (
            <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4.5 space-y-3">
              <h3 className="text-xs font-black text-dd-text uppercase tracking-wider border-b border-dd-border/50 pb-2">
                Seu Ranking
              </h3>
              <div className="flex items-center gap-3 p-1">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs ring-1 ring-orange-500/30 shrink-0">
                  {initialUser.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-xs font-black text-dd-text truncate">
                    @{initialUser.username}
                  </p>
                  <p className="text-[10px] text-dd-muted mt-0.5">
                    Pontos totais:{' '}
                    <strong className="text-orange-500 font-mono">
                      {initialUser.total_xp.toLocaleString()} XP
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subtle footer */}
          <div className="px-4 text-[10px] text-dd-muted leading-normal space-y-2 pt-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="hover:underline cursor-pointer">Termos</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Privacidade</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Cookies</span>
            </div>
            <p>© {new Date().getFullYear()} DevDeck Corp.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
