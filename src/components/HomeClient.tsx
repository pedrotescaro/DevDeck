"use client";

import Link from "next/link";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { Sparkles, Terminal, Swords, Trophy, Award, MessageSquare, ArrowRight } from "lucide-react";

interface HomeClientProps {
  initialUser: any;
}

export default function HomeClient({ initialUser }: HomeClientProps) {
  // Best copywriting option hardcoded as requested
  const headline = "Cursos não geram XP. DevDeck gera.";
  const subHeadline =
    "Onde suas dúvidas reais de Next.js 16 e Supabase viram quizzes por IA e disputas de código em tempo real. Codifique, ajude a comunidade e acumule XP por tecnologia.";
  const primaryCta = "Entrar na Arena";

  return (
    <div className="flex flex-col min-h-screen bg-dd-bg text-dd-text antialiased selection:bg-dd-accent/35 selection:text-white">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 w-full border-b border-dd-border bg-dd-bg/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="DevDeck Logo"
              className="w-6 h-6 object-contain hidden dark:block"
            />
            <img
              src="/logo-light.png"
              alt="DevDeck Logo"
              className="w-6 h-6 object-contain block dark:hidden"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-dd-text">DevDeck</span>
          </div>
          <nav className="flex items-center gap-4">
            {initialUser ? (
              <Link
                href="/feed"
                className="rounded-lg bg-dd-accent px-4 h-9 flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:opacity-90 shadow-md shadow-dd-accent/10 active:scale-[0.98]"
              >
                Ir para o Feed
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-dd-border bg-dd-surface hover:bg-dd-surface hover:text-dd-text px-4 h-9 flex items-center justify-center text-xs font-bold text-dd-muted transition-all duration-200 active:scale-[0.98]"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-dd-accent px-4 h-9 flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:opacity-90 shadow-md shadow-dd-accent/10 active:scale-[0.98]"
                >
                  Cadastrar-se
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center justify-center border-b border-dd-border/60">
          {/* Subtle code texture background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none font-mono text-[10px] md:text-xs">
            <div className="absolute top-[10%] left-[2%] md:left-[5%] rotate-[-6deg] max-w-xs hidden sm:block">
              <pre className="text-dd-text">
                {`import { useMemo } from 'react';
export function useCalculatedXP(xp: number) {
  return useMemo(() => {
    const level = Math.floor(Math.sqrt(xp / 100));
    return { level, next: (level + 1) * 100 };
  }, [xp]);
}`}
              </pre>
            </div>
            <div className="absolute top-[12%] right-[2%] md:right-[5%] rotate-[8deg] max-w-xs hidden sm:block">
              <pre className="text-dd-text">
                {`def calculate_score(user):
    streak = user.get_active_streak()
    bonus = 1.2 if streak > 7 else 1.0
    return sum(p.xp for p in user.posts) * bonus`}
              </pre>
            </div>
            <div className="absolute bottom-[25%] left-[4%] md:left-[8%] rotate-[12deg] max-w-xs hidden md:block">
              <pre className="text-dd-text">
                {`impl XPTracker for DevUser {
    fn add_xp(&mut self, amount: u32) {
        self.xp += amount;
        if self.xp >= self.next_level_xp {
            self.level_up();
        }
    }
}`}
              </pre>
            </div>
            <div className="absolute bottom-[18%] right-[4%] md:right-[10%] rotate-[-4deg] max-w-xs hidden md:block">
              <pre className="text-dd-text">
                {`func (d *Duel) Vote(voterID string, option int) error {
	if d.HasVoted(voterID) {
		return ErrAlreadyVoted
	}
	d.Votes[option]++
	return nil
}`}
              </pre>
            </div>
          </div>

          <div className="container mx-auto px-6 text-center max-w-4xl relative z-10 space-y-8">
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-dd-accent/20 bg-dd-accent/5 text-dd-accent text-[10px] font-extrabold uppercase tracking-widest mx-auto">
              Código vivo. Progresso real.
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl lg:text-7.5xl font-black tracking-tight mb-4 leading-[1.1] max-w-4xl mx-auto text-dd-text select-text">
                {headline}
              </h1>

              <p className="text-sm md:text-base text-dd-muted max-w-2xl mx-auto leading-relaxed select-text mt-2">
                {subHeadline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={initialUser ? "/feed" : "/register"}
                className="w-full sm:w-auto rounded-xl bg-dd-accent px-8 h-12 flex items-center justify-center text-sm font-bold text-white transition-all duration-200 hover:opacity-90 shadow-lg shadow-dd-accent/15 hover:shadow-dd-accent/25 active:scale-[0.98] gap-2 group"
              >
                {primaryCta}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#como-funciona"
                className="w-full sm:w-auto rounded-xl border border-dd-border bg-dd-surface/40 hover:bg-dd-surface/80 px-8 h-12 flex items-center justify-center text-sm font-bold text-dd-text transition-all duration-200 active:scale-[0.98] gap-2 group"
              >
                Ver como funciona
                <ArrowRight className="w-4 h-4 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Social Proof Line */}
            <div className="flex items-center justify-center gap-2.5 pt-2 text-xs text-dd-muted">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-dd-accent/20 border border-dd-bg flex items-center justify-center text-[7px] font-bold text-dd-accent">
                  G
                </div>
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-dd-bg flex items-center justify-center text-[7px] font-bold text-cyan-400">
                  R
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-dd-bg flex items-center justify-center text-[7px] font-bold text-emerald-400">
                  T
                </div>
              </div>
              <span>
                <strong className="text-dd-text font-bold">+1.200 devs</strong> já ganharam XP esta
                semana
              </span>
            </div>

            {/* Screenshot Carousel Showcase with 3D Browser Mockup Frame */}
            <div className="pt-8 md:pt-12 relative w-full flex justify-center">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-dd-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div
                className="w-full max-w-4xl rounded-2xl border border-dd-border bg-dd-surface/30 p-2 shadow-2xl backdrop-blur-md transition-transform duration-700 hover:rotate-0"
                style={{
                  perspective: "1000px",
                  transform: "perspective(1000px) rotateX(8deg) translateY(-10px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Mock Browser Header */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-dd-border bg-dd-bg/40 rounded-t-xl select-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  <div className="ml-4 flex-grow max-w-xs h-5 bg-dd-surface/60 rounded-md border border-dd-border/40 text-[9px] text-dd-muted flex items-center px-3 font-mono truncate">
                    https://devdeck.dev/feed
                  </div>
                </div>
                {/* Carousel Container */}
                <div className="overflow-hidden rounded-b-xl bg-dd-bg/25">
                  <ScreenshotCarousel />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-24 bg-dd-bg border-b border-dd-border/60">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-dd-text uppercase">
                Do debug ao topo do ranking
              </h2>
              <p className="text-dd-muted text-sm max-w-md mx-auto">
                Desenvolva suas habilidades ativamente ajudando a comunidade e superando desafios
                técnicos diários.
              </p>
            </div>

            <div className="space-y-16 relative before:absolute before:inset-y-0 before:left-7 before:w-[1px] before:bg-dd-border">
              {/* Step 1 */}
              <div className="flex gap-8 items-start relative z-10">
                <div className="font-mono text-xs font-bold text-orange-400 bg-dd-surface border border-dd-border rounded-xl w-14 h-14 flex items-center justify-center shrink-0 shadow-md">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-dd-text">Poste seu bug</h3>
                  <p className="text-dd-muted text-xs md:text-sm leading-relaxed">
                    Compartilhe suas dúvidas de código real em blocos de sintaxe limpa.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-8 items-start relative z-10">
                <div className="font-mono text-xs font-bold text-orange-400 bg-dd-surface border border-dd-border rounded-xl w-14 h-14 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-dd-text">Dispute com IA</h3>
                  <p className="text-dd-muted text-xs md:text-sm leading-relaxed">
                    Nossa IA gera quizzes automáticos a partir do seu post para testar a comunidade.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-8 items-start relative z-10">
                <div className="font-mono text-xs font-bold text-orange-400 bg-dd-surface border border-dd-border rounded-xl w-14 h-14 flex items-center justify-center shrink-0 shadow-md">
                  <Swords className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-dd-text">Domine a trilha</h3>
                  <p className="text-dd-muted text-xs md:text-sm leading-relaxed">
                    Acumule XP em tecnologias específicas e conquiste o leaderboard público.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Cards Grid */}
        <section id="features" className="py-24 border-b border-dd-border/60 bg-dd-surface/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-dd-text uppercase">
                A engenharia por trás do jogo
              </h2>
              <p className="text-dd-muted text-sm">
                Uma plataforma completa de desenvolvimento projetada para impulsionar sua
                proficiência prática e reputação técnica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/30 p-8 hover:border-dd-accent/20 transition-all duration-300 hover:translate-y-[-4px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-dd-accent/10 border border-dd-accent/20 flex items-center justify-center text-dd-accent mb-6">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Trilhas de Progresso</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Você visualiza sua evolução técnica segmentada por tecnologia em tempo real.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/30 p-8 hover:border-emerald-500/20 transition-all duration-300 hover:translate-y-[-4px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Quizzes por IA</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Você treina seus fundamentos resolvendo desafios gerados a partir do feed.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/30 p-8 hover:border-cyan-500/20 transition-all duration-300 hover:translate-y-[-4px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                  <Swords className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Duelos de Performance</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Você valida suas soluções em combates diretos contra outros desenvolvedores.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/30 p-8 hover:border-amber-500/20 transition-all duration-300 hover:translate-y-[-4px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Leaderboard Público</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Você garante destaque global liderando os rankings de suas linguagens favoritas.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/30 p-8 hover:border-purple-500/20 transition-all duration-300 hover:translate-y-[-4px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Conexão com GitHub</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Você converte suas contribuições open-source em reputação visível no perfil.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/30 p-8 hover:border-blue-500/20 transition-all duration-300 hover:translate-y-[-4px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">DMs em Tempo Real</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Você colabora com a comunidade e debate arquitetura por mensagens instantâneas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gamification Highlight Section */}
        <section className="py-24 bg-dd-bg border-b border-dd-border/60 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-dd-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
            <h2 className="text-3xl font-black uppercase text-dd-text tracking-tight">
              Reputação baseada em código compilado
            </h2>
            <p className="text-xs md:text-sm font-extrabold uppercase text-dd-accent tracking-widest">
              XP por linguagem e trilhas de aprendizado ativas.
            </p>
            <p className="text-sm md:text-base text-dd-muted leading-relaxed max-w-2xl mx-auto">
              No DevDeck, sua pontuação não é uma métrica de vaidade. Se você resolve uma
              concorrência em Rust ou uma query complexa no Prisma, o XP acumula naquela linguagem
              específica. Seu perfil torna-se um portfólio vivo de habilidades técnicas reais
              comprovadas pela comunidade.
            </p>
          </div>
        </section>

        {/* Prova Social Section */}
        <section className="py-24 bg-dd-surface/10 border-b border-dd-border/60">
          <div className="container mx-auto px-6 max-w-5xl space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-dd-text uppercase">
                Quem escreve código de verdade já está na arena
              </h2>
              <p className="text-dd-muted text-xs md:text-sm max-w-xl mx-auto">
                Engenheiros de software que escrevem código de verdade já estão na arena. Veja como
                eles usam o DevDeck para aprender, testar e se destacar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-dd-bg border border-dd-border p-6 rounded-2xl flex flex-col justify-between shadow-sm relative">
                <p className="text-xs text-dd-muted italic leading-relaxed mb-6">
                  &ldquo;Cansado de cursos que nunca terminam, comecei a praticar resolvendo as
                  dúvidas do feed. Os quizzes de IA me ajudaram a passar no meu primeiro teste
                  técnico corporativo.&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-dd-text">Mateus Fonseca</h4>
                  <p className="text-[10px] text-dd-muted mt-0.5">
                    Desenvolvedor Júnior na TechFlow
                  </p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-dd-bg border border-dd-border p-6 rounded-2xl flex flex-col justify-between shadow-sm relative">
                <p className="text-xs text-dd-muted italic leading-relaxed mb-6">
                  &ldquo;Uso as trilhas de Go e Rust para manter minha lógica afiada. É excelente
                  para ver bugs que outras equipes enfrentam no mundo real e testar minha
                  velocidade.&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-dd-text">Amanda Pinheiro</h4>
                  <p className="text-[10px] text-dd-muted mt-0.5">
                    Engenheira de Software Principal na CloudScale
                  </p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-dd-bg border border-dd-border p-6 rounded-2xl flex flex-col justify-between shadow-sm relative">
                <p className="text-xs text-dd-muted italic leading-relaxed mb-6">
                  &ldquo;Liderar o leaderboard de TypeScript me deu visibilidade imediata. Fui
                  convidado para projetos globais sem precisar enviar um único currículo
                  convencional.&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-dd-text">Bruno Rocha</h4>
                  <p className="text-[10px] text-dd-muted mt-0.5">Open Source Lead na DevHouse</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-dd-bg text-center relative overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-dd-accent/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 max-w-3xl relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-dd-text uppercase">
              Sua próxima linha de código vale XP.
            </h2>
            <p className="text-sm md:text-base text-dd-muted leading-relaxed max-w-xl mx-auto">
              Os quizzes diários de IA já estão rodando e o leaderboard reinicia em breve. Não fique
              assistindo de fora.
            </p>

            <div className="space-y-6">
              <div className="pt-2">
                <Link
                  href={initialUser ? "/feed" : "/register"}
                  className="inline-flex rounded-xl bg-dd-accent px-10 h-13 items-center justify-center text-sm font-black text-white transition-all duration-200 hover:opacity-90 shadow-xl shadow-dd-accent/20 active:scale-[0.98] gap-2 group"
                >
                  {primaryCta}
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <p className="text-[10.5px] text-dd-muted font-bold tracking-wide">
                Sem cursos chatos. Sem cartão de crédito. Apenas código compilado.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dd-border bg-dd-bg py-10 text-xs text-dd-muted">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} DevDeck. Criado para engenheiros de software competitivos.
          </p>
          <div className="flex gap-6 font-semibold">
            <a href="https://github.com" className="hover:text-dd-text transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-dd-text transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-dd-text transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
