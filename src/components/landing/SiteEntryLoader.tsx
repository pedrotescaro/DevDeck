'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './SiteEntryLoader.module.css';

const PROGRESS_DELAY_MS = 320;
const PROGRESS_DURATION_MS = 1760;
const COMPLETION_HOLD_MS = 120;
const EXIT_DURATION_MS = 620;

declare global {
  interface Window {
    __devDeckEntryLoaderStartedAt?: number;
  }
}

interface SiteEntryLoaderProps {
  onComplete?: () => void;
  forceMotion?: boolean;
}

interface LoaderFrame {
  progress: number;
  phase: number;
}

function createWavePath(progress: number, phase: number) {
  const surface = 214 - (progress / 100) * 228;
  const amplitude = progress > 0 && progress < 100 ? 9 : 0;
  const point = (offset: number) => surface + Math.sin(phase + offset) * amplitude;

  return [
    `M -80 ${point(0).toFixed(2)}`,
    `C 20 ${point(0.7).toFixed(2)}, 90 ${point(1.5).toFixed(2)}, 190 ${point(2.2).toFixed(2)}`,
    `S 370 ${point(3.1).toFixed(2)}, 480 ${point(3.8).toFixed(2)}`,
    `S 670 ${point(4.8).toFixed(2)}, 780 ${point(5.6).toFixed(2)}`,
    `S 980 ${point(6.5).toFixed(2)}, 1080 ${point(7.3).toFixed(2)}`,
    'L 1080 240 L -80 240 Z',
  ].join(' ');
}

export default function SiteEntryLoader({ onComplete, forceMotion = false }: SiteEntryLoaderProps) {
  const [frame, setFrame] = useState<LoaderFrame>({ progress: 0, phase: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const completionScheduledRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const clipId = useId().replace(/:/g, '');

  onCompleteRef.current = onComplete;

  useEffect(() => {
    const prefersReducedMotion =
      !forceMotion && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
    const requestFrame =
      window.requestAnimationFrame?.bind(window) ??
      ((callback: FrameRequestCallback) =>
        window.setTimeout(() => callback(performance.now()), 16) as unknown as number);
    const cancelFrame =
      window.cancelAnimationFrame?.bind(window) ??
      ((frameId: number) => window.clearTimeout(frameId));

    window.__devDeckEntryLoaderStartedAt ??= performance.now();
    const startedAt = window.__devDeckEntryLoaderStartedAt;
    let animationFrame = 0;
    let exitTimer = 0;
    let completionTimer = 0;

    const scheduleCompletion = () => {
      if (!onCompleteRef.current || completionScheduledRef.current) return;

      completionScheduledRef.current = true;
      exitTimer = window.setTimeout(
        () => setIsExiting(true),
        prefersReducedMotion ? 0 : COMPLETION_HOLD_MS
      );
      completionTimer = window.setTimeout(
        () => {
          window.__devDeckEntryLoaderStartedAt = undefined;
          onCompleteRef.current?.();
        },
        prefersReducedMotion ? 80 : COMPLETION_HOLD_MS + EXIT_DURATION_MS
      );
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const rawProgress = prefersReducedMotion
        ? 100
        : ((elapsed - PROGRESS_DELAY_MS) / PROGRESS_DURATION_MS) * 100;
      const progress = Math.min(100, Math.max(0, rawProgress));

      setFrame({
        progress,
        phase: elapsed * 0.0046,
      });

      if (progress >= 100) {
        scheduleCompletion();
        return;
      }

      animationFrame = requestFrame(tick);
    };

    animationFrame = requestFrame(tick);

    return () => {
      cancelFrame(animationFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completionTimer);
    };
  }, [forceMotion]);

  const roundedProgress = Math.round(frame.progress);
  const wavePath = useMemo(
    () => createWavePath(frame.progress, frame.phase),
    [frame.phase, frame.progress]
  );

  return (
    <div
      className={`${styles.loader} ${isExiting ? styles.exiting : ''}`}
      data-force-motion={forceMotion ? 'true' : undefined}
      data-testid="site-entry-loader"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className={styles.srOnly}>Loading DevDeck: {roundedProgress}%</span>

      <div className={styles.wordmark} aria-hidden="true">
        <svg
          className={styles.wordmarkSvg}
          viewBox="0 0 1000 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={wavePath} />
            </clipPath>
          </defs>

          <text
            className={styles.wordBase}
            x="500"
            y="106"
            textAnchor="middle"
            dominantBaseline="middle"
            textLength="940"
            lengthAdjust="spacingAndGlyphs"
          >
            DevDeck
          </text>
          <text
            className={styles.wordFill}
            x="500"
            y="106"
            textAnchor="middle"
            dominantBaseline="middle"
            textLength="940"
            lengthAdjust="spacingAndGlyphs"
            clipPath={`url(#${clipId})`}
          >
            DevDeck
          </text>
        </svg>

        <div className={styles.counter}>
          loading... <span>{roundedProgress}</span>%
        </div>
      </div>
    </div>
  );
}
