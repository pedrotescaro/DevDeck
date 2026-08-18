'use client';

import { Code2, Play, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import type { LessonStep } from '@/lib/lessons/types';

interface CodeEditorStepProps {
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

export function CodeEditorStep({
  step,
  code,
  onChangeCode,
  language,
  onRunCode,
  isRunning = false,
  runOutput = null,
  runError = null,
  disabled = false,
}: CodeEditorStepProps) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-white">{step.title}</h2>
        {step.instruction && (
          <p className="text-sm text-neutral-300 font-medium leading-relaxed">{step.instruction}</p>
        )}
      </div>

      {/* Editor Box */}
      <div className="rounded-2xl border-2 border-neutral-800 bg-[#0d1117] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              {language}
            </span>
          </div>

          <button
            type="button"
            onClick={onRunCode}
            disabled={isRunning || disabled}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executando...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Testar Código</span>
              </>
            )}
          </button>
        </div>

        <div className="p-1 min-h-[220px]">
          <CodeEditor
            value={code}
            onChange={onChangeCode}
            language={language}
            height="240px"
            readOnly={disabled}
          />
        </div>
      </div>

      {/* Console Output */}
      {(runOutput !== null || runError !== null) && (
        <div className="rounded-2xl border border-neutral-800 bg-black/90 font-mono text-xs overflow-hidden shadow-lg animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-neutral-400">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span className="font-bold">Console</span>
            </div>
            {step.expectedOutput && (
              <span className="text-[11px] text-neutral-500">
                Esperado: <code className="text-neutral-300">{step.expectedOutput}</code>
              </span>
            )}
          </div>

          <div className="p-4 space-y-2">
            {runOutput && (
              <div className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {runOutput}
              </div>
            )}

            {runError && (
              <div className="text-red-400 whitespace-pre-wrap leading-relaxed">{runError}</div>
            )}

            {!runOutput && !runError && (
              <div className="text-neutral-500 italic">
                Clique em &quot;Executar&quot; para compilar e testar sua solução.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
