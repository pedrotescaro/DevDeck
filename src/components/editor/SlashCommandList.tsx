'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  Bold,
  Code,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  SquareCode,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SlashCommandItem {
  key: keyof typeof slashCommandItems;
  title: string;
  description: string;
  icon: typeof Bold;
  command: () => void;
}

interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashCommandList = forwardRef<
  { onKeyDown: (event: KeyboardEvent) => boolean },
  SlashCommandListProps
>(function SlashCommandList({ items, command }, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((index) => (index + items.length - 1) % items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((index) => (index + 1) % items.length);
        return true;
      }

      if (event.key === 'Enter') {
        const item = items[selectedIndex];
        if (item) command(item);
        return true;
      }

      return false;
    },
  }));

  if (!items.length) {
    return (
      <div className="slash-menu rounded-xl border border-dd-border bg-dd-surface p-3 text-xs text-dd-muted shadow-xl">
        Nenhum bloco encontrado
      </div>
    );
  }

  return (
    <div className="slash-menu w-64 overflow-hidden rounded-xl border border-dd-border bg-dd-surface shadow-xl">
      <p className="border-b border-dd-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-dd-muted">
        Blocos
      </p>
      <div className="max-h-64 overflow-y-auto p-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => command(item)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer',
                index === selectedIndex
                  ? 'bg-dd-accent/10 text-dd-text'
                  : 'text-dd-muted hover:bg-dd-bg hover:text-dd-text'
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-dd-border bg-dd-bg">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-semibold text-dd-text">{item.title}</span>
                <span className="block text-[10px] text-dd-muted">{item.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export const slashCommandItems = {
  bold: { title: 'Negrito', description: 'Destaque texto importante', icon: Bold },
  italic: { title: 'Itálico', description: 'Ênfase suave no texto', icon: Italic },
  bulletList: { title: 'Tópico', description: 'Lista com marcadores', icon: List },
  orderedList: { title: 'Lista numerada', description: 'Lista ordenada', icon: ListOrdered },
  heading: { title: 'Título', description: 'Seção com destaque', icon: Heading2 },
  inlineCode: { title: 'Código inline', description: 'Trecho curto de código', icon: Code },
  codeBlock: {
    title: 'Bloco de código',
    description: 'Editor com syntax highlight e execução',
    icon: SquareCode,
  },
} as const;
