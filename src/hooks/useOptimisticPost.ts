'use client';

import { useState, useCallback } from 'react';

interface OptimisticPostOptions {
  onPublish: (content: any) => Promise<void>;
  onError?: (error: Error) => void;
}

export function useOptimisticPost({ onPublish, onError }: OptimisticPostOptions) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [optimisticPost, setOptimisticPost] = useState<any>(null);

  const publish = useCallback(
    async (content: any) => {
      // Instant optimistic update
      setOptimisticPost(content);
      setIsPublishing(true);

      try {
        await onPublish(content);
        setOptimisticPost(null); // Remove optimistic state on success
      } catch (error) {
        setOptimisticPost(null); // Remove on error
        onError?.(error as Error);
      } finally {
        setIsPublishing(false);
      }
    },
    [onPublish, onError]
  );

  return { publish, isPublishing, optimisticPost };
}
