'use client';

import { motion } from 'framer-motion';
import { Swords, Clock, Check } from 'lucide-react';

export default function LandingDuels() {
  return (
    <section className="relative py-28 lg:py-36" id="duels">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          className="grid lg:grid-cols-12 gap-8 mb-16"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lg:col-span-7">
            <div className="lp-section-marker mb-6">
              <span>05 — Duelos</span>
            </div>
            <h2
              className="lp-font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]"
              style={{ color: 'var(--lp-fg)' }}
            >
              O código é <span style={{ color: 'var(--lp-accent)' }}>a arma.</span>
              <br />
              <span className="lp-text-stroke">O conhecimento é a armadura.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p className="text-base leading-relaxed" style={{ color: 'var(--lp-fg-dim)' }}>
              Duelos de código em tempo real contra desenvolvedores do seu nível. Mesma pergunta,
              mesmo cronômetro. A resposta correta mais rápida vence.{' '}
              <span style={{ color: 'var(--lp-fg)' }}>
                Quem perde, perde XP. Quem ganha, acumula.
              </span>
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Live Duel Card */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="lp-duel-pulse p-6 lg:p-8"
              style={{
                backgroundColor: 'var(--lp-bg-card)',
                border: '1px solid rgba(245,118,43,0.3)',
                borderRadius: '12px',
              }}
            >
              {/* Duel Header */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="lp-font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded flex items-center gap-2"
                  style={{ color: 'var(--lp-accent)', background: 'rgba(245,118,43,0.1)' }}
                >
                  <span
                    className="lp-pulse-dot w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--lp-accent)' }}
                  />
                  DUELO AO VIVO · RUST · 02:34
                </span>
                <Swords size={16} style={{ color: 'var(--lp-accent)' }} />
              </div>

              <h3
                className="lp-font-heading font-semibold text-lg mb-6 leading-snug"
                style={{ color: 'var(--lp-fg)' }}
              >
                O que acontece quando você faz shadowing de uma variável dentro de um match arm?
              </h3>

              {/* Players */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Player 1 */}
                <div
                  className="p-4 rounded-lg"
                  style={{ border: '1px solid var(--lp-border)', background: 'rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center lp-font-mono font-bold text-[11px]"
                      style={{
                        background: 'linear-gradient(135deg, var(--lp-blue), var(--lp-blue-dim))',
                        color: '#0E1A24',
                      }}
                    >
                      MO
                    </div>
                    <div>
                      <div
                        className="lp-font-heading font-semibold text-[12px]"
                        style={{ color: 'var(--lp-fg)' }}
                      >
                        mira.okonkwo
                      </div>
                      <div
                        className="lp-font-mono text-[9px]"
                        style={{ color: 'var(--lp-accent)' }}
                      >
                        L14
                      </div>
                    </div>
                  </div>
                  <div
                    className="lp-font-mono text-[10px] flex items-center gap-1"
                    style={{ color: 'var(--lp-muted)' }}
                  >
                    digitando
                    <span className="flex gap-0.5">
                      <span
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: 'var(--lp-muted)', animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: 'var(--lp-muted)', animationDelay: '200ms' }}
                      />
                      <span
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: 'var(--lp-muted)', animationDelay: '400ms' }}
                      />
                    </span>
                  </div>
                  <div
                    className="mt-3 rounded p-2 lp-font-mono text-[10px] leading-relaxed"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
                  >
                    <span className="lp-kw">match</span> value {'{'}
                    <br />
                    &nbsp;&nbsp;<span className="lp-ty">Some</span>(x) {'=> {'}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="lp-kw">let</span> x = x +{' '}
                    <span className="lp-nm">1</span>;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="lp-cm">{'// ...'}</span>
                    <br />
                    &nbsp;&nbsp;{'}'}
                    <br />
                    {'}'}
                  </div>
                </div>

                {/* Player 2 */}
                <div
                  className="p-4 rounded-lg"
                  style={{ border: '1px solid var(--lp-border)', background: 'rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center lp-font-mono font-bold text-[11px]"
                      style={{
                        background: 'linear-gradient(135deg, var(--lp-accent), #8B4318)',
                        color: '#1A0F04',
                      }}
                    >
                      YT
                    </div>
                    <div>
                      <div
                        className="lp-font-heading font-semibold text-[12px]"
                        style={{ color: 'var(--lp-fg)' }}
                      >
                        yuki.t
                      </div>
                      <div
                        className="lp-font-mono text-[9px]"
                        style={{ color: 'var(--lp-accent)' }}
                      >
                        L19
                      </div>
                    </div>
                  </div>
                  <div
                    className="lp-font-mono text-[10px] flex items-center gap-1"
                    style={{ color: 'var(--lp-accent)' }}
                  >
                    <Check size={10} /> enviou
                  </div>
                  <div
                    className="mt-3 rounded p-2 lp-font-mono text-[10px] leading-relaxed"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
                  >
                    <span className="lp-kw">match</span> value {'{'}
                    <br />
                    &nbsp;&nbsp;<span className="lp-ty">Some</span>(x) {'=> {'}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="lp-cm">{'// x shadows outer'}</span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="lp-fn">println!</span>(
                    <span className="lp-st">&quot;{'{x}'}&quot;</span>);
                    <br />
                    &nbsp;&nbsp;{'}'}
                    <br />
                    {'}'}
                  </div>
                </div>
              </div>

              <div
                className="flex items-center justify-between pt-4 lp-font-mono text-[11px]"
                style={{ borderTop: '1px solid var(--lp-border)', color: 'var(--lp-muted)' }}
              >
                <span className="flex items-center gap-2">
                  <Clock size={12} /> 02:34 restantes
                </span>
                <span>
                  Vencedor ganha <span style={{ color: 'var(--lp-accent)' }}>+35 XP</span> ·
                  Perdedor perde <span style={{ color: '#ef4444' }}>−12 XP</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right — Matchmaking + Record */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Matchmaking */}
            <div
              className="p-6 text-center"
              style={{
                backgroundColor: 'var(--lp-bg-card)',
                border: '1px solid var(--lp-border)',
                borderRadius: '12px',
              }}
            >
              <div
                className="lp-font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'var(--lp-accent)' }}
              >
                BUSCANDO OPONENTE...
              </div>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div
                  className="absolute inset-0 rounded-full lp-duel-pulse"
                  style={{ border: '2px solid var(--lp-accent)' }}
                />
                <div
                  className="absolute inset-2 rounded-full"
                  style={{ border: '1px solid rgba(245,118,43,0.3)' }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center lp-font-display text-2xl"
                  style={{ color: 'var(--lp-accent)' }}
                >
                  vs
                </div>
              </div>
              <p className="lp-font-mono text-[11px] mb-1" style={{ color: 'var(--lp-fg-dim)' }}>
                Buscando um dev em até ±2 níveis
              </p>
              <p className="lp-font-mono text-[10px]" style={{ color: 'var(--lp-muted)' }}>
                Tempo médio de espera: 8s
              </p>
            </div>

            {/* Duel Record */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--lp-bg-card)',
                border: '1px solid var(--lp-border)',
                borderRadius: '12px',
              }}
            >
              <div
                className="lp-font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'var(--lp-muted)' }}
              >
                SEU HISTÓRICO DE DUELOS
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="lp-font-display text-4xl" style={{ color: 'var(--lp-accent)' }}>
                    24
                  </div>
                  <div
                    className="lp-font-mono text-[9px] uppercase"
                    style={{ color: 'var(--lp-muted)' }}
                  >
                    Vitórias
                  </div>
                </div>
                <div className="lp-font-display text-2xl" style={{ color: 'var(--lp-muted-2)' }}>
                  -
                </div>
                <div className="text-center">
                  <div className="lp-font-display text-4xl" style={{ color: 'var(--lp-fg-dim)' }}>
                    18
                  </div>
                  <div
                    className="lp-font-mono text-[9px] uppercase"
                    style={{ color: 'var(--lp-muted)' }}
                  >
                    Derrotas
                  </div>
                </div>
                <div
                  className="ml-auto text-center px-4 py-2 rounded"
                  style={{
                    background: 'rgba(245,118,43,0.1)',
                    border: '1px solid rgba(245,118,43,0.2)',
                  }}
                >
                  <div className="lp-font-display text-2xl" style={{ color: 'var(--lp-accent)' }}>
                    57%
                  </div>
                  <div
                    className="lp-font-mono text-[9px] uppercase"
                    style={{ color: 'var(--lp-muted)' }}
                  >
                    Vitórias %
                  </div>
                </div>
              </div>
              <div
                className="space-y-2 lp-font-mono text-[11px]"
                style={{ color: 'var(--lp-fg-dim)' }}
              >
                <div className="flex justify-between">
                  <span>Linguagem mais duelada</span>
                  <span style={{ color: 'var(--lp-accent)' }}>Rust</span>
                </div>
                <div className="flex justify-between">
                  <span>Maior sequência de vitórias</span>
                  <span style={{ color: 'var(--lp-gold)' }}>7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
