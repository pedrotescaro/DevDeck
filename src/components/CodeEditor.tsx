'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ReactCodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="bg-dd-card rounded-lg border border-dd-border flex items-center justify-center text-dd-muted text-sm min-h-[200px]">
      Carregando editor...
    </div>
  ),
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = 'JS',
  height = '300px',
  readOnly = false,
}: CodeEditorProps) {
  const extensions = useMemo(() => {
    const exts: ReturnType<typeof import('@codemirror/lang-javascript').javascript>[] = [];

    // We dynamically import language extensions to keep the bundle lean.
    // Since we can't use top-level await in a client component, we lazily load them.
    // CodeMirror will still work without language support, it just won't have syntax highlighting
    // until the extension loads.
    return exts;
  }, []);

  return (
    <CodeEditorInner
      value={value}
      onChange={onChange}
      language={language}
      height={height}
      readOnly={readOnly}
    />
  );
}

/** Inner component that handles dynamic language extension loading */
function CodeEditorInner({
  value,
  onChange,
  language = 'JS',
  height = '300px',
  readOnly = false,
}: CodeEditorProps) {
  const [extensions, setExtensions] = useState<import('@codemirror/state').Extension[]>([]);
  const [theme, setTheme] = useState<import('@codemirror/state').Extension | null>(null);

  // Dynamically load language extension and theme
  useEffect(() => {
    let cancelled = false;

    async function loadExtensions() {
      try {
        const [themeModule, langModule] = await Promise.all([
          import('@codemirror/theme-one-dark'),
          loadLanguageExtension(language),
        ]);

        if (!cancelled) {
          setTheme(themeModule.oneDark);
          if (langModule) {
            setExtensions([langModule]);
          }
        }
      } catch {
        // Silently fail — editor works without extensions
      }
    }

    loadExtensions();
    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <ReactCodeMirror
      value={value}
      onChange={onChange}
      height={height}
      readOnly={readOnly}
      theme={theme ?? 'dark'}
      extensions={extensions}
      placeholder="Escreva seu código aqui..."
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: !readOnly,
        highlightSelectionMatches: true,
        autocompletion: false,
      }}
      className="rounded-lg overflow-hidden border border-dd-border"
      style={{
        fontSize: '13px',
      }}
    />
  );
}

async function loadLanguageExtension(
  language: string
): Promise<import('@codemirror/state').Extension | null> {
  const lang = language.toUpperCase();

  switch (lang) {
    case 'JS':
    case 'JAVASCRIPT': {
      const { javascript } = await import('@codemirror/lang-javascript');
      return javascript({ jsx: true });
    }
    case 'TS':
    case 'TYPESCRIPT': {
      const { javascript } = await import('@codemirror/lang-javascript');
      return javascript({ typescript: true, jsx: true });
    }
    case 'PYTHON': {
      const { python } = await import('@codemirror/lang-python');
      return python();
    }
    case 'JAVA':
    case 'KOTLIN': {
      const { java } = await import('@codemirror/lang-java');
      return java();
    }
    case 'RUST': {
      const { rust } = await import('@codemirror/lang-rust');
      return rust();
    }
    case 'CPP':
    case 'C++': {
      const { cpp } = await import('@codemirror/lang-cpp');
      return cpp();
    }
    default:
      return null;
  }
}

// Need these imports for the inner component
import { useState, useEffect } from 'react';
