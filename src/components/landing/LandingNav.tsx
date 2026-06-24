'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Como funciona', href: '#how' },
  { label: 'A Plataforma', href: '#platform' },
  { label: 'Trilhas', href: '#trails' },
  { label: 'Duelos', href: '#duels' },
  { label: 'Perfis', href: '#profiles' },
];

interface LandingNavProps {
  initialUser: any;
}

export default function LandingNav({ initialUser }: LandingNavProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: 'rgba(14, 13, 11, 0.8)',
        borderBottom: '1px solid var(--lp-border)',
      }}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="DevDeck Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span
            className="lp-font-heading font-semibold text-lg tracking-wide"
            style={{ color: 'var(--lp-fg)' }}
          >
            DevDeck
          </span>
        </Link>

        {/* ── Center links (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="lp-nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-5">
          {/* Online counter */}
          <div
            className="hidden sm:flex items-center gap-2 lp-font-mono text-[11px] tracking-[0.15em] uppercase"
            style={{ color: 'var(--lp-muted)' }}
          >
            <span
              className="lp-pulse-dot inline-block w-2 h-2 rounded-full"
              style={{ background: '#4ADE80' }}
            />
            <span>2.134 JOGADORES ONLINE</span>
          </div>

          {/* Auth links or CTA */}
          {initialUser ? (
            <Link
              href="/feed"
              className="lp-font-heading font-semibold text-sm px-5 py-2 rounded-md transition-colors"
              style={{
                background: 'var(--lp-accent)',
                color: '#0A0A0A',
              }}
            >
              Ir para o Feed
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="lp-font-heading font-semibold text-sm px-4 py-2 rounded-md transition-colors hover:text-white"
                style={{ color: 'var(--lp-fg-dim)' }}
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="lp-font-heading font-semibold text-sm px-5 py-2 rounded-md transition-colors"
                style={{
                  background: 'var(--lp-accent)',
                  color: '#0A0A0A',
                }}
              >
                Cadastrar-se
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
