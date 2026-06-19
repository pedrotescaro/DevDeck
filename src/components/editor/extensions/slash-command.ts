import { Extension, type Editor, type Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { type SuggestionProps } from '@tiptap/suggestion';
import {
  SlashCommandList,
  slashCommandItems,
  type SlashCommandItem,
} from '@/components/editor/SlashCommandList';

type SlashKey = keyof typeof slashCommandItems;

const slashHandlers: Record<SlashKey, (editor: Editor, range: Range) => void> = {
  bold: (editor, range) => editor.chain().focus().deleteRange(range).toggleBold().run(),
  italic: (editor, range) => editor.chain().focus().deleteRange(range).toggleItalic().run(),
  bulletList: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  orderedList: (editor, range) =>
    editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  heading: (editor, range) =>
    editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run(),
  inlineCode: (editor, range) => editor.chain().focus().deleteRange(range).toggleCode().run(),
  codeBlock: (editor, range) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setCodeBlock({ language: 'typescript', isExecutable: true } as any)
      .run(),
  staticCodeBlock: (editor, range) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setCodeBlock({ language: 'typescript', isExecutable: false } as any)
      .run(),
};

function buildItems(query: string): SlashCommandItem[] {
  const items: SlashCommandItem[] = (Object.keys(slashCommandItems) as SlashKey[]).map((key) => ({
    key,
    ...slashCommandItems[key],
    command: () => {},
  }));

  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.description.toLowerCase().includes(normalized)
  );
}

export const SlashCommand = Extension.create({
  name: 'slash-command',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }) => {
          const item = props as SlashCommandItem;
          slashHandlers[item.key]?.(editor, range);
        },
        items: ({ query }: { query: string }) => buildItems(query),
        render: () => {
          let component: ReactRenderer | null = null;

          return {
            onStart: (props: SuggestionProps<SlashCommandItem>) => {
              component = new ReactRenderer(SlashCommandList, {
                props: {
                  items: props.items,
                  command: (item: SlashCommandItem) => props.command(item),
                },
                editor: props.editor,
              });

              if (!props.clientRect) return;
              const element = component.element as HTMLElement;
              element.style.position = 'absolute';
              element.style.zIndex = '50';
              document.body.appendChild(element);
              positionMenu(element, props.clientRect());
            },
            onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
              component?.updateProps({
                items: props.items,
                command: (item: SlashCommandItem) => props.command(item),
              });
              if (props.clientRect && component?.element) {
                positionMenu(component.element as HTMLElement, props.clientRect());
              }
            },
            onKeyDown: (props: { event: KeyboardEvent }) => {
              if (props.event.key === 'Escape') {
                component?.destroy();
                (component?.element as HTMLElement | undefined)?.remove();
                component = null;
                return true;
              }

              const ref = component?.ref as {
                onKeyDown?: (event: KeyboardEvent) => boolean;
              } | null;
              return ref?.onKeyDown?.(props.event) ?? false;
            },
            onExit: () => {
              (component?.element as HTMLElement | undefined)?.remove();
              component?.destroy();
              component = null;
            },
          };
        },
      }),
    ];
  },
});

function positionMenu(element: HTMLElement, rect: DOMRect | (() => DOMRect | null) | null) {
  const resolved = typeof rect === 'function' ? rect() : rect;
  if (!resolved) return;

  element.style.left = `${resolved.left + window.scrollX}px`;
  element.style.top = `${resolved.bottom + window.scrollY + 6}px`;
}
