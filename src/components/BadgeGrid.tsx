"use client";

import { useState } from "react";

interface Badge {
  slug: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  earned_at?: string | null;
}

interface BadgeGridProps {
  badges: Badge[];
}

interface BadgeDesign {
  bgGradient: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  shapeClass: string;
  innerBg: string;
  ribbonText?: string;
}

export const badgeDesigns: Record<string, BadgeDesign> = {
  hello_world: {
    bgGradient: "bg-gradient-to-br from-amber-400/20 via-yellow-600/10 to-zinc-950/40",
    borderColor: "border-amber-500/80 dark:border-amber-400 border-b-amber-700",
    textColor: "text-amber-600 dark:text-amber-400",
    glowColor: "shadow-amber-500/30",
    shapeClass: "rounded-full border-[3px] ring-4 ring-zinc-950/10 dark:ring-white/5",
    innerBg: "bg-gradient-to-br from-amber-500/10 to-transparent",
    ribbonText: "ACADEMY",
  },
  segfault_survivor: {
    bgGradient: "bg-gradient-to-br from-slate-400/20 via-slate-600/10 to-zinc-950/40",
    borderColor: "border-slate-400/80 dark:border-slate-400 border-b-slate-600",
    textColor: "text-dd-muted dark:text-dd-muted",
    glowColor: "shadow-slate-500/30",
    shapeClass:
      "rounded-lg border-[3px] [clip-path:polygon(50%_0%,_100%_20%,_100%_80%,_50%_100%,_0%_80%,_0%_20%)]",
    innerBg: "bg-gradient-to-b from-slate-500/10 to-transparent",
    ribbonText: "PRO",
  },
  git_push_force: {
    bgGradient: "bg-gradient-to-br from-blue-500/20 via-blue-700/10 to-zinc-950/40",
    borderColor: "border-blue-500/80 dark:border-blue-500 border-b-blue-700",
    textColor: "text-blue-600 dark:text-blue-400",
    glowColor: "shadow-blue-500/30",
    shapeClass: "rounded-[24px_8px] border-[3px] ring-2 ring-zinc-950/10 dark:ring-white/5",
    innerBg: "bg-gradient-to-br from-blue-500/10 to-transparent",
    ribbonText: "EXPERT",
  },
  typescript_wizard: {
    bgGradient: "bg-gradient-to-br from-purple-500/20 via-purple-700/10 to-zinc-950/40",
    borderColor: "border-purple-500/80 dark:border-purple-500 border-b-purple-800",
    textColor: "text-purple-600 dark:text-purple-400",
    glowColor: "shadow-purple-500/30",
    shapeClass:
      "rounded-full border-[3px] outline-double outline-[3px] outline-zinc-950/10 dark:outline-white/5",
    innerBg: "bg-gradient-to-br from-purple-500/10 to-transparent",
    ribbonText: "MASTER",
  },
  rustacean_approved: {
    bgGradient: "bg-gradient-to-br from-orange-500/20 via-orange-700/10 to-zinc-950/40",
    borderColor: "border-orange-500/80 dark:border-orange-500 border-b-orange-800",
    textColor: "text-orange-600 dark:text-orange-400",
    glowColor: "shadow-orange-500/30",
    shapeClass:
      "rounded-lg border-[3px] [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)]",
    innerBg: "bg-gradient-to-br from-orange-500/10 to-transparent",
    ribbonText: "ELITE",
  },
  stack_overflow_ban: {
    bgGradient: "bg-gradient-to-br from-rose-600/20 via-rose-800/10 to-zinc-950/40",
    borderColor: "border-rose-500/80 dark:border-rose-500 border-b-rose-800",
    textColor: "text-rose-600 dark:text-rose-400",
    glowColor: "shadow-rose-600/30",
    shapeClass: "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] border-[3px]",
    innerBg: "bg-gradient-to-br from-rose-500/10 to-transparent",
    ribbonText: "VETERAN",
  },
  speed_coder: {
    bgGradient: "bg-gradient-to-br from-emerald-500/20 via-emerald-700/10 to-zinc-950/40",
    borderColor: "border-emerald-500/80 dark:border-emerald-500 border-b-emerald-800",
    textColor: "text-emerald-600 dark:text-emerald-500",
    glowColor: "shadow-emerald-500/30",
    shapeClass:
      "rounded-xl border-[3px] [clip-path:polygon(50%_0%,_100%_38%,_82%_100%,_18%_100%,_0%_38%)]",
    innerBg: "bg-gradient-to-br from-emerald-500/10 to-transparent",
    ribbonText: "AGILE",
  },
  debug_ninja: {
    bgGradient: "bg-gradient-to-br from-zinc-500/20 via-zinc-700/10 to-zinc-950/40",
    borderColor: "border-zinc-500/80 dark:border-zinc-500 border-b-zinc-800",
    textColor: "text-zinc-700 dark:text-zinc-400",
    glowColor: "shadow-zinc-500/30",
    shapeClass: "border-[3px] rounded-full",
    innerBg: "bg-gradient-to-br from-zinc-500/10 to-transparent",
    ribbonText: "NINJA",
  },
  coffee_overflow: {
    bgGradient: "bg-gradient-to-br from-amber-600/20 via-amber-800/10 to-zinc-950/40",
    borderColor: "border-amber-600/80 dark:border-amber-600 border-b-amber-900",
    textColor: "text-amber-700 dark:text-amber-500",
    glowColor: "shadow-amber-600/30",
    shapeClass:
      "border-[3px] [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]",
    innerBg: "bg-gradient-to-br from-amber-600/10 to-transparent",
    ribbonText: "SUPREME",
  },
};

export function BadgeEmblem({
  slug,
  icon,
  label,
  size = "md",
  earned = true,
}: {
  slug: string;
  icon: string;
  label: string;
  size?: "sm" | "md";
  earned?: boolean;
}) {
  const sizeClasses = {
    sm: {
      outer: "w-14 h-14",
      inner: "w-11 h-11",
      icon: "text-lg",
      ribbon: "text-[7px] py-0.5",
    },
    md: {
      outer: "w-20 h-20",
      inner: "w-16 h-16",
      icon: "text-2xl",
      ribbon: "text-[8px] py-0.5 px-1.5",
    },
  }[size];

  const realBadgeImages: Record<string, string> = {
    code_streak: "/badge_streak.png",
    python_master: "/badge_python.png",
    rust_practitioner: "/badge_rust.png",
    community_educator: "/badge_educator.png",
  };

  const imageSrc = realBadgeImages[slug];

  if (imageSrc) {
    return (
      <div className="flex flex-col items-center justify-center select-none">
        <div
          className={`relative flex items-center justify-center ${sizeClasses.outer} ${
            earned ? "shadow-lg shadow-orange-500/20" : "opacity-35 grayscale"
          } transition-all duration-300 hover:scale-[1.04]`}
        >
          <img
            src={imageSrc}
            alt={label}
            className={`${sizeClasses.outer} object-contain rounded-xl`}
          />
          {!earned && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-xl">
              <span className="text-sm">🔒</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const design = badgeDesigns[slug] || {
    bgGradient: "from-slate-500/10 via-slate-600/5 to-transparent",
    borderColor: "border-slate-400/40",
    textColor: "text-dd-muted",
    glowColor: "shadow-slate-500/10",
    shapeClass: "rounded-xl border-2",
    innerBg: "bg-slate-50",
    ribbonText: "BADGE",
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div
        className={`relative flex items-center justify-center ${sizeClasses.outer} ${
          earned
            ? design.bgGradient
            : "bg-gradient-to-b from-slate-900/5 via-slate-950/2 to-transparent"
        } ${earned ? design.borderColor : "border-dd-border border-dashed border-2"} ${
          earned ? design.shapeClass : "rounded-xl"
        } ${earned ? `shadow-lg ${design.glowColor}` : "opacity-35 grayscale"} transition-all duration-300 hover:scale-[1.04]`}
      >
        <div
          className={`flex items-center justify-center ${sizeClasses.inner} rounded-inherit ${earned ? design.innerBg : "bg-dd-surface/40"} border border-dd-border/10 backdrop-blur-[1px]`}
        >
          <span
            className={`${sizeClasses.icon} transform transition-transform duration-300 hover:scale-110 drop-shadow-md`}
            role="img"
            aria-label={label}
          >
            {earned ? icon : "🔒"}
          </span>
        </div>

        {earned && design.ribbonText && (
          <span
            className={`absolute -bottom-2.5 bg-zinc-950 dark:bg-white border-2 border-zinc-900 dark:border-white text-white dark:text-zinc-950 font-extrabold rounded-none shadow-md ${sizeClasses.ribbon} font-mono uppercase text-center [clip-path:polygon(10%_0%,_90%_0%,_100%_50%,_90%_100%,_10%_100%,_0%_50%)]`}
          >
            {design.ribbonText}
          </span>
        )}
      </div>
    </div>
  );
}

function BadgeItem({ badge }: { badge: Badge }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const earned = !!badge.earned_at;

  return (
    <div
      className="relative flex flex-col items-center gap-3"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <BadgeEmblem slug={badge.slug} icon={badge.icon} label={badge.label} earned={earned} />

      <div className="text-center mt-1">
        <span
          className={`text-[11px] font-bold block truncate max-w-[120px] ${earned ? "text-dd-text" : "text-dd-muted font-normal"}`}
        >
          {badge.label}
        </span>
        {earned && badge.earned_at && (
          <span className="text-dd-muted text-[9px] font-semibold block mt-0.5">
            {new Date(badge.earned_at).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 w-52 animate-slide-up">
          <div className="bg-dd-card border border-dd-border rounded-xl px-4 py-3 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-dd-text text-xs font-bold mb-1">{badge.label}</p>
            <p className="text-dd-muted text-[10px] leading-relaxed">{badge.description}</p>
            {!earned && (
              <p className="text-dd-amber text-[9px] mt-1.5 font-bold uppercase tracking-wider">
                Ainda não conquistado
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-dd-muted text-xs text-center py-12 italic">
        Nenhum badge disponível ainda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 py-4">
      {badges.map((badge) => (
        <BadgeItem key={badge.slug} badge={badge} />
      ))}
    </div>
  );
}
