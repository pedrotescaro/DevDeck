import { Language } from '@prisma/client';
import { editorLanguageToPrisma } from '@/lib/editor/languages';

export interface PostContentMetadata {
  language: Language | null;
  code: string | null;
  isQuestion: boolean;
}

export function extractPostMetadata(body: string): PostContentMetadata {
  const match = body.match(/```([^\n`]*)\n([\s\S]*?)```/);
  if (!match) {
    return { language: null, code: null, isQuestion: false };
  }

  let rawLang = match[1]?.trim() || 'typescript';
  if (rawLang.endsWith('-static')) {
    rawLang = rawLang.slice(0, -7);
  }

  const language = editorLanguageToPrisma(rawLang);
  const code = match[2]?.trim() || null;

  return {
    language,
    code,
    isQuestion: Boolean(language),
  };
}
