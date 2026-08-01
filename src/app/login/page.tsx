'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OAUTH_PROVIDER_LABELS, type OAuthProvider } from '@/lib/supabase/oauth';
import { Eye, EyeOff } from 'lucide-react';
import { DiscordIcon, GitHubIcon, GoogleIcon } from '@/components/auth/OAuthProviderIcons';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('lp-landing-page');

    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const queryError = queryParams.get('error');
      if (queryError) {
        setError(queryError);
      } else if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error_description') || hashParams.get('error');
        if (hashError) {
          setError(decodeURIComponent(hashError.replace(/\+/g, ' ')));
        }
      }
    }

    return () => {
      document.documentElement.classList.remove('lp-landing-page');
    };
  }, []);

  const checkSupabaseConfig = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      setError(
        'Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no painel do Vercel para autenticação.'
      );
      return false;
    }
    return true;
  };

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setError(null);
    if (!checkSupabaseConfig()) return;

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      console.error(err);
      setError(`Erro ao autenticar com o ${OAUTH_PROVIDER_LABELS[provider]}. Tente novamente.`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkSupabaseConfig()) return;

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(
          loginError.message === 'Invalid login credentials'
            ? 'E-mail ou senha inválidos.'
            : loginError.message
        );
        setLoading(false);
        return;
      }

      router.push('/feed');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao tentar entrar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-svh bg-[#111] font-sans text-white antialiased">
      <div className="grid min-h-svh w-full lg:grid-cols-[53%_47%]">
        <aside
          className={[
            styles.hero,
            'relative m-3 mr-0 hidden min-h-[calc(100svh-24px)] overflow-hidden rounded-xl lg:flex lg:items-center lg:justify-center',
          ].join(' ')}
        >
          <div className="relative z-10 flex w-full -translate-y-[1.5%] flex-col items-center px-10 text-center">
            <Link href="/" className="inline-flex items-center gap-5">
              <Image
                src="/logo.svg"
                alt="Logo da DevDeck"
                width={62}
                height={62}
                className={[styles.brandLogo, 'h-[62px] w-[62px] object-contain'].join(' ')}
              />
              <span
                className={[
                  styles.brandText,
                  'text-[43px] font-bold tracking-[-0.055em] text-white',
                ].join(' ')}
              >
                DevDeck
              </span>
            </Link>

            <h1
              className={[
                styles.brandText,
                'mt-8 max-w-[560px] text-[32px] font-semibold leading-[1.14] tracking-[-0.045em] text-white xl:text-[36px]',
              ].join(' ')}
            >
              Unlock the best of DevDeck. Access to the future community.
            </h1>
            <p
              className={[
                styles.brandText,
                'mt-7 text-[17px] font-medium tracking-[-0.025em] text-white/85',
              ].join(' ')}
            >
              Developers creating amazing experiences.
            </p>
          </div>
        </aside>

        <section
          className={[
            styles.formPanel,
            'flex min-h-svh items-start justify-center px-8 py-10 sm:px-12 lg:py-[11vh] lg:px-[clamp(3rem,5.4vw,4rem)]',
          ].join(' ')}
        >
          <div className="w-full max-w-[466px]">
            <Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
              <Image
                src="/logo.svg"
                alt="Logo da DevDeck"
                width={38}
                height={38}
                className={[styles.brandLogo, 'h-[38px] w-[38px] object-contain'].join(' ')}
              />
              <span
                className={[styles.brandText, 'text-2xl font-bold tracking-[-0.04em]'].join(' ')}
              >
                DevDeck
              </span>
            </Link>

            <header className="text-center">
              <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.045em] text-white">
                Entre na sua conta
              </h2>
              <p className="mt-3 text-[15px] text-[#9cb6df]">Continue sua jornada na comunidade</p>
            </header>

            {error && (
              <div
                role="alert"
                className="mt-7 rounded-lg border border-rose-400/25 bg-rose-400/[0.08] px-4 py-3 text-sm leading-5 text-rose-200"
              >
                {error}
              </div>
            )}

            <div className="mt-12 grid grid-cols-3 gap-2.5">
              <button
                type="button"
                aria-label="Entrar com Google"
                onClick={() => handleOAuthLogin('google')}
                className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-1.5 text-[9px] font-medium whitespace-nowrap sm:gap-2 sm:px-2 sm:text-[10px] text-white/85 transition-colors hover:border-[#4285F4]/45 hover:bg-[#202020] cursor-pointer"
              >
                <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
                <span>Entrar com Google</span>
              </button>

              <button
                type="button"
                aria-label="Entrar com GitHub"
                onClick={() => handleOAuthLogin('github')}
                className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-1.5 text-[9px] font-medium whitespace-nowrap sm:gap-2 sm:px-2 sm:text-[10px] text-white/85 transition-colors hover:border-white/20 hover:bg-[#202020] cursor-pointer"
              >
                <GitHubIcon className="h-3.5 w-3.5 shrink-0" />
                <span>Entrar com GitHub</span>
              </button>

              <button
                type="button"
                aria-label="Entrar com Discord"
                onClick={() => handleOAuthLogin('discord')}
                className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-1.5 text-[9px] font-medium whitespace-nowrap sm:gap-2 sm:px-2 sm:text-[10px] text-white/85 transition-colors hover:border-[#5865F2]/45 hover:bg-[#202020] cursor-pointer"
              >
                <DiscordIcon className="h-3.5 w-4 shrink-0 text-[#5865F2]" />
                <span>Entrar com Discord</span>
              </button>
            </div>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#111] px-4 text-[11px] font-medium uppercase tracking-[-0.025em] text-[#8ea1bf]">
                  ou continue com e-mail
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-white" htmlFor="email">
                  Endereço de e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="h-[49px] w-full rounded-md border border-white/[0.06] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#9db0cf] hover:border-white/10 focus:border-[#469cff]"
                  placeholder="voce@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-white" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-[49px] w-full rounded-md border border-white/[0.06] bg-[#1a1a1a] px-4 pr-12 text-sm text-white outline-none transition-colors placeholder:text-[#9db0cf] hover:border-white/10 focus:border-[#469cff]"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-[#8c94a4] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-[49px] w-full items-center justify-center rounded-md bg-[#f1f1f3] text-sm font-semibold text-black transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-[#a7b8d5]">
              Ainda não tem uma conta?{' '}
              <Link href="/register" className="font-semibold text-white hover:underline">
                Crie sua conta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
