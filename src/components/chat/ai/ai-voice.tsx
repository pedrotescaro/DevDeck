'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * AI Voice — mic button com digitação por fala real via Web Speech API
 * (SpeechRecognition). O painel de escuta (timer + waveform + transcrição ao
 * vivo) flutua dentro do composer — o ancestral posicionado mais próximo deve
 * ser o container do composer (`relative`).
 *
 * Quando o reconhecimento termina (pausa do usuário ou botão parar), o texto
 * final é entregue via `onTranscript`.
 */

const WAVE_BARS = 16;
const MIN_BAR = 3;
const MAX_BAR = 16;

/** Pausa na fala (ms) após a qual a gravação encerra automaticamente. */
const SILENCE_TIMEOUT_MS = 2500;
/** Frequência do watchdog que detecta o silêncio. */
const WATCHDOG_INTERVAL_MS = 500;

function formatTime(totalSeconds: number) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/* ── Tipos mínimos do Web Speech API (não incluídos no lib.dom do TS) ── */

interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultListLike {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface AiVoiceProps {
  disabled?: boolean;
  className?: string;
  /** Recebe o texto final transcrito quando a gravação termina. */
  onTranscript?: (text: string) => void;
}

export function AiVoice({ disabled, className, onTranscript }: AiVoiceProps) {
  const { language } = useLanguage();
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [denied, setDenied] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: WAVE_BARS }, () => MIN_BAR)
  );
  const reduced = useReducedMotion();

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTextRef = useRef('');
  const lastResultRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const recognitionLang = language === 'en' ? 'en-US' : 'pt-BR';

  // Timer while listening.
  useEffect(() => {
    if (!listening) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [listening]);

  // Animated waveform while listening.
  useEffect(() => {
    if (!listening || reduced) return;
    const wave = window.setInterval(() => {
      setHeights((prev) =>
        prev.map(() => {
          const center = Math.sin(Math.random() * Math.PI * 2);
          return MIN_BAR + Math.abs(center) * (MAX_BAR - MIN_BAR);
        })
      );
    }, 220);
    return () => window.clearInterval(wave);
  }, [listening, reduced]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      if (watchdogRef.current) window.clearInterval(watchdogRef.current);
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const showNotice = (kind: 'unsupported' | 'denied') => {
    setUnsupported(kind === 'unsupported');
    setDenied(kind === 'denied');
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => {
      setUnsupported(false);
      setDenied(false);
      noticeTimerRef.current = null;
    }, 2600);
  };

  const reset = () => {
    if (watchdogRef.current) {
      window.clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }
    recognitionRef.current = null;
    finalTextRef.current = '';
    setListening(false);
    setSeconds(0);
    setFinalText('');
    setInterimText('');
  };

  const startRecognition = () => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      showNotice('unsupported');
      return;
    }

    const recognition = new Ctor();
    recognition.lang = recognitionLang;
    // Contínuo: não corta o áudio em pausas curtas. O watchdog encerra após
    // um silêncio maior, evitando gravação infinita.
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      lastResultRef.current = Date.now();
      let final = finalTextRef.current;
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) final += text;
        else interim += text;
      }
      finalTextRef.current = final;
      setFinalText(final);
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        reset();
        showNotice('denied');
        return;
      }
      // 'no-speech' / 'aborted' / etc.: encerra silenciosamente.
      reset();
    };

    recognition.onend = () => {
      const final = finalTextRef.current.trim();
      if (final) onTranscriptRef.current?.(final);
      reset();
    };

    recognitionRef.current = recognition;
    setSeconds(0);
    setFinalText('');
    setInterimText('');
    setListening(true);
    recognition.start();

    // Watchdog: encerra graciosamente após um silêncio prolongado.
    lastResultRef.current = Date.now();
    watchdogRef.current = window.setInterval(() => {
      if (!recognitionRef.current) return;
      if (Date.now() - lastResultRef.current > SILENCE_TIMEOUT_MS) {
        recognitionRef.current.stop();
      }
    }, WATCHDOG_INTERVAL_MS);
  };

  const toggle = () => {
    if (disabled) return;
    if (listening) {
      // Encerra de forma graciosa: `onend` entrega a transcrição final.
      recognitionRef.current?.stop();
      return;
    }
    startRecognition();
  };

  const transcriptPreview = `${finalText}${interimText}`.trim();

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-label={listening ? 'Parar gravação de voz' : 'Entrada de voz'}
        title={listening ? 'Parar gravação' : 'Entrada de voz'}
        className={cn(
          'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-dd-text transition-colors hover:bg-dd-surface disabled:cursor-not-allowed disabled:opacity-40 sm:size-8',
          listening && 'bg-dd-text/10 text-dd-text hover:bg-dd-text/10 hover:text-dd-text',
          className
        )}
      >
        {listening ? <Square className="size-4 fill-current" /> : <Mic className="size-4" />}
      </button>

      <AnimatePresence>
        {listening && (
          <motion.div
            key="listening"
            initial={reduced ? false : { opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-x-2.5 bottom-[46px] z-10"
          >
            <div className="rounded-xl border border-dd-border/60 bg-dd-surface/95 px-3 py-2 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="relative flex size-2 shrink-0">
                    <span
                      className={cn(
                        'absolute inline-flex h-full w-full rounded-full bg-dd-text opacity-60',
                        !reduced && 'animate-ping'
                      )}
                    />
                    <span className="relative inline-flex size-2 rounded-full bg-dd-text" />
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold text-dd-text">
                    Listening...
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-dd-muted">
                    {formatTime(seconds)}
                  </span>
                </div>

                <div className="flex h-5 items-center gap-[3px]" aria-hidden="true">
                  {Array.from({ length: WAVE_BARS }, (_, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: reduced ? MIN_BAR : heights[i] }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="w-[2px] rounded-full bg-dd-text/70"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Parar gravação de voz"
                  title="Parar"
                  className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
                >
                  <Square className="size-3 fill-current" />
                </button>
              </div>

              {transcriptPreview && (
                <p className="mt-1.5 truncate text-[11px] italic leading-snug text-dd-muted">
                  {finalText}
                  <span className="text-dd-muted/70">{interimText}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}

        {(unsupported || denied) && (
          <motion.div
            key="notice"
            initial={reduced ? false : { opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-x-2.5 bottom-[46px] z-10"
          >
            <div className="rounded-xl border border-dd-border/60 bg-dd-surface/95 px-3 py-2 shadow-sm backdrop-blur-sm">
              <p className="text-[11px] font-medium text-dd-muted">
                {denied
                  ? 'Permissão de microfone negada. Habilite o acesso e tente novamente.'
                  : 'Seu navegador não suporta entrada de voz.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
