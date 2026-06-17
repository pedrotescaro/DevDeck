'use client';

import { useEffect, useRef } from 'react';
import { LanguageTag } from './LanguageTag';

interface XPToastProps {
  amount: number;
  language: string;
  visible: boolean;
  onClose: () => void;
}

export function XPToast({ amount, language, visible, onClose }: XPToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100]"
      style={{
        animation: 'slide-in-right 0.3s ease-out',
      }}
    >
      <div className="bg-dd-card border border-orange-500/40 rounded-xl px-4 py-3 flex items-center gap-3">
        {/* Orange accent bar */}
        <div className="w-1 h-8 bg-orange-500 rounded-full" />

        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-bold text-lg">
            +{amount} XP
          </span>
          <LanguageTag language={language} size="sm" />
        </div>

        <button
          onClick={onClose}
          className="text-dd-muted hover:text-dd-text ml-2 transition-colors"
          aria-label="Fechar"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
