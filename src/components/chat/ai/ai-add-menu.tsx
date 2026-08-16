'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Paperclip, Plus, Settings } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Botão "+" que abre o popup "Adicionar" (estilo ChatGPT): reúne o anexo de
 * arquivos e as configurações rápidas (Think Deeper, Busca na web) em um
 * único menu, em vez de botões separados no composer.
 */

interface AiAddMenuProps {
  onPickAttachments?: () => void;
  deepThinkEnabled?: boolean;
  onToggleDeepThink?: () => void;
  deepThinkDisabled?: boolean;
  disabled?: boolean;
}

export function AiAddMenu({
  onPickAttachments,
  deepThinkEnabled = false,
  onToggleDeepThink,
  deepThinkDisabled = false,
  disabled = false,
}: AiAddMenuProps) {
  const [open, setOpen] = useState(false);
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

  const pickFiles = () => {
    setOpen(false);
    onPickAttachments?.();
  };

  const itemClass = (itemDisabled: boolean) =>
    cn(
      'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
      itemDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-dd-bg/50'
    );

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Adicionar arquivos ou configurações"
        title="Adicionar"
        className={cn(
          'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40',
          open ? 'bg-dd-surface text-dd-text' : 'text-dd-text hover:bg-dd-surface'
        )}
      >
        <Plus className="size-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Adicionar"
            initial={reduced ? false : { opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute bottom-full left-0 z-50 mb-2 w-72 origin-bottom-left overflow-y-auto rounded-xl border border-dd-border/70 bg-dd-surface p-2 font-sans shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          >
            <p className="select-none px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-dd-muted">
              Adicionar
            </p>

            {/* Arquivos e pastas */}
            <button
              type="button"
              role="menuitem"
              onClick={pickFiles}
              disabled={disabled}
              className={itemClass(disabled)}
            >
              <Paperclip className="size-4 shrink-0 text-dd-text" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-dd-text">
                  Arquivos e pastas
                </span>
                <span className="block truncate text-[10px] text-dd-muted">
                  Anexar código ou imagens
                </span>
              </span>
            </button>

            {/* Think Deeper */}
            {onToggleDeepThink && (
              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={deepThinkEnabled}
                onClick={onToggleDeepThink}
                disabled={disabled || deepThinkDisabled}
                className={itemClass(disabled || deepThinkDisabled)}
              >
                <Settings className="size-4 shrink-0 text-dd-text" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-dd-text">
                    Think Deeper
                  </span>
                  <span className="block truncate text-[10px] text-dd-muted">
                    Análise mais profunda do código
                  </span>
                </span>
                {deepThinkEnabled && <Check className="size-4 shrink-0 text-dd-text" />}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
