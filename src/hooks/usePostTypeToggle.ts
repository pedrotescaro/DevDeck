'use client';

import { useState, useCallback } from 'react';

type PostType = 'question' | 'discussion';

export function usePostTypeToggle(initial: PostType = 'question') {
  const [postType, setPostType] = useState<PostType>(initial);

  const toggle = useCallback((type: PostType) => {
    setPostType(type);
  }, []);

  return { postType, toggle };
}
