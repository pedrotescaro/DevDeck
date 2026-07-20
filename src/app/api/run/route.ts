import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import { rateLimit } from '@/lib/ratelimit';
import { WANDBOX_LANGUAGES, WANDBOX_API_URL, RATE_LIMIT_CODE_RUN } from '@/lib/config';

const runSchema = z.object({
  code: z.string().min(1).max(10000),
  language: z.string().min(1),
});

function prepareCode(code: string, language: string): string {
  const trimmed = code.trim();

  switch (language) {
    case 'java': {
      if (/public\s+class\s+/i.test(trimmed)) {
        return trimmed;
      }
      return `public class Main {\n  public static void main(String[] args) {\n${indent(trimmed)}\n  }\n}`;
    }
    case 'go': {
      if (/package\s+main/i.test(trimmed)) {
        return trimmed;
      }
      return `package main\n\nimport "fmt"\n\nfunc main() {\n${indent(trimmed)}\n}`;
    }
    case 'cpp': {
      if (/#include/i.test(trimmed)) {
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

function indent(code: string): string {
  return code
    .split('\n')
    .map((line) => (line.trim() ? `    ${line}` : line))
    .join('\n');
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

  const wandboxLang = WANDBOX_LANGUAGES[normalized];
  if (!wandboxLang) {
    return NextResponse.json(
      { ok: false, output: '', error: `Linguagem "${language}" não suportada.` },
      { status: 400 }
    );
  }

  const prepared = prepareCode(code, normalized);

  // Kotlin: Wandbox não tem compilador Kotlin nativo, retornar mensagem amigável
  if (normalized === 'kotlin') {
    return NextResponse.json(
      {
        ok: false,
        output: '',
        error: 'Execução de Kotlin não está disponível no momento. Tente outra linguagem.',
      },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(WANDBOX_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: prepared,
        compiler: wandboxLang.compiler,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Wandbox error:', response.status, errorText);
      return NextResponse.json(
        { ok: false, output: '', error: 'Serviço de execução indisponível no momento.' },
        { status: 502 }
      );
    }

    const result = await response.json();

    const stdout = (result.program_output as string | undefined)?.trim() ?? '';
    const stderr = (result.program_error as string | undefined)?.trim() ?? '';
    const compileOutput = (result.compiler_output as string | undefined)?.trim() ?? '';
    const compileError = (result.compiler_error as string | undefined)?.trim() ?? '';
    const status = result.status;
    const signal = result.signal;

    // Compile error
    if (compileError && status !== '0') {
      return NextResponse.json({
        ok: false,
        output: compileOutput || compileError,
        error: 'Erro de compilação.',
      });
    }

    // Runtime signal (e.g. SIGKILL, SIGSEGV)
    if (signal) {
      return NextResponse.json({
        ok: false,
        output: stdout,
        error: stderr || `Execução interrompida (${signal}).`,
      });
    }

    // Runtime error (non-zero exit)
    if (status !== '0' && status !== 0) {
      return NextResponse.json({
        ok: false,
        output: stdout,
        error: stderr || 'Erro em tempo de execução.',
      });
    }

    return NextResponse.json({
      ok: true,
      output: stdout || '(sem output)',
      error: stderr || undefined,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { ok: false, output: '', error: 'Tempo limite de execução atingido (15s).' },
        { status: 504 }
      );
    }
    console.error('Code execution error:', err);
    return NextResponse.json(
      { ok: false, output: '', error: 'Serviço de execução indisponível no momento.' },
      { status: 502 }
    );
  }
});
