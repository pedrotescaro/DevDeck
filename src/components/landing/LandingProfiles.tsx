'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Flame, Swords, Bug, Trophy, Target } from 'lucide-react';

const languages = [
  { name: 'Rust', level: 14, pct: 78, color: '#DEA584' },
  { name: 'TypeScript', level: 19, pct: 92, color: '#3178C6' },
  { name: 'Python', level: 8, pct: 45, color: '#3776AB' },
  { name: 'Go', level: 5, pct: 28, color: '#00ADD8' },
];

const badges = [
  { icon: Bug, label: 'Caçador de Bugs' },
  { icon: Flame, label: 'Ofensiva 30 dias' },
  { icon: Swords, label: 'Mestre dos Duelos' },
  { icon: Code, label: 'Poliglota' },
  { icon: Trophy, label: 'Top 10' },
  { icon: Target, label: 'Mestre dos Quizzes' },
];

export default function LandingProfiles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      className="relative py-28 lg:py-36"
      id="profiles"
      style={{ borderTop: '1px solid var(--lp-border)' }}
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
              <span>06 — Perfis</span>
            </div>
            <h2
              className="lp-font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]"
              style={{ color: 'var(--lp-fg)' }}
            >
              Seu perfil deixa de
              <br />
              <span className="lp-text-stroke">ser um currículo.</span>
              <br />E passa a ser <span style={{ color: 'var(--lp-accent)' }}>prova real.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p className="text-base leading-relaxed" style={{ color: 'var(--lp-fg-dim)' }}>
              Cada nível de linguagem, cada conquista, cada ofensiva, cada histórico de duelo —
              conquistados de forma transparente.{' '}
              <span style={{ color: 'var(--lp-fg)' }}>
                Compartilhe seu perfil do DevDeck da mesma forma que compartilha seu GitHub.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          ref={ref}
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="overflow-hidden"
            style={{
              backgroundColor: 'var(--lp-bg-card)',
              border: '1px solid var(--lp-border-light)',
              borderRadius: '16px',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
            }}
          >
            {/* Banner */}
            <div
              className="h-24 relative"
              style={{
                background:
                  'linear-gradient(135deg, var(--lp-accent), var(--lp-accent-dim), #1A0F04)',
              }}
            >
              <div className="absolute -bottom-8 left-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center lp-font-mono font-bold text-xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--lp-blue), var(--lp-blue-dim))',
                    color: '#0E1A24',
                    border: '3px solid var(--lp-bg-card)',
                  }}
                >
                  MO
                </div>
              </div>
            </div>

            <div className="pt-12 px-6 pb-6">
              {/* Name & handle */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className="lp-font-heading font-bold text-xl"
                    style={{ color: 'var(--lp-fg)' }}
                  >
                    Mira Okonkwo
                  </h3>
                  <div className="lp-font-mono text-[12px]" style={{ color: 'var(--lp-muted)' }}>
                    @mira.okonkwo
                  </div>
                </div>
                <div
                  className="lp-font-mono text-[11px] px-2.5 py-1 rounded"
                  style={{
                    color: 'var(--lp-accent)',
                    border: '1px solid rgba(245,118,43,0.3)',
                    background: 'rgba(245,118,43,0.1)',
                  }}
                >
                  L14 · 24,580 XP
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--lp-fg-dim)' }}>
                Rust fanatic. Ownership is a lifestyle.
              </p>

              {/* Stats */}
              <div
                className="flex flex-wrap gap-4 mb-6 pb-6 lp-font-mono text-[11px]"
                style={{ borderBottom: '1px solid var(--lp-border)' }}
              >
                {[
                  { label: 'Posts', value: '247' },
                  { label: 'Respostas', value: '1,842' },
                  { label: 'Duelos Vencidos', value: '42' },
                  { label: 'Ofensiva', value: '47 🔥' },
                ].map((s) => (
                  <span key={s.label}>
                    <span className="font-semibold" style={{ color: 'var(--lp-fg)' }}>
                      {s.value}
                    </span>{' '}
                    <span style={{ color: 'var(--lp-muted)' }}>{s.label}</span>
                  </span>
                ))}
              </div>

              {/* Language Tracks */}
              <div className="mb-6">
                <h4
                  className="lp-font-mono text-[10px] tracking-[0.15em] uppercase mb-3"
                  style={{ color: 'var(--lp-muted)' }}
                >
                  Trilhas de Linguagem
                </h4>
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="lp-font-mono text-[11px] flex items-center gap-2"
                          style={{ color: 'var(--lp-fg)' }}
                        >
                          <span className="w-2 h-2 rounded-sm" style={{ background: lang.color }} />
                          {lang.name}
                        </span>
                        <span
                          className="lp-font-mono text-[10px]"
                          style={{ color: 'var(--lp-accent)' }}
                        >
                          Nível {lang.level}
                        </span>
                      </div>
                      <div className="lp-lang-bar">
                        <div
                          className="lp-lang-bar-fill"
                          style={{
                            width: isInView ? `${lang.pct}%` : '0%',
                            background: lang.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4
                  className="lp-font-mono text-[10px] tracking-[0.15em] uppercase mb-3"
                  style={{ color: 'var(--lp-muted)' }}
                >
                  Conquistas
                </h4>
                <div className="flex gap-3">
                  {badges.map((b) => (
                    <div
                      key={b.label}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        border: '1px solid var(--lp-accent)',
                        background: 'rgba(245,118,43,0.05)',
                      }}
                      title={b.label}
                    >
                      <b.icon size={16} style={{ color: 'var(--lp-accent)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
