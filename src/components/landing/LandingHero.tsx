'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedAvatarGroup, { type AvatarData } from '@/components/smoothui/animated-avatar-group';
import FaultyTerminal from './FaultyTerminal';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

const lineReveal = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
} as const;

const HERO_AVATAR_URLS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80',
];

// Build the avatar data for AnimatedAvatarGroup.
// 5 visible with images + 1800 hidden (only counted for the "+N" indicator).
const heroAvatars: AvatarData[] = [
  ...HERO_AVATAR_URLS.map((src, i) => ({ src, alt: `Dev ${i + 1}` })),
  ...Array.from({ length: 1800 }, (_, i) => ({
    src: '',
    alt: `Dev ${i + 6}`,
  })),
];

interface LandingHeroProps {
  initialUser: any;
}

export default function LandingHero({ initialUser }: LandingHeroProps) {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[var(--lp-bg)] px-0 pb-20 pt-32 sm:pt-36"
      id="hero"
    >
      {/* Interactive terminal field */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <FaultyTerminal
          scale={1.45}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.78}
          scanlineIntensity={0.72}
          glitchAmount={0.95}
          flickerAmount={0.74}
          noiseAmp={0.86}
          chromaticAberration={0}
          dither={0}
          curvature={0.05}
          tint="#0083FE"
          mouseReact
          mouseStrength={0.95}
          pageLoadAnimation
          brightness={1.18}
        />
      </div>

      {/* Contrast layer and brand glows */}
      <div className="lp-hero-overlay z-10" />

      <div className="relative z-30 mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        {/* Centered hero content */}
        <motion.div
          className="lp-hero-content flex w-full max-w-5xl flex-col items-center text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <h1 className="mb-8 max-w-5xl px-1 font-sans text-[clamp(2.35rem,6vw,4.25rem)] font-semibold leading-[1.03] tracking-[-0.055em] text-white sm:px-0">
            <span className="overflow-hidden block pt-3 pb-1 -mt-3">
              <motion.span variants={lineReveal} className="inline-block">
                Unlock the best of DevDeck.
              </motion.span>
            </span>
            <span className="overflow-hidden block pt-3 pb-1 -mt-3">
              <motion.span variants={lineReveal} className="inline-block">
                Access to the future community.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mb-9 max-w-2xl px-2 font-sans text-[15px] font-medium leading-7 tracking-[-0.025em] text-white sm:px-0 md:text-[17px]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } },
            }}
          >
            Developers creating amazing experiences.
          </motion.p>

          {/* Circular avatar social proof stack */}
          <motion.div
            className="mb-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35 } },
            }}
          >
            <AnimatedAvatarGroup
              avatars={heroAvatars}
              maxVisible={5}
              size={36}
              overlap={0.35}
              expandOnHover
              className="[&_div.rounded-full.border-2]:!border-[var(--lp-bg)] [&>div:last-child]:!bg-[var(--lp-accent)] [&>div:last-child_span]:!text-[var(--lp-bg)] [&>div:last-child_span]:!font-bold"
            />
            <div className="flex flex-col items-center sm:items-start">
              <span className="lp-font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--lp-muted)] leading-none mb-1">
                ACTIVE MEMBERS
              </span>
              <span className="lp-font-heading font-semibold text-xs text-[var(--lp-fg)] leading-none">
                1,840+ developers in the arena
              </span>
            </div>
          </motion.div>

          <motion.div
            className="mb-10 flex flex-wrap justify-center gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.45 } },
            }}
          >
            <Link
              href={initialUser ? '/feed' : '/register'}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#04101f] transition-transform hover:-translate-y-0.5"
            >
              <span>{initialUser ? 'Go to Feed' : 'Enter the Arena'}</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="#platform"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors"
            >
              <span>View a real post</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
