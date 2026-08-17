'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Swords, RotateCcw, ArrowRight, Code2, Flame, Zap } from 'lucide-react';
import Link from 'next/link';

interface DuelVictoryModalProps {
  isOpen: boolean;
  isWinner: boolean;
  winnerUsername: string;
  winnerAvatarUrl?: string | null;
  xpAwarded: number;
  streak: number;
  myCode: string;
  opponentCode?: string;
  onRematch: () => void;
  onClose: () => void;
}

export function DuelVictoryModal({
  isOpen,
  isWinner,
  winnerUsername,
  winnerAvatarUrl,
  xpAwarded,
  streak,
  myCode,
  opponentCode,
  onRematch,
  onClose,
}: DuelVictoryModalProps) {
  const [showCodeDiff, setShowCodeDiff] = useState(false);
  const [rematchSent, setRematchSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-lg overflow-hidden rounded-[28px] border-2 border-b-4 border-dd-border bg-dd-surface p-6 sm:p-8 text-center shadow-2xl space-y-6 relative"
      >
        {/* Header Icon & Title */}
        <div className="space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-b-4 border-amber-500/50 border-b-amber-600 bg-amber-500/20 text-amber-300 shadow-xl shadow-amber-500/20">
            {isWinner ? (
              <Trophy className="h-10 w-10 animate-bounce" />
            ) : (
              <Swords className="h-10 w-10" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isWinner ? 'Vitória Épica! 🏆' : 'Fim do Duelo! ⚔️'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
            {isWinner
              ? 'Você superou seu oponente e resolveu o desafio com perfeição!'
              : `${winnerUsername} concluiu o desafio primeiro nesta rodada.`}
          </p>
        </div>

        {/* Gamified Rewards Card (XP & Streak) */}
        <div className="grid grid-cols-2 gap-3">
          {/* XP Card */}
          <div className="rounded-2xl border-2 border-b-4 border-emerald-500/40 border-b-emerald-600 bg-emerald-500/15 p-3.5 flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-emerald-300">+{xpAwarded} XP</p>
              <p className="text-[10px] text-emerald-400/80 font-bold uppercase">Recompensa</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="rounded-2xl border-2 border-b-4 border-amber-500/40 border-b-amber-600 bg-amber-500/15 p-3.5 flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-amber-300">{streak} Dias</p>
              <p className="text-[10px] text-amber-400/80 font-bold uppercase">Ofensiva</p>
            </div>
          </div>
        </div>

        {/* Code View Toggle */}
        {opponentCode && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => setShowCodeDiff(!showCodeDiff)}
              className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              {showCodeDiff ? 'Ocultar código do oponente' : 'Ver código da solução do oponente'}
            </button>
            {showCodeDiff && (
              <pre className="mt-2 p-3 bg-slate-950 border border-dd-border rounded-xl text-[11px] font-mono text-emerald-400 max-h-40 overflow-y-auto">
                {opponentCode}
              </pre>
            )}
          </div>
        )}

        {/* Action Buttons: 3D Duolingo Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setRematchSent(true);
              onRematch();
            }}
            disabled={rematchSent}
            className="dd-touch dd-focus-ring flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-amber-600 border-b-amber-800 bg-amber-500 hover:bg-amber-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer disabled:opacity-60"
          >
            <RotateCcw className="w-4 h-4" />
            {rematchSent ? 'Revanche Pedida!' : 'Pedir Revanche'}
          </button>

          <Link
            href="/duels"
            className="dd-touch dd-focus-ring flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-blue-600 border-b-blue-800 bg-blue-500 hover:bg-blue-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 cursor-pointer"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
