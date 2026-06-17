'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Monitor, Laptop } from 'lucide-react';

interface Screenshot {
  title: string;
  path: string;
  url: string;
  description: string;
}

export function ScreenshotCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots: Screenshot[] = [
    {
      title: 'Feed Principal',
      path: '/screenshots/media__1781704447616.png',
      url: 'devdeck.com/feed',
      description: 'Discussões técnicas em tempo real. Poste dúvidas de código e veja a comunidade debater soluções.'
    },
    {
      title: 'Trilhas de Linguagem',
      path: '/screenshots/media__1781704487853.png',
      url: 'devdeck.com/trails',
      description: 'Progresso ativo por linguagem. Acompanhe seu XP em TypeScript, Python, Rust, Go e suba de nível.'
    },
    {
      title: 'Quizzes por IA',
      path: '/screenshots/media__1781704850187.png',
      url: 'devdeck.com/feed?quiz=active',
      description: 'Nossa inteligência artificial converte posts de dúvidas em desafios de múltipla escolha para a arena.'
    },
    {
      title: 'Duelos de Performance',
      path: '/screenshots/media__1781705036165.png',
      url: 'devdeck.com/duels',
      description: 'Batalhas de código. Desafie colegas e submeta a melhor implementação de algoritmos sob avaliação da IA.'
    },
    {
      title: 'Pato de Borracha (Ducky)',
      path: '/screenshots/media__1781705127384.png',
      url: 'devdeck.com/ducky',
      description: 'Nosso pato de borracha com IA. Debugue e comente linhas de código diretamente no editor integrado.'
    },
    {
      title: 'Leaderboard Global',
      path: '/screenshots/media__1781705297394.png',
      url: 'devdeck.com/leaderboard',
      description: 'Rankings semanais e gerais. Garanta seu lugar no topo e compita com engenheiros do mundo todo.'
    },
    {
      title: 'Perfil Técnico',
      path: '/screenshots/media__1781705496693.png',
      url: 'devdeck.com/profile/gustavo',
      description: 'Seu currículo vivo. Exiba seu histórico de contribuições, badges raras e link do GitHub integrado.'
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const current = screenshots[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none">
      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-dd-surface border border-dd-border max-w-4xl mx-auto">
        {screenshots.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold tracking-tight transition-all duration-200 ${
              currentIndex === idx
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-dd-muted hover:text-dd-text hover:bg-dd-surface-hover'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Browser Mockup Frame */}
      <div className="relative rounded-2xl border border-dd-border bg-dd-bg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300">
        {/* Top Browser Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-dd-surface/40 border-b border-dd-border">
          {/* Window controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          
          {/* Address Bar */}
          <div className="flex items-center gap-1.5 px-6 py-1 rounded-md bg-dd-bg border border-dd-border/50 text-[10px] text-dd-muted font-mono w-48 md:w-80 justify-center">
            <span className="text-orange-500/80">https://</span>
            {current.url}
          </div>

          <div className="flex items-center gap-1 text-dd-muted opacity-70">
            <Laptop className="w-4 h-4" />
          </div>
        </div>

        {/* Screenshot Viewport Container */}
        <div className="relative min-h-[300px] md:min-h-[500px] bg-dd-surface/20 flex items-center justify-center overflow-hidden">
          {/* Slide image */}
          <div className="w-full h-full relative aspect-[16/10] overflow-hidden">
            <img 
              src={current.path} 
              alt={current.title} 
              className="w-full h-full object-cover transition-opacity duration-300 animate-fade-in"
              onError={(e) => {
                // Failback handling if screenshots are missing
                e.currentTarget.src = '/logo.png';
              }}
            />
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-dd-border bg-dd-bg/80 hover:bg-dd-bg text-dd-text flex items-center justify-center hover:scale-105 active:scale-[0.95] transition-all z-10 shadow-lg backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-dd-border bg-dd-bg/80 hover:bg-dd-bg text-dd-text flex items-center justify-center hover:scale-105 active:scale-[0.95] transition-all z-10 shadow-lg backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Screenshot Caption Description */}
      <div className="text-center max-w-xl mx-auto space-y-1 py-2">
        <h4 className="text-sm font-black text-dd-text uppercase tracking-wide">
          {current.title}
        </h4>
        <p className="text-xs text-dd-muted leading-relaxed">
          {current.description}
        </p>
      </div>

      {/* Embedded style tag for fade-in animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
