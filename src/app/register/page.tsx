'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OAUTH_PROVIDER_LABELS, type OAuthProvider } from '@/lib/supabase/oauth';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { DiscordIcon, GitHubIcon, GoogleIcon } from '@/components/auth/OAuthProviderIcons';
import Loader from '@/components/Loader';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('lp-landing-page');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Digite a mesma senha nos dois campos.');
      return;
    }

    if (!checkSupabaseConfig()) return;

    setLoading(true);

    try {
      // 1. Chamar nossa API customizada de cadastro
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao tentar cadastrar.');
        setLoading(false);
        return;
      }

      // 2. Realizar login automático no Supabase
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(
          'Conta criada com sucesso, mas ocorreu um erro ao entrar automaticamente. Faça login manualmente.'
        );
        setLoading(false);
        router.push('/login');
        return;
      }

      router.push('/feed');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro no servidor. Tente novamente.');
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
            'flex min-h-svh items-start justify-center px-8 py-8 sm:px-12 lg:py-[8vh] lg:px-[clamp(3rem,5.4vw,4rem)]',
          ].join(' ')}
        >
          <div className="w-full max-w-[466px]">
            <Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden">
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

            {loading ? (
              <Loader
                title="Criando sua conta..."
                subtitle="Estamos preparando seu perfil na DevDeck"
                size="md"
                className="min-h-[520px] px-0"
              />
            ) : (
              <>
                <header className="text-center">
                  <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.045em] text-white">
                    Crie sua conta
                  </h2>
                  <p className="mt-3 text-[15px] text-[#9cb6df]">Entre para a comunidade hoje</p>
                </header>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-lg border border-rose-400/25 bg-rose-400/[0.08] px-4 py-3 text-sm leading-5 text-rose-200"
                  >
                    {error}
                  </div>
                )}

                <div className="mt-8 grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    aria-label="Cadastrar com Google"
                    onClick={() => handleOAuthLogin('google')}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-1.5 text-[9px] font-medium whitespace-nowrap text-white/85 transition-colors hover:border-[#4285F4]/45 hover:bg-[#202020] sm:gap-2 sm:px-2 sm:text-[10px] cursor-pointer"
                  >
                    <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Cadastrar com GitHub"
                    onClick={() => handleOAuthLogin('github')}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-1.5 text-[9px] font-medium whitespace-nowrap text-white/85 transition-colors hover:border-white/20 hover:bg-[#202020] sm:gap-2 sm:px-2 sm:text-[10px] cursor-pointer"
                  >
                    <GitHubIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Cadastrar com Discord"
                    onClick={() => handleOAuthLogin('discord')}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-1.5 text-[9px] font-medium whitespace-nowrap text-white/85 transition-colors hover:border-[#5865F2]/45 hover:bg-[#202020] sm:gap-2 sm:px-2 sm:text-[10px] cursor-pointer"
                  >
                    <DiscordIcon className="h-3.5 w-4 shrink-0 text-[#5865F2]" />
                    <span>Discord</span>
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#111] px-4 text-[11px] font-medium uppercase tracking-[-0.025em] text-[#8ea1bf]">
                      ou continue com e-mail
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label
                      className="mb-2 block text-[13px] font-medium text-white"
                      htmlFor="username"
                    >
                      Nome de usuário
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      required
                      autoComplete="username"
                      className="h-[49px] w-full rounded-md border border-white/[0.06] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#9db0cf] hover:border-white/10 focus:border-[#469cff]"
                      placeholder="seu_usuario"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-[13px] font-medium text-white"
                      htmlFor="email"
                    >
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

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-2 block text-[13px] font-medium text-white"
                        htmlFor="password"
                      >
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                          className="h-[49px] w-full rounded-md border border-white/[0.06] bg-[#1a1a1a] px-4 pr-11 text-sm text-white outline-none transition-colors placeholder:text-[#9db0cf] hover:border-white/10 focus:border-[#469cff]"
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          aria-pressed={showPassword}
                          className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-[#8c94a4] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-[13px] font-medium text-white"
                        htmlFor="confirmPassword"
                      >
                        Confirmar senha
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                          className="h-[49px] w-full rounded-md border border-white/[0.06] bg-[#1a1a1a] px-4 pr-11 text-sm text-white outline-none transition-colors placeholder:text-[#9db0cf] hover:border-white/10 focus:border-[#469cff]"
                          placeholder="Repita a senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          aria-label={
                            showConfirmPassword ? 'Ocultar confirmação' : 'Mostrar confirmação'
                          }
                          aria-pressed={showConfirmPassword}
                          className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-[#8c94a4] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {confirmPassword && password === confirmPassword && (
                    <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <CheckCircle2 size={13} /> Senhas coincidem
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[49px] w-full items-center justify-center rounded-md bg-[#f1f1f3] text-sm font-semibold text-black transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-[#a7b8d5]">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="font-semibold text-white hover:underline">
                    Entrar
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
