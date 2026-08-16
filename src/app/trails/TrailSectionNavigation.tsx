import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import type { TrailLevel } from '@/lib/trailsData';

export interface TrailSectionView {
  number: number;
  name: string;
  title: string;
  levels: TrailLevel[];
  completedUnits: number;
  completed: boolean;
  unlocked: boolean;
}

export function getUnitNumberInSection(level: TrailLevel, levels: TrailLevel[]) {
  const unitIndex = levels
    .filter((candidate) => candidate.unitNumber === level.unitNumber)
    .findIndex((candidate) => candidate.levelNumber === level.levelNumber);

  return Math.max(1, unitIndex + 1);
}

export function getLevelsForSection(levels: TrailLevel[], sectionNumber: number) {
  return levels.filter((level) => level.unitNumber === sectionNumber);
}

export function buildTrailSections(
  levels: TrailLevel[],
  attempts: Record<string, boolean>,
  language: string
): TrailSectionView[] {
  const grouped = new Map<number, TrailLevel[]>();

  levels.forEach((level) => {
    const sectionLevels = grouped.get(level.unitNumber) ?? [];
    sectionLevels.push(level);
    grouped.set(level.unitNumber, sectionLevels);
  });

  return Array.from(grouped.entries()).map(([number, sectionLevels], index) => {
    const completedUnits = sectionLevels.filter((level) =>
      level.questions.every((question) => attempts[question.id] === true)
    ).length;
    const checkpointId = `${language.toLowerCase()}-u${number}-checkpoint`;
    const previousSectionNumber = Array.from(grouped.keys())[index - 1];
    const previousCheckpointId = previousSectionNumber
      ? `${language.toLowerCase()}-u${previousSectionNumber}-checkpoint`
      : null;

    return {
      number,
      name: sectionLevels[0]?.sectionName ?? `Seção ${number}`,
      title: sectionLevels[0]?.unitTitle ?? `Seção ${number}`,
      levels: sectionLevels,
      completedUnits,
      completed: completedUnits === sectionLevels.length && attempts[checkpointId] === true,
      unlocked:
        index === 0 || (previousCheckpointId ? attempts[previousCheckpointId] === true : false),
    };
  });
}

import { getSectionTheme } from './trailTheme';

interface TrailSectionNavigationProps {
  view: 'trail' | 'sections';
  sectionNumber: number;
  unitNumber: number;
  title: string;
  sections: TrailSectionView[];
  onOpenSections: () => void;
  onBack: () => void;
  onSelectSection: (sectionNumber: number) => void;
}

export function TrailSectionNavigation({
  view,
  sectionNumber,
  unitNumber,
  title,
  sections,
  onOpenSections,
  onBack,
  onSelectSection,
}: TrailSectionNavigationProps) {
  const theme = getSectionTheme(sectionNumber);

  if (view === 'sections') {
    return (
      <section aria-labelledby="trail-sections-title" className="mx-auto w-full max-w-2xl py-1">
        <button
          type="button"
          onClick={onBack}
          className="dd-focus-ring mb-5 flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm font-black text-dd-muted transition-colors hover:text-dd-text"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>

        <div className="mb-5 border-b border-dd-border pb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-400">
            Guia do curso
          </p>
          <h1 id="trail-sections-title" className="mt-1 text-2xl font-black text-dd-text">
            Seções e unidades
          </h1>
          <p className="mt-1 text-sm font-semibold text-dd-muted">
            Entre em uma seção para estudar ou revisar suas unidades.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => {
            const isCurrent = section.number === sectionNumber;
            const actionLabel = section.completed
              ? 'Revisar'
              : section.unlocked
                ? isCurrent
                  ? 'Continuar'
                  : 'Abrir'
                : 'Bloqueada';

            return (
              <article
                key={section.number}
                className={`relative overflow-hidden rounded-2xl border p-5 ${
                  isCurrent
                    ? 'border-blue-500/60 bg-blue-500/10'
                    : 'border-dd-border bg-dd-surface/45'
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,transparent_0,transparent_74px,var(--color-dd-border)_74px,var(--color-dd-border)_142px)]"
                />
                <div className="relative flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-400">
                      {section.name} · {section.levels.length} unidades
                    </p>
                    <h2 className="mt-2 text-xl font-black text-dd-text">Seção {section.number}</h2>
                    <p className="mt-1 truncate text-xs font-bold text-dd-muted">{section.title}</p>
                    <div
                      className={`mt-3 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${
                        section.completed
                          ? 'text-lime-400'
                          : section.unlocked
                            ? 'text-blue-400'
                            : 'text-dd-muted'
                      }`}
                    >
                      {section.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : section.unlocked ? (
                        <BookOpen className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                      {section.completed
                        ? 'Concluída'
                        : `${section.completedUnits} de ${section.levels.length} unidades`}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!section.unlocked}
                    onClick={() => onSelectSection(section.number)}
                    className="dd-focus-ring flex min-w-[102px] cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-dd-border bg-dd-bg/80 px-4 py-3 text-xs font-black uppercase tracking-wide text-blue-400 shadow-[0_4px_0_var(--color-dd-border)] transition-all enabled:hover:border-blue-500/60 enabled:hover:bg-blue-500/10 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {actionLabel}
                    {section.unlocked && <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="active-trail-unit-title"
      className={`relative overflow-hidden rounded-[22px] px-5 py-4 text-white shadow-md sm:px-6 transition-colors ${theme.headerClass}`}
    >
      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-white/90 sm:text-xs">
            Seção {sectionNumber}, Unidade {unitNumber}
          </p>
          <h1
            id="active-trail-unit-title"
            className="mt-1 truncate text-lg font-black tracking-tight sm:text-xl text-white"
          >
            {title}
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenSections}
          className="dd-focus-ring flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border-2 border-white/30 bg-black/15 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all hover:bg-black/25 active:translate-y-[2px] active:shadow-none"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Seções</span>
        </button>
      </div>
    </section>
  );
}
