import { Language } from '@prisma/client';

export interface CodeLanguageOption {
  value: string;
  label: string;
  prisma: Language;
  runnable: boolean;
}

export const CODE_LANGUAGES: CodeLanguageOption[] = [
  { value: 'typescript', label: 'TypeScript', prisma: 'TS', runnable: true },
  { value: 'javascript', label: 'JavaScript', prisma: 'JS', runnable: true },
  { value: 'python', label: 'Python', prisma: 'PYTHON', runnable: true },
  { value: 'rust', label: 'Rust', prisma: 'RUST', runnable: true },
  { value: 'go', label: 'Go', prisma: 'GO', runnable: true },
  { value: 'cpp', label: 'C++', prisma: 'CPP', runnable: true },
  { value: 'java', label: 'Java', prisma: 'JAVA', runnable: true },
  { value: 'kotlin', label: 'Kotlin', prisma: 'KOTLIN', runnable: true },
  { value: 'swift', label: 'Swift', prisma: 'SWIFT', runnable: true },
];

const prismaToEditor = new Map(CODE_LANGUAGES.map((lang) => [lang.prisma, lang.value]));
const editorToPrisma = new Map(CODE_LANGUAGES.map((lang) => [lang.value, lang.prisma]));

export function editorLanguageToPrisma(language?: string | null): Language | null {
  if (!language) return null;
  const normalized = language.toLowerCase();
  return editorToPrisma.get(normalized) ?? null;
}

export function prismaLanguageToEditor(language?: string | null): string {
  if (!language) return 'typescript';
  return prismaToEditor.get(language as Language) ?? 'typescript';
}

export function isRunnableLanguage(language?: string | null): boolean {
  const normalized = language?.toLowerCase();
  return CODE_LANGUAGES.find((lang) => lang.value === normalized)?.runnable ?? false;
}

export function codemirrorLanguageId(language?: string | null): string {
  const normalized = language?.toLowerCase() ?? 'typescript';
  switch (normalized) {
    case 'javascript':
      return 'JS';
    case 'typescript':
      return 'TS';
    case 'python':
      return 'PYTHON';
    case 'rust':
      return 'RUST';
    case 'go':
      return 'GO';
    case 'cpp':
      return 'CPP';
    case 'java':
      return 'JAVA';
    case 'kotlin':
      return 'KOTLIN';
    case 'swift':
      return 'SWIFT';
    default:
      return 'TS';
  }
}
