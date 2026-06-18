'use client';

import {
  Bold,
  Code,
  Heading1,
  Italic,
  Link as LinkIcon,
  Quote,
  SquareCode,
  Table2,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export type MarkdownToolbarAction =
  | 'bold'
  | 'italic'
  | 'inlineCode'
  | 'codeBlock'
  | 'heading'
  | 'quote'
  | 'link'
  | 'table';

interface MarkdownToolbarProps {
  onAction: (action: MarkdownToolbarAction) => void;
  disabled?: boolean;
  className?: string;
}

const actions = [
  { id: 'bold', label: 'Negrito', icon: Bold },
  { id: 'italic', label: 'Italico', icon: Italic },
  { id: 'inlineCode', label: 'Codigo inline', icon: Code },
  { id: 'codeBlock', label: 'Bloco de codigo', icon: SquareCode },
  { id: 'heading', label: 'Titulo', icon: Heading1 },
  { id: 'quote', label: 'Citacao', icon: Quote },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'table', label: 'Tabela', icon: Table2 },
] as const;

export function MarkdownToolbar({ onAction, disabled = false, className }: MarkdownToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 border-b border-dd-border bg-dd-surface/60 px-2 py-1.5',
        className
      )}
    >
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(action.id)}
            disabled={disabled}
            aria-label={action.label}
            title={action.label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-dd-muted transition-colors hover:bg-dd-bg hover:text-dd-text disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
