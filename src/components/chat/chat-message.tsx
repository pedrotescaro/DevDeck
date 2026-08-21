'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { FileCode, Image as ImageIcon, RotateCw } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from './types';
import { ChatMessageActions } from './chat-message-actions';

/** Stable callbacks registry (see DuckyContent) so memoized messages never
 *  re-render during streaming just because the parent re-rendered. */
export interface MessageActionsRef {
  regenerate: (text: string) => void;
  edit: (text: string) => void;
  retry: (id: string) => void;
}

/** Github mark (not exported by the installed lucide-react version). */
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ChatMessageViewProps {
  message: ChatMessageType;
  actionsRef: { current: MessageActionsRef };
}

function ChatMessageInner({ message, actionsRef }: ChatMessageViewProps) {
  const reduced = useReducedMotion();
  const actions = actionsRef.current;
  const isDucky = message.sender === 'ducky';

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('group w-full', !isDucky && 'flex flex-col items-end')}
    >
      {isDucky ? (
        <div className="w-full min-w-0 overflow-hidden break-words">
          {/* Badge do repositório (contexto funcional, sem o cabeçalho da IA) */}
          {message.repo && !message.isStreaming && (
            <a
              href={message.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              title={message.repo.url}
              className="mb-1.5 inline-flex items-center gap-1 rounded-md border border-dd-border/60 bg-dd-surface/60 px-2 py-0.5 text-[10px] font-semibold text-dd-muted transition-colors hover:border-dd-text/40 hover:text-dd-text"
            >
              <Github className="size-3 text-dd-text" />
              <span className="max-w-[160px] truncate">
                {message.repo.owner}/{message.repo.name}
              </span>
            </a>
          )}

          <div className="max-w-full min-w-0 break-words text-sm leading-relaxed text-dd-text sm:text-[15px]">
            <MarkdownRenderer content={message.text} />
            {message.isStreaming && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse rounded-full bg-dd-text align-middle"
              />
            )}
          </div>

          {!message.isStreaming && !message.error && (
            <ChatMessageActions
              message={message}
              onRegenerate={(text) => actions.regenerate(text)}
            />
          )}

          {message.error && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-dd-muted">Não foi possível gerar a resposta.</span>
              <button
                type="button"
                onClick={() => actions.retry(message.id)}
                className="flex cursor-pointer items-center gap-1 rounded-lg border border-dd-border/60 bg-dd-surface/60 px-2.5 py-1 text-[11px] font-semibold text-dd-text transition-colors hover:border-dd-text/40 hover:text-dd-text"
              >
                <RotateCw className="size-3" />
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-1.5 flex max-w-[92%] flex-wrap justify-end gap-1.5 sm:max-w-[85%]">
              {message.attachments.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-lg border border-dd-border/50 bg-dd-surface/70 px-2 py-1 text-[10px] text-dd-text"
                >
                  {a.kind === 'image' ? (
                    a.data ? (
                      <Image
                        src={`data:${a.mimeType || 'image/png'};base64,${a.data}`}
                        alt={a.name}
                        width={20}
                        height={20}
                        className="mr-0.5 rounded object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-3 shrink-0 text-dd-text" />
                    )
                  ) : (
                    <FileCode className="size-3 shrink-0 text-dd-text" />
                  )}
                  <span className="max-w-[120px] truncate">{a.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-[92%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-dd-border/50 bg-dd-surface/80 px-3 py-2.5 text-sm leading-relaxed text-dd-text sm:max-w-[75%] sm:px-4">
            {message.text}
          </div>

          <ChatMessageActions message={message} onEdit={(text) => actions.edit(text)} />
        </>
      )}
    </motion.div>
  );
}

/**
 * Memoized: during streaming the parent re-renders every tick, but only the
 * streaming message gets a new reference — the rest are skipped.
 */
export const ChatMessageView = memo(
  ChatMessageInner,
  (prev, next) => prev.message === next.message && prev.actionsRef === next.actionsRef
);
