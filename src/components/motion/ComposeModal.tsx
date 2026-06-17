"use client";

import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { modalContentVariants, fadeVariants, bottomSheetVariants } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  hasDraft: boolean;
  onDiscard?: () => void;
  children: ReactNode;
  headerExtra?: ReactNode;
}

export function ComposeModal({
  open,
  onClose,
  hasDraft,
  onDiscard,
  children,
  headerExtra,
}: ComposeModalProps) {
  const reduced = useReducedMotion();
  const [discardWarning, setDiscardWarning] = useState(false);

  function handleClose() {
    if (hasDraft) {
      setDiscardWarning(true);
      return;
    }
    setDiscardWarning(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasDraft, onClose]);

  const handleDiscard = () => {
    setDiscardWarning(false);
    onDiscard?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-[8px]"
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Criar nova publicação"
            variants={reduced ? fadeVariants : modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-xl bg-dd-surface border border-dd-border rounded-2xl shadow-2xl z-10 font-sans p-4 space-y-4 overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={handleClose}
                type="button"
                aria-label="Fechar rascunho"
                className="dd-focus-ring dd-touch text-dd-text hover:bg-dd-surface/80 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              {headerExtra}
            </div>

            {children}
          </motion.div>

          <AnimatePresence>
            {discardWarning && (
              <motion.div
                variants={reduced ? fadeVariants : bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-2xl rounded-t-3xl border border-dd-border bg-dd-surface px-5 pb-6 pt-4 shadow-2xl"
              >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-dd-border" />
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-dd-text">Descartar rascunho?</p>
                    <p className="text-xs text-dd-muted">
                      Seu texto continua salvo ate voce decidir descartar.
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDiscardWarning(false)}
                      className="dd-touch rounded-full border border-dd-border px-4 py-2 text-xs font-bold text-dd-text transition-colors hover:bg-dd-bg cursor-pointer"
                    >
                      Continuar
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscard}
                      className="dd-touch rounded-full bg-red-500/12 px-4 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/18 cursor-pointer"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
