'use client';

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer
      className="border-t py-12 text-xs text-[var(--lp-muted)] bg-[#0E0D0B]"
      style={{ borderColor: 'var(--lp-border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 border flex items-center justify-center relative"
            style={{ borderColor: 'var(--lp-muted)', borderRadius: '4px' }}
          >
            <span
              className="lp-font-mono font-bold text-[9px]"
              style={{ color: 'var(--lp-accent)' }}
            >
              {`{}`}
            </span>
          </div>
          <span className="lp-font-heading font-semibold text-sm tracking-wider uppercase text-[var(--lp-fg-dim)]">
            DevDeck
          </span>
        </div>

        <p className="lp-font-mono text-[11px] text-center sm:text-left">
          © {new Date().getFullYear()} DevDeck. Criado para engenheiros de software competitivos.
        </p>

        <div className="flex gap-6 font-semibold lp-font-heading">
          <a href="https://github.com" className="hover:text-[var(--lp-fg)] transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-[var(--lp-fg)] transition-colors">
            Termos
          </a>
          <a href="#" className="hover:text-[var(--lp-fg)] transition-colors">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
