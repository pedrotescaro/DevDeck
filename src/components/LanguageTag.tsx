'use client';

const LANGUAGE_CONFIG: Record<
  string,
  { color: string; label: string }
> = {
  PYTHON: { color: '#22d48a', label: 'Python' },
  JS: { color: '#f5c842', label: 'JavaScript' },
  TS: { color: '#5ba3f5', label: 'TypeScript' },
  JAVA: { color: '#f57c22', label: 'Java' },
  RUST: { color: '#de5722', label: 'Rust' },
  GO: { color: '#00add8', label: 'Go' },
  KOTLIN: { color: '#7c6ff7', label: 'Kotlin' },
  SWIFT: { color: '#f05138', label: 'Swift' },
  CPP: { color: '#5ba3f5', label: 'C++' },
};

interface LanguageTagProps {
  language: string;
  size?: 'sm' | 'md';
}

export function getLanguageColor(language: string): string {
  return LANGUAGE_CONFIG[language.toUpperCase()]?.color ?? '#888899';
}

export function getLanguageLabel(language: string): string {
  return LANGUAGE_CONFIG[language.toUpperCase()]?.label ?? language;
}

export function LanguageTag({ language, size = 'sm' }: LanguageTagProps) {
  const config = LANGUAGE_CONFIG[language.toUpperCase()];
  const color = config?.color ?? '#888899';
  const label = config?.label ?? language;

  const sizeClasses =
    size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${color}10`,
        color: color,
        borderColor: `${color}33`,
      }}
    >
      {label}
    </span>
  );
}
