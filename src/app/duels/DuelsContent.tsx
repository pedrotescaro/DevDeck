'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Language } from '@prisma/client';
import {
  Swords,
  Plus,
  ArrowLeft,
  Zap,
  Sparkles,
  Play,
  Flame,
  Wand2,
  Bot,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { LanguageTag } from '@/components/LanguageTag';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import type { DuelProblem } from '@/lib/duel-problems';

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

const AVAILABLE_LANGUAGES: { key: Language; label: string }[] = [
  { key: 'TS', label: 'TypeScript' },
  { key: 'PYTHON', label: 'Python' },
  { key: 'JS', label: 'JavaScript' },
  { key: 'RUST', label: 'Rust' },
  { key: 'GO', label: 'Go' },
  { key: 'CPP', label: 'C++' },
];

export function DuelsContent({ user, initialDuels }: DuelsContentProps) {
  const router = useRouter();
  const [duels, setDuels] = useState<any[]>(initialDuels);
  const [selectedLang, setSelectedLang] = useState<Language>('TS');
  const [filterLang, setFilterLang] = useState<string>('ALL');
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [showDuelForm, setShowDuelForm] = useState(false);
  const [duelTitle, setDuelTitle] = useState('');
  const [duelBody, setDuelBody] = useState('');
  const [duelLanguage, setDuelLanguage] = useState<Language>('TS');
  const [creating, setCreating] = useState(false);

  // AI generation state
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [aiDifficulty, setAIDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiTopic, setAITopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState<DuelProblem | null>(null);
  const [aiError, setAIError] = useState<string | null>(null);

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

  const handleQuickMatch = async () => {
    setIsMatchmaking(true);

    try {
      const res = await fetch('/api/duels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isQuickMatch: true,
          language: selectedLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.duel?.id) {
          router.push(`/duels/${data.duel.id}`);
          return;
        }
      }
    } catch (err) {
      console.error('Error during quick match:', err);
    } finally {
      setIsMatchmaking(false);
    }
  };

  const handleCreateCustomDuel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // If we have an AI-generated problem, store the full JSON in problem_body
      const problemBody = generatedProblem ? JSON.stringify(generatedProblem) : duelBody;

      const res = await fetch('/api/duels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_title: duelTitle,
          problem_body: problemBody,
          language: duelLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDuelTitle('');
        setDuelBody('');
        setGeneratedProblem(null);
        setShowDuelForm(false);
        setShowAIConfig(false);
        if (data.duel?.id) {
          router.push(`/duels/${data.duel.id}`);
          return;
        }
        await refreshDuels();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAIError(null);
    setGeneratedProblem(null);

    try {
      const res = await fetch('/api/duels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: duelLanguage,
          difficulty: aiDifficulty,
          topic: aiTopic.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAIError(data.error || 'Erro ao gerar desafio. Tente novamente.');
        return;
      }

      const data = await res.json();
      if (data.problem) {
        setGeneratedProblem(data.problem);
        setDuelTitle(data.problem.title);
        setDuelBody(data.problem.description);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      setAIError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredDuels = duels.filter((d) => {
    if (filterLang === 'ALL') return true;
    return d.language === filterLang;
  });

  return (
    <div className="dd-platform-shell">
      <Sidebar user={user} />

      <div className="mx-auto flex w-full min-w-0 flex-grow items-start justify-center xl:max-w-[1480px] 2xl:max-w-[1600px] xl:justify-start">
        {/* Coluna Central */}
        <main className="flex min-h-screen w-full min-w-0 max-w-[720px] xl:max-w-[820px] 2xl:max-w-[920px] flex-grow flex-col border-r border-dd-border/80 bg-dd-bg pb-24 md:pb-8">
          {/* Header Fixo */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 p-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <Link
                href="/feed"
                className="p-2 hover:bg-dd-surface rounded-full transition-colors text-dd-text cursor-pointer"
                title="Voltar ao Feed"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-base font-black text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" />
                  Arena de Duelos 1v1
                </h1>
                <p className="text-[11px] text-dd-muted font-bold">
                  Batalhas de código em tempo real estilo arcade
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDuelForm(!showDuelForm)}
              className="dd-touch dd-focus-ring flex items-center gap-1.5 rounded-xl border-2 border-b-[3px] border-blue-600 border-b-blue-800 bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {showDuelForm ? 'Fechar' : 'Criar Duelo'}
            </button>
          </div>

          {/* Quick Matchmaking Hero Banner (Duolingo 3D Style) */}
          <div className="p-4 sm:p-6 space-y-6">
            <div className="rounded-[26px] border-2 border-b-4 border-amber-500/30 border-b-amber-600/80 bg-gradient-to-b from-amber-500/10 via-dd-surface/80 to-dd-surface p-6 shadow-xl relative overflow-hidden space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/30">
                    <Zap className="w-3 h-3 fill-current" /> Fila Rápida 1v1
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Enfrente um Desenvolvedor Agora
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md">
                    Resolva algoritmos sob pressão em tempo real, passe nos testes e conquiste +50
                    XP e posições no ranking!
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl border-2 border-b-4 border-amber-500/50 border-b-amber-600 bg-amber-500/20 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
                    <Swords className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Language Selection for Quick Match */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-dd-muted">
                  Escolha a Linguagem do Duelo:
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = selectedLang === lang.key;
                    return (
                      <button
                        key={lang.key}
                        type="button"
                        onClick={() => setSelectedLang(lang.key)}
                        className={cn(
                          'dd-touch dd-focus-ring px-3.5 py-1.5 rounded-xl border-2 border-b-[3px] text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer',
                          isSelected
                            ? 'border-blue-500 border-b-blue-700 bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-105'
                            : 'border-dd-border/80 border-b-dd-border bg-dd-surface text-dd-muted hover:text-white hover:border-slate-600'
                        )}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Matchmaking Action Button - Blue 3D */}
              <button
                type="button"
                onClick={handleQuickMatch}
                disabled={isMatchmaking}
                className="dd-touch dd-focus-ring w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-b-4 border-blue-600 border-b-blue-800 bg-blue-500 hover:bg-blue-400 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer disabled:opacity-60"
              >
                <Play className={cn('w-5 h-5 fill-current', isMatchmaking && 'animate-spin')} />
                {isMatchmaking ? 'Buscando Oponente na Arena...' : 'Entrar na Fila Rápida 1v1'}
              </button>
            </div>

            {/* Form de Criação de Duelo Personalizado */}
            {showDuelForm && (
              <div className="rounded-[24px] border-2 border-b-4 border-blue-500/30 border-b-blue-600 bg-dd-surface p-5 sm:p-6 space-y-4 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-dd-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Configurar Desafio Customizado
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAIConfig(!showAIConfig);
                      setGeneratedProblem(null);
                      setAIError(null);
                    }}
                    className={cn(
                      'dd-touch dd-focus-ring flex items-center gap-1.5 rounded-xl border-2 border-b-[3px] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer',
                      showAIConfig
                        ? 'border-amber-500 border-b-amber-700 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'border-amber-500/40 border-b-amber-600 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                    )}
                  >
                    <Wand2 className="w-3 h-3" />
                    {showAIConfig ? 'Modo Manual' : 'Gerar com IA'}
                  </button>
                </div>

                {/* AI Generation Config Panel */}
                {showAIConfig ? (
                  <div className="space-y-4">
                    {/* Language + Difficulty Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-dd-muted uppercase">
                          Linguagem
                        </label>
                        <select
                          value={duelLanguage}
                          onChange={(e) => setDuelLanguage(e.target.value as Language)}
                          className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                        >
                          <option value="TS">TypeScript</option>
                          <option value="JS">JavaScript</option>
                          <option value="PYTHON">Python</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-dd-muted uppercase">
                          Dificuldade
                        </label>
                        <div className="flex gap-1.5">
                          {(
                            [
                              { key: 'easy', label: 'Fácil', color: 'emerald' },
                              { key: 'medium', label: 'Médio', color: 'amber' },
                              { key: 'hard', label: 'Difícil', color: 'rose' },
                            ] as const
                          ).map((d) => (
                            <button
                              key={d.key}
                              type="button"
                              onClick={() => setAIDifficulty(d.key)}
                              className={cn(
                                'dd-touch flex-1 rounded-xl border-2 border-b-[3px] px-2 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer',
                                aiDifficulty === d.key
                                  ? d.color === 'emerald'
                                    ? 'border-emerald-500 border-b-emerald-700 bg-emerald-500 text-white shadow-md'
                                    : d.color === 'amber'
                                      ? 'border-amber-500 border-b-amber-700 bg-amber-500 text-slate-950 shadow-md'
                                      : 'border-rose-500 border-b-rose-700 bg-rose-500 text-white shadow-md'
                                  : 'border-dd-border/80 border-b-dd-border bg-dd-bg text-dd-muted hover:text-white'
                              )}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Topic */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-dd-muted uppercase">
                        Tema (opcional)
                      </label>
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAITopic(e.target.value)}
                        placeholder="Ex: Árvores binárias, Strings, Recursão, Matrizes..."
                        className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Generate Button */}
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="dd-touch dd-focus-ring w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-b-4 border-amber-600 border-b-amber-800 bg-amber-500 hover:bg-amber-400 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer disabled:opacity-60"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Gerando Desafio com IA...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4" />
                          Gerar Desafio com IA
                        </>
                      )}
                    </button>

                    {/* AI Error */}
                    {aiError && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300 font-semibold">
                        {aiError}
                      </div>
                    )}

                    {/* Generated Problem Preview */}
                    {generatedProblem && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="rounded-[18px] border-2 border-b-4 border-emerald-500/30 border-b-emerald-600 bg-emerald-500/5 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                              Desafio Gerado com Sucesso
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-sm font-black text-white">
                              {generatedProblem.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border',
                                  generatedProblem.difficulty === 'Fácil'
                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                    : generatedProblem.difficulty === 'Médio'
                                      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                                      : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                                )}
                              >
                                {generatedProblem.difficulty}
                              </span>
                              <span className="text-[9px] font-bold text-dd-muted">
                                {generatedProblem.testCases.length} testes
                              </span>
                              <span className="text-[9px] font-bold text-dd-muted">
                                fn: {generatedProblem.functionName}()
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {generatedProblem.description}
                          </p>

                          {/* Test cases preview */}
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-dd-muted">
                              Casos de Teste:
                            </span>
                            {generatedProblem.testCases.map((tc) => (
                              <div
                                key={tc.id}
                                className="flex items-center gap-2 text-[10px] text-slate-400"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                <span className="font-semibold">{tc.description}</span>
                                <span className="text-dd-muted ml-auto shrink-0">
                                  {tc.inputDisplay} → {tc.expectedDisplay}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons for generated problem */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="dd-touch dd-focus-ring flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-b-[3px] border-slate-600 border-b-slate-800 bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            Gerar Outro
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleCreateCustomDuel({
                                preventDefault: () => {},
                              } as React.FormEvent);
                            }}
                            disabled={creating}
                            className="dd-touch dd-focus-ring flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-b-[3px] border-blue-600 border-b-blue-800 bg-blue-500 hover:bg-blue-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Swords className="w-3.5 h-3.5" />
                            {creating ? 'Publicando...' : 'Publicar Desafio'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Manual Form */
                  <form onSubmit={handleCreateCustomDuel} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-dd-muted uppercase">
                          Título do Problema
                        </label>
                        <input
                          type="text"
                          value={duelTitle}
                          onChange={(e) => setDuelTitle(e.target.value)}
                          required
                          placeholder="Ex: Validador de Parênteses Balanceados"
                          className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-dd-muted uppercase">
                          Linguagem
                        </label>
                        <select
                          value={duelLanguage}
                          onChange={(e) => setDuelLanguage(e.target.value as Language)}
                          className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
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

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-dd-muted uppercase">
                        Enunciado e Casos de Teste
                      </label>
                      <textarea
                        value={duelBody}
                        onChange={(e) => setDuelBody(e.target.value)}
                        required
                        rows={4}
                        placeholder="Descreva o problema, entradas e saídas esperadas..."
                        className="w-full text-xs rounded-xl border border-dd-border bg-dd-bg px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={creating}
                        className="dd-touch dd-focus-ring rounded-xl border-2 border-b-[3px] border-blue-600 border-b-blue-800 bg-blue-500 hover:bg-blue-400 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer disabled:opacity-50"
                      >
                        {creating ? 'Criando...' : 'Publicar Desafio'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Filter Tabs by Language */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Duelos Abertos da Comunidade
                </h3>
                <span className="text-[11px] font-bold text-dd-muted">
                  {filteredDuels.length} {filteredDuels.length === 1 ? 'duelo' : 'duelos'}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFilterLang('ALL')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl border-2 border-b-[3px] text-[11px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer',
                    filterLang === 'ALL'
                      ? 'border-blue-500 border-b-blue-700 bg-blue-500 text-white shadow-sm'
                      : 'border-dd-border/80 border-b-dd-border bg-dd-surface text-dd-muted hover:text-white'
                  )}
                >
                  Todas
                </button>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.key}
                    type="button"
                    onClick={() => setFilterLang(lang.key)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl border-2 border-b-[3px] text-[11px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer',
                      filterLang === lang.key
                        ? 'border-blue-500 border-b-blue-700 bg-blue-500 text-white shadow-sm'
                        : 'border-dd-border/80 border-b-dd-border bg-dd-surface text-dd-muted hover:text-white'
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Duelos Estilo Cartas 3D */}
            <div className="grid grid-cols-1 gap-3.5">
              {filteredDuels.length === 0 ? (
                <div className="rounded-[22px] border-2 border-dashed border-dd-border bg-dd-surface/30 p-12 text-center text-dd-muted space-y-2">
                  <p className="text-sm font-bold text-slate-300">
                    Nenhum duelo aberto com esse filtro
                  </p>
                  <p className="text-xs">
                    Clique em &quot;Entrar na Fila Rápida&quot; acima para iniciar um duelo
                    instantâneo!
                  </p>
                </div>
              ) : (
                filteredDuels.map((duel) => {
                  const isPending = duel.status === 'PENDING';
                  const isActive = duel.status === 'ACTIVE';

                  return (
                    <Link
                      key={duel.id}
                      href={`/duels/${duel.id}`}
                      className="group rounded-[22px] border-2 border-b-4 border-dd-border/80 bg-dd-surface p-4 sm:p-5 shadow-md transition-all duration-150 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      {/* Left: Problem info and Language */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <LanguageTag language={duel.language} size="sm" />
                          <span
                            className={cn(
                              'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border-2 border-b-[2.5px]',
                              isPending
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 border-b-amber-600'
                                : isActive
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30 border-b-blue-600'
                                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 border-b-emerald-600'
                            )}
                          >
                            {isPending
                              ? 'Aguardando Oponente'
                              : isActive
                                ? 'Batalha Ativa'
                                : 'Finalizado'}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors truncate">
                          {duel.problem_title}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-1">{duel.problem_body}</p>
                      </div>

                      {/* Right: Combatants & Enter Button */}
                      <div className="flex items-center gap-4 shrink-0 sm:self-center">
                        {/* Versus Avatars */}
                        <div className="flex items-center -space-x-3">
                          <AuthorAvatar
                            username={duel.challenger.username}
                            avatar_url={duel.challenger.avatar_url}
                            size="md"
                            className="ring-2 ring-blue-500 ring-offset-2 ring-offset-black"
                          />
                          {duel.opponent ? (
                            <AuthorAvatar
                              username={duel.opponent.username}
                              avatar_url={duel.opponent.avatar_url}
                              size="md"
                              className="ring-2 ring-amber-500 ring-offset-2 ring-offset-black"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-400">
                              ?
                            </div>
                          )}
                        </div>

                        {/* Duolingo 3D Blue Action Button with real SVG icon */}
                        <span className="dd-touch inline-flex items-center gap-1.5 rounded-xl border-2 border-b-[3px] border-blue-600 border-b-blue-800 bg-blue-500 group-hover:bg-blue-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
                          {isPending ? (
                            <>
                              <span>Entrar</span>
                              <Swords className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <span>Ver Duelo</span>
                          )}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
