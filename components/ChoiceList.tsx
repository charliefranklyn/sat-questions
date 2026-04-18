"use client";
import { useState } from "react";
import type { Choice } from "@/lib/questions";

interface Props {
  choices: Choice[];
  correctAnswer: string;
  questionType: "multiple-choice" | "grid-in";
}

export default function ChoiceList({ choices, correctAnswer, questionType }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  if (questionType === "grid-in") {
    return (
      <div className="mt-4">
        <p className="text-sm text-slate-500 italic">
          Student-produced response — grid in your answer.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-700">
          Correct answer: <span className="text-green-700 font-bold">{correctAnswer}</span>
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {choices.map((choice) => {
        const isSelected = selected === choice.label;
        const isCorrect = choice.label === correctAnswer;
        const revealed = selected !== null;

        let bg = "bg-slate-50 border-slate-100 hover:border-green-400 hover:bg-green-50";
        if (revealed && isCorrect) bg = "bg-emerald-50 border-emerald-400";
        else if (revealed && isSelected && !isCorrect) bg = "bg-rose-50 border-rose-300";

        return (
          <li key={choice.label}>
            <button
              disabled={revealed}
              onClick={() => setSelected(choice.label)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors text-sm ${bg}`}
            >
              <span className="font-bold text-slate-500 w-4 shrink-0">{choice.label}</span>
              <span className="text-slate-700">{choice.text}</span>
              {revealed && isCorrect && (
                <span className="ml-auto text-emerald-600 font-semibold shrink-0 text-xs">Correct</span>
              )}
              {revealed && isSelected && !isCorrect && (
                <span className="ml-auto text-rose-500 font-semibold shrink-0 text-xs">Incorrect</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
