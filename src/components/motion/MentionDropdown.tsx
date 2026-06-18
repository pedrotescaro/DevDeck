'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { mentionDropdownVariants } from '@/lib/motion';

interface MentionUser {
  id: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

interface MentionDropdownProps {
  query: string;
  visible: boolean;
  onSelect: (username: string) => void;
  onClose: () => void;
}

export function MentionDropdown({ query, visible, onSelect, onClose }: MentionDropdownProps) {
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.slice(0, 6));
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible || !query) return;
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, visible, search]);

  return (
    <AnimatePresence>
      {visible && users.length > 0 && (
        <motion.div
          className="absolute z-50 left-0 right-0 mt-1 bg-dd-surface border border-dd-border rounded-xl shadow-xl overflow-hidden"
          variants={mentionDropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                onSelect(user.username);
                onClose();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-dd-border/30 transition-colors cursor-pointer"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[8px] font-bold">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-dd-text truncate">{user.username}</p>
                {user.full_name && (
                  <p className="text-[10px] text-dd-muted truncate">{user.full_name}</p>
                )}
              </div>
            </button>
          ))}
          {loading && <div className="px-3 py-2 text-[10px] text-dd-muted">Buscando...</div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
