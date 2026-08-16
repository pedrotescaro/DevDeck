'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Keeps a textarea's height in sync with its content, growing up to `maxHeight`.
 * Based on the KokonutUI AI Input pattern (`useAutoResizeTextarea`).
 */
export function useAutoResizeTextarea(minHeight = 52, maxHeight = 200) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const height = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${height}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}
