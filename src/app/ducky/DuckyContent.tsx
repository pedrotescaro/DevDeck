'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paperclip,
  Send,
  History,
  Sparkles,
  Maximize2,
  ChevronDown,
  Check,
  ArrowLeft,
  Terminal,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface DuckyContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
    streak?: number;
    streak_days?: number;
  };
  activeLanguage: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ducky';
  text: string;
  isStreaming?: boolean;
}

export function DuckyContent({ user, activeLanguage }: DuckyContentProps) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Custom naming & DevDeck alignment:
  // - mode 'Rápido' maps to 'Rápido' (Instant) tab
  // - mode 'Deep Debug' maps to 'Deep Debug' (Expert) tab
  const [mode, setMode] = useState<'Rápido' | 'Deep Debug'>('Rápido');
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const [thinking, setThinking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [stars, setStars] = useState<
    { x: number; y: number; size: number; opacity: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.6 + 0.7,
      opacity: Math.random() * 0.7 + 0.15,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 4,
    }));
    setStars(generated);
  }, []);

  // Sync mode and deepThinkActive
  useEffect(() => {
    setDeepThinkActive(mode === 'Deep Debug');
  }, [mode]);

  const handleDeepThinkToggle = () => {
    const nextVal = !deepThinkActive;
    setDeepThinkActive(nextVal);
    setMode(nextVal ? 'Deep Debug' : 'Rápido');
  };

  // Smooth scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // Auto-resize textarea as typing
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [inputVal]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || thinking) return;

    // Append Search or DeepThink hints to query internally if active to improve prompt context
    let finalQuery = textToSend;
    if (searchActive) {
      finalQuery = `[Pesquisa ativa] ${finalQuery}`;
    }

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
            content: m.sender === 'user' && m.id === userMsg.id ? finalQuery : m.text,
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

        // Streaming text simulation
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

  const handleSuggestionClick = (suggestionText: string) => {
    let text = '';
    if (suggestionText === 'Explicar Bug') {
      text = '🐛 Quero ajuda para encontrar um bug neste código: \n\n';
    } else if (suggestionText === 'Refatorar Código') {
      text = '⚡ Como posso refatorar e otimizar este código: \n\n';
    } else if (suggestionText === 'Escrever Teste') {
      text = '📝 Escreva testes unitários para a seguinte função: \n\n';
    } else {
      text = suggestionText;
    }

    setInputVal(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const clearHistory = () => {
    if (confirm('Deseja apagar o histórico de conversa com o Ducky?')) {
      setMessages([]);
    }
  };

  const initials = user.username.slice(0, 2).toUpperCase() || 'DV';

  // DevDeck Ducky-style input card (Orange accents and custom button names)
  const renderInputCard = () => {
    return (
      <div className="w-full bg-[#131316]/90 border border-[#232329] rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-2xl focus-within:border-orange-500/40 focus-within:shadow-[0_0_25px_rgba(249,115,22,0.12)] transition-all duration-300 max-w-2xl mx-auto backdrop-blur-md">
        {/* Text area input */}
        <textarea
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(inputVal);
            }
          }}
          disabled={thinking}
          placeholder="Perguntar ao Ducky..."
          rows={2}
          className="w-full bg-transparent border-0 outline-0 ring-0 text-sm text-dd-text placeholder-[#53535f] resize-none py-1.5 max-h-36 overflow-y-auto font-sans leading-relaxed focus:ring-0 focus:outline-none"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between border-t border-[#1f1f23]/40 pt-3 mt-2 select-none">
          {/* Left side: Orange Toggles */}
          <div className="flex items-center gap-2">
            {/* Deep Debug Toggle */}
            <button
              type="button"
              onClick={handleDeepThinkToggle}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer select-none ${
                deepThinkActive
                  ? 'bg-[#2a1b15] border-[#7c3a0d] text-[#f97316]'
                  : 'bg-[#1a1a1f] border-[#232329] text-[#8b8b93] hover:bg-[#232329] hover:text-dd-text'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Deep Debug</span>
            </button>

            {/* Buscar Docs Toggle */}
            <button
              type="button"
              onClick={() => setSearchActive(!searchActive)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer select-none ${
                searchActive
                  ? 'bg-[#2a1b15] border-[#7c3a0d] text-[#f97316]'
                  : 'bg-[#1a1a1f] border-[#232329] text-[#8b8b93] hover:bg-[#232329] hover:text-dd-text'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-none stroke-current"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" />
              </svg>
              <span>Buscar Docs</span>
            </button>
          </div>

          {/* Right side: Attachment and Send (Orange theme) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Envio de arquivos em breve.')}
              className="p-2 hover:bg-[#232329] rounded-full text-[#8b8b93] hover:text-dd-text transition-all cursor-pointer"
              title="Anexar arquivo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleSend(inputVal)}
              disabled={!inputVal.trim() || thinking}
              className="p-2 bg-[#f97316] hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-[#f97316] disabled:cursor-not-allowed text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 w-8.5 h-8.5 shadow-md"
              title="Enviar"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4.5 h-4.5 fill-none stroke-current"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBottomBanner = () => {
    return (
      <div className="absolute bottom-6 right-6 max-w-xs md:max-w-sm bg-[#09090b]/80 border border-[#1f1f23] rounded-2xl p-3 flex items-center justify-between gap-4 shadow-xl z-20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 text-sm">
            ✨
          </div>
          <div className="font-sans">
            <p className="text-[11px] font-bold text-dd-text">Personalizar o Ducky</p>
            <p className="text-[9px] text-[#71767b] font-medium leading-tight">
              Tenha acesso a mais recursos no Ducky AI Premium
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Recurso premium em breve!')}
          className="px-3 py-1.5 bg-[#f97316] hover:bg-orange-600 text-white text-[10px] font-extrabold rounded-full transition-all cursor-pointer shrink-0 shadow-sm"
        >
          Explorar
        </button>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen bg-[#060606] text-dd-text antialiased transition-all ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      {/* Dynamic inline styles for premium animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.85; transform: scale(1.15); }
        }
        @keyframes float-nebula {
          0%, 100% { transform: scale(1) translate(0px, 0px); }
          50% { transform: scale(1.04) translate(10px, -8px); }
        }
      `,
        }}
      />

      {/* Hide sidebar if in fullscreen focus mode */}
      {!isFullscreen && <Sidebar user={user} />}

      <div className="flex-grow flex flex-col min-w-0 bg-[#060606] border-l border-[#1f1f23]/40 relative overflow-hidden">
        {/* Starry Background & cosmic nebulae */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_top_left,rgba(124,111,247,0.035)_0%,transparent_70%)]"
            style={{ animation: 'float-nebula 20s infinite ease-in-out' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.035)_0%,transparent_70%)]"
            style={{ animation: 'float-nebula 24s infinite ease-in-out' }}
          />

          {stars.map((star, idx) => (
            <div
              key={idx}
              className="absolute bg-white rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f23]/40 bg-[#060606]/40 backdrop-blur-md sticky top-0 z-20 relative select-none">
          {/* Top Left: Fullscreen Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 border border-[#1f1f23] bg-[#0c0c0e] hover:bg-[#16161a] text-dd-muted hover:text-dd-text rounded-lg transition-all cursor-pointer"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Modo Foco / Tela Cheia'}
            >
              {isFullscreen ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            {isFullscreen && (
              <span className="text-xs font-semibold text-[#8b8b93]">Modo Foco</span>
            )}
          </div>

          {/* Top Right: História / Privado */}
          <div className="flex items-center gap-2.5">
            {/* History Link / Button */}
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c0c0e] hover:bg-[#16161a] border border-[#1f1f23] rounded-lg text-[10px] font-bold text-dd-muted hover:text-dd-text transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>História</span>
              </button>
            )}

            {/* Private Mode Toggle */}
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                isPrivate
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : 'bg-[#0c0c0e] border-[#1f1f23] hover:bg-[#16161a] text-dd-muted'
              }`}
              title={isPrivate ? 'Histórico pausado (Modo Privado)' : 'Ativar Modo Privado'}
            >
              {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>Privado</span>
            </button>
          </div>
        </header>

        {/* Chat / Welcome Area */}
        {messages.length === 0 ? (
          /* EMPTY STATE (DeepSeek Layout Customized for Ducky) */
          <div className="flex-grow flex flex-col justify-center items-center overflow-y-auto px-4 py-8 max-w-3xl w-full mx-auto relative z-10">
            <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center -mt-16">
              {/* Ducky IA Branding */}
              <div className="flex items-center justify-center gap-3.5 select-none mb-1 animate-in fade-in zoom-in-95 duration-500">
                <img
                  src="/Logo_ia_ducky.png"
                  alt="Ducky IA Logo"
                  className="w-10 h-10 object-contain animate-bounce"
                />
                <span className="text-2xl font-bold tracking-tight text-white font-sans">
                  {mode === 'Rápido'
                    ? 'Conversar com o Ducky Rápido'
                    : 'Depuração Profunda com o Ducky'}
                </span>
              </div>

              {/* Mode switch tabs capsule (Rápido, Deep Debug, Repositório) */}
              <div className="flex bg-[#111115] border border-[#1f1f23] rounded-full p-1 select-none animate-in fade-in duration-300">
                <button
                  onClick={() => {
                    setMode('Rápido');
                  }}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Rápido'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Zap
                    className={`w-3.5 h-3.5 ${mode === 'Rápido' ? 'text-[#f97316] fill-[#f97316]' : ''}`}
                  />
                  <span>Rápido</span>
                </button>

                <button
                  onClick={() => {
                    setMode('Deep Debug');
                  }}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'Deep Debug'
                      ? 'bg-[#2a1b15] text-[#f97316] shadow-sm'
                      : 'text-[#8b8b93] hover:text-dd-text'
                  }`}
                >
                  <Terminal
                    className={`w-3.5 h-3.5 ${mode === 'Deep Debug' ? 'text-[#f97316]' : ''}`}
                  />
                  <span>Deep Debug</span>
                </button>

                <button
                  onClick={() => alert('Análise de repositório em breve!')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-[#484852] hover:text-[#8b8b93] cursor-pointer transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-none stroke-current"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Repositório</span>
                </button>
              </div>

              {/* Centered Ducky Input Card */}
              <div className="w-full">{renderInputCard()}</div>

              {/* Minimal Suggestion pills with icons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={() => handleSuggestionClick('Explicar Bug')}
                  className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] bg-[#0c0c0e]/30 hover:bg-[#16161a]/60 hover:border-[#38383e] text-[11px] font-semibold text-[#8b8b93] hover:text-dd-text rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-none stroke-current text-orange-500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v2M6 8a6 6 0 0 1 12 0c0 3 2.5 4 2.5 4H3.5S6 11 6 8Z" />
                    <path d="M18 12h-3M6 12H9M15 16H9" />
                    <path d="m19 6-1.5 1.5M5 6l1.5 1.5M12 18v3" />
                  </svg>
                  <span>Explicar Bug</span>
                </button>
                <button
                  onClick={() => handleSuggestionClick('Refatorar Código')}
                  className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] bg-[#0c0c0e]/30 hover:bg-[#16161a]/60 hover:border-[#38383e] text-[11px] font-semibold text-[#8b8b93] hover:text-dd-text rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-none stroke-current text-purple-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707m0-12.728.707.707m11.314 11.314.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                  </svg>
                  <span>Refatorar Código</span>
                </button>
                <button
                  onClick={() => handleSuggestionClick('Escrever Teste')}
                  className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] bg-[#0c0c0e]/30 hover:bg-[#16161a]/60 hover:border-[#38383e] text-[11px] font-semibold text-[#8b8b93] hover:text-dd-text rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-none stroke-current text-green-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                  <span>Escrever Teste</span>
                </button>
              </div>
            </div>

            {/* Floating Banner */}
            {renderBottomBanner()}
          </div>
        ) : (
          /* CONVERSATION FLOW (Bubble-free clean thread) */
          <>
            <div className="flex-grow overflow-y-auto px-6 py-6 max-w-3xl w-full mx-auto relative z-10 scrollbar-thin">
              <div className="flex flex-col w-full pb-36">
                {isPrivate && (
                  <div className="mb-4 bg-purple-500/5 border border-purple-500/10 p-3.5 rounded-xl flex items-center gap-2.5 text-purple-400 text-xs select-none">
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
                      className="flex gap-4 items-start w-full py-5 border-b border-[#1f1f23]/30 animate-in fade-in slide-in-from-bottom-1 duration-200"
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#0c0c0e] border border-[#2f2f36]/60 select-none">
                        {isDucky ? (
                          <img
                            src="/Logo_ia_ducky.png"
                            alt="Ducky"
                            className="w-8 h-8 object-contain"
                          />
                        ) : user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-[#8b8b93]">{initials}</span>
                        )}
                      </div>

                      {/* Message body */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1 select-none">
                          <span className="text-xs font-bold text-dd-text">
                            {isDucky ? 'Ducky AI' : user.username}
                          </span>
                          <span className="text-[10px] text-[#71767b] font-medium">
                            {isDucky ? '@ducky' : `@${user.username.toLowerCase()}`}
                          </span>
                        </div>

                        <div className="text-sm text-dd-text leading-relaxed font-sans pr-2">
                          {isDucky ? (
                            <MarkdownRenderer content={msg.text} />
                          ) : (
                            <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                          )}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3 bg-orange-500 ml-1 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Thinking Indicator */}
                {thinking && (
                  <div className="flex gap-4 items-start w-full py-5 border-b border-[#1f1f23]/10">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#0c0c0e] border border-[#2f2f36]/60 select-none">
                      <img
                        src="/Logo_ia_ducky.png"
                        alt="Ducky thinking"
                        className="w-8 h-8 object-contain animate-bounce"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1 select-none">
                        <span className="text-xs font-bold text-dd-text">Ducky AI</span>
                        <span className="text-[10px] text-[#71767b] font-medium">@ducky</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#71767b] py-1 font-sans">
                        <div className="flex gap-1.5">
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
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Bottom Pinned Input Card */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#060606] via-[#060606]/95 to-transparent z-20">
              <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
                {renderInputCard()}

                {/* Premium Promotion Hint */}
                <div className="mt-2.5 text-[9px] text-[#71767b] max-w-xl text-center flex items-center justify-center gap-1.5 select-none">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>
                    Ducky AI Premium — Tire dúvidas ilimitadas e ative análise de repositórios do
                    GitHub.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
