import CodeBlock from '@tiptap/extension-code-block';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ExecutableCodeBlockView } from '@/components/editor/ExecutableCodeBlockView';

export const ExecutableCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ExecutableCodeBlockView);
  },
});
