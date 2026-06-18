export interface CodeRunResult {
  ok: boolean;
  output: string;
  error?: string;
}

export async function runCodeInSandbox(
  code: string,
  language?: string | null
): Promise<CodeRunResult> {
  const normalized = language?.toLowerCase() ?? 'typescript';

  if (normalized === 'javascript' || normalized === 'typescript') {
    return runJsInBrowser(code, normalized);
  }

  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: normalized }),
    });

    const data = await res.json();
    return {
      ok: Boolean(data.ok),
      output: data.output ?? '',
      error: data.error,
    };
  } catch {
    return {
      ok: false,
      output: '',
      error: 'Falha ao conectar com o serviço de execução.',
    };
  }
}

function runJsInBrowser(code: string, language: string): CodeRunResult {
  const logs: string[] = [];
  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(args.map(formatValue).join(' ')),
    info: (...args: unknown[]) => logs.push(args.map(formatValue).join(' ')),
    warn: (...args: unknown[]) => logs.push(args.map(formatValue).join(' ')),
    error: (...args: unknown[]) => logs.push(args.map(formatValue).join(' ')),
  };

  try {
    const wrapped = language === 'typescript' ? transpileTypescript(code) : code;
    const runner = new Function('console', `"use strict";\n${wrapped}`);
    const returnValue = runner(sandboxConsole);

    if (returnValue !== undefined) {
      logs.push(formatValue(returnValue));
    }

    return {
      ok: true,
      output: logs.join('\n').trim() || '(sem output)',
    };
  } catch (error) {
    return {
      ok: false,
      output: logs.join('\n').trim(),
      error: error instanceof Error ? error.message : 'Erro ao executar o código.',
    };
  }
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

function transpileTypescript(code: string): string {
  return code
    .replace(/:\s*[A-Za-z_$][\w$<>[\],\s|&]*/g, '')
    .replace(/\binterface\s+\w+\s*\{[\s\S]*?\}/g, '')
    .replace(/\btype\s+\w+\s*=\s*[^;]+;/g, '')
    .replace(/\b(enum|implements|readonly|private|public|protected)\b/g, '');
}
