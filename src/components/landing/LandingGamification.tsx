'use client';

import { motion } from 'framer-motion';
import { Bug, Flame, Swords, Lock, Check, Trophy } from 'lucide-react';

export default function LandingGamification() {
  return (
    <section
      className="relative py-28 lg:py-36"
      id="gamify"
      style={{ borderTop: '1px solid var(--lp-border)', background: 'rgba(8,7,6,.5)' }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
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
              <span>04 — O Sistema</span>
            </div>
            <h2
              className="lp-font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]"
              style={{ color: 'var(--lp-fg)' }}
            >
              Níveis não são decoração.
              <br />
              <span style={{ color: 'var(--lp-accent)' }}>Eles são conquistados</span>{' '}
              <span className="lp-text-stroke">no ciclo.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p className="text-base leading-relaxed" style={{ color: 'var(--lp-fg-dim)' }}>
              Cada ponto de XP se origina de um post real, uma resposta real ou um duelo real.{' '}
              <span style={{ color: 'var(--lp-fg)' }}>Nada é concedido apenas por logar.</span>
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left — Daily Quiz */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="lp-quiz-card h-full p-8"
              style={{
                backgroundColor: 'var(--lp-bg-card)',
                border: '1px solid var(--lp-border)',
                borderRadius: '12px',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="lp-font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded flex items-center gap-2"
                  style={{ color: 'var(--lp-accent)', background: 'rgba(245,118,43,0.1)' }}
                >
                  <span
                    className="lp-pulse-dot w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--lp-accent)' }}
                  />
                  DAILY QUIZ · RESET EM 04:12:38
                </span>
              </div>
              <h3
                className="lp-font-heading font-semibold text-xl mb-4 leading-snug"
                style={{ color: 'var(--lp-fg)' }}
              >
                No Rust, qual é a diferença de ownership entre{' '}
                <code className="lp-font-mono" style={{ color: 'var(--lp-blue)' }}>
                  String
                </code>{' '}
                e{' '}
                <code className="lp-font-mono" style={{ color: 'var(--lp-blue)' }}>
                  &amp;str
                </code>
                ?
              </h3>
              <div
                className="rounded-md p-3 lp-font-mono text-[12px] mb-5 leading-relaxed"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
              >
                <span className="lp-kw">fn</span> <span className="lp-fn">takes_ownership</span>(s:{' '}
                <span className="lp-ty">String</span>) {'{ '}
                <span className="lp-cm">{'/* owns */'}</span>
                {' }'}
                <br />
                <span className="lp-kw">fn</span> <span className="lp-fn">borrows</span>(s:{' '}
                <span className="lp-kw">&amp;</span>
                <span className="lp-ty">str</span>) {'{ '}
                <span className="lp-cm">{'/* borrows */'}</span>
                {' }'}
                <br />
                <br />
                <span className="lp-kw">let</span> owned = <span className="lp-ty">String</span>::
                <span className="lp-fn">from</span>(<span className="lp-st">&quot;hi&quot;</span>);
                <br />
                <span className="lp-kw">let</span> slice: <span className="lp-kw">&amp;</span>
                <span className="lp-ty">str</span> = <span className="lp-kw">&amp;</span>owned;
              </div>
              <div className="space-y-2">
                {[
                  {
                    letter: 'A',
                    text: 'String é alocada na heap, &str é uma view (fatia)',
                    correct: true,
                  },
                  {
                    letter: 'B',
                    text: 'Ambas são alocadas na stack, mas diferem na mutabilidade',
                    correct: false,
                  },
                  {
                    letter: 'C',
                    text: '&str possui os dados, String os pega emprestado',
                    correct: false,
                  },
                  { letter: 'D', text: 'Nenhuma diferença, são aliases de tipo', correct: false },
                ].map((opt) => (
                  <div
                    key={opt.letter}
                    className="flex items-center gap-3 p-3 rounded lp-font-mono text-[12px] cursor-pointer transition-colors"
                    style={{
                      border: `1px solid ${opt.correct ? 'var(--lp-accent)' : 'var(--lp-border)'}`,
                      color: opt.correct ? 'var(--lp-fg)' : 'var(--lp-fg-dim)',
                      background: opt.correct ? 'rgba(245,118,43,0.1)' : 'transparent',
                    }}
                  >
                    <span
                      className="font-bold w-4"
                      style={{ color: opt.correct ? 'var(--lp-accent)' : 'var(--lp-muted)' }}
                    >
                      {opt.letter}
                    </span>
                    {opt.text}
                    {opt.correct && (
                      <Check size={12} className="ml-auto" style={{ color: 'var(--lp-accent)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Leaderboard + Badges */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Leaderboard */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--lp-bg-card)',
                border: '1px solid var(--lp-border)',
                borderRadius: '12px',
              }}
            >
              <div
                className="lp-font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'var(--lp-muted)' }}
              >
                RANKING · ESTA SEMANA
              </div>
              <div className="space-y-2">
                {[
                  { rank: '🥇', name: 'mira.okonkwo', xp: '12,480', color: 'var(--lp-gold)' },
                  { rank: '🥈', name: 'yuki.t', xp: '11,200', color: 'var(--lp-silver)' },
                  { rank: '🥉', name: 'm.velez', xp: '9,870', color: 'var(--lp-bronze)' },
                  { rank: '4', name: 'paulo.s', xp: '8,240', color: 'var(--lp-muted)' },
                  {
                    rank: '▸',
                    name: 'você',
                    xp: '7,890',
                    color: 'var(--lp-accent)',
                    highlight: true,
                  },
                ].map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-3 p-2.5 rounded lp-font-mono text-[11px]"
                    style={{
                      background: entry.highlight ? 'rgba(245,118,43,0.08)' : 'transparent',
                      border: entry.highlight
                        ? '1px solid rgba(245,118,43,0.2)'
                        : '1px solid transparent',
                    }}
                  >
                    <span className="w-6 text-center" style={{ color: entry.color }}>
                      {entry.rank}
                    </span>
                    <span
                      className="flex-1"
                      style={{ color: entry.highlight ? 'var(--lp-accent)' : 'var(--lp-fg)' }}
                    >
                      {entry.name}
                    </span>
                    <span style={{ color: entry.color }}>{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--lp-bg-card)',
                border: '1px solid var(--lp-border)',
                borderRadius: '12px',
              }}
            >
              <div
                className="lp-font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'var(--lp-muted)' }}
              >
                CONQUISTAS
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Bug,
                    label: 'Caçador de Bugs',
                    unlocked: true,
                    color: 'var(--lp-accent)',
                  },
                  {
                    icon: Flame,
                    label: 'Ofensiva 30 dias',
                    unlocked: true,
                    color: 'var(--lp-gold)',
                  },
                  {
                    icon: Swords,
                    label: 'Mestre dos Duelos',
                    unlocked: true,
                    color: 'var(--lp-accent)',
                  },
                  { icon: Lock, label: 'Bloqueado', unlocked: false, color: 'var(--lp-muted-2)' },
                  { icon: Lock, label: 'Bloqueado', unlocked: false, color: 'var(--lp-muted-2)' },
                  { icon: Lock, label: 'Bloqueado', unlocked: false, color: 'var(--lp-muted-2)' },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg"
                    style={{
                      border: `1px solid ${badge.unlocked ? badge.color : 'var(--lp-border)'}`,
                      opacity: badge.unlocked ? 1 : 0.4,
                    }}
                  >
                    <badge.icon size={20} style={{ color: badge.color }} />
                    <span
                      className="lp-font-mono text-[8px] text-center"
                      style={{ color: badge.unlocked ? 'var(--lp-fg-dim)' : 'var(--lp-muted-2)' }}
                    >
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stat */}
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'var(--lp-bg-card)', border: '1px solid var(--lp-border)' }}
            >
              <div>
                <div
                  className="lp-font-mono text-[9px] tracking-[0.15em] uppercase"
                  style={{ color: 'var(--lp-muted)' }}
                >
                  Quizzes de hoje
                </div>
                <div className="lp-font-display text-3xl" style={{ color: 'var(--lp-accent)' }}>
                  7/10
                </div>
              </div>
              <div>
                <div
                  className="lp-font-mono text-[9px] tracking-[0.15em] uppercase"
                  style={{ color: 'var(--lp-muted)' }}
                >
                  Precisão
                </div>
                <div className="lp-font-display text-3xl" style={{ color: 'var(--lp-fg)' }}>
                  86%
                </div>
              </div>
              <div>
                <div
                  className="lp-font-mono text-[9px] tracking-[0.15em] uppercase"
                  style={{ color: 'var(--lp-muted)' }}
                >
                  Ofensiva
                </div>
                <div className="lp-font-display text-3xl flex items-center gap-1">
                  <Trophy size={16} style={{ color: 'var(--lp-gold)' }} />
                  <span style={{ color: 'var(--lp-gold)' }}>5</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
