'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type EmptyStateType =
  | 'feed'
  | 'search'
  | 'notifications'
  | 'dm'
  | 'bookmarks'
  | 'profile-posts'
  | 'generic';

interface EmptyStateProps {
  type: EmptyStateType;
  searchTerm?: string;
  className?: string;
}

const STATES: Record<EmptyStateType, { icon: string; title: string; desc: string }> = {
  feed: {
    icon: '\u{1F4AC}',
    title: 'Nenhum post ainda.',
    desc: 'Seja o primeiro a quebrar o silencio.',
  },
  search: {
    icon: '\u{1F50D}',
    title: "Nenhum resultado para '{term}'.",
    desc: 'Voce pode ser o primeiro a falar sobre isso.',
  },
  notifications: {
    icon: '\u2728',
    title: 'Tudo lido.',
    desc: 'Hora de fazer algo que valha uma notificacao.',
  },
  dm: {
    icon: '\u{1F44B}',
    title: 'Nenhuma mensagem ainda.',
    desc: "Manda um 'Hello, World!'",
  },
  bookmarks: {
    icon: '\u{1F516}',
    title: 'Nenhum bookmark ainda.',
    desc: 'Salve posts tecnicos para revisitar sem perder o fio.',
  },
  'profile-posts': {
    icon: '\u{1F4DD}',
    title: 'Nenhuma postagem ainda.',
    desc: 'Quando postar algo, vai aparecer aqui.',
  },
  generic: {
    icon: '\u{1F4E6}',
    title: 'Nada por aqui.',
    desc: 'Volte mais tarde.',
  },
};

export function EmptyState({ type, searchTerm, className }: EmptyStateProps) {
  const state = STATES[type];
  const title = state.title.replace('{term}', searchTerm || '');
  const desc = state.desc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center space-y-3',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-dd-surface border border-dd-border flex items-center justify-center text-xl">
        {state.icon}
      </div>
      <p className="text-sm font-bold text-dd-text">{title}</p>
      <p className="text-xs text-dd-muted max-w-xs leading-relaxed">{desc}</p>
    </motion.div>
  );
}
