'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { CodeEditor } from '@/components/CodeEditor';
import { LanguageTag } from '@/components/LanguageTag';
import { Footer } from '@/components/Footer';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import {
  Swords,
  Code,
  Sparkles,
  ArrowLeft,
  Clock,
  Vote,
  CheckCircle,
  HelpCircle,
  Send,
} from 'lucide-react';

interface DuelDetailContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  initialDuel: any;
}

export function DuelDetailContent({ user, initialDuel }: DuelDetailContentProps) {
  const [duel, setDuel] = useState<any>(initialDuel);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [toastXp, setToastXp] = useState<{ amount: number; language: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateSoundState = () => {
      setSoundEnabled(localStorage.getItem('devdeck-sound') !== 'false');
    };

    updateSoundState();

    window.addEventListener('storage', updateSoundState);
    window.addEventListener('devdeck-sound-changed', updateSoundState);

    return () => {
      window.removeEventListener('storage', updateSoundState);
      window.removeEventListener('devdeck-sound-changed', updateSoundState);
    };
  }, []);

  const { playSound } = useSoundEffects(soundEnabled);

  const showXPToast = (amount: number, language: string) => {
    setToastXp({ amount, language });
    playSound('xpgain');
    setTimeout(() => {
      setToastXp(null);
    }, 4000);
  };

  const handleSubmitSolution = async () => {
    if (code.trim() === '') return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/duels/${duel.id}/solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Solução enviada com sucesso!');
        setCode('');
        window.location.reload();

        if (data.xpResult?.xpEarned) {
          showXPToast(data.xpResult.xpEarned, data.xpResult.language);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao enviar solução.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (solutionId: string) => {
    setVoting(true);

    try {
      const res = await fetch(`/api/duels/${duel.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solution_id: solutionId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Voto registrado com sucesso!');
        window.location.reload();
      } else {
        alert(data.error || 'Erro ao registrar voto.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  // Simulated syntax highlighter for code snippets
  const highlightCode = (code: string) => {
    if (!code) return null;
    const lines = code.split('\n');
    return (
      <pre className="font-mono text-[10px] leading-relaxed text-dd-text">
        <code>
          {lines.map((line, idx) => {
            let html = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const keywords =
              /\b(const|let|var|function|return|fn|impl|pub|use|import|from|def|class|async|await|struct|enum|if|else|for|while|match)\b/g;
            html = html.replace(keywords, '<span class="text-orange-400 font-semibold">$1</span>');

            const types =
              /\b(string|number|boolean|any|void|User|Post|Language|int|float|str|char)\b/g;
            html = html.replace(types, '<span class="text-cyan-400 font-medium">$1</span>');

            if (html.includes('//')) {
              const parts = html.split('//');
              html =
                parts[0] +
                '<span class="text-dd-muted italic">//' +
                parts.slice(1).join('//') +
                '</span>';
            }
            return (
              <div key={idx} className="table-row">
                <span className="table-cell text-right pr-4 select-none opacity-20 text-[9px] w-6">
                  {idx + 1}
                </span>
                <span className="table-cell" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            );
          })}
        </code>
      </pre>
    );
  };

  const isChallenger = duel.challenger_id === user.id;
  const isOpponent = duel.opponent_id === user.id;
  const isParticipant = isChallenger || isOpponent;

  const challengerSolution = duel.solutions?.find((s: any) => s.user_id === duel.challenger_id);
  const opponentSolution = duel.solutions?.find((s: any) => s.user_id === duel.opponent_id);

  const totalVotes = (challengerSolution?.vote_count ?? 0) + (opponentSolution?.vote_count ?? 0);
  const challengerPercent =
    totalVotes > 0 ? Math.round(((challengerSolution?.vote_count ?? 0) / totalVotes) * 100) : 50;
  const opponentPercent = totalVotes > 0 ? 100 - challengerPercent : 50;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      {/* XP Toast */}
      {toastXp && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in-right rounded-xl border border-emerald-500/30 bg-dd-surface/90 backdrop-blur-xl p-4 shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-base ring-1 ring-emerald-500/30">
            +{toastXp.amount}
          </div>
          <div>
            <p className="font-bold text-sm text-dd-text">XP Concedido!</p>
            <p className="text-xs text-dd-muted">Você progrediu na trilha de {toastXp.language}</p>
          </div>
        </div>
      )}

      <Sidebar user={user} />

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-6">
          {/* Back Link */}
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-xs font-semibold text-dd-muted hover:text-dd-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Arena
          </Link>

          {/* Duel Room Header */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-6 backdrop-blur-sm shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />
                Duelo de Código
              </span>
              <LanguageTag language={duel.language} size="sm" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-dd-text">
                {duel.problem_title}
              </h1>
              <p className="text-dd-muted text-xs mt-1 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-dd-muted" />
                Status: {duel.status === 'PENDING' ? 'Aguardando oponente...' : 'Combate Ativo'}
              </p>
            </div>

            <div className="border-t border-dd-border pt-4 space-y-2">
              <h2 className="text-xs font-bold text-dd-muted uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-dd-muted" />
                Descrição do Desafio
              </h2>
              <p className="text-xs text-dd-text leading-relaxed whitespace-pre-wrap">
                {duel.problem_body}
              </p>
            </div>
          </div>

          {/* Duel Sandbox editor for participants */}
          {duel.status === 'ACTIVE' && isParticipant && (
            <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 border-b border-dd-border pb-3">
                <Code className="w-4.5 h-4.5 text-orange-500/85" />
                <h2 className="text-sm font-extrabold text-dd-text">Escreva seu Algoritmo</h2>
              </div>

              <p className="text-dd-muted text-xs leading-relaxed">
                Desenvolva sua resposta utilizando a linguagem {duel.language}. Lembre-se de cobrir
                todos os casos de teste citados na descrição para vencer o duelo.
              </p>

              <CodeEditor value={code} onChange={setCode} language={duel.language} height="280px" />

              <div className="flex justify-end pt-2 border-t border-dd-border">
                <button
                  onClick={handleSubmitSolution}
                  disabled={submitting || code.trim() === ''}
                  className="bg-orange-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors hover:bg-orange-600 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/10 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Enviando...' : 'Submeter Solução (+25 XP)'}
                </button>
              </div>
            </div>
          )}

          {/* Voting Arena (visible when duel is active/voting) */}
          {duel.status === 'ACTIVE' && (
            <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-6 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 border-b border-dd-border pb-3">
                <Vote className="w-4.5 h-4.5 text-orange-500/85" />
                <h2 className="text-sm font-extrabold text-dd-text">
                  Arena de Votos da Comunidade
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Challenger Side */}
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-dd-border pb-6 md:pb-0 md:pr-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-dd-text">
                      Desafiante: @{duel.challenger.username}
                    </span>
                    <span className="text-[10px] text-dd-muted font-semibold">
                      {challengerSolution ? 'Código enviado ✅' : 'Codificando... ⏳'}
                    </span>
                  </div>

                  {challengerSolution ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-dd-border bg-dd-bg p-4 overflow-x-auto shadow-inner max-h-64">
                        {highlightCode(challengerSolution.code)}
                      </div>
                      {!isParticipant && (
                        <button
                          onClick={() => handleVote(challengerSolution.id)}
                          disabled={voting}
                          className="w-full bg-orange-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer shadow-sm"
                        >
                          Votar nesta solução
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-dd-bg/40 border border-dd-border rounded-lg p-12 text-center text-xs text-dd-muted italic">
                      Aguardando envio do código...
                    </div>
                  )}
                </div>

                {/* Opponent Side */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-dd-text">
                      Oponente: {duel.opponent ? `@${duel.opponent.username}` : 'Aguardando...'}
                    </span>
                    <span className="text-[10px] text-dd-muted font-semibold">
                      {duel.opponent
                        ? opponentSolution
                          ? 'Código enviado ✅'
                          : 'Codificando... ⏳'
                        : 'Matchmaking...'}
                    </span>
                  </div>

                  {opponentSolution ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-dd-border bg-dd-bg p-4 overflow-x-auto shadow-inner max-h-64">
                        {highlightCode(opponentSolution.code)}
                      </div>
                      {!isParticipant && (
                        <button
                          onClick={() => handleVote(opponentSolution.id)}
                          disabled={voting}
                          className="w-full bg-orange-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer shadow-sm"
                        >
                          Votar nesta solução
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-dd-bg/40 border border-dd-border rounded-lg p-12 text-center text-xs text-dd-muted italic">
                      {duel.opponent
                        ? 'Aguardando envio do código...'
                        : 'Buscando oponente na arena...'}
                    </div>
                  )}
                </div>
              </div>

              {/* Placar de Votos */}
              {totalVotes > 0 && (
                <div className="border-t border-dd-border pt-6 space-y-3">
                  <h3 className="font-bold text-xs text-center text-dd-muted uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    Resultado Parcial ({totalVotes} votos)
                  </h3>

                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-dd-muted">
                    <span>
                      @{duel.challenger.username} ({challengerPercent}%)
                    </span>
                    <span>
                      {duel.opponent ? `@${duel.opponent.username}` : 'Oponente'} ({opponentPercent}
                      %)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="h-full bg-orange-500 transition-all duration-350"
                      style={{ width: `${challengerPercent}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500 transition-all duration-350"
                      style={{ width: `${opponentPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
