'use client';

import { Bug, Play, Loader2, Terminal as TerminalIcon } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import type { LessonStep } from '@/lib/lessons/types';

interface DebugStepProps {
  step: LessonStep;
  code: string;
  onChangeCode: (code: string) => void;
  language: string;
  onRunCode: () => Promise<void>;
  isRunning?: boolean;
  runOutput?: string | null;
  runError?: string | null;
  disabled?: boolean;
}

export function DebugStep({
  step,
  code,
  onChangeCode,
  language,
  onRunCode,
  isRunning = false,
  runOutput = null,
  runError = null,
  disabled = false,
}: DebugStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 animate-fade-in font-sans">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm">
            <Bug className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-dd-text dark:text-white tracking-tight">
              {step.title || 'Desafio de Debug'}
            </h2>
            <p className="text-xs text-dd-muted dark:text-neutral-400 font-medium">
              {step.instruction || 'Encontre os erros no código e faça os testes passarem'}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled || isRunning}
          onClick={onRunCode}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-rose-500/20 hover:bg-rose-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Depurando...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Testar Correção</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-rose-500/30 bg-dd-card shadow-lg">
        <div className="flex items-center justify-between border-b border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs font-mono text-rose-400">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            Código com Bug (Corrija abaixo)
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            {language}
          </span>
        </div>

        <CodeEditor
          value={code}
          onChange={onChangeCode}
          language={language}
          height="220px"
          readOnly={disabled}
        />
      </div>

      {(runOutput !== null || runError !== null) && (
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d1117] shadow-md font-mono text-xs">
          <div className="flex items-center justify-between border-b border-neutral-800 bg-[#161b22] px-4 py-2 text-neutral-400">
            <span className="flex items-center gap-2 font-semibold">
              <TerminalIcon className="h-3.5 w-3.5 text-rose-400" />
              Resultado dos Testes
            </span>
          </div>

          <div className="p-4 space-y-2">
            {runOutput && (
              <div className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {runOutput}
              </div>
            )}
            {runError && (
              <div className="text-rose-400 whitespace-pre-wrap leading-relaxed">{runError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
