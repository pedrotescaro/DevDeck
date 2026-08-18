'use client';

import React from 'react';

interface DuolingoTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
}

export function DuolingoText({ text, className = '', highlightWords = [] }: DuolingoTextProps) {
  // Processa tokens de código `code`, negrito **bold** e palavras individuais
  const tokens = text.split(/(\`[^\`]+\`|\*\*[^\*]+\*\*|\s+)/g);

  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-base md:text-lg font-medium leading-relaxed ${className}`}
    >
      {tokens.map((token, index) => {
        if (!token) return null;

        // Se for espaço em branco
        if (/^\s+$/.test(token)) {
          return ' ';
        }

        // Se for código inline `algo`
        if (token.startsWith('`') && token.endsWith('`')) {
          const raw = token.slice(1, -1);
          return (
            <span
              key={index}
              className="inline-block font-mono font-bold text-purple-400 dark:text-purple-300 border-b-2 border-dotted border-purple-400/80 hover:border-purple-300 hover:text-purple-200 transition-colors cursor-help pb-0.5"
            >
              {raw}
            </span>
          );
        }

        // Se for negrito **algo**
        if (token.startsWith('**') && token.endsWith('**')) {
          const raw = token.slice(2, -2);
          return (
            <span
              key={index}
              className="inline-block font-extrabold text-blue-400 dark:text-blue-300 border-b-2 border-dotted border-blue-400/80 hover:border-blue-300 hover:text-blue-200 transition-colors cursor-help pb-0.5"
            >
              {raw}
            </span>
          );
        }

        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === token.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
        );

        return (
          <span
            key={index}
            className={`inline-block pb-0.5 transition-colors cursor-help ${
              isHighlighted
                ? 'font-bold text-purple-400 border-b-2 border-dotted border-purple-400'
                : 'text-dd-text dark:text-neutral-200 border-b-2 border-dotted border-neutral-400/50 dark:border-neutral-600/70 hover:border-blue-400 hover:text-blue-400'
            }`}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
}
