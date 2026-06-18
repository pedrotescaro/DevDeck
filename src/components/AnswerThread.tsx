'use client';

import { MessageSquare } from 'lucide-react';
import { AnswerCard } from '@/components/AnswerCard';
import type { AnswerNode } from '@/components/answer-types';

interface AnswerThreadProps {
  answers: AnswerNode[];
  isPostAuthor: boolean;
  currentUser?: { id?: string; username: string; avatar_url?: string | null };
  postId: string;
  onAccept?: (id: string) => void;
  /** Called when any answer (top-level or nested) is created. Receives the parent answer id (null for top-level) and the new answer node. */
  onAnswerAdded?: (parentAnswerId: string | null, newAnswer: AnswerNode) => void;
}

/**
 * Recursively counts every answer in a tree (top-level + all nested replies).
 * Used for the "Respostas (N)" header so the total reflects the whole thread.
 */
export function countAnswers(answers: AnswerNode[]): number {
  return answers.reduce((total, answer) => {
    const childCount = answer.replies ? countAnswers(answer.replies) : 0;
    return total + 1 + childCount;
  }, 0);
}

export function AnswerThread({
  answers,
  isPostAuthor,
  currentUser,
  postId,
  onAccept,
  onAnswerAdded,
}: AnswerThreadProps) {
  const totalAnswers = countAnswers(answers);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4.5 h-4.5 text-orange-500/85" />
        <h2 className="text-sm font-extrabold text-dd-text">Respostas ({totalAnswers})</h2>
      </div>

      {answers.length === 0 ? (
        <div className="rounded-xl border border-dd-border bg-dd-surface/10 p-8 text-center text-dd-muted text-xs">
          Nenhuma resposta publicada ainda. Seja o primeiro a ajudar o autor!
        </div>
      ) : (
        <div className="space-y-4">
          {answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              depth={0}
              isPostAuthor={isPostAuthor}
              onAccept={onAccept}
              currentUser={currentUser}
              postId={postId}
              onAnswerAdded={onAnswerAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
