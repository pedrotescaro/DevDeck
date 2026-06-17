"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { TRAILS_DATA, TrailLevel, TrailQuestion } from "@/lib/trailsData";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Lock, 
  Star, 
  Check, 
  X, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Sparkles,
  ArrowLeft,
  ChevronDown
} from "lucide-react";
function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

interface TrailsContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  initialTrails: {
    language: string;
    xp: number;
    level: number;
  }[];
  initialAttempts: Record<string, boolean>;
}

export function TrailsContent({
  user,
  initialTrails,
  initialAttempts,
}: TrailsContentProps) {
  const reduced = useReducedMotion();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound } = useSoundEffects(soundEnabled);

  // Estados principais
  const [activeLang, setActiveLang] = useState<string>("JS");
  const [attempts, setAttempts] = useState<Record<string, boolean>>(initialAttempts);
  const [trails, setTrails] = useState(initialTrails);
  const [userXp, setUserXp] = useState(user.total_xp);

  // Estados para as Seções e Unidades (Dropdown)
  const defaultSection = () => {
    const levels = TRAILS_DATA["JS"] || [];
    const firstIncompleteLevel = levels.find((level) => {
      const completedCount = level.questions.filter((q) => initialAttempts[q.id] === true).length;
      return completedCount < 3;
    });
    return firstIncompleteLevel ? firstIncompleteLevel.sectionName : (levels[0]?.sectionName || "");
  };

  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  // Resetar a seção ativa quando a linguagem selecionada mudar
  useEffect(() => {
    if (!activeLang) return;
    const levels = TRAILS_DATA[activeLang] || [];
    const firstIncompleteLevel = levels.find((level) => {
      const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
      return completedCount < 3;
    });

    if (firstIncompleteLevel) {
      setActiveSection(firstIncompleteLevel.sectionName);
    } else if (levels.length > 0) {
      setActiveSection(levels[0].sectionName);
    }
  }, [activeLang]);

  // Estados do Modal do Quiz
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<TrailLevel | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [submittingAttempt, setSubmittingAttempt] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Estado do LevelUp
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [unlockedTitle, setUnlockedTitle] = useState("");
  const [newLevelNumber, setNewLevelNumber] = useState(1);

  // Obter nível e XP da linguagem atual
  const activeTrail = trails.find((t) => t.language === activeLang) || {
    language: activeLang,
    xp: 0,
    level: 1,
  };

  const currentLevel = getLevelFromXp(userXp);

  // Seções disponíveis para a trilha atual
  const sections = Array.from(
    new Set(TRAILS_DATA[activeLang]?.map((level) => level.sectionName) || [])
  );

  // Fases da seção atual
  const sectionLevels = TRAILS_DATA[activeLang]?.filter(
    (level) => level.sectionName === activeSection
  ) || [];

  // Verificar se o nível está desbloqueado (Duolingo-like progression)
  const isLevelUnlocked = (levelIndex: number) => {
    if (levelIndex === 0) return true;
    const prevLevel = TRAILS_DATA[activeLang][levelIndex - 1];
    // Desbloqueia se acertou pelo menos 1 quiz da fase anterior
    return prevLevel.questions.some((q) => attempts[q.id] === true);
  };

  // Nível recomendado (primeira fase incompleta da linguagem atual que esteja desbloqueada)
  const recommendedLevel = TRAILS_DATA[activeLang]?.find((level, idx) => {
    const globalIdx = TRAILS_DATA[activeLang].findIndex(l => l.levelNumber === level.levelNumber);
    const unlocked = isLevelUnlocked(globalIdx);
    const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
    return unlocked && completedCount < 3;
  });

  // Unidade ativa com base no nível recomendado (ou primeiro da seção se todos concluídos)
  const activeUnitLevel = sectionLevels.find((level) => {
    const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
    return completedCount < 3;
  }) || sectionLevels[0];

  const handleLevelClick = (level: TrailLevel, unlocked: boolean) => {
    if (!unlocked) {
      playSound("post"); // Som de aviso de bloqueado
      alert("Esta fase está bloqueada! Complete pelo menos um exercício da fase anterior para liberá-la.");
      return;
    }
    setActiveLevel(level);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setCorrectCount(0);
    setXpEarned(0);
    setQuizModalOpen(true);
    setQuizError(null);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (answered) return;
    setSelectedOption(optionIdx);
  };

  const handleCheckAnswer = async () => {
    if (selectedOption === null || answered || !activeLevel) return;
    setAnswered(true);
    setSubmittingAttempt(true);

    const question = activeLevel.questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctIndex;

    if (isCorrect) {
      playSound("like"); // Som de acerto
      setCorrectCount((prev) => prev + 1);
      setXpEarned((prev) => prev + 15);
    } else {
      playSound("post"); // Som de erro
    }

    try {
      const res = await fetch(`/api/quiz/${question.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_index: selectedOption }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Atualizar tentativas localmente
        setAttempts((prev) => ({
          ...prev,
          [question.id]: isCorrect,
        }));

        // Se ganhou XP
        if (data.xpResult) {
          setUserXp(data.xpResult.newTotalXp);
          
          // Atualizar trilhas de linguagem localmente (inserindo se não existir)
          setTrails((prev) => {
            const exists = prev.some((t) => t.language === activeLang);
            if (exists) {
              return prev.map((t) => {
                if (t.language === activeLang) {
                  return {
                    ...t,
                    xp: data.xpResult.newLanguageXp,
                    level: data.xpResult.newLanguageLevel,
                  };
                }
                return t;
              });
            } else {
              return [
                ...prev,
                {
                  language: activeLang,
                  xp: data.xpResult.newLanguageXp,
                  level: data.xpResult.newLanguageLevel,
                },
              ];
            }
          });

          // Verificar se subiu de nível geral do usuário
          const oldLevel = getLevelFromXp(userXp);
          const newLevel = getLevelFromXp(data.xpResult.newTotalXp);
          if (newLevel > oldLevel) {
            setNewLevelNumber(newLevel);
            setUnlockedTitle(getLevelTitle(newLevel));
            setLevelUpVisible(true);
            playSound("levelup");
          }
        }
      } else {
        const data = await res.json();
        // Se já respondeu antes, não impede o avanço no wizard
        if (data.error !== "Você já respondeu a este quiz") {
          setQuizError(data.error || "Erro ao registrar resposta.");
        }
      }
    } catch (err) {
      console.error("Error checking answer:", err);
    } finally {
      setSubmittingAttempt(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl >= 10) return "Arquiteto Lendário";
    if (lvl >= 8) return "Engenheiro Principal";
    if (lvl >= 6) return "Desenvolvedor Sênior";
    if (lvl >= 4) return "Desenvolvedor Pleno";
    if (lvl >= 2) return "Desenvolvedor Júnior";
    return "Estagiário de Código";
  };

  const getOffsetStyle = (index: number) => {
    // Padrão Duolingo: zigue-zague vertical
    const values = [0, 50, 95, 50, 0, -50, -95, -50];
    const val = values[index % values.length];
    return { transform: `translateX(${val}px)` };
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-8">
          
          {/* Header & Sound Toggle */}
          <div className="flex items-center justify-between border-b border-dd-border pb-4">
            <div>
              <h1 className="text-dd-text text-xl font-extrabold tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Trilhas de Aprendizado
              </h1>
              <p className="text-dd-muted text-xs">
                Complete as lições no formato Duolingo e domine as linguagens de programação.
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 border border-dd-border bg-dd-surface hover:bg-dd-border/50 text-dd-muted hover:text-dd-text rounded-xl transition-all"
              title={soundEnabled ? "Mutar Sons" : "Ativar Sons"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Seletor de Linguagens */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {["JS", "TS", "PYTHON", "RUST", "GO"].map((lang) => {
              const langCode = lang === "PYTHON" ? "PYTHON" : lang;
              const isSelected = activeLang === (lang === "PYTHON" ? "PYTHON" : lang);
              const label = lang.toUpperCase();
              
              return (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang === "PYTHON" ? "PYTHON" : lang)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-dd-accent border-orange-500 text-white shadow-md shadow-orange-500/10"
                      : "bg-dd-surface border-dd-border text-dd-muted hover:text-dd-text hover:bg-dd-border/40"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Progress Indicator da Trilha Ativa */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-5 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-lg">
                {activeLang.slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-dd-text">Trilha de {activeLang}</h3>
                <p className="text-[10px] text-dd-muted uppercase tracking-wider font-bold">
                  Nível {activeTrail.level} • {activeTrail.xp.toLocaleString("pt-BR")} XP
                </p>
              </div>
            </div>
            
            {/* XP progress bar */}
            <div className="flex-1 w-full max-w-md">
              <div className="flex justify-between text-[9px] font-bold text-dd-muted mb-1.5 uppercase">
                <span>Progresso do Nível</span>
                <span>{activeTrail.xp % 500} / 500 XP</span>
              </div>
              <div className="h-2 w-full bg-dd-border/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                  style={{ width: `${((activeTrail.xp % 500) / 500) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Header Card (Duolingo Style: Dropdown and Active Unit Banner) */}
          <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-dd-border rounded-2xl p-6 shadow-md flex flex-col items-center text-center space-y-4">
            {/* Section Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-dd-surface border border-dd-border hover:border-orange-500/50 hover:bg-dd-border/30 rounded-xl transition-all cursor-pointer shadow-sm text-xs font-black text-dd-text uppercase tracking-wider"
              >
                <span>Nível: {activeSection}</span>
                <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${sectionDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {sectionDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setSectionDropdownOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-dd-surface border border-dd-border rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-dd-border/50"
                    >
                      {sections.map((sec) => {
                        const isSelected = sec === activeSection;
                        return (
                          <button
                            key={sec}
                            onClick={() => {
                              setActiveSection(sec);
                              setSectionDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-orange-500/10 text-orange-400 font-black"
                                : "text-dd-muted hover:text-dd-text hover:bg-dd-border/30"
                            }`}
                          >
                            <span>{sec}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Active Unit Title */}
            {activeUnitLevel && (
              <div className="space-y-1">
                <h2 className="text-dd-text text-sm md:text-base font-extrabold uppercase tracking-tight">
                  Unidade {activeUnitLevel.unitNumber}: {activeUnitLevel.unitTitle}
                </h2>
                <p className="text-[10px] text-dd-muted font-medium max-w-md">
                  Domine esta unidade completando os exercícios e quizzes abaixo para expandir seu conhecimento em {activeLang}.
                </p>
              </div>
            )}
          </div>

          {/* Winding Trail Path (Duolingo Map) */}
          <div className="relative flex flex-col items-center py-12 bg-dd-surface/5 border border-dd-border/50 border-dashed rounded-2xl overflow-hidden min-h-[500px]">
            <div className="space-y-4 w-full max-w-sm flex flex-col items-center">
              {(() => {
                let lastUnitNumber: number | null = null;
                
                return sectionLevels.map((level) => {
                  const showSeparator = level.unitNumber !== lastUnitNumber;
                  lastUnitNumber = level.unitNumber;

                  const globalIdx = TRAILS_DATA[activeLang].findIndex(l => l.levelNumber === level.levelNumber);
                  const unlocked = isLevelUnlocked(globalIdx);
                  const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
                  const isCompleted = completedCount === 3;
                  
                  return (
                    <div key={level.levelNumber} className="w-full flex flex-col items-center">
                      {showSeparator && (
                        <div className="w-full flex items-center justify-center my-8 max-w-sm px-4">
                          <div className="flex-grow border-t border-dd-border/60"></div>
                          <span className="px-3.5 py-1.5 bg-dd-surface border border-dd-border text-dd-text text-[9px] font-extrabold uppercase tracking-wider rounded-full mx-3 text-center shadow-sm whitespace-nowrap">
                            Unidade {level.unitNumber}: {level.unitTitle}
                          </span>
                          <div className="flex-grow border-t border-dd-border/60"></div>
                        </div>
                      )}

                      <div
                        className="relative z-10 flex flex-col items-center my-6 transition-transform"
                        style={getOffsetStyle(globalIdx)}
                      >
                        {/* Estrelas orgânicas/curvadas */}
                        <div className="flex gap-1 justify-center mb-2 items-end h-5">
                          {Array.from({ length: 3 }).map((_, starIdx) => {
                            const isStarEarned = attempts[level.questions[starIdx]?.id] === true;
                            const isMiddle = starIdx === 1;
                            const starClass = isMiddle 
                              ? "w-4 h-4 -translate-y-0.5 scale-110" 
                              : "w-3.5 h-3.5 translate-y-0.5 " + (starIdx === 0 ? "rotate-[-12deg]" : "rotate-[12deg]");

                            return (
                              <Star
                                key={starIdx}
                                className={`transition-all ${starClass} ${
                                  isStarEarned ? "text-yellow-500 fill-yellow-500" : "text-dd-border/70"
                                }`}
                              />
                            );
                          })}
                        </div>

                        {/* Botão 3D da fase (Rounded-Square) */}
                        <button
                          onClick={() => handleLevelClick(level, unlocked)}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all transform cursor-pointer ${
                            unlocked
                              ? isCompleted
                                ? "bg-orange-500 text-white border-x-2 border-t-2 border-b-[6px] border-orange-600 hover:bg-orange-400 active:border-b-0 active:translate-y-[6px]"
                                : "bg-dd-surface text-orange-500 border-x-2 border-t-2 border-b-[6px] border-orange-500 hover:bg-dd-border/30 active:border-b-0 active:translate-y-[6px]"
                              : "bg-dd-surface/40 text-dd-muted/30 border-x-2 border-t-2 border-b-[6px] border-dd-border/40 cursor-not-allowed"
                          }`}
                        >
                          {unlocked ? (
                            <BookOpen className="w-6 h-6" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </button>

                        {/* Título da fase */}
                        <div className="mt-2 text-center max-w-[140px]">
                          <p className="text-[10px] font-extrabold uppercase text-dd-text leading-tight">
                            Fase {level.levelNumber}
                          </p>
                          <p className="text-[9px] text-dd-muted font-semibold leading-tight mt-0.5 truncate">
                            {level.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </main>

        {/* Floating Recommended Level Bar */}
        <AnimatePresence>
          {recommendedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="sticky bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none"
            >
              <div className="pointer-events-auto bg-dd-surface/90 backdrop-blur-md border border-orange-500/30 rounded-2xl px-5 py-4 shadow-xl max-w-md w-full flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-extrabold uppercase text-orange-400 tracking-wider">
                    Próxima Atividade Recomendada
                  </p>
                  <h4 className="text-xs font-bold text-dd-text truncate mt-0.5">
                    Fase {recommendedLevel.levelNumber}: {recommendedLevel.title}
                  </h4>
                  <p className="text-[10px] text-dd-muted truncate mt-0.5">
                    {recommendedLevel.description}
                  </p>
                </div>
                
                <button
                  onClick={() => handleLevelClick(recommendedLevel, true)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Começar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>

      {/* QUIZ WIZARD MODAL */}
      <AnimatePresence>
        {quizModalOpen && activeLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-[8px]"
              onClick={() => {
                if (currentQuestionIndex < activeLevel.questions.length && !submittingAttempt) {
                  if (confirm("Quer realmente sair do quiz? Seu progresso nesta sessão será perdido.")) {
                    setQuizModalOpen(false);
                  }
                } else {
                  setQuizModalOpen(false);
                }
              }}
            />

            <motion.div
              variants={reduced ? fadeVariants : modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg bg-dd-surface border border-dd-border rounded-2xl shadow-2xl z-10 font-sans flex flex-col max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-dd-border">
                <div>
                  <h2 className="text-dd-text text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Fase {activeLevel.levelNumber}: {activeLevel.title}
                  </h2>
                  <p className="text-[10px] text-dd-muted mt-0.5">{activeLevel.description}</p>
                </div>
                <button
                  onClick={() => setQuizModalOpen(false)}
                  className="text-dd-muted hover:text-dd-text p-1 rounded-full hover:bg-dd-border/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wizard Content */}
              <div className="p-6 overflow-y-auto flex-grow space-y-6">
                {currentQuestionIndex < activeLevel.questions.length ? (
                  // QUIZ QUESTIONS SCREEN
                  (() => {
                    const question = activeLevel.questions[currentQuestionIndex];
                    return (
                      <div className="space-y-6">
                        {/* Progress Bar inside Wizard */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-dd-muted">
                            <span>Questão {currentQuestionIndex + 1} de {activeLevel.questions.length}</span>
                            <span>{Math.round(((currentQuestionIndex) / activeLevel.questions.length) * 100)}% concluído</span>
                          </div>
                          <div className="h-1.5 w-full bg-dd-border/40 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 rounded-full transition-all" 
                              style={{ width: `${((currentQuestionIndex) / activeLevel.questions.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Question Text */}
                        <h3 className="text-sm font-bold text-dd-text leading-relaxed">
                          {question.question}
                        </h3>

                        {/* Options list */}
                        <div className="space-y-2.5">
                          {question.options.map((opt, oIdx) => {
                            const isSelected = selectedOption === oIdx;
                            const isCorrectAnswer = oIdx === question.correctIndex;

                            let btnClasses = "border border-dd-border bg-dd-surface text-dd-text hover:bg-dd-border/20";
                            
                            if (answered) {
                              if (isCorrectAnswer) {
                                btnClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                              } else if (isSelected) {
                                btnClasses = "border-red-500 bg-red-500/10 text-red-400";
                              } else {
                                btnClasses = "border-dd-border opacity-50 bg-dd-surface text-dd-muted";
                              }
                            } else if (isSelected) {
                              btnClasses = "border-orange-500 bg-orange-500/5 text-orange-400";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleOptionSelect(oIdx)}
                                disabled={answered}
                                className={`w-full text-left p-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${btnClasses}`}
                              >
                                <span>{opt}</span>
                                {answered && isCorrectAnswer && (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                )}
                                {answered && isSelected && !isCorrectAnswer && (
                                  <X className="w-4 h-4 text-red-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizError && (
                          <p className="text-[10px] text-red-400 font-bold bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                            {quizError}
                          </p>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  // WIZARD SUMMARY SCREEN
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto animate-bounce">
                      <Trophy className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-dd-text uppercase">Fase Concluída!</h3>
                      <p className="text-xs text-dd-muted max-w-xs mx-auto">
                        Você concluiu a Fase {activeLevel.levelNumber} de {activeLang}!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      <div className="bg-dd-surface border border-dd-border p-4 rounded-xl text-center">
                        <p className="text-[9px] font-bold text-dd-muted uppercase">Acertos</p>
                        <p className="text-lg font-black text-dd-text mt-1">{correctCount} / 3</p>
                      </div>
                      <div className="bg-dd-surface border border-dd-border p-4 rounded-xl text-center">
                        <p className="text-[9px] font-bold text-dd-muted uppercase">XP Ganho</p>
                        <p className="text-lg font-black text-orange-400 mt-1 font-mono">+{xpEarned} XP</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer (Action Buttons) */}
              <div className="p-4 border-t border-dd-border flex justify-end">
                {currentQuestionIndex < activeLevel.questions.length ? (
                  !answered ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedOption === null || submittingAttempt}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                    >
                      {submittingAttempt ? "Processando..." : "Verificar"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                    >
                      Avançar
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setQuizModalOpen(false)}
                    className="px-6 py-2.5 bg-dd-surface border border-dd-border hover:bg-dd-border/30 text-dd-text rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Voltar para a Trilha
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEVEL UP OVERLAY */}
      <AnimatePresence>
        {levelUpVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setLevelUpVisible(false)}
            />
            
            {/* White screen flash */}
            <div className="dd-level-flash" />

            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-sm bg-dd-surface border border-dd-border p-8 rounded-2xl shadow-2xl z-10 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-orange-500/10">
                ⭐
              </div>
              
              <div className="space-y-2">
                <p className="text-dd-accent font-extrabold uppercase text-xs tracking-widest">Parabéns!</p>
                <h2 className="text-2xl font-black text-dd-text">Subiu de Nível!</h2>
                <p className="text-xs text-dd-muted">
                  Você agora atingiu o nível <strong className="text-dd-text">{newLevelNumber}</strong> geral no DevDeck.
                </p>
              </div>

              <div className="bg-dd-border/20 border border-dd-border/50 py-3.5 px-5 rounded-xl">
                <span className="text-[10px] font-bold text-dd-muted uppercase block">Título Conquistado</span>
                <span className="text-sm font-black text-orange-400 uppercase tracking-wide mt-1 block">
                  {unlockedTitle}
                </span>
              </div>

              <button
                onClick={() => setLevelUpVisible(false)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/15 transition-all cursor-pointer active:scale-95"
              >
                Continuar Jornada
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animações
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 450, damping: 26 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.92, 
    y: 12,
    transition: { duration: 0.15 } 
  },
};
