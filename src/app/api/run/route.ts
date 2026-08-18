import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import { rateLimit } from '@/lib/ratelimit';
import {
  WANDBOX_LANGUAGES,
  WANDBOX_API_URL,
  JUDGE0_API_URL,
  JUDGE0_LANGUAGES,
  RATE_LIMIT_CODE_RUN,
} from '@/lib/config';

const runSchema = z.object({
  code: z.string().min(1).max(10000),
  language: z.string().min(1),
});

interface ExecutionResult {
  ok: boolean;
  output: string;
  error?: string;
}

function cleanJvmWarnings(stderr: string): string {
  return stderr
    .split('\n')
    .filter(
      (line) =>
        !line.includes('OpenJDK 64-Bit Server VM warning:') &&
        !line.includes('-Xverify:none') &&
        !line.includes('-noverify')
    )
    .join('\n')
    .trim();
}

function indent(code: string): string {
  return code
    .split('\n')
    .map((line) => (line.trim() ? `    ${line}` : line))
    .join('\n');
}

function prepareCode(code: string, language: string, provider: 'judge0' | 'wandbox'): string {
  const trimmed = code.trim();

  switch (language) {
    case 'java': {
      if (/class\s+\w+/i.test(trimmed)) {
        if (provider === 'wandbox') {
          // Wandbox requer classe não-pública quando o arquivo é prog.java
          return trimmed.replace(/public\s+class\s+/gi, 'class ');
        }
        return trimmed;
      }
      const className = provider === 'wandbox' ? 'Main' : 'Main';
      const classDecl = provider === 'wandbox' ? `class ${className}` : `public class ${className}`;
      return `${classDecl} {\n  public static void main(String[] args) {\n${indent(trimmed)}\n  }\n}`;
    }
    case 'go': {
      if (/package\s+main/i.test(trimmed)) {
        return trimmed;
      }
      return `package main\n\nimport "fmt"\n\nfunc main() {\n${indent(trimmed)}\n}`;
    }
    case 'cpp':
    case 'c': {
      if (/#include|main\s*\(/i.test(trimmed)) {
        return trimmed;
      }
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n${indent(trimmed)}\n  return 0;\n}`;
    }
    case 'kotlin': {
      if (/fun\s+main\s*\(/i.test(trimmed)) {
        return trimmed;
      }
      return `fun main() {\n${indent(trimmed)}\n}`;
    }
    case 'swift': {
      if (/import\s+Foundation/i.test(trimmed)) {
        return trimmed;
      }
      return `import Foundation\n\n${trimmed}`;
    }
    case 'rust': {
      if (/fn\s+main\s*\(/i.test(trimmed)) {
        return trimmed;
      }
      return `fn main() {\n${indent(trimmed)}\n}`;
    }
    default:
      return trimmed;
  }
}

async function runOnJudge0(code: string, languageId: number): Promise<ExecutionResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(JUDGE0_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const stdout = (data.stdout as string | undefined)?.trim() ?? '';
    const stderr = cleanJvmWarnings((data.stderr as string | undefined)?.trim() ?? '');
    const compileOutput = (data.compile_output as string | undefined)?.trim() ?? '';
    const statusId = data.status?.id;

    // Status 3: Accepted
    if (statusId === 3) {
      return {
        ok: true,
        output: stdout || '(sem output)',
        error: stderr || undefined,
      };
    }

    // Status 6: Compilation Error
    if (statusId === 6) {
      return {
        ok: false,
        output: compileOutput || stderr,
        error: 'Erro de compilação.',
      };
    }

    // Status 5: Time Limit Exceeded
    if (statusId === 5) {
      return {
        ok: false,
        output: '',
        error: 'Tempo limite de execução atingido (15s).',
      };
    }

    // Runtime Error or other non-accepted status
    return {
      ok: false,
      output: stdout,
      error: stderr || compileOutput || data.status?.description || 'Erro em tempo de execução.',
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        ok: false,
        output: '',
        error: 'Tempo limite de execução atingido (15s).',
      };
    }
    return null;
  }
}

async function runOnWandbox(code: string, compiler: string): Promise<ExecutionResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(WANDBOX_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        compiler,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const stdout = (result.program_output as string | undefined)?.trim() ?? '';
    const stderr = (result.program_error as string | undefined)?.trim() ?? '';
    const compileOutput = (result.compiler_output as string | undefined)?.trim() ?? '';
    const compileError = (result.compiler_error as string | undefined)?.trim() ?? '';
    const status = result.status;
    const signal = result.signal;

    if (compileError && status !== '0') {
      return {
        ok: false,
        output: compileOutput || compileError,
        error: 'Erro de compilação.',
      };
    }

    if (signal) {
      return {
        ok: false,
        output: stdout,
        error: stderr || `Execução interrompida (${signal}).`,
      };
    }

    if (status !== '0' && status !== 0) {
      return {
        ok: false,
        output: stdout,
        error: stderr || 'Erro em tempo de execução.',
      };
    }

    return {
      ok: true,
      output: stdout || '(sem output)',
      error: stderr || undefined,
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        ok: false,
        output: '',
        error: 'Tempo limite de execução atingido (15s).',
      };
    }
    return null;
  }
}

export const POST = apiHandler(async (req) => {
  await rateLimit('code-run:global', {
    ...RATE_LIMIT_CODE_RUN,
    endpoint: '/api/run',
  });

  const body = await req.json();
  const { code, language } = runSchema.parse(body);
  const normalized = language.toLowerCase();

  if (
    normalized === 'javascript' ||
    normalized === 'typescript' ||
    normalized === 'js' ||
    normalized === 'ts'
  ) {
    return NextResponse.json(
      { ok: false, output: '', error: 'JavaScript e TypeScript rodam no navegador.' },
      { status: 400 }
    );
  }

  const judge0LangId = JUDGE0_LANGUAGES[normalized];
  const wandboxLang = WANDBOX_LANGUAGES[normalized];

  if (!judge0LangId && !wandboxLang) {
    return NextResponse.json(
      { ok: false, output: '', error: `Linguagem "${language}" não suportada.` },
      { status: 400 }
    );
  }

  // 1. Tentar primeiro via Judge0 (suporta Kotlin, Swift, Python, Java, Go, Rust, C++)
  if (judge0LangId) {
    const preparedJudge0 = prepareCode(code, normalized, 'judge0');
    const result = await runOnJudge0(preparedJudge0, judge0LangId);
    if (result) {
      return NextResponse.json(result);
    }
  }

  // 2. Fallback via Wandbox (se Judge0 estiver instável ou indisponível)
  if (wandboxLang && normalized !== 'kotlin' && normalized !== 'swift') {
    const preparedWandbox = prepareCode(code, normalized, 'wandbox');
    const result = await runOnWandbox(preparedWandbox, wandboxLang.compiler);
    if (result) {
      return NextResponse.json(result);
    }
  }

  return NextResponse.json(
    {
      ok: false,
      output: '',
      error: 'Serviço de execução indisponível no momento. Tente novamente em instantes.',
    },
    { status: 502 }
  );
});
