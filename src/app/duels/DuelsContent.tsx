'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DuelCard } from '@/components/DuelCard';
import { Footer } from '@/components/Footer';
import { Language } from '@prisma/client';
import { Swords, Plus, ChevronRight, Sparkles, HelpCircle, Code, ArrowLeft } from 'lucide-react';
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

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-6">
          {/* Back Link */}
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-xs font-semibold text-dd-muted hover:text-dd-text transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Feed
          </Link>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 bg-dd-surface border border-dd-border rounded-xl p-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Swords className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-dd-text">Arena de Duelos</h1>
                <p className="text-dd-muted text-xs mt-0.5">
                  Desafie a comunidade em problemas de algoritmos, envie soluções no editor e vote!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDuelForm(!showDuelForm)}
              className="bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors hover:bg-orange-600 whitespace-nowrap cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              {showDuelForm ? 'Fechar Formulário' : 'Lançar Duelo (+20 XP)'}
            </button>
          </div>

          {showDuelForm && (
            <div className="rounded-xl border border-dd-border bg-dd-surface p-6 space-y-4 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 border-b border-dd-border pb-3">
                <Sparkles className="w-4 h-4 text-orange-500/85" />
                <h3 className="text-xs font-bold text-dd-muted uppercase tracking-wider">
                  Configurar Novo Desafio
                </h3>
              </div>

              <form onSubmit={handleCreateDuel} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-dd-muted uppercase tracking-wider mb-2">
                      Título do Duelo
                    </label>
                    <input
                      type="text"
                      value={duelTitle}
                      onChange={(e) => setDuelTitle(e.target.value)}
                      required
                      placeholder="Ex: Inverter uma Árvore Binária sem Recursão"
                      className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-dd-muted uppercase tracking-wider mb-2">
                      Linguagem Requerida
                    </label>
                    <select
                      value={duelLanguage}
                      onChange={(e) => setDuelLanguage(e.target.value as Language)}
                      className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-3 py-2.5 text-dd-text focus:border-orange-500/60 focus:outline-none cursor-pointer"
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
                  <label className="block text-[10px] font-bold text-dd-muted uppercase tracking-wider mb-2">
                    Descrição e Casos de Teste
                  </label>
                  <textarea
                    value={duelBody}
                    onChange={(e) => setDuelBody(e.target.value)}
                    required
                    rows={5}
                    placeholder="Escreva a descrição do algoritmo. Especifique formatos de entrada, saída esperada e restrições de desempenho."
                    className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none resize-none transition-colors"
                  />
                </div>
                <div className="flex justify-end pt-2 border-t border-dd-border">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-orange-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors hover:bg-orange-600 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    {creating ? 'Lançando...' : 'Lançar Desafio'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Duels Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {duels.length === 0 ? (
              <div className="col-span-2 rounded-xl border border-dd-border bg-dd-surface/10 p-16 text-center text-dd-muted text-xs">
                Nenhum duelo de código ocorrendo no momento. Seja o primeiro a criar um desafio
                acima!
              </div>
            ) : (
              duels.map((duel) => <DuelCard key={duel.id} duel={duel} />)
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
