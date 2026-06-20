'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const pills = ['Todas', 'TypeScript', 'Rust', 'Python', 'Go'];

export default function LandingTrails() {
  const [active, setActive] = useState('Todas');

  return (
    <section className="relative py-28 lg:py-36" id="trails">
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
              <span>03 — Trilhas</span>
            </div>
            <h2
              className="lp-font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] uppercase"
              style={{ color: 'var(--lp-fg)' }}
            >
              Cada linguagem é uma
              <br />
              <span className="lp-text-stroke">sequência de</span>{' '}
              <span style={{ color: 'var(--lp-accent)' }}>fases.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--lp-fg-dim)' }}>
              As fases são desbloqueadas em sequência. Cada fase termina com um quiz gerado a partir
              de posts reais da comunidade.{' '}
              <span style={{ color: 'var(--lp-fg)' }}>Não pule nada. Conquiste cada nível.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {pills.map((p) => (
                <button
                  key={p}
                  onClick={() => setActive(p)}
                  className={`lp-goal-pill ${active === p ? 'active' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trail Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        >
          {[
            {
              phase: 'FASE 1',
              title: 'Sintaxe Básica',
              desc: 'Variáveis, tipos primitivos, operadores, controle de fluxo. O ponto de partida obrigatório.',
              duration: '2-3 H',
              quiz: '12 Q',
              xp: '+180',
              level: 'INICIANTE',
              status: 'COMPLETO ✓',
              locked: false,
              progress: false,
            },
            {
              phase: 'FASE 2',
              title: 'Estruturas de Controle',
              desc: 'Condicionais, loops, pattern matching. Como decidir e repetir com intenção.',
              duration: '3-4 H',
              quiz: '18 Q',
              xp: '+240',
              level: 'INICIANTE+',
              status: 'EM PROGRESSO · 64%',
              locked: false,
              progress: true,
            },
            {
              phase: 'FASE 3',
              title: 'Funções e Closures',
              desc: 'Escopo, parâmetros, retorno, closures, funções de alta ordem. Onde a linguagem começa a pensar.',
              duration: '4-5 H',
              quiz: '24 Q',
              xp: '+320',
              level: 'INTERMEDIÁRIO',
              status: 'BLOQUEADO',
              locked: true,
              progress: false,
            },
          ].map((trail) => (
            <motion.article
              key={trail.phase}
              className="lp-trail-module lp-notch-corner"
              style={{ opacity: trail.locked ? 0.6 : 1 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: trail.locked ? 0.6 : 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-md mb-3.5 text-lg relative z-10"
                style={
                  trail.locked
                    ? {
                        backgroundColor: 'var(--lp-bg-card)',
                        color: 'var(--lp-muted)',
                        border: '1px solid var(--lp-border-light)',
                      }
                    : { backgroundColor: 'var(--lp-accent)', color: '#1A0F04' }
                }
              >
                {trail.locked ? <Lock size={18} /> : <BookOpen size={18} />}
              </div>
              <div
                className="lp-font-mono text-[10px] tracking-[0.2em] uppercase mb-2 relative z-10"
                style={{ color: trail.locked ? 'var(--lp-muted)' : 'var(--lp-accent)' }}
              >
                {trail.phase}
              </div>
              <h3
                className="lp-font-display text-3xl mb-3 relative z-10"
                style={{ color: 'var(--lp-fg)' }}
              >
                {trail.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-5 relative z-10"
                style={{ color: 'var(--lp-fg-dim)' }}
              >
                {trail.desc}
              </p>
              <div
                className="grid grid-cols-2 gap-3 mb-5 pb-5 relative z-10"
                style={{ borderBottom: '1px solid var(--lp-border-light)' }}
              >
                {[
                  { label: 'Duração', value: trail.duration },
                  { label: 'Quiz', value: trail.quiz },
                  { label: 'XP', value: trail.xp, accent: true },
                  { label: 'Nível', value: trail.level },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="lp-font-mono text-[9px] tracking-[0.15em] uppercase"
                      style={{ color: 'var(--lp-muted)' }}
                    >
                      {stat.label}
                    </div>
                    <div
                      className="lp-font-heading text-sm"
                      style={{ color: stat.accent ? 'var(--lp-accent)' : 'var(--lp-fg)' }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between relative z-10">
                <span
                  className="lp-font-mono text-[10px] tracking-[0.15em]"
                  style={{ color: trail.locked ? 'var(--lp-muted)' : 'var(--lp-accent)' }}
                >
                  {trail.status}
                </span>
                {trail.locked ? (
                  <Lock size={12} style={{ color: 'var(--lp-muted)' }} />
                ) : (
                  <ArrowRight size={12} style={{ color: 'var(--lp-accent)' }} />
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Next Activity Banner */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="flex flex-col lg:flex-row lg:items-center gap-6 p-6 lg:p-8"
            style={{
              border: '1px solid rgba(245,118,43,0.3)',
              background: 'linear-gradient(to right, rgba(245,118,43,0.05), transparent)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{ backgroundColor: 'var(--lp-accent)', borderRadius: '8px' }}
              >
                <Zap size={20} className="text-black" />
              </div>
              <div>
                <div
                  className="lp-font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--lp-accent)' }}
                >
                  PRÓXIMA ATIVIDADE RECOMENDADA
                </div>
                <h4 className="lp-font-display text-2xl mt-1" style={{ color: 'var(--lp-fg)' }}>
                  Fase 4: Funções e Closures
                </h4>
              </div>
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--lp-fg-dim)' }}>
              Você completou 3 fases nas últimas 2 semanas. Esta fase foi desbloqueada por 1,847
              desenvolvedores nesta semana. Dificuldade estimada:{' '}
              <span style={{ color: 'var(--lp-fg)' }}>intermediária</span>.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3 lp-font-heading text-xs tracking-[0.15em] uppercase text-black whitespace-nowrap transition-colors"
              style={{ backgroundColor: 'var(--lp-accent)' }}
            >
              <span>Continuar</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
