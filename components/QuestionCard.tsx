import type { Question } from "@/lib/questions";
import ChoiceList from "./ChoiceList";
import Explanation from "./Explanation";

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

interface Props {
  question: Question;
  number: number;
}

export default function QuestionCard({ question, number }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Question {number}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${DIFFICULTY_STYLES[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </div>

      <div className="px-6 py-5">
        {question.passage && (
          <div className="mb-5 p-4 bg-slate-50 rounded-xl border-l-4 border-green-400 text-sm text-slate-600 leading-relaxed italic">
            {question.passage}
          </div>
        )}

        <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line">
          {question.prompt}
        </p>

        <ChoiceList
          choices={question.choices ?? []}
          correctAnswer={question.correctAnswer}
          questionType={question.questionType}
        />

        <Explanation text={question.explanation} />
      </div>
    </div>
  );
}
