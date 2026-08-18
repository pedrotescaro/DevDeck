'use client';

import { Edit3, CheckCircle2 } from 'lucide-react';
import type { LessonStep } from '@/lib/lessons/types';

interface CodeCompletionStepProps {
  step: LessonStep;
  blankValues: Record<string, string>;
  onUpdateBlank: (blankId: string, value: string) => void;
  disabled?: boolean;
}

export function CodeCompletionStep({
  step,
  blankValues,
  onUpdateBlank,
  disabled = false,
}: CodeCompletionStepProps) {
  const blanks = step.blanks || [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 shadow-sm">
          <Edit3 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-dd-text dark:text-white tracking-tight">
            {step.title || 'Complete o Código'}
          </h2>
          <p className="text-xs text-dd-muted dark:text-neutral-400 font-medium">
            {step.instruction || 'Preencha o trecho faltante para tornar o código válido'}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-dd-border dark:border-neutral-800 bg-[#0d1117] p-5 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm md:text-base leading-loose text-neutral-200">
          {step.completionPrefix && <span className="text-blue-300">{step.completionPrefix}</span>}

          {blanks.map((blank) => (
            <input
              key={blank.id}
              type="text"
              disabled={disabled}
              placeholder={blank.placeholder}
              value={blankValues[blank.id] || ''}
              onChange={(e) => onUpdateBlank(blank.id, e.target.value)}
              className="inline-block min-w-[120px] max-w-[200px] rounded-xl border-2 border-cyan-500/60 bg-cyan-950/40 px-3 py-1 text-center font-mono font-bold text-cyan-300 placeholder:text-cyan-600/70 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          ))}

          {step.completionSuffix && (
            <span className="text-neutral-300 whitespace-pre">{step.completionSuffix}</span>
          )}
        </div>
      </div>
    </div>
  );
}
