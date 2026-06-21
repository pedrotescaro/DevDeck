'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paperclip,
  Send,
  History,
  Sparkles,
  Trash2,
  Maximize2,
  EyeOff,
  Eye,
  ChevronDown,
  Check,
  ArrowLeft,
  Terminal,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Ducky SVG Icon matching Sidebar
const DuckyLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="15.5" cy="7.5" r="3" />
    <circle cx="16" cy="7" r="0.5" fill="currentColor" />
    <path d="M18.5 7.5 C19.5 7.5 21 7 21.5 8 C20.5 9 19.5 8.5 18.5 8.5" fill="currentColor" />
    <path d="M13 10.5 C10 10.5 8 9.5 6 11 C4.5 12 4 14 4 15.5 C4 18.5 7.5 20 11.5 20 C16 20 18.5 17.5 18.5 14.5 C18.5 12.5 17 11 15 10.5 L13 10.5 Z" />
    <path d="M11 14 C9.5 14.5 8.5 15.5 8 16.5 C9.5 17 11.5 16 12.5 15" />
  </svg>
);

interface DuckyContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  activeLanguage: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ducky';
  text: string;
  isStreaming?: boolean;
}

const getDuckyResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (
    q.includes('bug') ||
    q.includes('erro') ||
    q.includes('consertar') ||
    q.includes('fix') ||
    q.includes('problem')
  ) {
    return `Quack! 🦆 Parece que você encontrou um bug. Vamos depurar isso juntos!

Para encontrar a causa raiz, me responda:
1. O que o código **deveria** fazer vs. o que ele **realmente** está fazendo?
2. Você já isolou o problema usando um console.log ou inspecionando o stack trace?

Geralmente, bugs em JavaScript/TypeScript acontecem por:
- Referências nulas ou indefinidas (\`undefined\`).
- Escopo de variáveis incorreto.
- Condicionais com operadores de comparação incorretos (ex: \`==\` em vez de \`===\`).

Compartilhe o trecho de código abaixo para darmos uma olhada!`;
  }

  if (q.includes('react') || q.includes('next') || q.includes('render')) {
    return `Quack! 🦆 Desenvolvendo com React/Next.js? Excelente escolha!

Seja sobre hooks (\`useState\`, \`useEffect\`) ou a arquitetura do Next.js (App Router, Server Components), aqui vão algumas dicas essenciais de desenvolvimento:
- **Server Components por padrão**: No Next.js App Router, os componentes são Server Components por padrão. Use \`"use client"\` no topo apenas se precisar de estado ou hooks de ciclo de vida.
- **Dependências do useEffect**: Sempre declare todas as variáveis externas usadas dentro do \`useEffect\` no array de dependências para evitar closures antigas (stale closures).

O que você está tentando construir ou qual comportamento inesperado está enfrentando?`;
  }

  if (
    q.includes('performance') ||
    q.includes('otimizar') ||
    q.includes('lento') ||
    q.includes('speed')
  ) {
    return `Quack! 🦆 Deixando o código veloz como um jato? Vamos otimizar isso!

Alguns pontos comuns de lentidão para analisar:
- **Complexidade de Tempo**: Evite loops aninhados (\`O(N^2)\`) quando puder usar um \`Map\` ou \`Set\` para buscas em tempo constante (\`O(1)\`).
- **Re-renders desnecessários (React)**: Use \`useMemo\` ou \`useCallback\` para evitar recriação de objetos e funções pesadas nas renderizações.
- **Chamadas de Banco de Dados**: No back-end, verifique se não está fazendo o famoso problema do \`N+1 queries\`. Use selects com joins apropriados.

Me envie a parte lenta do código que eu te ajudo a refatorar!`;
  }

  if (q.includes('test') || q.includes('teste')) {
    return `Quack! 🦆 Testar o código é o que separa os amadores dos profissionais!

Para escrever um bom teste unitário:
1. **Isole a lógica**: Teste uma única unidade (função ou componente) de forma isolada. Mocke dependências externas (bancos de dados, APIs).
2. **Siga a estrutura AAA**:
   - **Arrange (Organizar)**: Prepare os dados de entrada e mockes.
   - **Act (Agir)**: Execute a função que está sendo testada.
   - **Assert (Afirmar)**: Verifique se o resultado retornado é o esperado.

Aqui está um exemplo simples em Jest/Vitest:
\`\`\`javascript
test('deve somar dois números corretamente', () => {
  // Arrange
  const a = 5;
  const b = 3;
  
  // Act
  const resultado = somar(a, b);
  
  // Assert
  expect(resultado).toBe(8);
});
\`\`\`
Qual função você quer testar hoje?`;
  }

  // Resposta padrão (Rubber Ducking)
  return `Quack! 🦆 Eu sou o Ducky, seu patinho de borracha de programação!

O método do **Patinho de Borracha (Rubber Duck Debugging)** consiste em me explicar o seu código linha por linha. Ao tentar verbalizar o problema de forma simples, seu cérebro frequentemente encontra a solução sozinho!

Como posso te ajudar hoje? Você pode me perguntar sobre:
- Explicação de algum trecho de código confuso
- Como encontrar e resolver um bug
- Boas práticas e refatoração
- Como escrever testes unitários`;
};

export function DuckyContent({ user, activeLanguage }: DuckyContentProps) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [mode, setMode] = useState<'Rápido' | 'Deep Debug'>('Rápido');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rolagem suave para o final do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || thinking) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setThinking(true);

    try {
      const response = await fetch('/api/ai/ducky/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeLanguage,
          history: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      setThinking(false);

      if (response.ok && data.text) {
        const duckyMsgId = Math.random().toString();
        const newDuckyMsg: Message = {
          id: duckyMsgId,
          sender: 'ducky',
          text: '',
          isStreaming: true,
        };

        setMessages((prev) => [...prev, newDuckyMsg]);

        // Efeito de stream de digitação
        let currentIdx = 0;
        const interval = setInterval(() => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === duckyMsgId) {
                const nextText = data.text.slice(0, currentIdx + 5);
                const done = nextText.length === data.text.length;
                if (done) {
                  clearInterval(interval);
                }
                return {
                  ...msg,
                  text: nextText,
                  isStreaming: !done,
                };
              }
              return msg;
            })
          );
          currentIdx += 5;
        }, 20);
      } else {
        const duckyMsgId = Math.random().toString();
        setMessages((prev) => [
          ...prev,
          {
            id: duckyMsgId,
            sender: 'ducky',
            text:
              data.text ||
              'Quack... Tive um problema ao processar seu código. Pode tentar de novo?',
          },
        ]);
      }
    } catch (err) {
      setThinking(false);
      const duckyMsgId = Math.random().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: duckyMsgId,
          sender: 'ducky',
          text: 'Quack... Tive um problema ao me conectar com os servidores de IA.',
        },
      ]);
    }
  };

  const handleSuggestionClick = (prefix: string) => {
    setInputVal(prefix);
  };

  const clearHistory = () => {
    if (confirm('Deseja apagar o histórico de conversa com o Ducky?')) {
      setMessages([]);
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased transition-all ${isFullscreen ? 'p-0' : ''}`}
    >
      {/* Ocultar sidebar se estiver em tela cheia para maximizar foco no código */}
      {!isFullscreen && <Sidebar user={user} />}

      <div className="flex-grow flex flex-col min-w-0 bg-dd-bg border-l border-dd-border/30 relative">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-dd-border/20 bg-dd-bg/60 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 hover:bg-dd-border/30 rounded-lg text-dd-muted hover:text-dd-text transition-all cursor-pointer"
                title="Sair do Modo Foco"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <DuckyLogo className="w-5 h-5 text-orange-500 fill-orange-500/10" />
              <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Ducky AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Private Mode Toggle */}
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                isPrivate
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : 'bg-dd-surface border-dd-border hover:bg-dd-border/30 text-dd-muted'
              }`}
              title={isPrivate ? 'Histórico pausado (Modo Privado)' : 'Ativar Modo Privado'}
            >
              {isPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPrivate ? 'Privado' : 'Público'}</span>
            </button>

            {/* Clear History */}
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-2 border border-dd-border bg-dd-surface hover:bg-red-500/10 hover:border-red-500/30 text-dd-muted hover:text-red-400 rounded-lg transition-all cursor-pointer"
                title="Limpar Conversa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Toggle Fullscreen Focus */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 border border-dd-border bg-dd-surface hover:bg-dd-border/30 text-dd-muted hover:text-dd-text rounded-lg transition-all cursor-pointer"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Modo Foco / Tela Cheia'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Chat / Welcome Area */}
        <div className="flex-grow flex flex-col justify-between overflow-y-auto px-4 py-8 max-w-3xl w-full mx-auto pb-32">
          {messages.length === 0 ? (
            // WELCOME / EMPTY STATE (Grok Style)
            <div className="flex-grow flex flex-col items-center justify-center text-center my-auto space-y-8 py-12">
              <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/5 animate-pulse">
                <DuckyLogo className="w-10 h-10 fill-orange-500/10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-dd-text tracking-tight uppercase">
                  Como posso ajudar a codar hoje?
                </h2>
                <p className="text-xs text-dd-muted max-w-sm mx-auto">
                  Eu sou o seu patinho de borracha com inteligência artificial. Explique seu código
                  e tire dúvidas técnicas.
                </p>
              </div>

              {/* Sugestões rápidas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
                <button
                  onClick={() =>
                    handleSuggestionClick('🐛 Quero ajuda para encontrar um bug neste código: \n\n')
                  }
                  className="p-4 border border-dd-border/60 bg-dd-surface/40 hover:bg-dd-border/30 hover:border-orange-500/30 rounded-xl text-left transition-all cursor-pointer text-xs group"
                >
                  <span className="font-bold text-dd-text block group-hover:text-orange-400">
                    Explicar Bug
                  </span>
                  <span className="text-[10px] text-dd-muted mt-1 block">
                    Encontre erros lógicos ou exceções.
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleSuggestionClick('⚡ Como posso refatorar e otimizar este código: \n\n')
                  }
                  className="p-4 border border-dd-border/60 bg-dd-surface/40 hover:bg-dd-border/30 hover:border-orange-500/30 rounded-xl text-left transition-all cursor-pointer text-xs group"
                >
                  <span className="font-bold text-dd-text block group-hover:text-orange-400">
                    Refatorar
                  </span>
                  <span className="text-[10px] text-dd-muted mt-1 block">
                    Melhore performance e legibilidade.
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleSuggestionClick(
                      '📝 Escreva testes unitários para a seguinte função: \n\n'
                    )
                  }
                  className="p-4 border border-dd-border/60 bg-dd-surface/40 hover:bg-dd-border/30 hover:border-orange-500/30 rounded-xl text-left transition-all cursor-pointer text-xs group"
                >
                  <span className="font-bold text-dd-text block group-hover:text-orange-400">
                    Escrever Teste
                  </span>
                  <span className="text-[10px] text-dd-muted mt-1 block">
                    Gere testes Jest/Vitest robustos.
                  </span>
                </button>
              </div>
            </div>
          ) : (
            // CONVERSATION FLOW
            <div className="space-y-6 w-full flex flex-col">
              {isPrivate && (
                <div className="bg-purple-500/5 border border-purple-500/10 p-3.5 rounded-xl flex items-center gap-2.5 text-purple-400 text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>
                    Você está no <strong>Modo Privado</strong>. Suas conversas não ficam salvas na
                    conta.
                  </span>
                </div>
              )}

              {messages.map((msg) => {
                const isDucky = msg.sender === 'ducky';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${isDucky ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDucky
                          ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500'
                          : 'bg-dd-border/40 text-dd-text border border-dd-border'
                      }`}
                    >
                      {isDucky ? (
                        <DuckyLogo className="w-4 h-4" />
                      ) : (
                        user.username.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl p-4 border text-xs leading-relaxed ${
                        isDucky
                          ? 'bg-dd-surface/30 border-dd-border/40 text-dd-text whitespace-pre-wrap'
                          : 'bg-orange-500/10 border-orange-500/20 text-dd-text whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-3.5 bg-orange-500 ml-1 animate-ping" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking Indicator */}
              {thinking && (
                <div className="flex gap-3 self-start max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <DuckyLogo className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-dd-surface/30 border border-dd-border/40 rounded-2xl p-4 text-xs text-dd-muted flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                    </div>
                    <span>
                      {mode === 'Deep Debug'
                        ? 'Ducky está analisando o escopo do seu projeto...'
                        : 'Ducky está analisando seu código...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Chat Input Form (Grok Style) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dd-bg via-dd-bg to-transparent z-10">
          <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
            {/* Input Container */}
            <div className="w-full bg-dd-surface border border-dd-border/60 focus-within:border-orange-500/50 rounded-3xl p-2 pl-4 flex items-center gap-3 shadow-xl max-w-2xl">
              {/* Clip Attachment */}
              <button
                onClick={() => alert('Envio de arquivos em breve.')}
                className="p-2 hover:bg-dd-border/30 rounded-full text-dd-muted hover:text-dd-text transition-all cursor-pointer"
                title="Anexar Arquivo"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Area Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend(inputVal);
                  }
                }}
                disabled={thinking}
                placeholder="Perguntar ao Ducky..."
                className="flex-grow bg-transparent border-0 outline-0 ring-0 text-xs text-dd-text placeholder-dd-muted h-10 resize-none py-2"
              />

              {/* Dropdown Select Mode (Grok Style) */}
              <div className="relative">
                <button
                  onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dd-surface/40 hover:bg-dd-border/30 border border-dd-border rounded-full text-[10px] font-bold text-dd-muted hover:text-dd-text transition-all cursor-pointer"
                >
                  {mode === 'Rápido' ? (
                    <Zap className="w-3 h-3 text-orange-500" />
                  ) : (
                    <Terminal className="w-3 h-3 text-purple-400" />
                  )}
                  <span>{mode}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {modeDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setModeDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute bottom-full right-0 mb-2 w-40 bg-dd-surface border border-dd-border rounded-xl shadow-2xl z-20 overflow-hidden divide-y divide-dd-border/50"
                      >
                        <button
                          onClick={() => {
                            setMode('Rápido');
                            setModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-bold cursor-pointer flex items-center justify-between ${
                            mode === 'Rápido'
                              ? 'bg-orange-500/10 text-orange-400'
                              : 'text-dd-muted hover:bg-dd-border/20'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Rápido
                          </span>
                          {mode === 'Rápido' && <Check className="w-3 h-3 text-orange-500" />}
                        </button>
                        <button
                          onClick={() => {
                            setMode('Deep Debug');
                            setModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-bold cursor-pointer flex items-center justify-between ${
                            mode === 'Deep Debug'
                              ? 'bg-purple-500/10 text-purple-400'
                              : 'text-dd-muted hover:bg-dd-border/20'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <Terminal className="w-3 h-3" /> Deep Debug
                          </span>
                          {mode === 'Deep Debug' && <Check className="w-3 h-3 text-purple-400" />}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSend(inputVal)}
                disabled={!inputVal.trim() || thinking}
                className="p-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 disabled:cursor-not-allowed text-white rounded-full transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Premium Promotion Hint (Grok Style) */}
            <div className="mt-2 text-[9px] text-dd-muted max-w-xl text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>
                Ducky AI Premium — Tire dúvidas ilimitadas e ative análise de repositórios do
                GitHub.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
