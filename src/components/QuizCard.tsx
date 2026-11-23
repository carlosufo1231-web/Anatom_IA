import { CheckCircle2, Lightbulb, RefreshCw, XCircle } from "lucide-react";
import type { QuizData } from "../types/anatomy";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface QuizCardProps {
  quiz: QuizData;
  onSelectOption: (quizId: string, optionIndex: number) => void;
  onGenerateAnother: (topic: string) => void;
  isGeneratingQuiz: boolean;
  showQuizControls: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function QuizCard({
  quiz,
  onSelectOption,
  onGenerateAnother,
  isGeneratingQuiz,
  showQuizControls,
}: QuizCardProps) {
  const hasAnswered =
    quiz.selectedOption !== undefined && quiz.selectedOption !== null;
  const isCorrect = hasAnswered && quiz.selectedOption === quiz.correctIndex;

  return (
    <div className="rounded-2xl border border-[#00E640]/40 bg-[#091526]/95 p-5 shadow-[0_0_24px_rgba(0,230,64,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#0088FF]/20">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#76FF03]">
          <span>Quiz Rápido</span>
          <span aria-hidden="true" className="text-slate-500">
            ·
          </span>
          <span className="text-[#00E5FF]">{quiz.topic}</span>
        </div>

        {hasAnswered && (
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${
              isCorrect ? "text-[#00E640]" : "text-[#E53935]"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Resposta Correta</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>Resposta Incorreta</span>
              </>
            )}
          </div>
        )}
      </div>

      <h3 className="mt-4 text-base font-bold text-white leading-snug">
        {quiz.question}
      </h3>

      <div className="mt-4 space-y-2.5">
        {quiz.options.map((option, idx) => {
          const isSelected = quiz.selectedOption === idx;
          const isOptionCorrect = idx === quiz.correctIndex;

          let containerClasses =
            "border-[#0088FF]/30 bg-[#040B14]/80 text-slate-100 hover:border-[#00E5FF] hover:bg-[#0088FF]/10";
          let letterClasses = "border-[#0088FF]/40 text-[#00E5FF]";

          if (hasAnswered) {
            if (isOptionCorrect) {
              containerClasses =
                "border-[#00E640] bg-[#00E640]/15 text-white";
              letterClasses =
                "border-[#00E640] bg-[#00E640] text-[#040B14]";
            } else if (isSelected && !isOptionCorrect) {
              containerClasses =
                "border-[#E53935] bg-[#E53935]/15 text-red-100";
              letterClasses =
                "border-[#E53935] bg-[#E53935] text-white";
            } else {
              containerClasses =
                "border-[#0088FF]/15 bg-[#040B14]/40 text-slate-400";
              letterClasses = "border-slate-700 text-slate-500";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={hasAnswered}
              onClick={() => onSelectOption(quiz.id, idx)}
              className={`w-full min-h-[44px] flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                hasAnswered ? "cursor-default" : "cursor-pointer"
              } ${containerClasses}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-mono font-bold ${letterClasses}`}
              >
                {OPTION_LETTERS[idx] ?? idx + 1}
              </span>
              <span className="flex-1 leading-snug">{option}</span>
              {hasAnswered && isOptionCorrect && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00E640]" />
              )}
              {hasAnswered && isSelected && !isOptionCorrect && (
                <XCircle className="h-4 w-4 shrink-0 text-[#E53935]" />
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="mt-4 space-y-3 pt-4 border-t border-[#0088FF]/20">
          <div className="text-sm text-slate-200">
            <MarkdownRenderer content={quiz.explanation} />
          </div>

          {quiz.mnemonic && (
            <div className="rounded-xl border border-[#00E640]/35 bg-[#00E640]/[0.07] px-3.5 py-2.5 text-xs text-slate-100 flex items-start gap-2.5">
              <Lightbulb className="h-4 w-4 shrink-0 text-[#76FF03] mt-0.5" />
              <div>
                <span className="font-bold text-[#76FF03]">
                  Dica de Memorização:{" "}
                </span>
                <span>{quiz.mnemonic}</span>
              </div>
            </div>
          )}

          {showQuizControls && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                disabled={isGeneratingQuiz}
                onClick={() => onGenerateAnother(quiz.topic)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#00E5FF]/50 bg-[#040B14] px-3.5 py-2 text-xs font-semibold text-[#00E5FF] hover:border-[#00E5FF] hover:bg-[#0088FF]/15 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Gerar outra pergunta</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
