'use client';

import { useEffect } from 'react';
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

interface HomeClientProps {
  initialUser: any;
}

export default function HomeClient({ initialUser }: HomeClientProps) {
  useEffect(() => {
    document.documentElement.classList.add('lp-landing-page');
    return () => {
      document.documentElement.classList.remove('lp-landing-page');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0D0B] text-[#F4F1EB] antialiased selection:bg-[var(--lp-accent)]/30 selection:text-white">
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
