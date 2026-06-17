"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  username?: string;
}

export function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex items-center gap-[3px]">
        <span className="dd-typing-dot" />
        <span className="dd-typing-dot" />
        <span className="dd-typing-dot" />
      </div>
      {username && (
        <span className="text-[10px] text-dd-muted font-medium">
          {username} esta digitando...
        </span>
      )}
    </motion.div>
  );
}
