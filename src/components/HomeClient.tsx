'use client';

import { useEffect } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingShowcase from '@/components/landing/LandingShowcase';
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
    <div className="flex flex-col min-h-screen bg-[var(--lp-bg)] text-[var(--lp-fg)] antialiased selection:bg-[var(--lp-accent)]/30 selection:text-white">
      {/* Background grain texture */}
      <div className="lp-grain" />

      {/* Navigation */}
      <LandingNav initialUser={initialUser} />

      {/* Hero Section */}
      <LandingHero initialUser={initialUser} />

      {/* Redesigned product experience */}
      <main className="relative z-10">
        <LandingShowcase initialUser={initialUser} />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
