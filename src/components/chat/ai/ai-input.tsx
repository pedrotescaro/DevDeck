'use client';

import { useEffect } from 'react';
import { FileCode, Globe, Image as ImageIcon, Send, Square, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { cn } from '@/lib/utils';
import type { ChatEffort, ChatMode, ChatSpeed } from '@/components/chat/types';
import { AiAddMenu } from './ai-add-menu';
import { AiModeMenu } from './ai-mode-menu';
import { AiVoice } from './ai-voice';

/**
 * Composer baseado no padrão KokonutUI "AI Input Search", adaptado aos
 * tokens de design do projeto (dd-*). Auto-resize, Enter para enviar,
 * Shift+Enter para nova linha, anexos, busca e voz integrados.
 */

export interface AiInputAttachment {
  id: string;
  name: string;
  kind: 'image' | 'code';
}

interface AiInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  thinking?: boolean;
  minHeight?: number;
  maxHeight?: number;
  searchEnabled?: boolean;
  onToggleSearch?: () => void;
  deepThinkEnabled?: boolean;
  onToggleDeepThink?: () => void;
  deepThinkDisabled?: boolean;
  mode?: ChatMode;
  onModeChange?: (mode: ChatMode) => void;
  speed?: ChatSpeed;
  onSpeedChange?: (speed: ChatSpeed) => void;
  effort?: ChatEffort;
  onEffortChange?: (effort: ChatEffort) => void;
  attachments?: AiInputAttachment[];
  onRemoveAttachment?: (id: string) => void;
  onPickAttachments?: () => void;
}

export function AiInput({
  value,
  onChange,
  onSubmit,
  onStop,
  disabled = false,
  placeholder = 'Pergunte qualquer coisa...',
  thinking = false,
  minHeight = 52,
  maxHeight = 200,
  searchEnabled = false,
  onToggleSearch,
  deepThinkEnabled = false,
  onToggleDeepThink,
  deepThinkDisabled = false,
  mode = 'Rápido',
  onModeChange,
  speed = 'Normal',
  onSpeedChange,
  effort = 'Médio',
  onEffortChange,
  attachments = [],
  onRemoveAttachment,
  onPickAttachments,
}: AiInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea(minHeight, maxHeight);

  // Re-sync height when the value is cleared programmatically (e.g. after send).
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const canSend = !disabled && (value.trim().length > 0 || attachments.length > 0);

  const handleSubmit = () => {
    if (!canSend || thinking) return;
    onSubmit(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative min-w-0 rounded-xl border border-dd-border/60 transition-all duration-200 focus-within:border-dd-text/40 focus-within:ring-1 focus-within:ring-dd-text/15 sm:rounded-2xl">
      {/* Attachment chips preview */}
      <AnimatePresence initial={false}>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex max-w-[180px] items-center gap-1.5 rounded-lg border border-dd-border/70 bg-dd-bg/70 py-1 pl-2 pr-1 text-[11px] text-dd-text"
                >
                  {file.kind === 'image' ? (
                    <ImageIcon className="size-3.5 shrink-0 text-dd-text" />
                  ) : (
                    <FileCode className="size-3.5 shrink-0 text-dd-text" />
                  )}
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment?.(file.id)}
                    aria-label={`Remover anexo ${file.name}`}
                    title="Remover anexo"
                    className="shrink-0 cursor-pointer rounded p-0.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ minHeight, maxHeight }}
        className="w-full resize-none overflow-y-auto border-0 bg-transparent px-3 pb-1 pt-3 text-base leading-relaxed text-dd-text outline-none ring-0 placeholder:text-dd-muted focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:pt-3.5 sm:text-sm"
      />

      {/* Bottom row */}
      <div className="flex min-w-0 select-none items-center justify-between gap-1 px-1.5 pb-1.5 pt-1 sm:gap-2 sm:px-2.5 sm:pb-2.5">
        {/* Left: "+" Adicionar (arquivos + config) + busca separada */}
        <div className="flex min-w-0 items-center gap-0.5">
          <AiAddMenu
            disabled={disabled}
            onPickAttachments={onPickAttachments}
            deepThinkEnabled={deepThinkEnabled}
            onToggleDeepThink={onToggleDeepThink}
            deepThinkDisabled={deepThinkDisabled}
          />

          {onToggleSearch && (
            <button
              type="button"
              onClick={onToggleSearch}
              disabled={disabled}
              aria-pressed={searchEnabled}
              title={searchEnabled ? 'Busca na web ativa' : 'Buscar na web'}
              className={cn(
                'flex h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:min-w-0',
                searchEnabled
                  ? 'bg-dd-text/10 text-dd-text hover:bg-dd-text/15'
                  : 'text-dd-muted hover:bg-dd-surface hover:text-dd-text'
              )}
            >
              <Globe className="size-4" />
              <AnimatePresence initial={false}>
                {searchEnabled && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="hidden overflow-hidden whitespace-nowrap sm:inline"
                  >
                    Buscar
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>

        {/* Right: mode, voice, send */}
        <div className="flex items-center gap-1">
          {/* Seletor de modo ao lado esquerdo do microfone */}
          {onModeChange && (
            <AiModeMenu
              mode={mode}
              onModeChange={onModeChange}
              speed={speed}
              onSpeedChange={onSpeedChange}
              effort={effort}
              onEffortChange={onEffortChange}
              disabled={thinking}
            />
          )}

          {/* Mic button + floating listening panel (panel anchors to the composer container) */}
          <AiVoice
            disabled={disabled || thinking}
            onTranscript={(text) => {
              if (!text.trim()) return;
              onChange(value.trim() ? `${value.trimEnd()} ${text.trim()}` : text.trim());
            }}
          />

          <span aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-dd-border/70" />

          {thinking && onStop ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Parar geração"
              title="Parar"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-dd-surface text-dd-text transition-colors hover:bg-dd-border sm:size-8"
            >
              <Square className="size-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Enviar mensagem"
              title="Enviar (Enter)"
              className={cn(
                'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-all duration-200 disabled:cursor-not-allowed sm:size-8',
                canSend
                  ? 'bg-dd-text text-dd-bg shadow-sm hover:bg-dd-text/90'
                  : 'bg-dd-surface text-dd-muted disabled:opacity-60'
              )}
            >
              <Send className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
