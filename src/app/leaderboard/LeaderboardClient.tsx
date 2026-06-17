"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

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

export function LeaderboardClient({
  initialUser,
  initialLeaderboard,
}: LeaderboardClientProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>(initialLeaderboard);
  const [language, setLanguage] = useState<string>("GLOBAL");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (language === "GLOBAL" && leaderboard === initialLeaderboard) return;

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const url =
          language === "GLOBAL"
            ? "/api/leaderboard"
            : `/api/leaderboard?language=${language}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
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

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              🏆 <span className="bg-gradient-to-r from-white via-dd-text to-dd-muted bg-clip-text text-transparent">Quadro de Líderes</span>
            </h1>
            <p className="text-dd-muted text-sm mt-1">
              Descubra os desenvolvedores mais ativos e com maior nível de habilidade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-dd-muted font-semibold uppercase tracking-wider">Trilha:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm rounded-lg border border-dd-border bg-dd-surface px-4 py-2 text-dd-text focus:border-orange-500 focus:outline-none transition-all active:scale-[0.98] font-medium cursor-pointer"
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
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-4" />
            <p className="text-dd-muted text-sm">Carregando classificação...</p>
          </div>
        ) : (
          <>
            {/* Podium Top 3 */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12 max-w-3xl mx-auto">
                {displayPodium.map((user) => {
                  const isFirst = user.rank === 1;
                  const isSecond = user.rank === 2;
                  const isThird = user.rank === 3;

                  // Cores e estilos baseados na classificação
                  let cardStyle = "border-dd-border bg-dd-surface/40";
                  let medalColor = "text-dd-muted";
                  let rankTitle = "";
                  let heightClass = "";

                  if (isFirst) {
                    cardStyle = "rank-1 bg-dd-surface shadow-[0_0_20px_rgba(255,215,0,0.2)]";
                    medalColor = "text-[#ffd700]";
                    rankTitle = "👑 Mestre Dev";
                    heightClass = "md:h-64 order-1 md:order-2 z-10 scale-105 md:scale-110";
                  } else if (isSecond) {
                    cardStyle = "rank-2 bg-dd-surface shadow-[0_0_15px_rgba(192,192,192,0.15)]";
                    medalColor = "text-[#c0c0c0]";
                    rankTitle = "🥈 Vice-Líder";
                    heightClass = "md:h-56 order-2 md:order-1";
                  } else if (isThird) {
                    cardStyle = "rank-3 bg-dd-surface shadow-[0_0_10px_rgba(205,127,50,0.15)]";
                    medalColor = "text-[#cd7f32]";
                    rankTitle = "🥉 Bronze";
                    heightClass = "md:h-48 order-3";
                  }

                  return (
                    <div
                      key={user.username}
                      className={`flex flex-col items-center justify-center border rounded-xl p-6 transition-all duration-300 hover:translate-y-[-4px] ${cardStyle} ${heightClass}`}
                    >
                      <span className="text-xs font-bold text-dd-muted tracking-widest uppercase mb-3 block">
                        {rankTitle}
                      </span>
                      
                      <div className="relative mb-3">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg select-none ${
                          isFirst ? "bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/40" :
                          isSecond ? "bg-dd-blue/20 text-dd-blue ring-2 ring-dd-blue/30" :
                          "bg-[#c5844a]/20 text-[#c5844a] ring-2 ring-[#c5844a]/30"
                        }`}>
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-dd-border bg-dd-card flex items-center justify-center font-bold text-xs ${medalColor}`}>
                          {user.rank}
                        </span>
                      </div>

                      <Link
                        href={`/profile/${user.username}`}
                        className="text-dd-text font-bold hover:text-orange-400 transition-colors text-base"
                      >
                        {user.username}
                      </Link>

                      <div className="mt-2 text-center">
                        <span className="text-dd-amber text-xs font-semibold uppercase font-mono block">
                          Nível {user.level}
                        </span>
                        <span className="text-dd-text text-sm font-bold font-mono">
                          {user.xp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List Table for Remaining */}
            <div className="rounded-xl border border-dd-border bg-dd-surface overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-dd-border bg-dd-card/30 text-dd-muted font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-20">Posição</th>
                    <th className="py-4 px-6">Desenvolvedor</th>
                    <th className="py-4 px-6 text-center">Nível</th>
                    <th className="py-4 px-6 text-right">XP Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {remaining.length === 0 && top3.length <= leaderboard.length ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-dd-muted text-xs">
                        Nenhum outro desenvolvedor no ranking ainda.
                      </td>
                    </tr>
                  ) : (
                    remaining.map((row) => (
                      <tr
                        key={row.username}
                        className="border-b border-dd-border hover:bg-dd-card/10 transition-colors"
                      >
                        <td className="py-4 px-6 text-center font-bold text-dd-muted">
                          #{row.rank}
                        </td>
                        <td className="py-4 px-6 font-semibold text-dd-text">
                          <Link
                            href={`/profile/${row.username}`}
                            className="flex items-center gap-3 hover:text-orange-400 transition-colors w-fit"
                          >
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-xs">
                              {row.username.slice(0, 2).toUpperCase()}
                            </div>
                            {row.username}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-center text-dd-amber font-mono font-bold">
                          Nível {row.level}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-orange-400">
                          {row.xp.toLocaleString()} XP
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      <Footer />
      </div>
    </div>
  );
}
