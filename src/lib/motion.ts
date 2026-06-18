import { Variants } from 'framer-motion';

/* ── Spring Configs ── */
export const springSnappy = { type: 'spring' as const, stiffness: 500, damping: 28, mass: 0.8 };
export const springBouncy = { type: 'spring' as const, stiffness: 400, damping: 15, mass: 0.6 };
export const springGentle = { type: 'spring' as const, stiffness: 260, damping: 24 };
export const springReaction = { type: 'spring' as const, stiffness: 600, damping: 20, mass: 0.5 };

/* ── Base Variants ── */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springGentle },
};

export const newPostsPillVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springBouncy },
  exit: { opacity: 0, y: -8, scale: 0.9, transition: { duration: 0.15 } },
};

/* ── Reaction Picker (long-press) ── */
export const reactionPickerVariants: Variants = {
  hidden: { opacity: 0, scale: 0, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...springBouncy, staggerChildren: 0.03 },
  },
  exit: { opacity: 0, scale: 0.8, y: 4, transition: { duration: 0.12 } },
};

export const reactionItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: springReaction },
};

/* ── Bottom Sheet (draft discard) ── */
export const bottomSheetVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ...springGentle, duration: 0.3 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Optimistic Post ── */
export const optimisticPostVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { ...springGentle, duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: 'easeOut' } },
};

/* ── Level Up Overlay ── */
export const levelUpOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 2.5 } },
};

export const levelUpBadgeVariants: Variants = {
  hidden: { scale: 0.5, rotate: -10, opacity: 0 },
  visible: {
    scale: [0.5, 1.1, 1],
    rotate: [-10, 4, 0],
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* ── Crossfade (tab switching) ── */
export const crossfadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── Slide Down (content reveal) ── */
export const slideDownVariants: Variants = {
  hidden: { height: 0, opacity: 0, overflow: 'hidden' as const },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.15 } },
};

/* ── Mention Dropdown ── */
export const mentionDropdownVariants: Variants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1 } },
};

/* ── Repost / Share Menu ── */
export const popoverMenuVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.9, y: 4, transition: { duration: 0.1 } },
};

/* ── DM message stagger ── */
export const dmMessageVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

export const dmStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

/* ── Notification stagger (bottom to top) ── */
export const notifStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

export const notifItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

export const POST_CHAR_LIMIT = 500;
