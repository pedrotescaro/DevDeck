'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface NotificationBellIconProps {
  unreadCount: number;
  className?: string;
  shake?: boolean;
  active?: boolean;
}

export function NotificationBellIcon({
  unreadCount,
  className,
  shake = false,
  active = false,
}: NotificationBellIconProps) {
  const reduced = useReducedMotion();
  const shouldShake = shake || unreadCount > 0;

  return (
    <motion.div
      className={cn('relative flex items-center justify-center', className)}
      animate={shouldShake && !reduced ? { rotate: [0, -2, 2, -2, 2, 0] } : { rotate: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <Bell className={cn('w-5 h-5', active ? 'fill-current' : '')} />
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
          {!reduced && (
            <span className="dd-dot-pulse absolute inline-flex h-full w-full rounded-full bg-dd-amber opacity-75" />
          )}
          <span className="relative inline-flex min-w-[14px] h-[14px] -mt-0.5 -mr-0.5 bg-orange-500 text-white text-[8px] font-extrabold items-center justify-center rounded-full px-0.5 ring-2 ring-dd-bg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </span>
      )}
    </motion.div>
  );
}
