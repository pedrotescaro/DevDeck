import type { JSONContent } from '@tiptap/core';

function serializeInline(nodes: JSONContent[] | undefined): string {
  if (!nodes?.length) return '';

  return nodes
    .map((node) => {
      if (node.type === 'text') {
        let text = node.text ?? '';
        if (node.marks?.some((mark) => mark.type === 'bold')) {
          text = `**${text}**`;
        }
        if (node.marks?.some((mark) => mark.type === 'italic')) {
          text = `*${text}*`;
        }
        if (node.marks?.some((mark) => mark.type === 'code')) {
          text = `\`${text}\``;
        }
        if (node.marks?.some((mark) => mark.type === 'link')) {
          const href = node.marks.find((mark) => mark.type === 'link')?.attrs?.href ?? '';
          text = `[${text}](${href})`;
        }
        return text;
      }

      if (node.type === 'hardBreak') return '\n';
      return '';
    })
    .join('');
}

function serializeBlock(node: JSONContent): string {
  switch (node.type) {
    case 'paragraph':
      return serializeInline(node.content);
    case 'heading': {
      const level = node.attrs?.level ?? 2;
      return `${'#'.repeat(level)} ${serializeInline(node.content)}`.trim();
    }
    case 'bulletList':
      return (node.content ?? [])
        .map((item) => {
          const text = item.content?.map(serializeBlock).join('\n') ?? '';
          return text
            .split('\n')
            .map((line) => (line ? `- ${line}` : '-'))
            .join('\n');
        })
        .join('\n');
    case 'orderedList':
      return (node.content ?? [])
        .map((item, index) => {
          const text = item.content?.map(serializeBlock).join('\n') ?? '';
          return text
            .split('\n')
            .map((line) => (line ? `${index + 1}. ${line}` : `${index + 1}.`))
            .join('\n');
        })
        .join('\n');
    case 'listItem':
      return (node.content ?? []).map(serializeBlock).join('\n');
    case 'codeBlock': {
      const language = node.attrs?.language || 'typescript';
      const code = node.content?.map((child) => child.text ?? '').join('') ?? '';
      return `\`\`\`${language}\n${code}\n\`\`\``;
    }
    case 'blockquote':
      return (node.content ?? [])
        .map((child) => `> ${serializeBlock(child)}`)
        .join('\n');
    default:
      return '';
  }
}

export function docToMarkdown(doc: JSONContent): string {
  return (doc.content ?? [])
    .map(serializeBlock)
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function parseInline(text: string): JSONContent[] {
  const nodes: JSONContent[] = [];
  const pattern =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      nodes.push({ type: 'text', text: match[2], marks: [{ type: 'bold' }] });
    } else if (match[4]) {
      nodes.push({ type: 'text', text: match[4], marks: [{ type: 'italic' }] });
    } else if (match[6]) {
      nodes.push({ type: 'text', text: match[6], marks: [{ type: 'code' }] });
    } else if (match[8] && match[9]) {
      nodes.push({
        type: 'text',
        text: match[8],
        marks: [{ type: 'link', attrs: { href: match[9] } }],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text', text: text.slice(lastIndex) });
  }

  return nodes.length ? nodes : [{ type: 'text', text }];
}

export function markdownToDoc(markdown: string): JSONContent {
  const trimmed = markdown.trim();
  if (!trimmed) return { type: 'doc', content: [{ type: 'paragraph' }] };

  const blocks: JSONContent[] = [];
  const lines = trimmed.split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'typescript';
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      blocks.push({
        type: 'codeBlock',
        attrs: { language },
        content: codeLines.length ? [{ type: 'text', text: codeLines.join('\n') }] : [],
      });
      index += 1;
      continue;
    }

    if (/^#{2,3}\s/.test(line)) {
      const level = line.startsWith('###') ? 3 : 2;
      blocks.push({
        type: 'heading',
        attrs: { level },
        content: parseInline(line.replace(/^#{2,3}\s/, '')),
      });
      index += 1;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items: JSONContent[] = [];
      while (index < lines.length && /^[-*]\s/.test(lines[index])) {
        items.push({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: parseInline(lines[index].replace(/^[-*]\s/, '')),
            },
          ],
        });
        index += 1;
      }
      blocks.push({ type: 'bulletList', content: items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: JSONContent[] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        items.push({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: parseInline(lines[index].replace(/^\d+\.\s/, '')),
            },
          ],
        });
        index += 1;
      }
      blocks.push({ type: 'orderedList', content: items });
      continue;
    }

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !lines[index].startsWith('```') &&
      !/^#{2,3}\s/.test(lines[index]) &&
      !/^[-*]\s/.test(lines[index]) &&
      !/^\d+\.\s/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push({
      type: 'paragraph',
      content: parseInline(paragraphLines.join('\n')),
    });
  }

  return {
    type: 'doc',
    content: blocks.length ? blocks : [{ type: 'paragraph' }],
  };
}
