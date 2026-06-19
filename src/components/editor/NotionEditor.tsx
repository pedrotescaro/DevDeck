'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type FocusEvent } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Code, Italic, Link as LinkIcon } from 'lucide-react';
import { ExecutableCodeBlock } from '@/components/editor/extensions/executable-code-block';
import { SlashCommand } from '@/components/editor/extensions/slash-command';
import { docToMarkdown, markdownToDoc } from '@/lib/editor/markdown';
import { cn } from '@/lib/cn';
import './NotionEditor.css';

export interface NotionEditorRef {
  insertText: (text: string) => void;
  focus: () => void;
}

interface NotionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minHeight?: string;
  onFocus?: () => void;
  onBlur?: (event?: FocusEvent) => void;
  className?: string;
}

function clampMarkdown(value: string, maxLength?: number) {
  return typeof maxLength === 'number' ? value.slice(0, maxLength) : value;
}

export const NotionEditor = forwardRef<NotionEditorRef, NotionEditorProps>(function NotionEditor(
  {
    value,
    onChange,
    placeholder = 'Comece a escrever ou digite / para blocos...',
    maxLength,
    minHeight = '2.5rem',
    onFocus,
    onBlur,
    className,
  },
  ref
) {
  const syncingRef = useRef(false);
  const lastEmittedRef = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-dd-accent underline',
          },
        },
      }),
      ExecutableCodeBlock.configure({
        defaultLanguage: 'typescript',
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      SlashCommand,
    ],
    content: markdownToDoc(value),
    editorProps: {
      attributes: {
        class: 'notion-editor-content focus:outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (syncingRef.current) return;
      const markdown = clampMarkdown(docToMarkdown(currentEditor.getJSON()), maxLength);
      lastEmittedRef.current = markdown;
      onChange(markdown);
    },
    onFocus: () => onFocus?.(),
    onBlur: () => onBlur?.(),
  });

  useEffect(() => {
    if (!editor || value === lastEmittedRef.current) return;

    syncingRef.current = true;
    editor.commands.setContent(markdownToDoc(value));
    lastEmittedRef.current = value;
    syncingRef.current = false;
  }, [editor, value]);

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      editor?.chain().focus().insertContent(text).run();
    },
    focus: () => {
      editor?.chain().focus().run();
    },
  }));

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL do link', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className={cn('notion-editor relative w-full', className)} style={{ minHeight }}>
      {editor && (
        <BubbleMenu
          editor={editor}
          className="bubble-toolbar flex items-center gap-0.5 rounded-lg border border-dd-border bg-dd-surface p-1 shadow-lg"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer',
              editor.isActive('bold')
                ? 'bg-dd-accent/15 text-dd-accent'
                : 'text-dd-muted hover:bg-dd-bg hover:text-dd-text'
            )}
            aria-label="Negrito"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer',
              editor.isActive('italic')
                ? 'bg-dd-accent/15 text-dd-accent'
                : 'text-dd-muted hover:bg-dd-bg hover:text-dd-text'
            )}
            aria-label="Itálico"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer',
              editor.isActive('code')
                ? 'bg-dd-accent/15 text-dd-accent'
                : 'text-dd-muted hover:bg-dd-bg hover:text-dd-text'
            )}
            aria-label="Código inline"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={setLink}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer',
              editor.isActive('link')
                ? 'bg-dd-accent/15 text-dd-accent'
                : 'text-dd-muted hover:bg-dd-bg hover:text-dd-text'
            )}
            aria-label="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  );
});

// Backward-compatible export while callers migrate off MarkdownEditor.
export { NotionEditor as MarkdownEditor };
export type { NotionEditorRef as MarkdownEditorRef };
