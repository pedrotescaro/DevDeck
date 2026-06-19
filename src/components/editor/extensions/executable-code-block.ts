import CodeBlock from '@tiptap/extension-code-block';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ExecutableCodeBlockView } from '@/components/editor/ExecutableCodeBlockView';

export const ExecutableCodeBlock = CodeBlock.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isExecutable: {
        default: true,
        parseHTML: (element) => {
          const classAttr = element.getAttribute('class') || '';
          return !classAttr.includes('-static');
        },
        renderHTML: (attributes) => {
          if (!attributes.isExecutable) {
            return {
              class: `language-${attributes.language}-static`,
            };
          }
          return {};
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExecutableCodeBlockView);
  },
});
