'use client';

import { motion } from 'framer-motion';
import { Code, Zap, GraduationCap, Check } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
} as const;

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
} as const;

export default function LandingHowItWorks() {
  return (
    <section className="relative py-28 lg:py-36" id="how">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          className="grid lg:grid-cols-12 gap-8 mb-20"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lg:col-span-5">
            <div className="lp-section-marker mb-6">
              <span>01 — O CICLO</span>
            </div>
            <h2
              className="lp-font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] uppercase"
              style={{ color: 'var(--lp-fg)' }}
            >
              Três coisas acontecem com
              <br />
              <span className="lp-text-stroke">cada post</span> que você escreve.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end">
            <p className="text-base leading-relaxed" style={{ color: 'var(--lp-fg-dim)' }}>
              Esta é uma sequência fixa — não três pilares, não três valores.{' '}
              <strong style={{ color: 'var(--lp-fg)' }}>
                Poste primeiro, depois ganhe XP, depois faça o quiz.
              </strong>{' '}
              Todos os outros recursos no DevDeck dependem deste ciclo. Passe o mouse nos cards para
              revelar os detalhes.
            </p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Card 1 — POST */}
          <motion.div className="lp-flip-card group" variants={cardReveal}>
            <div className="lp-flip-card-inner">
              {/* Front Face */}
              <div className="lp-flip-face lp-notch-corner p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="lp-font-mono text-[11px] tracking-[0.2em]"
                      style={{ color: 'var(--lp-accent)' }}
                    >
                      01 / POSTAR
                    </div>
                    <Code size={16} style={{ color: 'var(--lp-accent)' }} />
                  </div>
                  <h3
                    className="lp-font-display text-3xl mb-3 uppercase"
                    style={{ color: 'var(--lp-fg)' }}
                  >
                    Poste um problema real.
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--lp-fg-dim)' }}>
                    Não é um tutorial. Não é um palpite. O problema exato onde você travou, com o
                    código que realmente está quebrado. Tags sugeridas automaticamente a partir do
                    seu snippet.
                  </p>
                </div>
                <div
                  className="rounded-md p-3 lp-font-mono text-[10px]"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
                >
                  <div
                    className="mb-1.5 pb-1.5"
                    style={{ color: 'var(--lp-fg)', borderBottom: '1px dashed var(--lp-border)' }}
                  >
                    Por que meu useEffect está executando duas vezes?
                  </div>
                  <div style={{ color: 'var(--lp-fg-dim)' }}>
                    <span className="lp-kw">useEffect</span>
                    {'(() => {'}
                    <br />
                    &nbsp;&nbsp;<span className="lp-fn">fetch</span>(
                    <span className="lp-st">&quot;/api/user&quot;</span>)<br />
                    {'}, []) '}
                    <span className="lp-cm">{'// ← ?'}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ color: 'var(--lp-blue)', background: 'rgba(127,168,201,0.1)' }}
                    >
                      react
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ color: 'var(--lp-blue)', background: 'rgba(127,168,201,0.1)' }}
                    >
                      hooks
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Face */}
              <div className="lp-flip-face lp-flip-back lp-notch-corner p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="lp-font-mono text-[10px] text-[var(--lp-accent)] tracking-[0.2em]">
                      / PROCESSADOR DE SINTAXE
                    </div>
                    <span className="lp-font-mono text-[9px] text-[var(--lp-muted)]">
                      ENGINE v2.4
                    </span>
                  </div>
                  <h4 className="lp-font-display text-2xl mb-4 uppercase text-[var(--lp-fg)]">
                    Análise de Tags por IA
                  </h4>
                  <p className="text-xs leading-relaxed text-[var(--lp-fg-dim)]">
                    Nossa engine lê o seu bloco de código em tempo real e extrai a árvore sintática
                    abstrata (AST) para sugerir as tags exatas e segmentar a pergunta para os
                    desenvolvedores certos.
                  </p>
                </div>
                <div
                  className="rounded p-3 lp-font-mono text-[9.5px] space-y-1"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--lp-border)' }}
                >
                  <div className="text-[var(--lp-blue)]">[ast] Analisando snippet React...</div>
                  <div className="text-[var(--lp-gold)]">[ast] Hook detectado: useEffect</div>
                  <div className="text-[var(--lp-string)]">
                    [ast] Indexando tags: [react, hooks]
                  </div>
                  <div className="text-[var(--lp-muted)]">
                    [sys] Aguardando respostas aceitas...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — EARN */}
          <motion.div className="lp-flip-card group" variants={cardReveal}>
            <div className="lp-flip-card-inner">
              {/* Front Face */}
              <div className="lp-flip-face lp-notch-corner p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="lp-font-mono text-[11px] tracking-[0.2em]"
                      style={{ color: 'var(--lp-accent)' }}
                    >
                      02 / GANHAR
                    </div>
                    <Zap size={16} style={{ color: 'var(--lp-accent)' }} />
                  </div>
                  <h3
                    className="lp-font-display text-3xl mb-3 uppercase"
                    style={{ color: 'var(--lp-fg)' }}
                  >
                    A comunidade responde.
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--lp-fg-dim)' }}>
                    Votos positivos de desenvolvedores que realmente executaram seu código.
                    Respostas aceitas rendem 45 XP. Discussões de alta qualidade concedem XP bônus
                    para ambos os lados.
                  </p>
                </div>
                <div
                  className="rounded-md p-3 flex items-center gap-4"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
                >
                  <div>
                    <div
                      className="lp-font-display text-3xl leading-none"
                      style={{ color: 'var(--lp-accent)' }}
                    >
                      +45
                    </div>
                    <div
                      className="lp-font-mono text-[9px] tracking-[0.15em] uppercase mt-1"
                      style={{ color: 'var(--lp-muted)' }}
                    >
                      XP CREDITADO
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[10px] mb-2 truncate"
                      style={{ color: 'var(--lp-fg-dim)' }}
                    >
                      Resposta aceita · 12 votos
                    </div>
                    <div
                      className="h-1 rounded overflow-hidden"
                      style={{ background: 'var(--lp-border)' }}
                    >
                      <div
                        className="h-full rounded"
                        style={{
                          width: '72%',
                          background:
                            'linear-gradient(90deg, var(--lp-accent), var(--lp-accent-bright))',
                        }}
                      />
                    </div>
                    <div
                      className="flex justify-between lp-font-mono text-[8px] mt-1"
                      style={{ color: 'var(--lp-muted)' }}
                    >
                      <span>L14 · 24,580</span>
                      <span>L15 · 28,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Face */}
              <div className="lp-flip-face lp-flip-back lp-notch-corner p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="lp-font-mono text-[10px] text-[var(--lp-accent)] tracking-[0.2em]">
                      / TABELA DE XP
                    </div>
                    <span className="lp-font-mono text-[9px] text-[var(--lp-muted)]">
                      XP ENGINE
                    </span>
                  </div>
                  <h4 className="lp-font-display text-2xl mb-4 uppercase text-[var(--lp-fg)]">
                    Linhas de Código Validadas
                  </h4>
                  <p
                    className="text-xs leading-relaxed text-[var(--lp-flip-back)]"
                    style={{ color: 'var(--lp-fg-dim)' }}
                  >
                    Cada contribuição bem-sucedida valida seu nível técnico. Escrever boas respostas
                    e corrigir bugs da comunidade gera reputação tangível.
                  </p>
                </div>
                <div
                  className="rounded p-3 lp-font-mono text-[10px] space-y-1.5"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--lp-border)' }}
                >
                  <div className="flex justify-between">
                    <span className="text-[var(--lp-muted)]">Resposta aceita</span>
                    <span className="text-[var(--lp-accent)] font-semibold">+45 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--lp-muted)]">Upvote no post</span>
                    <span className="text-[var(--lp-blue)] font-semibold">+15 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--lp-muted)]">Duelo ganho</span>
                    <span className="text-[var(--lp-gold)] font-semibold">+30 XP</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--lp-border)] pt-1">
                    <span className="text-[var(--lp-muted)]">Multiplicador Streak</span>
                    <span className="text-[var(--lp-string)] font-semibold">x1.2</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 — QUIZ */}
          <motion.div className="lp-flip-card group" variants={cardReveal}>
            <div className="lp-flip-card-inner">
              {/* Front Face */}
              <div className="lp-flip-face lp-notch-corner p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="lp-font-mono text-[11px] tracking-[0.2em]"
                      style={{ color: 'var(--lp-accent)' }}
                    >
                      03 / QUIZ
                    </div>
                    <TrashIconAndOthers size={16} />
                  </div>
                  <h3
                    className="lp-font-display text-3xl mb-3 uppercase"
                    style={{ color: 'var(--lp-fg)' }}
                  >
                    IA cria um quiz.
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--lp-fg-dim)' }}>
                    Conceitos extraídos, distratores gerados a partir de erros comuns. Outro
                    desenvolvedor evolui com a sua discussão. Você ganha crédito quando eles
                    aprendem.
                  </p>
                </div>
                <div
                  className="rounded-md p-3 lp-font-mono text-[10px]"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lp-border)' }}
                >
                  <div className="text-[9px] mb-1" style={{ color: 'var(--lp-muted)' }}>
                    QUIZ · do post de mira.o · 30s
                  </div>
                  <div className="text-[11px] mb-2 truncate" style={{ color: 'var(--lp-fg)' }}>
                    {'Por que Option<&T> não implementa Copy?'}
                  </div>
                  <div
                    className="py-1 px-2 rounded mb-1 flex items-center gap-1.5 text-[9px]"
                    style={{ color: 'var(--lp-fg-dim)', border: '1px solid var(--lp-border)' }}
                  >
                    <span className="font-bold" style={{ color: 'var(--lp-muted)' }}>
                      A
                    </span>{' '}
                    Referências não são Copy
                  </div>
                  <div
                    className="py-1 px-2 rounded mb-1 flex items-center gap-1.5 text-[9px]"
                    style={{
                      color: 'var(--lp-fg)',
                      border: '1px solid var(--lp-accent)',
                      background: 'rgba(245,118,43,0.1)',
                    }}
                  >
                    <span className="font-bold" style={{ color: 'var(--lp-accent)' }}>
                      B
                    </span>{' '}
                    &amp;T é Copy
                    <Check size={9} className="ml-auto" style={{ color: 'var(--lp-accent)' }} />
                  </div>
                </div>
              </div>

              {/* Back Face */}
              <div className="lp-flip-face lp-flip-back lp-notch-corner p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="lp-font-mono text-[10px] text-[var(--lp-accent)] tracking-[0.2em]">
                      / COMPILADOR DE QUESTÕES
                    </div>
                    <span className="lp-font-mono text-[9px] text-[var(--lp-muted)]">
                      QUIZ ENGINE
                    </span>
                  </div>
                  <h4 className="lp-font-display text-2xl mb-4 uppercase text-[var(--lp-fg)]">
                    IA Generativa Ativa
                  </h4>
                  <p className="text-xs leading-relaxed text-[var(--lp-fg-dim)]">
                    Nossa IA não substitui o programador; ela desafia a comunidade. Os tópicos
                    discutidos na resposta aceita viram perguntas dinâmicas e testes de fixação para
                    outros membros.
                  </p>
                </div>
                <div
                  className="rounded p-3 lp-font-mono text-[9.5px] space-y-1"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--lp-border)' }}
                >
                  <div className="text-[var(--lp-blue)]">[gpt] Lendo discussão aceita...</div>
                  <div className="text-[var(--lp-gold)]">
                    [gpt] Synthesizing O(N) distractors...
                  </div>
                  <div className="text-[var(--lp-string)]">[gpt] Quiz publicado na arena!</div>
                  <div className="text-[var(--lp-muted)]">
                    [sys] Atribuindo XP aos respondentes.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrashIconAndOthers({ size }: { size: number }) {
  return <GraduationCap size={size} style={{ color: 'var(--lp-accent)' }} />;
}
