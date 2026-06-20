'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: number;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  { value: 18420, label: 'Devs ativos na arena', color: 'var(--lp-fg)' },
  { value: 47200, label: 'Dúvidas resolvidas', color: 'var(--lp-accent)' },
  { value: 124800, label: 'Quizzes gerados por IA', color: 'var(--lp-fg)' },
  { value: 3120, label: 'Duelos de código lutados', color: 'var(--lp-fg)' },
];

function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

function AnimatedNumber({
  target,
  color,
  inView,
}: {
  target: number;
  color: string;
  inView: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1500;
    const startTime = performance.now();

    let rafId: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target]);

  return (
    <span className="lp-font-display text-6xl md:text-7xl" style={{ color }}>
      {formatNumber(current)}
    </span>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export default function LandingStatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="w-full py-16 md:py-20"
      style={{
        background: 'rgba(8, 7, 6, 0.5)',
        borderTop: '1px solid var(--lp-border)',
        borderBottom: '1px solid var(--lp-border)',
      }}
    >
      <motion.div
        ref={ref}
        className="mx-auto max-w-7xl px-6 grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} className="lp-stat-block" variants={itemVariants}>
            <AnimatedNumber target={stat.value} color={stat.color} inView={isInView} />
            <p
              className="lp-font-mono text-[11px] tracking-[0.2em] uppercase mt-2"
              style={{ color: 'var(--lp-muted)' }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
