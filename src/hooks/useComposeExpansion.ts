'use client';

import { useState, useCallback } from 'react';

export function useComposeExpansion() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFocus = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Only collapse if empty
    setIsExpanded(false);
  }, []);

  return { isExpanded, handleFocus, handleBlur };
}
