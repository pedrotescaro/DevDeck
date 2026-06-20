'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LandingCTAProps {
  initialUser: any;
}

export default function LandingCTA({ initialUser }: LandingCTAProps) {
  const [terminalText, setTerminalText] = useState('');
  const fullText = 'devdeck login --arena --force-interactive';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        setTimeout(() => {
          index = 0;
        }, 3000); // Pause before re-typing
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 lg:py-40 bg-[#0E0D0B] overflow-hidden" id="start">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-[var(--lp-accent)]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 relative z-10 text-center flex flex-col items-center">
        {/* Terminal block decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg mb-12 border border-[var(--lp-border)] rounded-lg bg-[#141311] overflow-hidden text-left"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-[#1A1815] border-b border-[var(--lp-border)]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]/30" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]/30" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]/30" />
            </div>
            <span className="lp-font-mono text-[10px] text-[var(--lp-muted)]">bash — devdeck</span>
          </div>
          <div className="p-5 lp-font-mono text-xs md:text-sm space-y-2.5 text-[var(--lp-fg-dim)] min-h-[140px]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--lp-accent)]">➜</span>
              <span className="text-[var(--lp-blue)]">~</span>
              <span>{terminalText}</span>
              <span className="w-1.5 h-4 bg-[var(--lp-accent)] animate-pulse" />
            </div>
            {terminalText.length >= fullText.length - 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                <div className="text-[var(--lp-string)]">✔ Conectado ao cluster da arena</div>
                <div className="text-[var(--lp-muted)]">Inicializando conexão do sandbox...</div>
                <div className="text-[var(--lp-gold)]">
                  Aviso: Alta densidade competitiva na trilha de Rust.
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action copy */}
        <span className="lp-section-marker mb-6">DESAFIO FINAL</span>

        <h2 className="lp-font-display text-5xl md:text-7xl font-bold tracking-wide uppercase mb-6 leading-none max-w-2xl text-[var(--lp-fg)]">
          SUA PRÓXIMA LINHA DE CÓDIGO <span className="text-[var(--lp-accent)]">VALE XP</span>.
        </h2>

        <p className="lp-font-heading text-base md:text-lg text-[var(--lp-fg-dim)] max-w-xl mb-10 leading-relaxed">
          Os quizzes diários de IA já estão rodando e o leaderboard reinicia em breve. Não fique
          assistindo de fora.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          <Link
            href={initialUser ? '/feed' : '/register'}
            className="lp-font-heading font-semibold text-base px-10 py-4 rounded-md transition-colors lp-pulse-btn flex items-center gap-3 w-full sm:w-auto justify-center animate-pulse"
            style={{
              background: 'var(--lp-accent)',
              color: '#0E0D0B',
            }}
          >
            {initialUser ? 'Ir para o Feed' : 'Começar Agora'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
