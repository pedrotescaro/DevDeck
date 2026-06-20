'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

const lineReveal = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
} as const;

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1800&q=80',
];

interface LandingHeroProps {
  initialUser: any;
}

export default function LandingHero({ initialUser }: LandingHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden pt-32 pb-20 bg-[#0E0D0B]"
      id="hero"
    >
      {/* Background Slideshow Frames */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((src, i) => (
          <div key={src} className={`lp-reel-frame ${i === activeIndex ? 'active' : ''}`}>
            <img src={src} alt={`Fundo de programação ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* Dark overlay & glows */}
      <div className="lp-hero-overlay z-10" />

      {/* Background decorative code */}
      <div
        className="absolute inset-0 lp-font-mono text-[12px] leading-[1.7] whitespace-pre-wrap p-10 pointer-events-none select-none overflow-hidden z-20"
        style={{ color: 'var(--lp-fg)', opacity: 0.03 }}
      >
        {`// devdeck/engine/quiz_builder.rs
fn build_quiz_from_post(post: &Post) -> Quiz {
    let concepts = extract_concepts(post.body());
    let blockers = analyze_stack_traces(post.code_blocks());
    let distractors = mine_common_mistakes(concepts, post.tags());
    Quiz::new()
        .prompt(synthesize_question(concepts))
        .correct_answer(pick_best(concepts))
        .distractors(sample(distractors, 3))
        .difficulty(estimate(post.upvotes()))
        .build()
}
// the more you post, the harder the quizzes become
// for everyone who reads you.
// devdeck/engine/xp.rs
fn credit_xp(user: &User, action: Action) -> Result<XP, Error> {
    let base = action.base_xp();
    let streak_mult = user.streak().multiplier();
    let quality = community.vote_quality(action.post_id());
    let total = (base * streak_mult * quality).round();
    user.credit(total)?;
    user.track(action.language()).progress(total);
    Ok(total)
}`}
      </div>

      <div className="relative z-30 max-w-[1600px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center min-h-[80vh]">
        {/* Left Column */}
        <motion.div
          className="lg:col-span-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="lp-section-marker mb-6">
            <span>V2.4 · BETA PÚBLICO</span>
          </div>

          <h1 className="lp-font-display text-[11vw] md:text-[8vw] lg:text-[5.2vw] leading-[0.88] mb-8 uppercase text-[var(--lp-fg)]">
            <span className="overflow-hidden block">
              <motion.span variants={lineReveal} className="inline-block">
                Stack Overflow
              </motion.span>
            </span>
            <span className="overflow-hidden block">
              <motion.span
                variants={lineReveal}
                className="inline-block lp-text-stroke"
              >{`não lembra de você.`}</motion.span>
            </span>
            <span className="overflow-hidden block">
              <motion.span
                variants={lineReveal}
                className="inline-block"
              >{`O GitHub não sabe`}</motion.span>
            </span>
            <span className="overflow-hidden block">
              <motion.span variants={lineReveal} className="inline-block">
                o que você <span style={{ color: 'var(--lp-accent)' }}>aprendeu.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="max-w-xl text-base md:text-lg leading-relaxed mb-8"
            style={{ color: 'var(--lp-fg-dim)' }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } },
            }}
          >
            Poste um problema real. Ganhe XP quando a comunidade votar na sua resposta. Uma IA gera
            um quiz da sua própria discussão — outra pessoa evolui com o seu trabalho.{' '}
            <span style={{ color: 'var(--lp-fg)' }}>
              Trilhas de linguagem se preenchem. Ofensivas se acumulam. Duelos são disputados.
            </span>{' '}
            Seu perfil deixa de ser um currículo e passa a ser prova real de habilidade.
          </motion.p>

          {/* Circular avatar social proof stack */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35 } },
            }}
          >
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80',
              ].map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt={`Dev ${i + 1}`}
                  className="w-9 h-9 rounded-full border-2 border-[#0E0D0B] object-cover"
                  whileHover={{ y: -4, zIndex: 10 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-[#0E0D0B] bg-[var(--lp-accent)] flex items-center justify-center lp-font-mono font-bold text-[9px] text-[#0E0D0B]">
                +1.8k
              </div>
            </div>
            <div className="flex flex-col">
              <span className="lp-font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--lp-muted)] leading-none mb-1">
                MEMBROS ATIVOS
              </span>
              <span className="lp-font-heading font-semibold text-xs text-[var(--lp-fg)] leading-none">
                1.840+ programadores na arena
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3 mb-12"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.45 } },
            }}
          >
            <Link
              href={initialUser ? '/feed' : '/register'}
              className="lp-pulse-btn inline-flex items-center gap-3 px-7 py-4 lp-font-heading text-sm tracking-[0.15em] uppercase text-black transition-colors"
              style={{ backgroundColor: 'var(--lp-accent)' }}
            >
              <span>{initialUser ? 'Ir para o Feed' : 'Entrar na Arena'}</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href="#platform"
              className="inline-flex items-center gap-3 px-7 py-4 lp-font-heading text-sm tracking-[0.15em] uppercase transition-colors"
              style={{ border: '1px solid var(--lp-border-light)', color: 'var(--lp-fg)' }}
            >
              <span>Ver um post real</span>
            </a>
          </motion.div>

          {/* Bottom stats + reel progress split */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-[var(--lp-border)] max-w-xl">
            {/* Live stats */}
            <motion.div
              className="flex items-center gap-4 lp-font-mono text-[10px] tracking-[0.15em] uppercase flex-wrap"
              style={{ color: 'var(--lp-muted)' }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.7, delay: 0.5 } },
              }}
            >
              <span className="flex items-center gap-2" style={{ color: 'var(--lp-accent)' }}>
                <span
                  className="lp-pulse-dot w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--lp-accent)' }}
                />
                AO VIVO
              </span>
              <span>
                <span style={{ color: 'var(--lp-fg)' }} className="font-medium">
                  +1.247
                </span>{' '}
                posts
              </span>
              <span style={{ color: 'var(--lp-muted-2)' }}>/</span>
              <span>
                <span style={{ color: 'var(--lp-fg)' }} className="font-medium">
                  +612
                </span>{' '}
                devs subindo
              </span>
            </motion.div>

            {/* Reel progress & chapter */}
            <motion.div
              className="flex items-center gap-4 max-w-xs w-full sm:w-auto"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.7, delay: 0.5 } },
              }}
            >
              <span className="lp-font-mono text-[10px]" style={{ color: 'var(--lp-muted)' }}>
                {String(activeIndex + 1).padStart(2, '0')} / 05
              </span>
              <div className="lp-progress-bar flex-1 sm:flex-none">
                <motion.div
                  key={activeIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="lp-progress-bar-fill"
                />
              </div>
              <span className="lp-font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--lp-accent)] font-semibold whitespace-nowrap">
                REEL DA ARENA
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column — 3D Logo + Floating Cards */}
        <div className="lg:col-span-5 relative h-[560px] flex items-center justify-center">
          {/* Floating Post Card */}
          <div
            className="absolute top-8 right-0 w-[280px] overflow-hidden z-30"
            style={{
              backgroundColor: 'var(--lp-bg-card)',
              border: '1px solid var(--lp-border-light)',
              transform: 'perspective(1200px) rotateY(-8deg) rotateX(4deg) rotateZ(3deg)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
            }}
          >
            <div
              className="flex items-center gap-2.5 px-3 py-2.5"
              style={{ borderBottom: '1px solid var(--lp-border)', background: 'rgba(0,0,0,0.3)' }}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center lp-font-mono font-bold text-[11px]"
                style={{
                  background: 'linear-gradient(135deg, var(--lp-accent), #8B4318)',
                  color: '#1A0F04',
                }}
              >
                MO
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="lp-font-heading font-semibold text-[12px] leading-tight"
                  style={{ color: 'var(--lp-fg)' }}
                >
                  mira.okonkwo
                </div>
                <div className="lp-font-mono text-[10px]" style={{ color: 'var(--lp-muted)' }}>
                  4h atrás · Rust
                </div>
              </div>
              <div
                className="lp-font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color: 'var(--lp-accent)',
                  border: '1px solid rgba(245,118,43,0.3)',
                  background: 'rgba(245,118,43,0.1)',
                }}
              >
                L14
              </div>
            </div>
            <div className="p-3">
              <div
                className="lp-font-heading font-semibold text-[13px] leading-snug mb-2"
                style={{ color: 'var(--lp-fg)' }}
              >
                Por que <span style={{ color: 'var(--lp-blue)' }}>{'Option<&T>'}</span> não
                implementa Copy?
              </div>
              <div
                className="rounded p-2 lp-font-mono text-[10px] leading-relaxed mb-2 overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
              >
                <div>
                  <span className="lp-cm">{'// repro mínimo'}</span>
                </div>
                <div>
                  <span className="lp-kw">fn</span> <span className="lp-fn">main</span>() {'{'}
                </div>
                <div>
                  &nbsp;&nbsp;<span className="lp-kw">let</span> x:{' '}
                  <span className="lp-ty">Option</span>&lt;<span className="lp-kw">&amp;</span>
                  <span className="lp-ty">i32</span>&gt; = <span className="lp-ty">Some</span>(
                  <span className="lp-kw">&amp;</span>
                  <span className="lp-nm">5</span>);
                </div>
                <div>
                  &nbsp;&nbsp;<span className="lp-kw">let</span> y = x;{' '}
                  <span className="lp-cm">{'// moves'}</span>
                </div>
                <div>{'}'}</div>
              </div>
              <div className="flex gap-1.5 mb-2">
                <span
                  className="lp-font-mono text-[9px] px-1.5 py-0.5 rounded"
                  style={{ color: 'var(--lp-blue)', background: 'rgba(127,168,201,0.1)' }}
                >
                  rust
                </span>
                <span
                  className="lp-font-mono text-[9px] px-1.5 py-0.5 rounded"
                  style={{ color: 'var(--lp-blue)', background: 'rgba(127,168,201,0.1)' }}
                >
                  ownership
                </span>
              </div>
              <div
                className="flex items-center gap-3 pt-2 lp-font-mono text-[10px]"
                style={{ borderTop: '1px solid var(--lp-border)', color: 'var(--lp-muted)' }}
              >
                <span style={{ color: 'var(--lp-accent)' }} className="font-semibold">
                  ▲ 247
                </span>
                <span>32 res</span>
                <span className="ml-auto font-semibold" style={{ color: 'var(--lp-accent)' }}>
                  +45 XP
                </span>
              </div>
            </div>
          </div>

          {/* Floating XP Badge */}
          <div
            className="absolute top-4 left-0 lp-font-mono text-[11px] rounded-md px-3 py-2 backdrop-blur-sm z-30"
            style={{
              backgroundColor: 'rgba(26,24,21,0.95)',
              border: '1px solid var(--lp-border-light)',
              transform: 'rotate(-3deg)',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            }}
          >
            <span className="font-bold" style={{ color: 'var(--lp-accent)' }}>
              +45 XP
            </span>
            <span style={{ color: 'var(--lp-muted)' }}> · resposta aceita</span>
          </div>

          {/* Floating Level Badge */}
          <div
            className="absolute bottom-20 left-4 lp-font-mono text-[11px] rounded-md px-3 py-2 backdrop-blur-sm z-30"
            style={{
              backgroundColor: 'rgba(26,24,21,0.95)',
              border: '1px solid var(--lp-border-light)',
              transform: 'rotate(2deg)',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            }}
          >
            TypeScript{' '}
            <span className="font-semibold" style={{ color: 'var(--lp-blue)' }}>
              L18 → L19
            </span>
          </div>

          {/* 3D Logo */}
          <div className="lp-logo-stage relative z-20">
            <div className="lp-logo-stack">
              <div className="lp-logo-card c1" />
              <div className="lp-logo-card c2" />
              <div className="lp-logo-card c3" />
              <div className="lp-logo-card cfront">
                <div className="lp-braces">{'{ }'}</div>
              </div>
            </div>
            <div className="lp-logo-floor" />
          </div>
        </div>
      </div>
    </section>
  );
}
