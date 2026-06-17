"use client";

import { AnimatePresence, motion } from "framer-motion";
import { newPostsPillVariants } from "@/lib/motion";

interface NewPostsPillProps {
  count: number;
  onClick: () => void;
  visible: boolean;
}

export function NewPostsPill({ count, onClick, visible }: NewPostsPillProps) {
  return (
    <AnimatePresence>
      {visible && count > 0 && (
        <motion.button
          type="button"
          onClick={onClick}
          variants={newPostsPillVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-40
                     bg-orange-500 text-white text-xs font-bold
                     px-4 py-2 rounded-full shadow-lg shadow-orange-500/25
                     hover:scale-[1.03] active:scale-95 dd-focus-ring cursor-pointer"
        >
          Ver {count} {count === 1 ? "novo post" : "novos posts"}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
