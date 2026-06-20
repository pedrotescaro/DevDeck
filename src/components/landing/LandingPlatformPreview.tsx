'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Swords, Route, Trophy, User, MessageSquare } from 'lucide-react';

const SCREENSHOTS = [
  {
    id: 'feed',
    label: 'Feed de Dúvidas',
    icon: Home,
    src: '/screenshots/feed_dark.png',
    title: 'Onde dúvidas reais viram quizzes',
    description:
      'Um feed inteligente onde cada dúvida postada gera automaticamente um quiz por IA. Resolva problemas de outros desenvolvedores, acerte o quiz e acumule XP em tempo real.',
  },
  {
    id: 'trails',
    label: 'Trilhas de Aprendizado',
    icon: Route,
    src: '/screenshots/trails_dark.png',
    title: 'Jornadas de evolução focadas',
    description:
      'Suba de nível em tecnologias específicas (TypeScript, Rust, Python, Go) completando módulos práticos estruturados de sintaxe a tópicos avançados.',
  },
  {
    id: 'duels',
    label: 'Duelos de Código',
    icon: Swords,
    src: '/screenshots/duels_dark.png',
    title: 'A arena competitiva de programação',
    description:
      'Desafie outros desenvolvedores em tempo real. Quem resolver o desafio de performance mais rápido ou com melhor arquitetura leva o XP e escala no ranking.',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
    src: '/screenshots/leaderboard_dark.png',
    title: 'O ranking global da competência',
    description:
      'Destaque-se na comunidade global. Suba nas ligas e mostre seu nível real de habilidade para empresas parceiras sem precisar de um currículo tradicional.',
  },
  {
    id: 'profile',
    label: 'Perfil Gamificado',
    icon: User,
    src: '/screenshots/profile_dark.png',
    title: 'Sua competência é sua identidade',
    description:
      'Seu perfil exibe seu progresso por linguagem, suas conquistas (badges), ofensivas de dias ativos e histórico de duelos. Suas linhas de código viram seu portfólio.',
  },
  {
    id: 'ducky',
    label: 'Ducky Debugger',
    icon: MessageSquare,
    src: '/screenshots/ducky_dark.png',
    title: 'Seu parceiro de código inteligente',
    description:
      'Consulte o patinho de borracha da IA para analisar stack traces, tirar dúvidas ou obter dicas sobre desafios sem sair da arena de desenvolvimento.',
  },
];

export default function LandingPlatformPreview() {
  const [activeTab, setActiveTab] = useState('feed');
  const currentItem = SCREENSHOTS.find((s) => s.id === activeTab) || SCREENSHOTS[0];

  return (
    <section
      className="relative py-28 lg:py-36 bg-[#0E0D0B] overflow-hidden"
      id="platform"
      style={{
        borderTop: '1px solid var(--lp-border)',
        borderBottom: '1px solid var(--lp-border)',
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none select-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(127,168,201,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          className="grid lg:grid-cols-12 gap-8 mb-16"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lg:col-span-7">
            <div className="lp-section-marker mb-6">
              <span>02 — A Arena Real</span>
            </div>
            <h2
              className="lp-font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] uppercase"
              style={{ color: 'var(--lp-fg)' }}
            >
              Esta é a <span className="text-[var(--lp-accent)]">nossa plataforma</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p className="text-base leading-relaxed" style={{ color: 'var(--lp-fg-dim)' }}>
              Nada de mockups simulados ou ilustrações conceituais.{' '}
              <strong style={{ color: 'var(--lp-fg)' }}>
                Estes são os prints reais da interface de uso
              </strong>{' '}
              que você acessará ao criar sua conta no DevDeck.
            </p>
          </div>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10 pb-2 border-b border-[var(--lp-border)] overflow-x-auto scrollbar-none">
          {SCREENSHOTS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4.5 py-3.5 lp-font-heading font-medium text-xs tracking-wider uppercase border rounded-md transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[var(--lp-accent)] text-black border-[var(--lp-accent)] shadow-md shadow-[var(--lp-accent)]/10 scale-[1.02]'
                    : 'text-[var(--lp-fg-dim)] bg-[#141311] border-[var(--lp-border)] hover:bg-[#1A1815] hover:text-[var(--lp-fg)]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Display window with selected screenshot & description */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: Window Screen */}
          <div className="lg:col-span-8">
            <div
              className="rounded-lg overflow-hidden border border-[var(--lp-border)] bg-[#141311] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative"
              style={{
                boxShadow: '0 40px 80px -25px rgba(0,0,0,0.85), 0 0 0 1px var(--lp-border-light)',
              }}
            >
              {/* Browser Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1A1815] border-b border-[var(--lp-border)]">
                {/* Dots */}
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]/60" />
                </div>
                {/* Address */}
                <div className="flex items-center gap-1 px-4 py-1 rounded bg-[#0E0D0B] border border-[var(--lp-border)] text-[10px] lp-font-mono text-[var(--lp-muted)] w-48 sm:w-64 justify-center">
                  <span className="text-[var(--lp-accent)]">https://</span>
                  <span>devdeck.com/{currentItem.id}</span>
                </div>
                {/* Spacer */}
                <div className="w-12 h-2 bg-[var(--lp-border)] rounded hidden sm:block" />
              </div>

              {/* Window Content */}
              <div className="bg-[#0E0D0B] aspect-[16/10] relative overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.src}
                    alt={currentItem.label}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Feature explanation */}
          <div className="lg:col-span-4 lg:pt-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="lp-section-marker">
                  <span>DESTAQUE</span>
                </div>

                <h3 className="lp-font-heading font-bold text-3xl md:text-4xl text-[var(--lp-fg)] leading-tight uppercase">
                  {currentItem.title}
                </h3>

                <p className="text-base md:text-lg leading-relaxed text-[var(--lp-fg-dim)]">
                  {currentItem.description}
                </p>

                <div className="pt-4 flex">
                  <a
                    href="#start"
                    className="lp-font-heading font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded border border-[var(--lp-accent)] text-[var(--lp-accent)] hover:bg-[var(--lp-accent)] hover:text-black transition-all duration-300 cursor-pointer"
                  >
                    Experimentar Agora
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
