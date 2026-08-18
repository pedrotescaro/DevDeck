'use client';

import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import type { LessonStep } from '@/lib/lessons/types';

interface TerminalStepProps {
  step: LessonStep;
  command: string;
  onChangeCommand: (cmd: string) => void;
  onSubmitCommand: () => void;
  disabled?: boolean;
}

export function TerminalStep({
  step,
  command,
  onChangeCommand,
  onSubmitCommand,
  disabled = false,
}: TerminalStepProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
          <TerminalIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-dd-text dark:text-white tracking-tight">
            {step.title || 'Terminal Interativo'}
          </h2>
          <p className="text-xs text-dd-muted dark:text-neutral-400 font-medium">
            {step.instruction || 'Digite o comando apropriado no terminal abaixo'}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d1117] p-5 shadow-xl font-mono">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 border-b border-neutral-800 pb-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 font-bold text-neutral-300">bash — stacklyst@cloud-runner</span>
        </div>

        <div className="flex items-center gap-2 text-sm md:text-base">
          <span className="text-emerald-400 font-bold select-none">$</span>
          <input
            type="text"
            disabled={disabled}
            autoFocus
            value={command}
            onChange={(e) => onChangeCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmitCommand();
              }
            }}
            placeholder="digite o comando..."
            className="flex-1 bg-transparent font-mono text-emerald-300 placeholder:text-neutral-600 focus:outline-none"
          />
          <button
            type="button"
            disabled={disabled || !command.trim()}
            onClick={onSubmitCommand}
            aria-label="Executar comando"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
