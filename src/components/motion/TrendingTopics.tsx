'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TrendingTopic {
  id: string;
  name: string;
  postCount: number;
  positionChange?: number; // positive = moved up, negative = moved down
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  onTopicClick?: (topic: string) => void;
}

export function TrendingTopics({ topics, onTopicClick }: TrendingTopicsProps) {
  const reduced = useReducedMotion();

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            layout
            initial={{ opacity: 0, y: topic.positionChange && topic.positionChange > 0 ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: topic.positionChange && topic.positionChange < 0 ? -20 : 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'flex items-center justify-between p-2 rounded-lg hover:bg-dd-surface transition-colors cursor-pointer',
              !reduced &&
                topic.positionChange !== undefined &&
                topic.positionChange > 0 &&
                'swap-up',
              !reduced &&
                topic.positionChange !== undefined &&
                topic.positionChange < 0 &&
                'swap-down'
            )}
            onClick={() => onTopicClick?.(topic.name)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-dd-muted w-6">#{index + 1}</span>
              <span className="text-sm font-semibold text-dd-text">{topic.name}</span>
            </div>
            <span className="text-xs text-dd-muted">{topic.postCount} posts</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
