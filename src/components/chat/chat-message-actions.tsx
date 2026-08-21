'use client';

import { Copy, Pencil, RotateCw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from './types';

interface ChatMessageActionsProps {
  message: ChatMessage;
  onRegenerate?: (text: string) => void;
  onEdit?: (text: string) => void;
}

function ActionButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text sm:size-7"
    >
      {children}
    </button>
  );
}

/**
 * Ações abaixo da mensagem — sempre visíveis na resposta da IA; no balão do
 * usuário ficam ocultas até o hover (desktop) e sem like/deslike.
 */
export function ChatMessageActions({ message, onRegenerate, onEdit }: ChatMessageActionsProps) {
  const isDucky = message.sender === 'ducky';

  return (
    <div
      className={cn(
        'mt-1.5 flex select-none items-center gap-0.5 text-dd-muted transition-opacity duration-150',
        !isDucky && 'md:opacity-0 md:group-hover:opacity-100'
      )}
    >
      <ActionButton
        title="Copiar"
        onClick={() => {
          void navigator.clipboard.writeText(message.text);
        }}
      >
        <Copy className="size-3.5" />
      </ActionButton>

      {isDucky && onRegenerate && (
        <ActionButton title="Regenerar" onClick={() => onRegenerate(message.text)}>
          <RotateCw className="size-3.5" />
        </ActionButton>
      )}

      {/* Like/deslike só na resposta da IA — quem escreveu não avalia a própria mensagem */}
      {isDucky && (
        <>
          <ActionButton title="Gostei">
            <ThumbsUp className="size-3.5" />
          </ActionButton>
          <ActionButton title="Não gostei">
            <ThumbsDown className="size-3.5" />
          </ActionButton>
        </>
      )}
      <ActionButton title="Compartilhar">
        <Share2 className="size-3.5" />
      </ActionButton>

      {!isDucky && onEdit && (
        <ActionButton title="Editar" onClick={() => onEdit(message.text)}>
          <Pencil className="size-3.5" />
        </ActionButton>
      )}
    </div>
  );
}
