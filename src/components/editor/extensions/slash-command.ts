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
          let clientRect: (() => DOMRect | null) | null = null;

          const updatePosition = () => {
            if (!component?.element || !clientRect) return;
            positionMenu(component.element as HTMLElement, clientRect);
          };

          const startTrackingPosition = () => {
            window.addEventListener('resize', updatePosition);
            document.addEventListener('scroll', updatePosition, true);
          };

          const stopTrackingPosition = () => {
            window.removeEventListener('resize', updatePosition);
            document.removeEventListener('scroll', updatePosition, true);
          };

          const destroyMenu = () => {
            stopTrackingPosition();
            (component?.element as HTMLElement | undefined)?.remove();
            component?.destroy();
            component = null;
            clientRect = null;
          };

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
              clientRect = props.clientRect;
              const element = component.element as HTMLElement;
              element.style.position = 'fixed';
              element.style.zIndex = '110';
              document.body.appendChild(element);
              startTrackingPosition();
              updatePosition();
              window.requestAnimationFrame(updatePosition);
            },
            onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
              component?.updateProps({
                items: props.items,
                command: (item: SlashCommandItem) => props.command(item),
              });
              if (props.clientRect) {
                clientRect = props.clientRect;
                updatePosition();
                window.requestAnimationFrame(updatePosition);
              }
            },
            onKeyDown: (props: { event: KeyboardEvent }) => {
              if (props.event.key === 'Escape') {
                destroyMenu();
                return true;
              }

              const ref = component?.ref as {
                onKeyDown?: (event: KeyboardEvent) => boolean;
              } | null;
              return ref?.onKeyDown?.(props.event) ?? false;
            },
            onExit: () => {
              destroyMenu();
            },
          };
        },
      }),
    ];
  },
});

const MENU_GAP = 8;
const VIEWPORT_MARGIN = 12;
const MENU_HEADER_HEIGHT = 42;
const MIN_LIST_HEIGHT = 80;

export function positionMenu(element: HTMLElement, rect: DOMRect | (() => DOMRect | null) | null) {
  const resolved = typeof rect === 'function' ? rect() : rect;
  if (!resolved) return;

  element.style.position = 'fixed';
  element.style.maxWidth = `calc(100vw - ${VIEWPORT_MARGIN * 2}px)`;

  const initialMenuRect = element.getBoundingClientRect();
  const menuWidth = Math.min(initialMenuRect.width || 256, window.innerWidth - VIEWPORT_MARGIN * 2);
  const roomBelow = window.innerHeight - resolved.bottom - VIEWPORT_MARGIN - MENU_GAP;
  const roomAbove = resolved.top - VIEWPORT_MARGIN - MENU_GAP;
  const placeAbove = initialMenuRect.height > roomBelow && roomAbove > roomBelow;
  const availableHeight = Math.max(
    MIN_LIST_HEIGHT + MENU_HEADER_HEIGHT,
    placeAbove ? roomAbove : roomBelow
  );

  element.style.setProperty(
    '--slash-menu-list-max-height',
    `${Math.max(MIN_LIST_HEIGHT, availableHeight - MENU_HEADER_HEIGHT)}px`
  );

  const measuredHeight = Math.min(element.getBoundingClientRect().height, availableHeight);
  const maxLeft = Math.max(VIEWPORT_MARGIN, window.innerWidth - menuWidth - VIEWPORT_MARGIN);
  const left = Math.min(Math.max(resolved.left, VIEWPORT_MARGIN), maxLeft);
  const preferredTop = placeAbove
    ? resolved.top - measuredHeight - MENU_GAP
    : resolved.bottom + MENU_GAP;
  const maxTop = Math.max(VIEWPORT_MARGIN, window.innerHeight - measuredHeight - VIEWPORT_MARGIN);
  const top = Math.min(Math.max(preferredTop, VIEWPORT_MARGIN), maxTop);

  element.dataset.placement = placeAbove ? 'top' : 'bottom';
  element.style.left = `${Math.round(left)}px`;
  element.style.top = `${Math.round(top)}px`;
}
