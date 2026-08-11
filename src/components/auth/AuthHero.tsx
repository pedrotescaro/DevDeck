'use client';

import Image from 'next/image';
import Link from 'next/link';
import FaultyTerminal from '@/components/landing/FaultyTerminal';
import styles from './AuthHero.module.css';

export default function AuthHero() {
  return (
    <aside
      className={`${styles.hero} relative m-3 mr-0 hidden min-h-[calc(100svh-24px)] overflow-hidden rounded-xl lg:flex lg:items-center lg:justify-center`}
      data-testid="auth-terminal-hero"
    >
      <FaultyTerminal
        aria-hidden="true"
        className={styles.terminal}
        data-testid="auth-terminal-effect"
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

      <div className={styles.overlay} aria-hidden="true" />

      <div className="relative z-10 flex w-full -translate-y-[1.5%] flex-col items-center px-10 text-center">
        <Link href="/" className="inline-flex items-center gap-5">
          <Image
            src="/logo.svg"
            alt="DevDeck logo"
            width={62}
            height={62}
            className={`${styles.brandLogo} h-[62px] w-[62px] object-contain`}
          />
          <span
            className={`${styles.brandText} text-[43px] font-bold tracking-[-0.055em] text-white`}
          >
            DevDeck
          </span>
        </Link>

        <h1
          className={`${styles.brandText} mt-8 max-w-[560px] text-[32px] font-semibold leading-[1.14] tracking-[-0.045em] text-white xl:text-[36px]`}
        >
          Unlock the best of DevDeck. Access to the future community.
        </h1>
        <p
          className={`${styles.brandText} mt-7 text-[17px] font-medium tracking-[-0.025em] text-white/85`}
        >
          Developers creating amazing experiences.
        </p>
      </div>
    </aside>
  );
}
