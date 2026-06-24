'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Terminal,
  Swords,
  Flame,
  Check,
  Heart,
  MessageSquare,
  Bookmark,
  Trophy,
} from 'lucide-react';

export function HeroMockup() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showXPBadge, setShowXPBadge] = useState(false);
  const [xpValue, setXpValue] = useState(1240);
  const [isHovered, setIsHovered] = useState(false);

  // Animation cycle: every 4.5 seconds, show the answer, float XP, fill bar, reset.
  useEffect(() => {
    const runCycle = () => {
      // Step 1: Select correct option (Option B / Index 1)
      setSelectedOption(1);

      // Step 2: Show XP badge floating up and update XP bar after 600ms
      setTimeout(() => {
        setShowXPBadge(true);
        setXpValue(1255);
      }, 600);

      // Step 3: Reset after 3.2 seconds
      setTimeout(() => {
        setShowXPBadge(false);
        setSelectedOption(null);
        setXpValue(1240);
      }, 3200);
    };

    // Run first cycle
    const initialTimeout = setTimeout(runCycle, 1000);

    // Set interval for subsequent cycles
    const interval = setInterval(runCycle, 4500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-5xl mx-auto rounded-2xl border border-dd-border bg-dd-bg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-700 ease-out select-none transform-gpu"
      style={{
        transform: isHovered
          ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.02)'
          : 'rotateX(6deg) rotateY(-8deg) rotateZ(1.5deg)',
        perspective: '1200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-dd-surface/40 border-b border-dd-border">
        {/* Window controls */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        {/* Address Bar */}
        <div className="flex items-center gap-1.5 px-6 py-1 rounded-md bg-dd-bg border border-dd-border/50 text-[10px] text-dd-muted font-mono w-48 md:w-64 justify-center">
          <span className="text-orange-500/80">https://</span>
          devdeck.com/feed
        </div>

        {/* Action item */}
        <div className="w-12 h-2 rounded bg-dd-border" />
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[460px] text-dd-text font-sans">
        {/* Left Navigation */}
        <div className="hidden md:flex flex-col p-4 border-r border-dd-border bg-dd-surface/10 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
              DD
            </div>
            <span className="font-bold text-sm tracking-tight">DevDeck</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-semibold">
              <Terminal className="w-4 h-4" />
              Feed Principal
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-dd-muted hover:text-dd-text text-xs transition-colors">
              <Swords className="w-4 h-4" />
              Duelos
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-dd-muted hover:text-dd-text text-xs transition-colors">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </div>
          </div>

          {/* User profile preview */}
          <div className="mt-auto p-3 bg-dd-surface/30 border border-dd-border/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold">
                GU
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold">@gustavo</div>
                <div className="text-[9px] text-dd-muted">Dev de Verdade</div>
              </div>
            </div>
            <div className="pt-1 border-t border-dd-border/50 flex items-center justify-between text-[9px]">
              <span className="text-dd-muted">Level 4</span>
              <span className="text-orange-400 font-bold flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-current" /> 12 dias
              </span>
            </div>
          </div>
        </div>

        {/* Central Feed Area */}
        <div className="col-span-1 md:col-span-2 p-5 space-y-4 bg-dd-bg flex flex-col justify-between overflow-y-auto">
          {/* Main Simulated Post */}
          <div className="space-y-3.5 border border-dd-border bg-dd-surface/5 hover:border-dd-border/80 transition-colors p-4 rounded-xl relative">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                  GU
                </div>
                <div>
                  <span className="text-xs font-bold hover:underline">@gustavo</span>
                  <span className="text-[10px] text-dd-muted block">Junior Dev • 2h atrás</span>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                TypeScript
              </span>
            </div>

            {/* Post Title & Description */}
            <div className="space-y-1">
              <h3 className="text-xs md:text-sm font-bold text-dd-text">
                Como calcular a complexidade de tempo neste loop?
              </h3>
              <p className="text-[11px] text-dd-muted leading-relaxed">
                Estou filtrando elementos duplicados de uma array grande em TypeScript. Qual a
                complexidade de tempo do método com{' '}
                <code className="px-1 py-0.5 rounded bg-dd-surface text-dd-text font-mono text-[9px]">
                  filter
                </code>{' '}
                +{' '}
                <code className="px-1 py-0.5 rounded bg-dd-surface text-dd-text font-mono text-[9px]">
                  Set
                </code>
                ?
              </p>
            </div>

            {/* Code Snippet block */}
            <div className="bg-dd-surface/50 border border-dd-border/60 rounded-lg p-3 font-mono text-[10px] text-zinc-300 overflow-x-auto relative">
              <div className="absolute right-2 top-2 text-[8px] text-dd-muted uppercase tracking-wider font-sans">
                typescript
              </div>
              <pre className="space-y-0.5 leading-relaxed">
                <div>
                  <span className="text-amber-500">function</span>{' '}
                  <span className="text-blue-400">findDuplicates</span>(arr:{' '}
                  <span className="text-cyan-400">number</span>[]):{' '}
                  <span className="text-cyan-400">number</span>[] &#123;
                </div>
                <div>
                  {' '}
                  <span className="text-amber-500">const</span> seen ={' '}
                  <span className="text-amber-500">new</span>{' '}
                  <span className="text-green-400">Set</span>&lt;
                  <span className="text-cyan-400">number</span>&gt;();
                </div>
                <div>
                  {' '}
                  <span className="text-amber-500">return</span> arr.
                  <span className="text-blue-400">filter</span>(x =&gt; seen.
                  <span className="text-blue-400">has</span>(x) ?{' '}
                  <span className="text-amber-500">true</span> : !seen.
                  <span className="text-blue-400">add</span>(x));
                </div>
                <div>&#125;</div>
              </pre>
            </div>

            {/* AI Generated Quiz Widget */}
            <div className="border border-orange-500/20 bg-orange-500/[0.02] rounded-xl p-3.5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-orange-500/10 pb-2">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Quiz Gerado por IA
                  </span>
                </div>
                <span className="text-[9px] text-orange-400/80 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">
                  +15 XP
                </span>
              </div>

              <div className="text-[11px] font-semibold text-dd-text">
                Qual a complexidade de tempo do algoritmo acima?
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-medium font-mono relative">
                {/* Option A */}
                <div className="border border-dd-border bg-dd-surface/40 p-2.5 rounded-lg text-dd-muted opacity-80 flex items-center justify-between">
                  <span>A) O(1)</span>
                </div>

                {/* Option B (Simulated Correct Option) */}
                <div
                  className={`border p-2.5 rounded-lg flex items-center justify-between transition-all duration-300 relative ${
                    selectedOption === 1
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)] scale-[1.01]'
                      : 'border-dd-border bg-dd-surface/40 text-dd-text hover:border-dd-border/80'
                  }`}
                >
                  <span>B) O(N)</span>
                  {selectedOption === 1 && (
                    <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white animate-scale-in">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Floating XP badge animation */}
                  {showXPBadge && (
                    <div className="absolute -top-6 -right-2 bg-emerald-500 text-white font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-md z-30 animate-xp-float flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-current" /> +15 XP
                    </div>
                  )}
                </div>

                {/* Option C */}
                <div className="border border-dd-border bg-dd-surface/40 p-2.5 rounded-lg text-dd-muted opacity-80 flex items-center justify-between">
                  <span>C) O(N log N)</span>
                </div>

                {/* Option D */}
                <div className="border border-dd-border bg-dd-surface/40 p-2.5 rounded-lg text-dd-muted opacity-80 flex items-center justify-between">
                  <span>D) O(N²)</span>
                </div>
              </div>
            </div>

            {/* Post Stats/Footer */}
            <div className="flex items-center justify-between pt-1 text-dd-muted text-[10px]">
              <div className="flex gap-4">
                <span className="flex items-center gap-1 hover:text-dd-text transition-colors">
                  <Heart className="w-3.5 h-3.5" /> 24
                </span>
                <span className="flex items-center gap-1 hover:text-dd-text transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> 8 respostas
                </span>
              </div>
              <Bookmark className="w-3.5 h-3.5 hover:text-dd-text transition-colors" />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 p-4 border-t md:border-t-0 md:border-l border-dd-border bg-dd-surface/10 space-y-4 flex flex-col justify-start">
          {/* XP Progress Card */}
          <div className="bg-dd-bg border border-dd-border rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-dd-muted uppercase tracking-wider font-semibold">
                XP Diário
              </span>
              <span className="text-[10px] text-orange-400 font-mono font-bold">
                {xpValue} / 1500 XP
              </span>
            </div>

            {/* Progress track */}
            <div className="h-2 w-full bg-dd-surface rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(xpValue / 1500) * 100}%` }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            </div>

            <div className="text-[9px] text-dd-muted leading-relaxed">
              Faltam apenas <strong className="text-dd-text font-bold">{1500 - xpValue} XP</strong>{' '}
              para completar sua meta diária!
            </div>
          </div>

          {/* Mini Active Duel Card */}
          <div className="bg-dd-bg border border-dd-border rounded-xl p-3.5 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-lg pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Swords className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Duelo em Alta
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="text-[10px] font-bold">Desafio de Performance: JS vs Rust</div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[9px] font-mono text-dd-muted">
                <span>Rust</span>
                <span className="text-emerald-400 font-bold">68% (124 votos)</span>
              </div>
              <div className="h-1.5 w-full bg-dd-surface rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: '68%' }} />
                <div className="h-full bg-orange-500" style={{ width: '32%' }} />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-dd-muted">
                <span>JavaScript</span>
                <span className="text-orange-400 font-bold">32% (58 votos)</span>
              </div>
            </div>

            <button className="w-full py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-bold text-[9px] transition-all duration-200">
              Votar no Duelo
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind and Custom CSS inject for animations */}
      <style jsx global>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes xp-float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(0.9);
            opacity: 0;
          }
        }
        .animate-xp-float {
          animation: xp-float 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
