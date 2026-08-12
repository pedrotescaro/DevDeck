'use client';

import { useEffect, useState } from 'react';
import { formatAbsoluteDate, formatRelativeTime, type DateInput } from '@/lib/date';

const RELATIVE_TIME_REFRESH_MS = 60_000;

interface RelativeTimeState {
  timestamp: number;
  text: string;
}

export function useHydrationSafeRelativeTime(dateValue: DateInput) {
  const timestamp = dateValue instanceof Date ? dateValue.getTime() : new Date(dateValue).getTime();
  const [relativeTime, setRelativeTime] = useState<RelativeTimeState | null>(null);

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime({
        timestamp,
        text: formatRelativeTime(timestamp),
      });
    };

    updateRelativeTime();
    const intervalId = window.setInterval(updateRelativeTime, RELATIVE_TIME_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [timestamp]);

  const hydratedRelativeTime = relativeTime?.timestamp === timestamp ? relativeTime.text : null;

  return {
    text: hydratedRelativeTime ?? formatAbsoluteDate(timestamp),
    isRelative: hydratedRelativeTime !== null,
  };
}
