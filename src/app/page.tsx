import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { HeroMockup } from "@/components/HeroMockup";
import { 
  Sparkles, 
  BookOpen, 
  Swords, 
  Award, 
  Trophy, 
  Terminal, 
  ArrowRight, 
  Play, 
  GitFork, 
  Users, 
  Flame 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();

  return (
    <div className="flex flex-col min-h-screen bg-dd-bg text-dd-text antialiased selection:bg-orange-500/35 selection:text-white">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 w-full border-b border-dd-border bg-dd-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 group">
            <img src="/logo.png" alt="DevDeck Logo" className="w-6 h-6 object-contain hidden dark:block" />
            <img src="/logo-light.png" alt="DevDeck Logo" className="w-6 h-6 object-contain block dark:hidden" />
            <span className="font-sans text-xl font-bold tracking-tight text-dd-text">DevDeck</span>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <Link
                href="/feed"
                className="rounded-lg bg-orange-500 px-4 h-9 flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:bg-orange-600 shadow-md shadow-orange-500/10 active:scale-[0.98]"
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
                  className="rounded-lg bg-orange-500 px-4 h-9 flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:bg-orange-600 shadow-md shadow-orange-500/10 active:scale-[0.98]"
                >
                  Cadastrar-se
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center justify-center border-b border-slate-900/50">
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
            <h1 className="text-4xl md:text-6xl lg:text-7.5xl font-black tracking-tight mb-4 leading-[1.1] max-w-4xl mx-auto text-dd-text">
              Stack Overflow não te dá XP.<br className="hidden md:inline" />
              {" "}Twitter não entende seu código.<br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                DevDeck resolve os dois.
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-dd-muted max-w-2xl mx-auto leading-relaxed">
              A evolução do Stack Overflow com a dinâmica de jogos. Resolva dúvidas reais, suba de nível em trilhas de tecnologia e desafie outros desenvolvedores em duelos de código.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={user ? "/feed" : "/register"}
                className="w-full sm:w-auto rounded-xl bg-orange-500 px-8 h-12 flex items-center justify-center text-sm font-bold text-white transition-all duration-200 hover:bg-orange-600 shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 active:scale-[0.98] gap-2 group"
              >
                Começar Agora
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto rounded-xl border border-dd-border bg-dd-surface/40 hover:bg-dd-surface/80 px-8 h-12 flex items-center justify-center text-sm font-bold text-dd-text transition-all duration-200 active:scale-[0.98] gap-2 group"
              >
                Ver um post real
                <ArrowRight className="w-4 h-4 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Social Proof Line */}
            <div className="flex items-center justify-center gap-2.5 pt-2 text-xs text-dd-muted">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-dd-bg flex items-center justify-center text-[7px] font-bold text-orange-400">G</div>
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-dd-bg flex items-center justify-center text-[7px] font-bold text-cyan-400">R</div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-dd-bg flex items-center justify-center text-[7px] font-bold text-emerald-400">T</div>
              </div>
              <span>
                <strong className="text-dd-text font-bold">+1.200 devs</strong> já ganharam XP esta semana
              </span>
            </div>

            {/* Interactive Mockup */}
            <div className="pt-8 md:pt-12 relative w-full">
              {/* Subtle background glow behind the mockup */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* Features Cards Grid */}
        <section id="features" className="py-24 border-b border-slate-900/50 bg-dd-bg">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-dd-text">Funcionalidades do Deck</h2>
              <p className="text-dd-muted text-sm">Desenvolvido para transformar o aprendizado de algoritmos e a colaboração de código em uma experiência altamente viciante.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/10 p-8 hover:border-dd-border transition-all duration-300 hover:translate-y-[-4px]">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">XP por Linguagem</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Ganhe experiência (XP) nas tecnologias que você codifica. Acompanhe seu progresso e suba de nível em trilhas de TypeScript, Rust, Python, Go e muito mais.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/10 p-8 hover:border-dd-border transition-all duration-300 hover:translate-y-[-4px]">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                  <Swords className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Duelos de Código</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Desafie programadores ou entre em duelos pendentes. Escreva a melhor solução no editor CodeMirror em tempo real e deixe a comunidade votar no vencedor.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-dd-border bg-dd-surface/10 p-8 hover:border-dd-border transition-all duration-300 hover:translate-y-[-4px]">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-dd-text">Badges e Conquistas</h3>
                <p className="text-dd-muted text-xs leading-relaxed">
                  Complete desafios diários, mantenha sequências de atividade (streaks) e colecione insígnias que atestam sua reputação de engenharia de software na rede.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="py-24 bg-dd-bg">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-extrabold text-center text-dd-text mb-20">Como funciona a gamificação?</h2>
            
            <div className="space-y-16 relative before:absolute before:inset-y-0 before:left-7 before:w-[1px] before:bg-dd-surface">
              
              {/* Step 1 */}
              <div className="flex gap-8 items-start relative z-10">
                <div className="font-mono text-xs font-bold text-orange-400 bg-dd-surface border border-dd-border rounded-xl w-14 h-14 flex items-center justify-center shrink-0 shadow-sm">
                  01
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-dd-text">Pergunte ou Ajude a Comunidade</h3>
                  <p className="text-dd-muted text-xs leading-relaxed">
                    Compartilhe dúvidas reais anexando trechos de código formatados. Cada resposta útil aceita pelo autor do post rende XP direto na trilha de linguagem daquela dúvida.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-8 items-start relative z-10">
                <div className="font-mono text-xs font-bold text-orange-400 bg-dd-surface border border-dd-border rounded-xl w-14 h-14 flex items-center justify-center shrink-0 shadow-sm">
                  02
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-dd-text">Quizzes Gerados por IA</h3>
                  <p className="text-dd-muted text-xs leading-relaxed">
                    Nossa inteligência artificial analisa cada dúvida enviada no feed e gera automaticamente um quiz de múltipla escolha. Outros usuários podem resolver o quiz no post para reforçar conceitos e ganhar XP bônus.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-8 items-start relative z-10">
                <div className="font-mono text-xs font-bold text-orange-400 bg-dd-surface border border-dd-border rounded-xl w-14 h-14 flex items-center justify-center shrink-0 shadow-sm">
                  03
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-dd-text">Duelos e Ranking</h3>
                  <p className="text-dd-muted text-xs leading-relaxed">
                    Publique ou vote em soluções de duelos técnicos. Acumule XP nas linguagens do seu interesse para figurar nos rankings específicos e ganhar as maiores insígnias da plataforma.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-dd-bg py-10 text-xs text-dd-muted">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DevDeck. Criado para engenheiros de software competitivos.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="https://github.com" className="hover:text-dd-text transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-dd-text transition-colors">Termos</Link>
            <Link href="#" className="hover:text-dd-text transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
