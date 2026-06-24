'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { StreakBadge } from './StreakBadge';

interface NavbarUser {
  username: string;
  avatar_url?: string | null;
  streak?: number;
}

interface NavbarProps {
  user?: NavbarUser | null;
}

function UserAvatar({ user, size = 32 }: { user: NavbarUser; size?: number }) {
  const initials = user.username.slice(0, 2).toUpperCase();

  if (user.avatar_url) {
    return (
      <Image
        src={user.avatar_url}
        alt={user.username}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-semibold"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-dd-bg/95 backdrop-blur border-b border-dd-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="DevDeck Logo"
            width={20}
            height={20}
            className="object-contain hidden dark:block"
          />
          <Image
            src="/logo-light.png"
            alt="DevDeck Logo"
            width={20}
            height={20}
            className="object-contain block dark:hidden"
          />
          <span className="text-dd-text font-semibold text-lg tracking-tight">DevDeck</span>
        </Link>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/feed" className="text-dd-muted hover:text-dd-text text-sm transition-colors">
            Feed
          </Link>
          <Link
            href="/duels"
            className="text-dd-muted hover:text-dd-text text-sm transition-colors"
          >
            Duelos
          </Link>
          <Link
            href="/leaderboard"
            className="text-dd-muted hover:text-dd-text text-sm transition-colors"
          >
            Ranking
          </Link>

          {user ? (
            <div className="flex items-center gap-3 relative">
              {user.streak != null && user.streak > 0 && <StreakBadge streak={user.streak} />}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                >
                  <UserAvatar user={user} size={32} />
                  <span className="text-dd-text text-sm font-medium">{user.username}</span>
                  <svg
                    className={`w-4 h-4 text-dd-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-dd-border bg-dd-surface shadow-xl z-20 py-1 font-sans">
                      <Link
                        href={`/profile/${user.username}`}
                        className="block px-4 py-2 text-sm text-dd-text hover:bg-dd-card transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Meu Perfil
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-dd-text hover:bg-dd-card transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Configurações
                      </Link>
                      <hr className="border-dd-border my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dd-card hover:text-red-300 transition-colors cursor-pointer font-semibold"
                      >
                        Sair da Conta
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-dd-muted hover:text-dd-text text-sm px-3 py-1.5 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Registrar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-dd-muted hover:text-dd-text p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dd-border bg-dd-bg/98 backdrop-blur px-4 py-3 space-y-2">
          <Link
            href="/feed"
            className="block text-dd-muted hover:text-dd-text text-sm py-2"
            onClick={() => setMobileOpen(false)}
          >
            Feed
          </Link>
          <Link
            href="/duels"
            className="block text-dd-muted hover:text-dd-text text-sm py-2"
            onClick={() => setMobileOpen(false)}
          >
            Duelos
          </Link>
          <Link
            href="/leaderboard"
            className="block text-dd-muted hover:text-dd-text text-sm py-2"
            onClick={() => setMobileOpen(false)}
          >
            Ranking
          </Link>

          {user ? (
            <div className="pt-2 border-t border-dd-border flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {user.streak != null && user.streak > 0 && <StreakBadge streak={user.streak} />}
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserAvatar user={user} size={28} />
                  <span className="text-dd-text text-sm font-semibold">{user.username}</span>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <Link
                  href="/settings"
                  className="text-dd-muted hover:text-dd-text text-xs"
                  onClick={() => setMobileOpen(false)}
                >
                  Configurações
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-dd-border flex items-center gap-2">
              <Link
                href="/login"
                className="text-dd-muted text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Registrar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
