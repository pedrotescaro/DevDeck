'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type FocusEvent,
} from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { MarkdownToolbar, type MarkdownToolbarAction } from '@/components/MarkdownToolbar';
import { cn } from '@/lib/cn';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
}

interface MarkdownInsertion {
  nextValue: string;
  selectionStart: number;
  selectionEnd: number;
}

function clampToMaxLength(value: string, maxLength?: number) {
  return typeof maxLength === 'number' ? value.slice(0, maxLength) : value;
}

function buildInsertion(
  action: MarkdownToolbarAction,
  value: string,
  selectionStart: number,
  selectionEnd: number
): MarkdownInsertion {
  const selected = value.slice(selectionStart, selectionEnd);
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);

  const wrap = (prefix: string, suffix: string, fallback: string): MarkdownInsertion => {
    const inner = selected || fallback;
    const inserted = `${prefix}${inner}${suffix}`;
    const start = before.length + prefix.length;
    const end = start + inner.length;

    return {
      nextValue: `${before}${inserted}${after}`,
      selectionStart: start,
      selectionEnd: end,
    };
  };

  if (action === 'bold') return wrap('**', '**', 'texto');
  if (action === 'italic') return wrap('*', '*', 'texto');
  if (action === 'inlineCode') return wrap('`', '`', 'codigo');
  if (action === 'link') return wrap('[', '](https://)', 'texto do link');

  const linePrefix = before.endsWith('\n') || before.length === 0 ? '' : '\n';
  const lineSuffix = after.startsWith('\n') || after.length === 0 ? '' : '\n';

  if (action === 'heading') {
    const inserted = `${linePrefix}# ${selected || 'Titulo'}${lineSuffix}`;
    const start = before.length + linePrefix.length + 2;
    const end = start + (selected || 'Titulo').length;

    return {
      nextValue: `${before}${inserted}${after}`,
      selectionStart: start,
      selectionEnd: end,
    };
  }

  if (action === 'quote') {
    const text = selected || 'citacao';
    const quoted = text
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');
    const inserted = `${linePrefix}${quoted}${lineSuffix}`;

    return {
      nextValue: `${before}${inserted}${after}`,
      selectionStart: before.length + linePrefix.length + 2,
      selectionEnd: before.length + linePrefix.length + quoted.length,
    };
  }

  if (action === 'codeBlock') {
    const inner = selected || '// seu codigo aqui';
    const inserted = `${linePrefix}\`\`\`typescript\n${inner}\n\`\`\`${lineSuffix}`;
    const start = before.length + linePrefix.length + '```typescript\n'.length;

    return {
      nextValue: `${before}${inserted}${after}`,
      selectionStart: start,
      selectionEnd: start + inner.length,
    };
  }

  const table = `${linePrefix}| Col 1 | Col 2 |\n| --- | --- |\n| valor | valor |${lineSuffix}`;

  return {
    nextValue: `${before}${table}${after}`,
    selectionStart: before.length + linePrefix.length,
    selectionEnd: before.length + linePrefix.length + table.trim().length,
  };
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  function MarkdownEditor(
    { value, onChange, placeholder, minRows = 4, maxRows = 14, maxLength, onFocus, onBlur },
    forwardedRef
  ) {
    const [mode, setMode] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(forwardedRef, () => textareaRef.current as HTMLTextAreaElement);

    const applyAction = (action: MarkdownToolbarAction) => {
      const textarea = textareaRef.current;
      const selectionStart = textarea?.selectionStart ?? value.length;
      const selectionEnd = textarea?.selectionEnd ?? value.length;
      const insertion = buildInsertion(action, value, selectionStart, selectionEnd);
      const nextValue = clampToMaxLength(insertion.nextValue, maxLength);

      onChange(nextValue);
      setMode('write');

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        const safeStart = Math.min(insertion.selectionStart, nextValue.length);
        const safeEnd = Math.min(insertion.selectionEnd, nextValue.length);
        textareaRef.current?.setSelectionRange(safeStart, safeEnd);
      });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!event.ctrlKey && !event.metaKey) return;

      const key = event.key.toLowerCase();

      if (key === 'b') {
        event.preventDefault();
        applyAction('bold');
      } else if (key === 'i') {
        event.preventDefault();
        applyAction('italic');
      } else if (key === 'k') {
        event.preventDefault();
        applyAction('link');
      } else if (event.key === '`') {
        event.preventDefault();
        applyAction('inlineCode');
      }
    };

    const minHeight = `${Math.max(1, minRows) * 1.65}rem`;
    const maxHeight = `${Math.max(minRows, maxRows) * 1.65}rem`;

    return (
      <div className="overflow-hidden rounded-lg border border-dd-border bg-dd-bg transition-colors focus-within:border-dd-accent/60">
        <div className="flex items-center justify-between gap-2 border-b border-dd-border bg-dd-surface/60 px-2 py-1.5">
          <div className="inline-flex overflow-hidden rounded-md border border-dd-border bg-dd-bg p-0.5">
            <button
              type="button"
              onClick={() => setMode('write')}
              className={cn(
                'rounded px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer',
                mode === 'write' ? 'bg-dd-surface text-dd-text' : 'text-dd-muted hover:text-dd-text'
              )}
            >
              Escrever
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={cn(
                'rounded px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer',
                mode === 'preview'
                  ? 'bg-dd-surface text-dd-text'
                  : 'text-dd-muted hover:text-dd-text'
              )}
            >
              Preview
            </button>
          </div>
        </div>

        {mode === 'write' ? (
          <>
            <MarkdownToolbar onAction={applyAction} />
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => onChange(clampToMaxLength(event.target.value, maxLength))}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              required
              maxLength={maxLength}
              rows={minRows}
              placeholder={placeholder}
              style={{ minHeight, maxHeight }}
              className="w-full resize-none bg-transparent px-3 py-3 text-sm leading-relaxed text-dd-text placeholder-dd-muted/65 focus:outline-none"
            />
          </>
        ) : (
          <div
            className="overflow-y-auto px-3 py-3"
            style={{ minHeight, maxHeight }}
            onClick={(event) => event.stopPropagation()}
          >
            {value.trim() ? (
              <MarkdownRenderer content={value} compact={false} />
            ) : (
              <p className="text-sm text-dd-muted/65">{placeholder}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
