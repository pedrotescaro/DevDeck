import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import { rateLimit } from '@/lib/ratelimit';

const runSchema = z.object({
  code: z.string().min(1).max(10000),
  language: z.string().min(1),
});

const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  rust: { language: 'rust', version: '1.68.2' },
  go: { language: 'go', version: '1.16.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
  kotlin: { language: 'kotlin', version: '1.8.2' },
  swift: { language: 'swift', version: '5.3.3' },
};

function prepareCode(code: string, language: string): { content: string; fileName: string } {
  const trimmed = code.trim();

  switch (language) {
    case 'java': {
      if (/public\s+class\s+/i.test(trimmed)) {
        return { content: trimmed, fileName: 'Main.java' };
      }
      return {
        content: `public class Main {\n  public static void main(String[] args) {\n${indent(trimmed)}\n  }\n}`,
        fileName: 'Main.java',
      };
    }
    case 'go': {
      if (/package\s+main/i.test(trimmed)) {
        return { content: trimmed, fileName: 'main.go' };
      }
      return {
        content: `package main\n\nimport "fmt"\n\nfunc main() {\n${indent(trimmed)}\n}`,
        fileName: 'main.go',
      };
    }
    case 'cpp': {
      if (/#include/i.test(trimmed)) {
        return { content: trimmed, fileName: 'main.cpp' };
      }
      return {
        content: `#include <iostream>\nusing namespace std;\n\nint main() {\n${indent(trimmed)}\n  return 0;\n}`,
        fileName: 'main.cpp',
      };
    }
    case 'kotlin': {
      if (/fun\s+main\s*\(/i.test(trimmed)) {
        return { content: trimmed, fileName: 'Main.kt' };
      }
      return {
        content: `fun main() {\n${indent(trimmed)}\n}`,
        fileName: 'Main.kt',
      };
    }
    case 'swift': {
      if (/import\s+Foundation/i.test(trimmed)) {
        return { content: trimmed, fileName: 'main.swift' };
      }
      return {
        content: `import Foundation\n\n${trimmed}`,
        fileName: 'main.swift',
      };
    }
    case 'rust': {
      if (/fn\s+main\s*\(/i.test(trimmed)) {
        return { content: trimmed, fileName: 'main.rs' };
      }
      return {
        content: `fn main() {\n${indent(trimmed)}\n}`,
        fileName: 'main.rs',
      };
    }
    default:
      return { content: trimmed, fileName: 'main.py' };
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
    limit: 30,
    window: '1 m',
    endpoint: '/api/run',
  });

  const body = await req.json();
  const { code, language } = runSchema.parse(body);
  const normalized = language.toLowerCase();

  if (normalized === 'javascript' || normalized === 'typescript') {
    return NextResponse.json(
      { ok: false, output: '', error: 'JavaScript e TypeScript rodam no navegador.' },
      { status: 400 }
    );
  }

  const pistonLang = PISTON_LANGUAGES[normalized];
  if (!pistonLang) {
    return NextResponse.json(
      { ok: false, output: '', error: `Linguagem "${language}" não suportada.` },
      { status: 400 }
    );
  }

  const prepared = prepareCode(code, normalized);

  const pistonApiUrl = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';
  const response = await fetch(pistonApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: pistonLang.language,
      version: pistonLang.version,
      files: [{ name: prepared.fileName, content: prepared.content }],
      run_timeout: 5000,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, output: '', error: 'Serviço de execução indisponível no momento.' },
      { status: 502 }
    );
  }

  const result = await response.json();
  const stdout = (result.run?.stdout as string | undefined)?.trim() ?? '';
  const stderr = (result.run?.stderr as string | undefined)?.trim() ?? '';
  const compileOutput = (result.compile?.output as string | undefined)?.trim() ?? '';

  if (result.run?.signal) {
    return NextResponse.json({
      ok: false,
      output: stdout,
      error: stderr || `Execução interrompida (${result.run.signal}).`,
    });
  }

  if (compileOutput && result.compile?.code !== 0) {
    return NextResponse.json({
      ok: false,
      output: compileOutput,
      error: 'Erro de compilação.',
    });
  }

  if (result.run?.code !== 0) {
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
});
