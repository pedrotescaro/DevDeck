"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CommunityCardProps {
  language: string;
  memberCount: number;
  isMember: boolean;
  onJoin: () => void;
}

const LANGUAGE_THEME_COLORS: Record<string, string> = {
  JavaScript: "#f5a623",
  TypeScript: "#3178c6",
  Python: "#5ba3f5",
  Rust: "#f97316",
  Go: "#22d48a",
  "C++": "#f59e0b",
  Java: "#ef4444",
  Kotlin: "#7f52ff",
  Swift: "#f05138",
};

const LANGUAGE_THEME_CLASSES: Record<string, string> = {
  JavaScript: "theme-js",
  TypeScript: "theme-typescript",
  Python: "theme-python",
  Rust: "theme-rust",
  Go: "theme-go",
  "C++": "theme-cpp",
  Java: "theme-java",
  Kotlin: "theme-kotlin",
  Swift: "theme-swift",
};

export function CommunityCard({
  language,
  memberCount,
  isMember,
  onJoin,
}: CommunityCardProps) {
  const themeColor = LANGUAGE_THEME_COLORS[language] || "#f97316";
  const themeClass = LANGUAGE_THEME_CLASSES[language] || "";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "community-card border border-dd-border rounded-xl p-4 transition-all",
        themeClass
      )}
      style={
        themeClass
          ? undefined
          : {
              borderColor: themeColor,
            }
      }
    >
      <h3 className="text-sm font-bold text-dd-text mb-2">{language} Community</h3>
      <p className="text-xs text-dd-muted mb-4">{memberCount.toLocaleString()} membros</p>
      <button
        onClick={onJoin}
        className="mt-2 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer"
        style={{
          backgroundColor: themeColor,
          color: "white",
        }}
      >
        {isMember ? "Membro" : "Entrar"}
      </button>
    </motion.div>
  );
}
