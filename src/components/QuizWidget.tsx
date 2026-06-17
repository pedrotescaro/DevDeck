"use client";

import { useState, useEffect } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
}

interface QuizWidgetProps {
  quiz: Quiz;
  postId: string;
  attempted?: boolean;
  userAnswer?: number;
  onAttemptSuccess?: (selectedIndex: number, isCorrect: boolean, xpResult: any) => void;
}

type QuizState = "unanswered" | "correct" | "incorrect";

export function QuizWidget({
  quiz,
  postId,
  attempted = false,
  userAnswer,
  onAttemptSuccess,
}: QuizWidgetProps) {
  const [state, setState] = useState<QuizState>(
    attempted ? (userAnswer === quiz.correct_index ? "correct" : "incorrect") : "unanswered"
  );
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateSoundState = () => {
      setSoundEnabled(localStorage.getItem("devdeck-sound") !== "false");
    };

    updateSoundState();

    window.addEventListener("storage", updateSoundState);
    window.addEventListener("devdeck-sound-changed", updateSoundState);

    return () => {
      window.removeEventListener("storage", updateSoundState);
      window.removeEventListener("devdeck-sound-changed", updateSoundState);
    };
  }, []);

  const { playSound } = useSoundEffects(soundEnabled);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(userAnswer ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSelect = async (index: number) => {
    if (state !== "unanswered" || submitting) return;

    setSelectedIndex(index);
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/quiz/${quiz.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_index: index }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit quiz attempt");
      }

      const data = await res.json();
      const isCorrect = index === quiz.correct_index;
      setState(isCorrect ? "correct" : "incorrect");
      playSound(isCorrect ? "quiz_correct" : "quiz_incorrect");
      if (onAttemptSuccess) {
        onAttemptSuccess(index, isCorrect, data.xpResult);
      }
    } catch {
      setSelectedIndex(null);
      setSubmitError("Nao deu para registrar sua resposta agora. Tente novamente.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const getOptionClasses = (index: number) => {
    const base = "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors";

    if (state === "unanswered") {
      if (selectedIndex === index && submitting) {
        return `${base} border-orange-500/50 bg-orange-500/10 text-dd-text`;
      }
      return `${base} border-dd-border bg-dd-surface hover:border-orange-500/30 hover:bg-orange-500/5 text-dd-text cursor-pointer`;
    }

    // After answering
    if (index === quiz.correct_index) {
      return `${base} border-dd-green/50 bg-dd-green/10 text-dd-green`;
    }
    if (index === selectedIndex && state === "incorrect") {
      return `${base} border-red-500/50 bg-red-500/10 text-red-400`;
    }
    return `${base} border-dd-border bg-dd-surface text-dd-muted opacity-60`;
  };

  return (
    <div
      className={`bg-dd-card border border-orange-500/30 rounded-xl p-5 ${
        state === "unanswered" ? "dd-glow-ring" : ""
      } ${
        state === "correct" ? "dd-correct-flash" : ""
      } ${state === "incorrect" ? "dd-shake-error" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-orange-400">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <span className="text-dd-muted text-xs font-medium uppercase tracking-wide">
          Quiz gerado dessa pergunta
        </span>
      </div>

      {/* Question */}
      <p className="text-dd-text text-sm font-medium mb-4">{quiz.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={state !== "unanswered" || submitting}
            className={getOptionClasses(index)}
          >
            <span className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium shrink-0 ${
                  state !== "unanswered" && index === quiz.correct_index
                    ? "border-dd-green text-dd-green"
                    : state !== "unanswered" && index === selectedIndex && state === "incorrect"
                      ? "border-red-500 text-red-400"
                      : "border-dd-border text-dd-muted"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {state !== "unanswered" && index === quiz.correct_index && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="ml-auto text-dd-green shrink-0"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {state === "incorrect" && index === selectedIndex && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="ml-auto text-red-400 shrink-0"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}
            </span>
          </button>
        ))}
      </div>

      {submitError && <div className="mt-4 text-xs font-semibold text-red-400">{submitError}</div>}

      {/* Feedback */}
      {state === "correct" && (
        <div className="mt-4 flex items-center gap-2 text-dd-green text-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Correto! +15 XP
        </div>
      )}
      {state === "incorrect" && (
        <div className="mt-4 text-red-400 text-sm">
          Incorreto. A resposta certa era a opcao{" "}
          <strong>{String.fromCharCode(65 + quiz.correct_index)}</strong>.
        </div>
      )}
    </div>
  );
}
