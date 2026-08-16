'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  Gauge,
  Minus,
  RotateCcw,
  Target,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ChatEffort, ChatMode, ChatSpeed } from '@/components/chat/types';

/**
 * Seletor de modelo/esforço do chat (estilo ChatGPT): um pill mostrando o
 * modelo (ASYNC) + esforço (velocidade) que abre um menu com linhas
 * "label — valor" que expandem as opções de cada grupo.
 */

interface AiModeMenuProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  speed?: ChatSpeed;
  onSpeedChange?: (speed: ChatSpeed) => void;
  effort?: ChatEffort;
  onEffortChange?: (effort: ChatEffort) => void;
  disabled?: boolean;
}

/** Modos do modelo — o modo padrão é exibido como "Normal". */
const MODE_OPTIONS: Array<{ value: ChatMode; label: string; icon: typeof Zap }> = [
  { value: 'Rápido', label: 'Normal', icon: Zap },
  { value: 'Deep Debug', label: 'Deep Debug', icon: Target },
  { value: 'Repositório', label: 'Repositório', icon: Folder },
];

const SPEED_OPTIONS: Array<{ value: ChatSpeed; label: string; icon: typeof Gauge }> = [
  { value: 'Normal', label: 'Normal', icon: Gauge },
  { value: 'Rápida', label: 'Rápida', icon: Zap },
];

const EFFORT_OPTIONS: Array<{ value: ChatEffort; label: string; icon: typeof Minus }> = [
  { value: 'Baixo', label: 'Baixo', icon: ArrowDown },
  { value: 'Médio', label: 'Médio', icon: Minus },
  { value: 'Alto', label: 'Alto', icon: ArrowUp },
];

export function AiModeMenu({
  mode,
  onModeChange,
  speed = 'Normal',
  onSpeedChange,
  effort = 'Médio',
  onEffortChange,
  disabled = false,
}: AiModeMenuProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<'modelo' | 'esforço' | 'velocidade' | null>(null);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou pressionar Escape.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectMode = (next: ChatMode) => {
    onModeChange(next);
    setExpanded(null);
    setOpen(false);
  };

  const selectSpeed = (next: ChatSpeed) => {
    onSpeedChange?.(next);
    setExpanded(null);
    setOpen(false);
  };

  const selectEffort = (next: ChatEffort) => {
    onEffortChange?.(next);
    setExpanded(null);
    setOpen(false);
  };

  const resetDefaults = () => {
    onModeChange('Rápido');
    onSpeedChange?.('Normal');
    onEffortChange?.('Médio');
    setExpanded(null);
    setOpen(false);
  };

  // Valor exibido na linha do menu (label do modo atual, ex.: "Normal").
  const modeLabel = MODE_OPTIONS.find((o) => o.value === mode)?.label ?? mode;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Modelo e esforço do chat"
        title="Modelo e esforço do chat"
        className={cn(
          'flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-lg px-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40',
          open ? 'bg-dd-surface text-dd-text' : 'text-dd-text hover:bg-dd-surface'
        )}
      >
        {/* Raio preenchido à esquerda do nome — aparece apenas na velocidade Rápida */}
        {speed === 'Rápida' && (
          <span className="flex size-4 shrink-0 items-center justify-center">
            <Zap className="size-4 fill-current text-dd-text" />
          </span>
        )}
        <span className="text-xs font-bold text-dd-text">ASYNC</span>
        {/* Esforço em cinza, como na referência "5.5 Alto" */}
        <span className="text-xs font-medium text-dd-muted">{effort}</span>
        <ChevronDown
          className={cn(
            'size-3 shrink-0 text-dd-muted transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Modelo e esforço"
            initial={reduced ? false : { opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute bottom-full right-0 z-50 mb-2 w-64 origin-bottom-right overflow-hidden rounded-xl border border-dd-border/70 bg-dd-surface p-2 font-sans shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          >
            {/* Modelo */}
            <div>
              <button
                type="button"
                onClick={() => setExpanded(expanded === 'modelo' ? null : 'modelo')}
                aria-expanded={expanded === 'modelo'}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-dd-text transition-colors hover:bg-dd-bg/50"
              >
                <span>Modelo</span>
                <span className="ml-auto text-dd-muted">{modeLabel}</span>
                <ChevronRight
                  className={cn(
                    'size-3.5 shrink-0 text-dd-muted transition-transform duration-200',
                    expanded === 'modelo' && 'rotate-90'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded === 'modelo' && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pb-1.5">
                      {MODE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = mode === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="menuitemradio"
                            aria-checked={active}
                            onClick={() => selectMode(opt.value)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2.5 rounded-lg pl-9 pr-3 py-2 text-left text-xs font-medium transition-colors',
                              active
                                ? 'text-dd-text'
                                : 'text-dd-muted hover:bg-dd-bg/50 hover:text-dd-text'
                            )}
                          >
                            <Icon
                              className={cn(
                                'size-3.5 shrink-0',
                                active ? 'text-dd-text' : 'text-dd-muted'
                              )}
                            />
                            <span className="flex-1 truncate">{opt.label}</span>
                            {active && <Check className="size-3.5 shrink-0 text-dd-text" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Esforço */}
            <div>
              <button
                type="button"
                onClick={() => setExpanded(expanded === 'esforço' ? null : 'esforço')}
                aria-expanded={expanded === 'esforço'}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-dd-text transition-colors hover:bg-dd-bg/50"
              >
                <span>Esforço</span>
                <span className="ml-auto text-dd-muted">{effort}</span>
                <ChevronRight
                  className={cn(
                    'size-3.5 shrink-0 text-dd-muted transition-transform duration-200',
                    expanded === 'esforço' && 'rotate-90'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded === 'esforço' && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pb-1.5">
                      {EFFORT_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = effort === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="menuitemradio"
                            aria-checked={active}
                            onClick={() => selectEffort(opt.value)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2.5 rounded-lg pl-9 pr-3 py-2 text-left text-xs font-medium transition-colors',
                              active
                                ? 'text-dd-text'
                                : 'text-dd-muted hover:bg-dd-bg/50 hover:text-dd-text'
                            )}
                          >
                            <Icon
                              className={cn(
                                'size-3.5 shrink-0',
                                active ? 'text-dd-text' : 'text-dd-muted'
                              )}
                            />
                            <span className="flex-1 truncate">{opt.label}</span>
                            {active && <Check className="size-3.5 shrink-0 text-dd-text" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Velocidade */}
            <div>
              <button
                type="button"
                onClick={() => setExpanded(expanded === 'velocidade' ? null : 'velocidade')}
                aria-expanded={expanded === 'velocidade'}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-dd-text transition-colors hover:bg-dd-bg/50"
              >
                <span>Velocidade</span>
                <span className="ml-auto text-dd-muted">{speed}</span>
                <ChevronRight
                  className={cn(
                    'size-3.5 shrink-0 text-dd-muted transition-transform duration-200',
                    expanded === 'velocidade' && 'rotate-90'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded === 'velocidade' && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pb-1.5">
                      {SPEED_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = speed === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="menuitemradio"
                            aria-checked={active}
                            onClick={() => selectSpeed(opt.value)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2.5 rounded-lg pl-9 pr-3 py-2 text-left text-xs font-medium transition-colors',
                              active
                                ? 'text-dd-text'
                                : 'text-dd-muted hover:bg-dd-bg/50 hover:text-dd-text'
                            )}
                          >
                            <Icon
                              className={cn(
                                'size-3.5 shrink-0',
                                active ? 'text-dd-text' : 'text-dd-muted'
                              )}
                            />
                            <span className="flex-1 truncate">{opt.label}</span>
                            {active && <Check className="size-3.5 shrink-0 text-dd-text" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="my-1.5 h-px bg-dd-border/60" />

            {/* Redefinir para o padrão — ícone de refresh à direita, como na referência */}
            <button
              type="button"
              onClick={resetDefaults}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-dd-muted transition-colors hover:bg-dd-bg/50 hover:text-dd-text"
            >
              <span className="flex-1">Redefinir para o padrão</span>
              <RotateCcw className="size-3.5 shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
