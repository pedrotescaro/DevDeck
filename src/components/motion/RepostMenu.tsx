"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Repeat2, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/cn";
import { popoverMenuVariants } from "@/lib/motion";

interface RepostMenuProps {
  onRepost: () => void;
  onQuote: () => void;
  count?: number;
  isReposted?: boolean;
  className?: string;
}

export function RepostMenu({
  onRepost,
  onQuote,
  count = 0,
  isReposted = false,
  className,
}: RepostMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "dd-touch dd-focus-ring p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1",
          isReposted
            ? "text-dd-green"
            : "text-dd-muted hover:text-dd-green"
        )}
        title="Repostar"
      >
        <Repeat2 className="w-4 h-4" />
        {count > 0 && (
          <span className="text-[10px] font-semibold">{count}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-full left-0 mb-2 z-50 bg-dd-surface border border-dd-border rounded-xl shadow-xl overflow-hidden min-w-[180px]"
            variants={popoverMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onRepost();
              }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-bold text-dd-text hover:bg-dd-border/30 transition-colors cursor-pointer"
            >
              <Repeat2 className="w-4 h-4" />
              Repostar
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onQuote();
              }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-bold text-dd-text hover:bg-dd-border/30 transition-colors cursor-pointer"
            >
              <MessageSquareQuote className="w-4 h-4" />
              Citar com comentario
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
