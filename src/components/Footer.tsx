'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-dd-border bg-dd-bg mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DevDeck Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain hidden dark:block"
            />
            <Image
              src="/logo-light.png"
              alt="DevDeck Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain block dark:hidden"
            />
            <span className="text-dd-text font-bold text-sm">DevDeck</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 font-semibold">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dd-muted hover:text-dd-text text-xs transition-colors"
            >
              GitHub
            </Link>
            <Link href="#" className="text-dd-muted hover:text-dd-text text-xs transition-colors">
              Sobre
            </Link>
            <Link href="#" className="text-dd-muted hover:text-dd-text text-xs transition-colors">
              Termos
            </Link>
          </div>

          {/* Copyright */}
          <span className="text-dd-muted text-[11px]">
            © {new Date().getFullYear()} DevDeck. Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
