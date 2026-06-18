'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { AnimatedCounter } from './AnimatedCounter';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLongPress } from '@/hooks/useLongPress';
import { reactionPickerVariants, reactionItemVariants } from '@/lib/motion';

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const REACTIONS = [
  { emoji: '\u{1F525}', label: 'Fogo', color: '#f97316' },
  { emoji: '\u2764\uFE0F', label: 'Curtir', color: '#ef4444' },
  { emoji: '\u{1F602}', label: 'Haha', color: '#f5a623' },
  { emoji: '\u{1F44F}', label: 'Aplausos', color: '#22d48a' },
  { emoji: '\u{1F4A1}', label: 'Insight', color: '#5ba3f5' },
] as const;

type ReactionType = (typeof REACTIONS)[number]['emoji'] | null;

interface ExpandedReactionButtonProps {
  isActive: boolean;
  activeReaction?: ReactionType;
  onReact: (reaction?: ReactionType) => void;
  title?: string;
}

export function ExpandedReactionButton({
  isActive,
  activeReaction,
  onReact,
  title,
}: ExpandedReactionButtonProps) {
  const [bursting, setBursting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [particleColor, setParticleColor] = useState('#f97316');
  const reduced = useReducedMotion();

  const handleQuickReact = () => {
    if (pickerOpen) return;
    const willActivate = !isActive;
    if (willActivate && !reduced) {
      setBursting(true);
      setParticleColor('#f97316');
      setTimeout(() => setBursting(false), 400);
    }
    onReact(null);
  };

  const handlePickerReact = (reaction: (typeof REACTIONS)[number]) => {
    setPickerOpen(false);
    if (!reduced) {
      setBursting(true);
      setParticleColor(reaction.color);
      setTimeout(() => setBursting(false), 400);
    }
    onReact(reaction.emoji);
  };

  const longPressHandlers = useLongPress({
    onLongPress: () => setPickerOpen(true),
    onPress: handleQuickReact,
    threshold: 400,
  });

  const activeEmoji = activeReaction ? REACTIONS.find((r) => r.emoji === activeReaction) : null;

  return (
    <div className="relative flex items-center">
      <motion.button
        type="button"
        {...longPressHandlers}
        title={title}
        className={cn(
          'dd-touch dd-focus-ring dd-gpu relative p-1.5 rounded-md transition-colors cursor-pointer select-none',
          isActive
            ? 'text-orange-500 hover:bg-orange-500/10'
            : 'text-dd-muted hover:text-dd-text hover:bg-orange-500/10'
        )}
        whileTap={reduced ? undefined : { scale: [1, 1.35, 1.1, 1] }}
        transition={{ duration: 0.3, times: [0, 0.35, 0.7, 1] }}
      >
        {activeEmoji ? (
          <span className="text-sm leading-none">{activeEmoji.emoji}</span>
        ) : (
          <ArrowBigUp className="w-4 h-4 fill-current" />
        )}

        {bursting &&
          PARTICLE_ANGLES.map((deg, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full pointer-events-none"
              style={{
                backgroundColor: isActive ? '#a1a1aa' : particleColor,
                ['--tx' as string]: `${Math.cos((deg * Math.PI) / 180) * 16}px`,
                ['--ty' as string]: `${Math.sin((deg * Math.PI) / 180) * 16}px`,
                animation: 'dd-particle 400ms ease-out forwards',
              }}
            />
          ))}
      </motion.button>

      <AnimatePresence>
        {pickerOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
            <motion.div
              className="absolute bottom-full left-0 mb-2 z-50 flex gap-1 bg-dd-surface border border-dd-border rounded-full px-2 py-1.5 shadow-xl"
              variants={reactionPickerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {REACTIONS.map((reaction) => (
                <motion.button
                  key={reaction.emoji}
                  type="button"
                  variants={reactionItemVariants}
                  onClick={() => handlePickerReact(reaction)}
                  className="dd-touch w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-500/10 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  title={reaction.label}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
