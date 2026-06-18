'use client';

import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onPress?: () => void;
  threshold?: number;
}

export function useLongPress({ onLongPress, onPress, threshold = 400 }: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const start = useCallback(() => {
    didLongPress.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
    }, threshold);
  }, [onLongPress, threshold]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const end = useCallback(() => {
    cancel();
    if (!didLongPress.current) {
      onPress?.();
    }
  }, [cancel, onPress]);

  return {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: end,
  };
}
