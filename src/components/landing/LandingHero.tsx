'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import BraceLoader from '@/components/BraceLoader';

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

          <h1 className="lp-font-display text-[11vw] md:text-[8vw] lg:text-[5.2vw] leading-[1.15] mb-8 uppercase text-[var(--lp-fg)]">
            <span className="overflow-hidden block pt-3 pb-1 -mt-3">
              <motion.span variants={lineReveal} className="inline-block">
                Poste código.
              </motion.span>
            </span>
            <span className="overflow-hidden block pt-3 pb-1 -mt-3">
              <motion.span variants={lineReveal} className="inline-block lp-text-stroke">
                Ganhe XP.
              </motion.span>
            </span>
            <span className="overflow-hidden block pt-3 pb-1 -mt-3">
              <motion.span variants={lineReveal} className="inline-block">
                Suba de <span style={{ color: 'var(--lp-accent)' }}>nível.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="max-w-lg text-sm md:text-base leading-relaxed mb-8"
            style={{ color: 'var(--lp-fg-dim)' }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } },
            }}
          >
            Poste problemas reais, ganhe XP com a comunidade e resolva quizzes gerados por IA. Seu
            perfil deixa de ser apenas um currículo e se torna{' '}
            <span style={{ color: 'var(--lp-fg)' }}>prova real de suas habilidades</span>.
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

          {/* Bottom stats */}
          <div className="pt-6 border-t border-[var(--lp-border)] max-w-xl">
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
          </div>
        </motion.div>

        {/* Right Column — 3D Loader */}
        <div className="lg:col-span-5 relative h-[560px] flex items-center justify-center">
          <BraceLoader scale={3} color="#FF5C00" background="transparent" />
        </div>
      </div>

      {/* Reel progress & chapter - absolute bottom-right */}
      <div className="absolute bottom-8 right-6 lg:right-10 z-30 flex items-center gap-4">
        <span className="lp-font-mono text-[10px]" style={{ color: 'var(--lp-muted)' }}>
          {String(activeIndex + 1).padStart(2, '0')} / 05
        </span>
        <div className="lp-progress-bar w-[120px]">
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
      </div>
    </section>
  );
}
