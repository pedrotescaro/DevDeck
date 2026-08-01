'use client';

import type { CSSProperties, HTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: {
    container: 'size-20',
    title: 'text-sm leading-tight font-medium',
    subtitle: 'text-xs leading-relaxed',
    spacing: 'space-y-2',
    maxWidth: 'max-w-48',
  },
  md: {
    container: 'size-32',
    title: 'text-base leading-snug font-medium',
    subtitle: 'text-sm leading-relaxed',
    spacing: 'space-y-3',
    maxWidth: 'max-w-60',
  },
  lg: {
    container: 'size-40',
    title: 'text-lg leading-tight font-semibold',
    subtitle: 'text-base leading-relaxed',
    spacing: 'space-y-4',
    maxWidth: 'max-w-72',
  },
} as const;

const ringMask = (inner: number, start: number, end: number, outer: number) =>
  `radial-gradient(circle at 50% 50%, transparent ${inner}%, black ${start}%, black ${end}%, transparent ${outer}%)`;

export default function Loader({
  title = 'Preparando sua experiência...',
  subtitle = 'Aguarde enquanto deixamos tudo pronto para você',
  size = 'md',
  className,
  ...props
}: LoaderProps) {
  const reduceMotion = useReducedMotion();
  const config = sizeConfig[size];

  const ringStyle = (background: string, mask: string, opacity: number): CSSProperties => ({
    background,
    mask,
    WebkitMask: mask,
    opacity,
  });

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-8 p-8 text-white', className)}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { scale: [1, 1.025, 1] }}
        className={cn('relative text-[#4da3ff]', config.container)}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: [0.4, 0, 0.6, 1] }}
      >
        <div className="absolute inset-[22%] rounded-full bg-[#0083fe]/10 blur-xl" />

        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, 360] }}
          className="absolute inset-0 rounded-full"
          style={ringStyle(
            'conic-gradient(from 0deg, transparent 0deg, #ffffff 90deg, rgba(255,255,255,0.08) 180deg, transparent 270deg)',
            ringMask(35, 37, 39, 41),
            0.72
          )}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        />

        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, 360] }}
          className="absolute inset-0 rounded-full"
          style={ringStyle(
            'conic-gradient(from 0deg, transparent 0deg, #0083fe 120deg, rgba(91,163,245,0.55) 240deg, transparent 360deg)',
            ringMask(42, 44, 48, 50),
            0.95
          )}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        />

        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, -360] }}
          className="absolute inset-0 rounded-full"
          style={ringStyle(
            'conic-gradient(from 180deg, transparent 0deg, rgba(255,255,255,0.7) 45deg, transparent 90deg)',
            ringMask(52, 54, 56, 58),
            0.4
          )}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        />

        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, 360] }}
          className="absolute inset-0 rounded-full"
          style={ringStyle(
            'conic-gradient(from 270deg, transparent 0deg, rgba(0,131,254,0.8) 20deg, transparent 40deg)',
            ringMask(61, 62, 63, 64),
            0.65
          )}
          transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        />

        <div className="absolute inset-[42%] rounded-full bg-[#65b2ff] shadow-[0_0_22px_rgba(0,131,254,0.58)]" />
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn('text-center', config.spacing, config.maxWidth)}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.h1
          animate={reduceMotion ? undefined : { opacity: [0.95, 0.72, 0.95] }}
          className={cn(
            config.title,
            'tracking-[-0.02em] text-white/95 antialiased [text-shadow:0_2px_12px_rgba(0,0,0,0.25)]'
          )}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          animate={reduceMotion ? undefined : { opacity: [0.62, 0.42, 0.62] }}
          className={cn(
            config.subtitle,
            'font-normal tracking-[-0.01em] text-[#a9bddb] antialiased'
          )}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
}
