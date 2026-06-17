"use client";

import { ReactNode, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function TabSwitcher({ tabs, defaultTab, className }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className={cn("w-full", className)}>
      {/* Tab selector with sliding underline */}
      <div className="relative flex gap-6 border-b border-dd-border">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative py-3 text-sm font-semibold transition-colors cursor-pointer",
              activeTab === tab.id ? "text-dd-text" : "text-dd-muted hover:text-dd-text"
            )}
          >
            {tab.label}
            {/* Sliding underline indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-dd-accent rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Crossfade content */}
      <div className="mt-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="crossfade"
        >
          {activeTabData?.content}
        </motion.div>
      </div>
    </div>
  );
}
