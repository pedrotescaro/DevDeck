'use client';

import { useMemo } from 'react';

interface CharCounterState {
  count: number;
  limit: number;
  percent: number;
  visible: boolean;
  color: 'default' | 'amber' | 'red';
  shake: boolean;
  disabled: boolean;
}

export function useCharCounter(text: string, limit: number): CharCounterState {
  return useMemo(() => {
    const count = text.length;
    const percent = (count / limit) * 100;
    const visible = percent >= 70;
    const shake = percent >= 90 && percent < 100;
    const disabled = count > limit;

    let color: 'default' | 'amber' | 'red' = 'default';
    if (percent >= 100) color = 'red';
    else if (percent >= 90) color = 'amber';

    return { count, limit, percent, visible, color, shake, disabled };
  }, [text, limit]);
}
