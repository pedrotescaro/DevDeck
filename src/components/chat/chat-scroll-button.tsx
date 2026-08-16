'use client';

import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface ChatScrollButtonProps {
  onClick: () => void;
}

/** Appears when the user has scrolled up — "Ir para o final" affordance. */
export function ChatScrollButton({ onClick }: ChatScrollButtonProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClick}
      aria-label="Ir para o final da conversa"
      title="Ir para o final"
      className="absolute bottom-4 right-4 z-20 flex cursor-pointer items-center gap-1.5 rounded-full border border-dd-border/70 bg-dd-bg/95 px-3 py-1.5 text-[11px] font-semibold text-dd-text shadow-sm backdrop-blur-sm transition-colors hover:border-dd-text/40 hover:text-dd-text"
    >
      <ArrowDown className="size-3.5" />
      Ir para o final
    </motion.button>
  );
}
