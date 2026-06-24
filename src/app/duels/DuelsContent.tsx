'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Language } from '@prisma/client';
import { Swords, Plus, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DuelsContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
    streak?: number;
  };
  initialDuels: any[];
}

export function DuelsContent({ user, initialDuels }: DuelsContentProps) {
  const [duels, setDuels] = useState<any[]>(initialDuels);
  const [showDuelForm, setShowDuelForm] = useState(false);
  const [duelTitle, setDuelTitle] = useState('');
  const [duelBody, setDuelBody] = useState('');
  const [duelLanguage, setDuelLanguage] = useState<Language>('TS');
  const [creating, setCreating] = useState(false);

  const refreshDuels = async () => {
    try {
      const res = await fetch('/api/duels');
      if (res.ok) {
        const data = await res.json();
        setDuels(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDuel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/duels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_title: duelTitle,
          problem_body: duelBody,
          language: duelLanguage,
        }),
      });

      if (res.ok) {
        setDuelTitle('');
        setDuelBody('');
        setShowDuelForm(false);
        await refreshDuels();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

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
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-sm font-black text-dd-text">Arena de Duelos</h1>
                <p className="text-[10px] text-dd-muted font-semibold mt-0.5">
                  {duels.length} {duels.length === 1 ? 'duelo ativo' : 'duelos ativos'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDuelForm(!showDuelForm)}
              className="bg-orange-500 text-white font-bold py-1.5 px-4 rounded-full text-xs hover:bg-orange-600 transition-colors cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {showDuelForm ? 'Fechar' : 'Criar Duelo'}
            </button>
          </div>

          {showDuelForm && (
            <div className="border-b border-dd-border bg-dd-sidebar-bg p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-dd-border/40">
                <Sparkles className="w-4 h-4 text-orange-500/85 animate-pulse" />
                <h3 className="text-xs font-bold text-dd-muted uppercase tracking-wider">
                  Configurar Novo Desafio
                </h3>
              </div>

              <form onSubmit={handleCreateDuel} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-dd-muted uppercase tracking-wider mb-1.5">
                      Título do Duelo
                    </label>
                    <input
                      type="text"
                      value={duelTitle}
                      onChange={(e) => setDuelTitle(e.target.value)}
                      required
                      placeholder="Ex: Inverter uma Árvore Binária sem Recursão"
                      className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-4 py-2.5 text-dd-text placeholder-dd-muted focus:border-orange-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-dd-muted uppercase tracking-wider mb-1.5">
                      Linguagem Requerida
                    </label>
                    <select
                      value={duelLanguage}
                      onChange={(e) => setDuelLanguage(e.target.value as Language)}
                      className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-3 py-2.5 text-dd-text focus:border-orange-500/60 focus:outline-none cursor-pointer"
                    >
                      <option value="TS">TypeScript</option>
                      <option value="JS">JavaScript</option>
                      <option value="PYTHON">Python</option>
                      <option value="RUST">Rust</option>
                      <option value="GO">Go</option>
                      <option value="CPP">C++</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-dd-muted uppercase tracking-wider mb-1.5">
                    Descrição e Casos de Teste
                  </label>
                  <textarea
                    value={duelBody}
                    onChange={(e) => setDuelBody(e.target.value)}
                    required
                    rows={4}
                    placeholder="Escreva a descrição do algoritmo. Especifique formatos de entrada, saída esperada e restrições de desempenho."
                    className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-4 py-2.5 text-dd-text placeholder-dd-muted focus:border-orange-500/60 focus:outline-none resize-none transition-colors"
                  />
                </div>
                <div className="flex justify-end pt-2 border-t border-dd-border/40">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-orange-500 text-white text-xs font-bold px-5 py-2 rounded-full transition-colors hover:bg-orange-600 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    {creating ? 'Lançando...' : 'Lançar Desafio'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista Vertical de Duelos */}
          <div className="divide-y divide-dd-border/60">
            {duels.length === 0 ? (
              <div className="p-16 text-center text-dd-muted text-xs">
                Nenhum duelo de código ocorrendo no momento. Seja o primeiro a criar um desafio
                acima!
              </div>
            ) : (
              duels.map((duel) => {
                const totalVotes = duel.solutions.reduce(
                  (s: number, sol: { vote_count: number }) => s + sol.vote_count,
                  0
                );
                const challengerVotes = duel.solutions[0]?.vote_count ?? 0;
                const challengerPercent =
                  totalVotes > 0 ? Math.round((challengerVotes / totalVotes) * 100) : 50;
                const opponentPercent = totalVotes > 0 ? 100 - challengerPercent : 50;

                const statusLabel: Record<string, string> = {
                  PENDING: 'Aguardando oponente',
                  ACTIVE: 'Em andamento',
                  VOTING: 'Em votação',
                  FINISHED: 'Finalizado',
                };

                const statusColor: Record<string, string> = {
                  PENDING: 'text-dd-amber bg-dd-amber/10 border-dd-amber/20',
                  ACTIVE: 'text-dd-blue bg-dd-blue/10 border-dd-blue/20',
                  VOTING: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                  FINISHED: 'text-dd-green bg-dd-green/10 border-dd-green/20',
                };

                return (
                  <Link
                    key={duel.id}
                    href={`/duels/${duel.id}`}
                    className="flex gap-4 p-4.5 hover:bg-dd-surface/20 transition-colors text-left"
                  >
                    {/* Avatars on the left */}
                    <div className="flex shrink-0 items-center justify-center w-12">
                      <div className="relative flex items-center justify-center w-10 h-10">
                        {/* Challenger Avatar */}
                        <div className="absolute top-0 left-0 w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-dd-bg flex items-center justify-center text-[9px] font-black z-10 shadow-sm">
                          {duel.challenger.username.slice(0, 2).toUpperCase()}
                        </div>
                        {/* Opponent Avatar */}
                        {duel.opponent ? (
                          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-dd-amber/20 text-dd-amber border border-dd-bg flex items-center justify-center text-[9px] font-black z-20 shadow-sm">
                            {duel.opponent.username.slice(0, 2).toUpperCase()}
                          </div>
                        ) : (
                          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full border border-dashed border-dd-border bg-dd-bg flex items-center justify-center text-[9px] font-black z-20 text-dd-muted shadow-sm">
                            ?
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Title, participants and info */}
                    <div className="flex-grow min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] bg-dd-surface border border-dd-border/60 px-1.5 py-0.5 rounded text-dd-muted font-mono font-semibold">
                          {duel.language}
                        </span>
                        <span
                          className={`text-[9px] border px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight ${statusColor[duel.status] || 'text-dd-muted bg-dd-surface'}`}
                        >
                          {statusLabel[duel.status] || duel.status}
                        </span>
                        <span className="text-[10px] text-dd-muted">
                          ·{' '}
                          {new Date(duel.created_at).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-dd-text leading-snug hover:text-orange-500 transition-colors">
                        {duel.problem_title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-dd-muted font-medium">
                        <span className="text-dd-text font-semibold">
                          @{duel.challenger.username}
                        </span>
                        <span>vs</span>
                        {duel.opponent ? (
                          <span className="text-dd-text font-semibold">
                            @{duel.opponent.username}
                          </span>
                        ) : (
                          <span className="italic">Aguardando...</span>
                        )}
                      </div>

                      {/* Vote/Progress Bar when active/voting/finished */}
                      {duel.status !== 'PENDING' && (
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex-grow h-1.5 bg-dd-surface border border-dd-border/50 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-orange-500 transition-all"
                              style={{ width: `${challengerPercent}%` }}
                            />
                            <div
                              className="h-full bg-dd-amber transition-all"
                              style={{ width: `${opponentPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-dd-muted shrink-0">
                            {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right side: Action chevron */}
                    <div className="flex items-center justify-center shrink-0 self-center text-dd-muted hover:text-dd-text p-1">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </main>

        {/* Coluna Direita */}
        <aside className="hidden lg:block w-80 p-4 space-y-4 shrink-0 border-l border-dd-border/80 min-h-screen bg-dd-bg">
          {/* Widget 1: Como Funciona */}
          <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center gap-2 border-b border-dd-border/50 pb-2.5">
              <Swords className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-black text-dd-text uppercase tracking-wider">
                Como Funciona
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dd-text">Crie ou Aceite</h4>
                  <p className="text-[10px] text-dd-muted mt-0.5 leading-normal">
                    Lance um desafio com algoritmo e linguagem definidos ou aceite um duelo aberto.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dd-text">Codifique no Editor</h4>
                  <p className="text-[10px] text-dd-muted mt-0.5 leading-normal">
                    Escreva sua solução no editor de código interativo e submeta até o tempo limite.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dd-text">Vote e Pontue</h4>
                  <p className="text-[10px] text-dd-muted mt-0.5 leading-normal">
                    A comunidade vota nas resoluções. Vença para ganhar **+20 XP** de reputação.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 2: Estatísticas de Duelo */}
          <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4.5 space-y-4">
            <h3 className="text-xs font-black text-dd-text uppercase tracking-wider border-b border-dd-border/50 pb-2.5">
              Arena Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-dd-surface/20 border border-dd-border/40 rounded-xl p-3">
                <span className="block text-lg font-black text-orange-500 font-mono">
                  {
                    duels.filter(
                      (d: any) =>
                        d.challenger.username === user.username ||
                        d.opponent?.username === user.username
                    ).length
                  }
                </span>
                <span className="text-[9px] font-bold text-dd-muted uppercase tracking-wider block mt-1">
                  Seus Duelos
                </span>
              </div>
              <div className="bg-dd-surface/20 border border-dd-border/40 rounded-xl p-3">
                <span className="block text-lg font-black text-dd-text font-mono">
                  {user.total_xp.toLocaleString()}
                </span>
                <span className="text-[9px] font-bold text-dd-muted uppercase tracking-wider block mt-1">
                  XP Total
                </span>
              </div>
            </div>
          </div>

          {/* Subtle footer */}
          <div className="px-4 text-[10px] text-dd-muted leading-normal space-y-2 pt-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="hover:underline cursor-pointer">Termos de Serviço</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Política de Privacidade</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Política de cookies</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Acessibilidade</span>
            </div>
            <p>© {new Date().getFullYear()} DevDeck Corp.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
