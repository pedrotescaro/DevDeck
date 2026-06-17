"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { AnimatedCounter } from "./AnimatedCounter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

interface ReactionButtonProps {
  count: number;
  isActive: boolean;
  onToggle: () => void;
  title?: string;
}

export function ReactionButton({ count, isActive, onToggle, title }: ReactionButtonProps) {
  const [bursting, setBursting] = useState(false);
  const reduced = useReducedMotion();

  const handleClick = () => {
    const willActivate = !isActive;
    if (willActivate && !reduced) {
      setBursting(true);
      setTimeout(() => setBursting(false), 400);
    }
    onToggle();
  };

  return (
    <div className="flex items-center gap-0.5">
      <motion.button
        type="button"
        onClick={handleClick}
        title={title}
        className={cn(
          "dd-touch dd-focus-ring relative p-1.5 rounded-md transition-colors cursor-pointer",
          isActive ? "text-orange-500" : "text-dd-muted hover:text-dd-text hover:scale-[1.03]"
        )}
        whileTap={reduced ? undefined : { scale: [1, 1.35, 1.1, 1] }}
        transition={{ duration: 0.3, times: [0, 0.35, 0.7, 1] }}
      >
        <ArrowBigUp className="w-4 h-4 fill-current" />
        {bursting &&
          PARTICLE_ANGLES.map((deg, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-orange-500 pointer-events-none"
              style={{
                ["--tx" as string]: `${Math.cos((deg * Math.PI) / 180) * 16}px`,
                ["--ty" as string]: `${Math.sin((deg * Math.PI) / 180) * 16}px`,
                animation: "dd-particle 400ms ease-out forwards",
              }}
            />
          ))}
      </motion.button>
      <AnimatedCounter
        value={count}
        className="px-1 font-semibold text-[10px] text-dd-text"
      />
    </div>
  );
}
