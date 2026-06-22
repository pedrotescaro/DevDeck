'use client';

import { useEffect, useState } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingMarquee from '@/components/landing/LandingMarquee';
import LandingStatsBand from '@/components/landing/LandingStatsBand';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingPlatformPreview from '@/components/landing/LandingPlatformPreview';
import LandingTrails from '@/components/landing/LandingTrails';
import LandingGamification from '@/components/landing/LandingGamification';
import LandingDuels from '@/components/landing/LandingDuels';
import LandingProfiles from '@/components/landing/LandingProfiles';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';
import BraceLoader from '@/components/BraceLoader';

interface HomeClientProps {
  initialUser: any;
}

export default function HomeClient({ initialUser }: HomeClientProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [renderLoader, setRenderLoader] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('lp-landing-page');

    // Wait 2.5s for loading, then fade out
    const fadeTimer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);

    // Wait 3.0s to completely unmount
    const removeTimer = setTimeout(() => {
      setRenderLoader(false);
    }, 3000);

    return () => {
      document.documentElement.classList.remove('lp-landing-page');
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--lp-bg)] text-[var(--lp-fg)] antialiased selection:bg-[var(--lp-accent)]/30 selection:text-white">
      {/* 3D Stack Loader */}
      {renderLoader && (
        <div className={`loader-container ${!showLoader ? 'fade-out' : ''}`}>
          <BraceLoader color="#FF5C00" background="transparent" />
        </div>
      )}

      {/* Background grain texture */}
      <div className="lp-grain" />

      {/* Navigation */}
      <LandingNav initialUser={initialUser} />

      {/* Hero Section */}
      <LandingHero initialUser={initialUser} />

      {/* Marquee Banner */}
      <LandingMarquee />

      {/* Stats Counters */}
      <LandingStatsBand />

      <main className="relative z-10">
        {/* How It Works */}
        <LandingHowItWorks />

        {/* Platform Mockup Preview */}
        <LandingPlatformPreview />

        {/* Learning Trails */}
        <LandingTrails />

        {/* Gamification Systems (Quizzes, Streaks) */}
        <LandingGamification />

        {/* Coding Duels */}
        <LandingDuels />

        {/* Profile Card & Stats Showcase */}
        <LandingProfiles />

        {/* Final CTA Terminal */}
        <LandingCTA initialUser={initialUser} />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
