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
    <div className="flex flex-col min-h-screen bg-[#0E0D0B] text-[#F4F1EB] antialiased selection:bg-[var(--lp-accent)]/30 selection:text-white">
      {/* 3D Stack Loader */}
      {renderLoader && (
        <div className={`loader-container ${!showLoader ? 'fade-out' : ''}`}>
          <div className="loader">
            <div className="box box-1">
              <div className="side-left" />
              <div className="side-right" />
              <div className="side-top">
                <div className="brace">
                  <svg viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,2 C5,2 5,5.5 5,7.5 C5,9.5 5,9.5 2,10 C5,10.5 5,10.5 5,12.5 C5,14.5 5,18 9,18" />
                    <path d="M15,2 C19,2 19,5.5 19,7.5 C19,9.5 19,9.5 22,10 C19,10.5 19,10.5 19,12.5 C19,14.5 19,18 15,18" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="box box-2">
              <div className="side-left" />
              <div className="side-right" />
              <div className="side-top">
                <div className="brace">
                  <svg viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,2 C5,2 5,5.5 5,7.5 C5,9.5 5,9.5 2,10 C5,10.5 5,10.5 5,12.5 C5,14.5 5,18 9,18" />
                    <path d="M15,2 C19,2 19,5.5 19,7.5 C19,9.5 19,9.5 22,10 C19,10.5 19,10.5 19,12.5 C19,14.5 19,18 15,18" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="box box-3">
              <div className="side-left" />
              <div className="side-right" />
              <div className="side-top">
                <div className="brace">
                  <svg viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,2 C5,2 5,5.5 5,7.5 C5,9.5 5,9.5 2,10 C5,10.5 5,10.5 5,12.5 C5,14.5 5,18 9,18" />
                    <path d="M15,2 C19,2 19,5.5 19,7.5 C19,9.5 19,9.5 22,10 C19,10.5 19,10.5 19,12.5 C19,14.5 19,18 15,18" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="box box-4">
              <div className="side-left" />
              <div className="side-right" />
              <div className="side-top">
                <div className="brace">
                  <svg viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,2 C5,2 5,5.5 5,7.5 C5,9.5 5,9.5 2,10 C5,10.5 5,10.5 5,12.5 C5,14.5 5,18 9,18" />
                    <path d="M15,2 C19,2 19,5.5 19,7.5 C19,9.5 19,9.5 22,10 C19,10.5 19,10.5 19,12.5 C19,14.5 19,18 15,18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
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
