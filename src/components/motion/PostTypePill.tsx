"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type PostType = "question" | "discussion";

interface PostTypePillProps {
  value: PostType;
  onChange: (type: PostType) => void;
}

const OPTIONS: { value: PostType; label: string }[] = [
  { value: "question", label: "Duvida Tecnica" },
  { value: "discussion", label: "Discussao Geral" },
];

export function PostTypePill({ value, onChange }: PostTypePillProps) {
  return (
    <div className="relative flex rounded-2xl border border-dd-border bg-dd-bg/70 p-1.5 select-none shadow-inner">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "relative z-10 flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer",
            value === opt.value
              ? "text-white"
              : "text-dd-muted hover:text-dd-text"
          )}
        >
          {opt.label}
          {value === opt.value && (
            <motion.div
              layoutId="postTypePill"
              className="absolute inset-0 rounded-xl bg-dd-accent shadow-lg shadow-orange-500/15 -z-10"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
