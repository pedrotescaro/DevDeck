'use client';

import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, FastForward, Lock, Sparkles, Star, Trophy, X } from 'lucide-react';
import type { TrailLevel } from '@/lib/trailsData';
import { getSectionTheme } from './trailTheme';

/** Topo do primeiro nó de nível de cada unidade (abaixo da linha divisória). */
const FIRST_LEVEL_TOP = 96;
/** Espaçamento vertical entre os nós de nível. */
const LEVEL_SPACING = 240;
/** Distância do último nível até o checkpoint. */
const CHECKPOINT_GAP = 160;
/** Altura do botão do checkpoint. */
const CHECKPOINT_BTN_H = 78;
/** Respiro abaixo do checkpoint até a próxima unidade. */
const UNIT_BOTTOM_PAD = 170;

/** Converte um hex (#rgb ou #rrggbb) em HSL. */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: h * 360, s, l };
}

/**
 * Filtro CSS que tinge o PNG azul do baú com a cor do tema da seção,
 * preservando o sombreamento (hue-rotate + saturate + brightness).
 */
function chestTintFilter(targetHex: string): string {
  // Azul original do baú (blue-500 #3b82f6)
  const source = hexToHsl('#3b82f6');
  const target = hexToHsl(targetHex);

  const hue = target.h - source.h;
  const sat = source.s > 0 ? target.s / source.s : 1;
  const light = source.l > 0 ? target.l / source.l : 1;

  return `hue-rotate(${hue.toFixed(1)}deg) saturate(${sat.toFixed(3)}) brightness(${light.toFixed(3)})`;
}

interface TrailMapProps {
  activeLanguage: string;
  allLevels: TrailLevel[];
  attempts: Record<string, boolean>;
  isLevelUnlocked: (levelIndex: number) => boolean;
  onLevelClick: (level: TrailLevel, unlocked: boolean) => void;
  onCheckpointClick: (sectionNumber: number) => void;
}

interface UnitBlock {
  unitNumber: number;
  levels: TrailLevel[];
  theme: ReturnType<typeof getSectionTheme>;
  height: number;
  checkpointTop: number;
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
            } ${earned ? 'fill-[#ffc800] text-[#ffc800]' : 'fill-[#4b5563] text-[#4b5563]'}`}
          />
        );
      })}
    </div>
  );
}

export function TrailMap({
  activeLanguage,
  allLevels,
  attempts,
  isLevelUnlocked,
  onLevelClick,
  onCheckpointClick,
}: TrailMapProps) {
  const [rewardModal, setRewardModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    xp: number;
    unlocked: boolean;
    theme: ReturnType<typeof getSectionTheme>;
  }>({
    open: false,
    title: '',
    description: '',
    xp: 0,
    unlocked: false,
    theme: getSectionTheme(1),
  });

  // Agrupa TODAS as unidades por seção, em ordem crescente — o mapa empilha
  // cada unidade descendo a página (estilo Duolingo), cada uma com sua linha
  // divisória, nós, robôs, baú e checkpoint.
  const units = useMemo<UnitBlock[]>(() => {
    const groups = new Map<number, TrailLevel[]>();
    for (const level of allLevels) {
      const list = groups.get(level.unitNumber) ?? [];
      list.push(level);
      groups.set(level.unitNumber, list);
    }

    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([unitNumber, unitLevels]) => {
        const levelCount = unitLevels.length;
        const checkpointTop =
          FIRST_LEVEL_TOP + Math.max(0, levelCount - 1) * LEVEL_SPACING + CHECKPOINT_GAP;
        const height = checkpointTop + CHECKPOINT_BTN_H + UNIT_BOTTOM_PAD;
        return {
          unitNumber,
          levels: unitLevels,
          theme: getSectionTheme(unitNumber),
          height,
          checkpointTop,
        };
      });
  }, [allLevels]);

  const globalIndex = (level: TrailLevel) =>
    allLevels.findIndex((candidate) => candidate.levelNumber === level.levelNumber);

  const isLevelAccessible = (level: TrailLevel) => {
    const idx = globalIndex(level);
    const completed = level.questions.every((q) => attempts[q.id] === true);
    return isLevelUnlocked(idx) || completed;
  };

  const handleOpenChestReward = (
    xpAmount: number,
    unlocked: boolean,
    unitTheme: ReturnType<typeof getSectionTheme>
  ) => {
    if (unlocked) {
      setRewardModal({
        open: true,
        title: 'Baú de Recompensa Resgatado!',
        description:
          'Parabéns pelo seu progresso! Você abriu o baú da trilha e garantiu um bônus especial de aprendizado.',
        xp: xpAmount,
        unlocked: true,
        theme: unitTheme,
      });
    } else {
      setRewardModal({
        open: true,
        title: 'Baú Bloqueado',
        description:
          'Complete as lições anteriores da trilha para desbloquear e abrir este baú de bônus!',
        xp: xpAmount,
        unlocked: false,
        theme: unitTheme,
      });
    }
  };

  const firstUnitNumber = units[0]?.unitNumber;

  return (
    <div data-testid="trail-map" className="relative mx-auto w-full max-w-[680px] px-2 sm:px-4">
      {units.map((unit) => {
        const { unitNumber, theme, levels, height, checkpointTop } = unit;
        const levelCount = levels.length;
        const checkpointId = `${activeLanguage.toLowerCase()}-u${unitNumber}-checkpoint`;
        const checkpointCompleted = attempts[checkpointId] === true;
        const lastLevel = levels[levelCount - 1];
        const lastLevelTop = checkpointTop - CHECKPOINT_GAP;
        const lastLevelAccessible = lastLevel ? isLevelAccessible(lastLevel) : false;
        const secondLevel = levels[1];
        const chestUnlocked = Boolean(
          secondLevel && secondLevel.questions.every((q) => attempts[q.id] === true)
        );
        const chestTop = Math.min(FIRST_LEVEL_TOP + LEVEL_SPACING + 60, checkpointTop - 140);

        return (
          <div
            key={unitNumber}
            id={`trail-section-${unitNumber}`}
            className="relative"
            style={{ height }}
          >
            {/* Linha divisória com o texto da unidade */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1] flex items-center gap-3">
              <span aria-hidden="true" className="h-px flex-1 bg-dd-border" />
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-dd-text sm:text-xs">
                {levels[0]?.unitTitle}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-dd-border" />
            </div>

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
                priority={unitNumber === firstUnitNumber}
              />
            </div>

            {/* Robot Mascot 2 (Middle Left - Gaming/Typing pose) */}
            <div
              data-testid="trail-robot-gaming"
              className="pointer-events-none absolute left-[4%] top-[42%] z-[3] hidden h-[135px] w-[135px] sm:block"
            >
              <Image
                src="/assets/trails/blue-devdeck-robot-gaming.png"
                alt="Robô mascote com headset"
                fill
                sizes="135px"
                className="object-contain drop-shadow-md"
              />
            </div>

            {/* Nós de nível + passos */}
            {levels.map((level, i) => {
              const top = FIRST_LEVEL_TOP + i * LEVEL_SPACING;
              const isFirstTrailLevel = unitNumber === firstUnitNumber && i === 0;
              const accessible = isLevelAccessible(level);
              const completed = level.questions.every((q) => attempts[q.id] === true);
              const started = level.questions.some((q) =>
                Object.prototype.hasOwnProperty.call(attempts, q.id)
              );
              const nextLevel = levels[i + 1];
              const nextAccessible = nextLevel ? isLevelAccessible(nextLevel) : false;
              const leftSide = i % 2 === 0;

              return (
                <Fragment key={level.levelNumber}>
                  {/* Nó de nível */}
                  <div
                    id={`trail-level-${level.levelNumber}`}
                    className="absolute z-10 flex -translate-x-1/2 flex-col items-center text-center"
                    style={{ left: '50%', top }}
                  >
                    {/* Popup "PULAR PRA CÁ" no primeiro nó ainda não iniciado */}
                    {i === 0 && !started && (
                      <div
                        className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-dd-border bg-dd-surface px-2.5 py-1.5 text-[10px] font-bold leading-none shadow-md"
                        style={{ color: theme.primaryHex }}
                      >
                        PULAR PRA CÁ?
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-dd-border bg-dd-surface"
                        />
                      </div>
                    )}
                    <LessonStars level={level} attempts={attempts} />
                    <button
                      type="button"
                      disabled={!accessible}
                      onClick={() => onLevelClick(level, accessible)}
                      aria-label={`Seção ${unitNumber}, unidade ${i + 1}: ${level.title}`}
                      className={`group dd-focus-ring relative flex h-[76px] w-[76px] items-center justify-center rounded-[22px] shadow-md transition-all duration-150 enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:active:translate-y-[4px] ${
                        accessible
                          ? theme.nodeButtonClass
                          : 'border-b-[6px] border-[#202b33] bg-[#37464f] text-[#77858d]'
                      }`}
                    >
                      {i === 0 && isFirstTrailLevel ? (
                        started ? (
                          <Check className="h-7 w-7" strokeWidth={3.2} />
                        ) : (
                          <FastForward className="h-7 w-7" fill="currentColor" strokeWidth={0} />
                        )
                      ) : completed ? (
                        <Check className="h-7 w-7" strokeWidth={3.2} />
                      ) : !accessible ? (
                        <Lock className="h-6 w-6" strokeWidth={2.6} />
                      ) : (
                        <span className="font-mono text-base font-black tracking-tight text-white">
                          {`{${i + 1}}`}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Passos decorativos até o próximo nível */}
                  {nextLevel && (
                    <>
                      {/* O baú é um nó do caminho: ocupa o 1º espaço de passo após a 2ª unidade */}
                      {levelCount >= 3 && i === 1 ? (
                        <div
                          className="absolute z-10 flex -translate-x-1/2 items-center justify-center"
                          style={{ left: leftSide ? '28%' : '72%', top: top + 95 }}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenChestReward(150, chestUnlocked, theme)}
                            aria-label="Baú da trilha"
                            className="dd-focus-ring group relative flex h-[80px] w-[80px] cursor-pointer items-center justify-center transition-transform duration-150 hover:-translate-y-1 active:scale-95"
                          >
                            <Image
                              src={
                                chestUnlocked
                                  ? '/assets/trails/trail-chest-open.png'
                                  : '/assets/trails/trail-chest.png'
                              }
                              alt="Baú da trilha"
                              width={78}
                              height={78}
                              className="relative z-10 h-[78px] w-[78px] object-contain transition-transform group-hover:scale-105"
                              style={{ filter: chestTintFilter(theme.primaryHex) }}
                            />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="absolute z-10 flex -translate-x-1/2 items-center justify-center"
                          style={{ left: leftSide ? '28%' : '72%', top: top + 95 }}
                        >
                          <button
                            type="button"
                            disabled={!nextAccessible}
                            onClick={() => onLevelClick(nextLevel, nextAccessible)}
                            aria-label={`Passo ${i + 1} de ${nextLevel.title}`}
                            className={`flex h-[56px] w-[56px] items-center justify-center rounded-full shadow-md transition-all ${
                              nextAccessible
                                ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
                                : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
                            }`}
                          >
                            {nextAccessible ? (
                              <Check className="h-6.5 w-6.5" strokeWidth={3.5} />
                            ) : (
                              <Lock className="h-5 w-5" strokeWidth={2.6} />
                            )}
                          </button>
                        </div>
                      )}
                      <div
                        className="absolute z-10 flex -translate-x-1/2 items-center justify-center"
                        style={{ left: leftSide ? '72%' : '28%', top: top + 165 }}
                      >
                        <button
                          type="button"
                          disabled={!nextAccessible}
                          onClick={() => onLevelClick(nextLevel, nextAccessible)}
                          aria-label={`Passo ${i + 2} de ${nextLevel.title}`}
                          className={`flex h-[56px] w-[56px] items-center justify-center rounded-full shadow-md transition-all ${
                            nextAccessible
                              ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
                              : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
                          }`}
                        >
                          {nextAccessible ? (
                            <Check className="h-6.5 w-6.5" strokeWidth={3.5} />
                          ) : (
                            <Lock className="h-5 w-5" strokeWidth={2.6} />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </Fragment>
              );
            })}

            {/* Baú (fallback para unidades com menos de 3 níveis — sem sobrepor nenhum nó) */}
            {levelCount < 3 && (
              <div
                className="absolute z-10 flex -translate-x-1/2 items-center justify-center"
                style={{ left: '74%', top: chestTop }}
              >
                <button
                  type="button"
                  onClick={() => handleOpenChestReward(150, chestUnlocked, theme)}
                  aria-label="Baú da trilha"
                  className="dd-focus-ring group relative flex h-[80px] w-[80px] cursor-pointer items-center justify-center transition-transform duration-150 hover:-translate-y-1 active:scale-95"
                >
                  <Image
                    src={
                      chestUnlocked
                        ? '/assets/trails/trail-chest-open.png'
                        : '/assets/trails/trail-chest.png'
                    }
                    alt="Baú da trilha"
                    width={78}
                    height={78}
                    className="relative z-10 h-[78px] w-[78px] object-contain transition-transform group-hover:scale-105"
                    style={{ filter: chestTintFilter(theme.primaryHex) }}
                  />
                </button>
              </div>
            )}

            {/* Passo circular depois do penúltimo nó (entre o último nível e o checkpoint) */}
            {levelCount > 1 && lastLevel && (
              <div
                className="absolute z-10 flex -translate-x-1/2 items-center justify-center"
                style={{ left: (levelCount - 1) % 2 === 0 ? '28%' : '72%', top: lastLevelTop + 95 }}
              >
                <button
                  type="button"
                  disabled={!lastLevelAccessible}
                  onClick={() => onLevelClick(lastLevel, lastLevelAccessible)}
                  aria-label={`Passo final de ${lastLevel.title}`}
                  className={`flex h-[56px] w-[56px] items-center justify-center rounded-full shadow-md transition-all ${
                    lastLevelAccessible
                      ? `cursor-pointer hover:-translate-y-0.5 active:translate-y-[3px] ${theme.stepButtonClass}`
                      : 'border-b-[5px] border-[#202b33] bg-[#37464f] text-[#77858d]'
                  }`}
                >
                  {lastLevelAccessible ? (
                    <Check className="h-6.5 w-6.5" strokeWidth={3.5} />
                  ) : (
                    <Lock className="h-5 w-5" strokeWidth={2.6} />
                  )}
                </button>
              </div>
            )}

            {/* Checkpoint da unidade */}
            <div
              className="absolute z-10 flex -translate-x-1/2 flex-col items-center text-center"
              style={{ left: '50%', top: checkpointTop }}
            >
              <LessonStars level={lastLevel} attempts={attempts} />
              <button
                type="button"
                onClick={() => onCheckpointClick(unitNumber)}
                aria-label={`Checkpoint da seção ${unitNumber}`}
                className={`dd-focus-ring relative flex h-[78px] w-[78px] cursor-pointer items-center justify-center rounded-[22px] shadow-md transition-all duration-150 hover:-translate-y-0.5 active:translate-y-[4px] ${
                  checkpointCompleted
                    ? theme.checkpointButtonClass
                    : 'border-b-[6px] border-[#202b33] bg-[#37464f] text-[#77858d]'
                }`}
              >
                <Trophy className="h-8 w-8" strokeWidth={2.4} />
              </button>
              <p className="mt-2 text-xs font-black uppercase tracking-wide text-dd-text">
                Desafio
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-dd-muted">Checkpoint de Código</p>
            </div>
          </div>
        );
      })}

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

            <div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center"
              style={{ filter: chestTintFilter(rewardModal.theme.primaryHex) }}
            >
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
              className={`mt-6 w-full cursor-pointer rounded-xl py-3 text-xs font-black uppercase tracking-wide text-white transition-all hover:brightness-110 active:translate-y-1 active:border-b-0 ${rewardModal.theme.nodeButtonClass}`}
            >
              {rewardModal.unlocked ? 'Pegar Recompensa' : 'Entendido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
