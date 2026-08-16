'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { translations, type Language, type Translations } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'site-language';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') return saved;
  } catch {
    // localStorage might be inaccessible in restricted iframe or private mode
  }
  return 'pt';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialLanguage();
    setLanguageState(initial);
    setIsMounted(true);
  }, []);

  const syncDocumentAttributes = useCallback((lang: Language) => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.documentElement.dataset.language = lang;
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    syncDocumentAttributes(language);

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage write errors
    }

    document.dispatchEvent(
      new CustomEvent('site-language-change', {
        detail: { language },
      })
    );
  }, [language, isMounted, syncDocumentAttributes]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'pt' : 'en'));
  }, []);

  const value = useMemo<LanguageContextType>(() => {
    return {
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language] || translations.pt,
      isEnglish: language === 'en',
    };
  }, [language, setLanguage, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback context if used outside provider (e.g. isolated test or SSR)
    return {
      language: 'pt',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.pt,
      isEnglish: false,
    };
  }
  return context;
}
