'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Lock, RotateCcw, Sparkles, Star, Trophy, X } from 'lucide-react';
import type { TrailLevel } from '@/lib/trailsData';
import { getSectionTheme } from './trailTheme';

const MAP_HEIGHT = 1240;

interface TrailMapProps {
  activeLanguage: string;
  allLevels: TrailLevel[];
  levels: TrailLevel[];
  attempts: Record<string, boolean>;
  isLevelUnlocked: (levelIndex: number) => boolean;
  onLevelClick: (level: TrailLevel, unlocked: boolean) => void;
  onCheckpointClick: (sectionNumber: number) => void;
}

function LessonStars({
  level,
  attempts,
}: {
  level?: TrailLevel;
  attempts: Record<string, boolean>;
}) {
  const count = level ? Math.min(3, Math.max(1, level.questions.length)) : 3;

  return (
    <div
      aria-label="Progresso da unidade"
      className="mb-1.5 flex h-6 items-end justify-center gap-1"
    >
      {Array.from({ length: count }).map((_, index) => {
        const earned = level ? attempts[level.questions[index]?.id] === true : false;
        const middle = index === 1;

        return (
          <Star
            key={index}
            aria-hidden="true"
            className={`${
              middle ? 'h-5 w-5 -translate-y-1' : 'h-4 w-4'
            } ${earned ? 'fill-[#ffc800] text-[#ffc800]' : 'fill-[#ffc800] text-[#ffc800]'}`}
          />
        );
      })}
    </div>
  );
}

export function TrailMap({
  activeLanguage,
  allLevels,
  levels,
  attempts,
  isLevelUnlocked,
  onLevelClick,
  onCheckpointClick,
}: TrailMapProps) {
  const checkpointId = `${activeLanguage.toLowerCase()}-u${levels[0]?.unitNumber ?? 1}-checkpoint`;
  const checkpointCompleted = attempts[checkpointId] === true;
  const sectionNumber = levels[0]?.unitNumber ?? 1;
  const theme = getSectionTheme(sectionNumber);

  const [rewardModal, setRewardModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    xp: number;
    unlocked: boolean;
  }>({
    open: false,
    title: '',
    description: '',
    xp: 0,
    unlocked: false,
  });

  const level1 = levels[0];
  const level2 = levels[1];
  const level3 = levels[2];

  const globalIndex0 = level1
    ? allLevels.findIndex((candidate) => candidate.levelNumber === level1.levelNumber)
    : 0;
  const globalIndex1 = level2
    ? allLevels.findIndex((candidate) => candidate.levelNumber === level2.levelNumber)
    : 1;
  const globalIndex2 = level3
    ? allLevels.findIndex((candidate) => candidate.levelNumber === level3.levelNumber)
    : 2;

  const level1Unlocked = isLevelUnlocked(globalIndex0);
  const level1Completed = level1
    ? level1.questions.every((question) => attempts[question.id] === true)
    : false;
  const level1Accessible = level1Unlocked || level1Completed;

  const level2Unlocked = isLevelUnlocked(globalIndex1);
  const level2Completed = level2
    ? level2.questions.every((question) => attempts[question.id] === true)
    : false;
  const level2Accessible = level2Unlocked || level2Completed;

  const level3Unlocked = isLevelUnlocked(globalIndex2);
  const level3Completed = level3
    ? level3.questions.every((question) => attempts[question.id] === true)
    : false;
  const level3Accessible = level3Unlocked || level3Completed;

  const checkpointUnlocked = Boolean(
    level3 && level3.questions.every((question) => attempts[question.id] === true)
  );

  const chestUnlocked = level2Completed;

  const handleOpenChestReward = (xpAmount: number, unlocked: boolean) => {
    if (unlocked) {
      setRewardModal({
        open: true,
        title: 'Baú de Recompensa Resgatado!',
        description:
          'Parabéns pelo seu progresso! Você abriu o baú da trilha e garantiu um bônus especial de aprendizado.',
        xp: xpAmount,
        unlocked: true,
      });
    } else {
      setRewardModal({
        open: true,
        title: 'Baú Bloqueado',
        description:
          'Complete as lições anteriores da trilha para desbloquear e abrir este baú de bônus!',
        xp: xpAmount,
        unlocked: false,
      });
    }
  };

  return (
    <div
      data-testid="trail-map"
      className="relative mx-auto w-full max-w-[680px]"
      style={{ height: `${MAP_HEIGHT}px` }}
    >
      {/* S-Curve Path connecting all nodes themed by section */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 680 1200"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M 326 80 C 290 120 248 155 226 205 C 198 265 200 320 250 370 C 300 420 326 455 326 500 C 326 550 365 585 395 625 C 430 675 392 730 326 770 C 265 808 242 858 260 910 C 278 962 350 985 372 1030 C 394 1076 350 1120 326 1170"
          fill="none"
          stroke={theme.pathStroke}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="9 11"
          opacity="0.8"
          style={{ filter: `drop-shadow(0 0 6px ${theme.glowHex})` }}
        />
      </svg>

      {/* Robot Mascot 1 (Top Right) */}
      <div
        data-testid="trail-robot"
        className="pointer-events-none absolute right-[4%] top-[40px] z-[3] hidden h-[140px] w-[135px] sm:block"
      >
        <Image
          src="/assets/trails/blue-devdeck-robot.png"
          alt="Robô mascote digitando"
          fill
          sizes="135px"
          className="object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* Robot Mascot 2 (Middle Left - Gaming/Typing pose) */}
      <div
        data-testid="trail-robot-gaming"
        className="pointer-events-none absolute left-[4%] top-[515px] z-[3] hidden h-[135px] w-[135px] sm:block"
      >
        <Image
          src="/assets/trails/blue-devdeck-robot-gaming.png"
          alt="Robô mascote com headset"
          fill
          sizes="135px"
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Trophy 1 */}
      <Trophy
        aria-hidden="true"
        className="absolute left-[44%] top-[250px] h-7 w-7 -translate-x-1/2"
        style={{ color: theme.primaryHex, opacity: 0.6 }}
        strokeWidth={1.5}
      />

      {/* Floating XP bubble 1 */}
      <div
        aria-hidden="true"
        className="absolute left-[56%] top-[350px] z-[2] flex h-10 w-10 -translate-x-1/2 flex-col items-center justify-center rounded-full border border-dd-border bg-dd-surface/90 shadow-md backdrop-blur-sm"
      >
        <span className="text-[8px] font-black leading-none" style={{ color: theme.primaryHex }}>
          XP
        </span>
        <span className="mt-0.5 text-[8px] font-black leading-none text-yellow-400">+100</span>
      </div>

      {/* Trophy 2 */}
      <Trophy
        aria-hidden="true"
        className="absolute left-[56%] top-[770px] h-7 w-7 -translate-x-1/2"
        style={{ color: theme.primaryHex, opacity: 0.6 }}
        strokeWidth={1.5}
      />

      {/* Floating XP bubble 2 */}
      <div
        aria-hidden="true"
        className="absolute left-[44%] top-[860px] z-[2] flex h-10 w-10 -translate-x-1/2 flex-col items-center justify-center rounded-full border border-dd-border bg-dd-surface/90 shadow-md backdrop-blur-sm"
      >
        <span className="text-[8px] font-black leading-none" style={{ color: theme.primaryHex }}>
          XP
        </span>
        <span className="mt-0.5 text-[8px] font-black leading-none text-yellow-400">+150</span>
      </div>

      {/* NODE 1: Level 1 Node — on path at (326, 80) = 48% */}
      {level1 && (
        <div
          id={`trail-section-${level1.unitNumber}`}
          className="absolute left-[48%] top-[40px] z-10 flex w-[170px] -translate-x-1/2 flex-col items-center text-center"
        >
          <LessonStars level={level1} attempts={attempts} />
          <button
            type="button"
            disabled={!level1Accessible}
            onClick={() => onLevelClick(level1, level1Accessible)}
            aria-label={`Seção ${level1.unitNumber}, unidade 1: ${level1.title}`}
            className={`group dd-focus-ring relative flex h-[76px] w-[76px] items-center justify-center rounded-[22px] shadow-md transition-all duration-150 enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:active:translate-y-[4px] ${theme.nodeButtonClass}`}
          >
            <span className="font-mono text-base font-black tracking-tight text-white">{`{x=5}`}</span>
          </button>
          <p className="mt-2 text-xs font-black uppercase tracking-wide text-dd-text">
            {level1.title}
          </p>
        </div>
      )}

      {/* NODE 2: Step 1 — on path at (240, 190) = 35% */}
      <div className="absolute left-[35%] top-[160px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => level1 && onLevelClick(level1, true)}
          aria-label="Passo de variáveis: Tipos Primitivos"
          className={`flex h-[58px] w-[58px] cursor-pointer items-center justify-center rounded-full shadow-md transition-all hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`}
        >
          <Check className="h-7 w-7" strokeWidth={3.5} />
        </button>
      </div>

      {/* NODE 3: Step 2 — on path at (200, 310) = 29% */}
      <div className="absolute left-[29%] top-[280px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => level1 && onLevelClick(level1, true)}
          aria-label="Passo de variáveis: Escopo de Bloco"
          className={`flex h-[58px] w-[58px] cursor-pointer items-center justify-center rounded-full shadow-md transition-all hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`}
        >
          <Check className="h-7 w-7" strokeWidth={3.5} />
        </button>
      </div>

      {/* NODE 4: Step 3 — on path at (265, 410) = 39% */}
      <div className="absolute left-[39%] top-[380px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => level2 && onLevelClick(level2, level2Accessible)}
          disabled={!level2Accessible}
          aria-label="Passo de estruturas: Condicionais"
          className={`flex h-[58px] w-[58px] items-center justify-center rounded-full text-white shadow-md transition-all ${
            level2Accessible
              ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
              : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
          }`}
        >
          {level2Accessible ? (
            <Check className="h-7 w-7" strokeWidth={3.5} />
          ) : (
            <Lock className="h-5 w-5" strokeWidth={2.6} />
          )}
        </button>
      </div>

      {/* NODE 5: Level 2 Node — on path at (326, 500) = 48% */}
      {level2 && (
        <div className="absolute left-[48%] top-[460px] z-10 flex w-[180px] -translate-x-1/2 flex-col items-center text-center">
          <LessonStars level={level2} attempts={attempts} />
          <button
            type="button"
            disabled={!level2Accessible}
            onClick={() => onLevelClick(level2, level2Accessible)}
            aria-label={`Seção ${level2.unitNumber}, unidade 2: ${level2.title}`}
            className={`group dd-focus-ring relative flex h-[76px] w-[76px] items-center justify-center rounded-[22px] text-white shadow-md transition-all duration-150 ${
              level2Accessible
                ? `enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:active:translate-y-[4px] ${theme.nodeButtonClass}`
                : 'border-b-[6px] border-[#202b33] bg-[#37464f] text-[#77858d]'
            }`}
          >
            {level2Accessible ? (
              <span className="flex items-center justify-center font-mono text-lg font-black text-white">
                <RotateCcw className="h-7 w-7" strokeWidth={2.8} />
              </span>
            ) : (
              <Lock className="h-6 w-6" strokeWidth={2.6} />
            )}
          </button>
          <p className="mt-2 text-xs font-black uppercase tracking-wide text-dd-text">
            {level2.title}
          </p>
        </div>
      )}

      {/* NODE 6: Reward Chest */}
      <div className="absolute left-[68%] top-[590px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => handleOpenChestReward(150, chestUnlocked)}
          aria-label="Baú da trilha"
          className="dd-focus-ring group relative flex h-[84px] w-[84px] cursor-pointer items-center justify-center transition-transform duration-150 hover:-translate-y-1 active:scale-95"
        >
          <Image
            src={
              chestUnlocked
                ? '/assets/trails/trail-chest-open.png'
                : '/assets/trails/trail-chest.png'
            }
            alt="Baú da trilha"
            width={82}
            height={82}
            className="relative z-10 h-[82px] w-[82px] object-contain transition-transform group-hover:scale-105"
          />
        </button>
      </div>

      {/* NODE 7: Level 3 Node — on path at (326, 720) = 48% */}
      {level3 && (
        <div className="absolute left-[48%] top-[680px] z-10 flex w-[180px] -translate-x-1/2 flex-col items-center text-center">
          <LessonStars level={level3} attempts={attempts} />
          <button
            type="button"
            disabled={!level3Accessible}
            onClick={() => onLevelClick(level3, level3Accessible)}
            aria-label={`Seção ${level3.unitNumber}, unidade 3: ${level3.title}`}
            className={`group dd-focus-ring relative flex h-[76px] w-[76px] items-center justify-center rounded-[22px] text-white shadow-md transition-all duration-150 ${
              level3Accessible
                ? `enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:active:translate-y-[4px] ${theme.nodeButtonClass}`
                : 'border-b-[6px] border-[#202b33] bg-[#37464f] text-[#77858d]'
            }`}
          >
            {level3Accessible ? (
              <span className="font-mono text-base font-black tracking-tight text-white">{`[ ... ]`}</span>
            ) : (
              <Lock className="h-6 w-6" strokeWidth={2.6} />
            )}
          </button>
          <p className="mt-2 text-xs font-black uppercase tracking-wide text-dd-text">
            {level3.title}
          </p>
        </div>
      )}

      {/* NODE 8: Step 4 — on path at (260, 840) = 38% */}
      <div className="absolute left-[38%] top-[810px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => level3 && onLevelClick(level3, level3Accessible)}
          disabled={!level3Accessible}
          aria-label="Passo de arrays: Métodos"
          className={`flex h-[58px] w-[58px] items-center justify-center rounded-full text-white shadow-md transition-all ${
            level3Accessible
              ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
              : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
          }`}
        >
          {level3Accessible ? (
            <Check className="h-7 w-7" strokeWidth={3.5} />
          ) : (
            <Lock className="h-5 w-5" strokeWidth={2.6} />
          )}
        </button>
      </div>

      {/* NODE 9: Step 5 */}
      <div className="absolute left-[55%] top-[910px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => level3 && onLevelClick(level3, level3Accessible)}
          disabled={!level3Accessible}
          aria-label="Passo de objetos: Propriedades"
          className={`flex h-[58px] w-[58px] items-center justify-center rounded-full text-white shadow-md transition-all ${
            level3Accessible
              ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
              : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
          }`}
        >
          {level3Accessible ? (
            <Star className="h-7 w-7 fill-current" strokeWidth={2.8} />
          ) : (
            <Lock className="h-5 w-5" strokeWidth={2.6} />
          )}
        </button>
      </div>

      {/* NODE 10: Step 6 */}
      <div className="absolute left-[52%] top-[1010px] z-10 flex -translate-x-1/2 items-center justify-center">
        <button
          type="button"
          onClick={() => level3 && onLevelClick(level3, level3Accessible)}
          disabled={!level3Accessible}
          aria-label="Passo de objetos: Revisão"
          className={`flex h-[58px] w-[58px] items-center justify-center rounded-full text-white shadow-md transition-all ${
            level3Accessible
              ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
              : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
          }`}
        >
          {level3Accessible ? (
            <Check className="h-7 w-7" strokeWidth={3.5} />
          ) : (
            <Lock className="h-5 w-5" strokeWidth={2.6} />
          )}
        </button>
      </div>

      {/* NODE 11: Section Checkpoint */}
      <div className="absolute left-[48%] top-[1090px] z-10 flex w-[200px] -translate-x-1/2 flex-col items-center text-center">
        <LessonStars level={level3} attempts={attempts} />
        <button
          type="button"
          onClick={() => onCheckpointClick(sectionNumber)}
          aria-label={`Checkpoint da seção ${sectionNumber}`}
          className={`dd-focus-ring relative flex h-[78px] w-[78px] cursor-pointer items-center justify-center rounded-[22px] shadow-md transition-all duration-150 hover:-translate-y-0.5 active:translate-y-[4px] ${theme.checkpointButtonClass}`}
        >
          {checkpointCompleted ? (
            <Check className="h-8 w-8" strokeWidth={3.2} />
          ) : (
            <span className="font-mono text-2xl font-black text-white">{`{ }`}</span>
          )}
          {!checkpointUnlocked && (
            <span className="absolute -right-1 -top-1 rounded-full border border-dd-border bg-dd-bg p-1.5 shadow-md">
              <Lock className="h-3.5 w-3.5 text-dd-muted" />
            </span>
          )}
        </button>
        <p className="mt-2 text-xs font-black uppercase tracking-wide text-dd-text">Desafio</p>
        <p className="mt-0.5 text-[11px] font-bold text-dd-muted">Checkpoint de Código</p>
      </div>

      {/* REWARD MODAL */}
      {rewardModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-dd-border bg-dd-surface p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setRewardModal((prev) => ({ ...prev, open: false }))}
              aria-label="Fechar modal de recompensa"
              className="absolute right-4 top-4 rounded-full p-1 text-dd-muted hover:bg-dd-border/40 hover:text-dd-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <Image
                src={
                  rewardModal.unlocked
                    ? '/assets/trails/trail-chest-open.png'
                    : '/assets/trails/trail-chest.png'
                }
                alt="Baú de Recompensa"
                width={80}
                height={80}
                className="h-20 w-20 object-contain drop-shadow-xl animate-bounce"
              />
            </div>

            <h3 className="text-lg font-black text-dd-text">{rewardModal.title}</h3>
            <p className="mt-2 text-xs font-semibold text-dd-muted leading-relaxed">
              {rewardModal.description}
            </p>

            {rewardModal.unlocked && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-yellow-400/15 border border-yellow-400/30 px-4 py-2 text-sm font-black text-yellow-400">
                <Sparkles className="h-4 w-4" />+{rewardModal.xp} XP Bônus
              </div>
            )}

            <button
              type="button"
              onClick={() => setRewardModal((prev) => ({ ...prev, open: false }))}
              className={`mt-6 w-full cursor-pointer rounded-xl py-3 text-xs font-black uppercase tracking-wide text-white transition-all hover:brightness-110 active:translate-y-1 active:border-b-0 ${theme.nodeButtonClass}`}
            >
              {rewardModal.unlocked ? 'Pegar Recompensa' : 'Entendido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
