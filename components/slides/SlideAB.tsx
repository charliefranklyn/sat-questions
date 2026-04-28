"use client";
import React from "react";
import { PAL, FONT, OPTION_STYLES, OptionState } from "./shared";

export interface SlideABProps {
  tag: string;
  tagColor?: string;
  question: React.ReactNode;
  visual?: React.ReactNode;            // shown between headline and options (optional)
  optionA: string;
  optionB: string;
  correct: "A" | "B";
  explain: string;
  // controlled by the shell
  picked: "A" | "B" | null;
  onPick: (opt: "A" | "B") => void;
}

function OptionRow({ letter, label, state, onClick }: {
  letter: string; label: string; state: OptionState; onClick?: () => void;
}) {
  const s = OPTION_STYLES[state];
  return (
    <div
      onClick={state === "idle" ? onClick : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 18px", borderRadius: 16,
        background: s.bg, border: `2px solid ${s.border}`,
        cursor: state === "idle" ? "pointer" : "default",
        transition: "all 0.15s",
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: s.badgeBg, color: s.badgeText,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, fontSize: 15, fontWeight: 900, flexShrink: 0,
      }}>
        {letter}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: s.text, flex: 1, lineHeight: 1.3 }}>
        {label}
      </div>
      {state === "correct" && (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill={PAL.green}/>
          <path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {state === "wrong" && (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill={PAL.red}/>
          <path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

function FeedbackBanner({ correct, explain }: { correct: boolean; explain: string }) {
  return (
    <div style={{
      padding: "16px 24px", borderRadius: 16, marginTop: 12,
      background: correct ? "#E7F8EC" : "#FDECEC",
      border: `1.5px solid ${correct ? PAL.green : PAL.red}`,
    }}>
      <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: correct ? PAL.greenDk : PAL.red, marginBottom: 4 }}>
        {correct ? "Correct!" : "Not quite"}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: PAL.ink, lineHeight: 1.5 }}>
        {explain}
      </div>
    </div>
  );
}

export default function SlideAB({ tag, tagColor, question, visual, optionA, optionB, correct, explain, picked, onPick }: SlideABProps) {
  const submitted = picked !== null;

  function stateOf(letter: "A" | "B"): OptionState {
    if (!submitted) return "idle";
    if (letter === correct) return "correct";
    if (letter === picked) return "wrong";
    return "dim";
  }

  return (
    <div>
      <div style={{
        fontFamily: FONT, fontSize: 12, fontWeight: 700,
        color: tagColor ?? PAL.accent,
        letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 8,
      }}>
        {tag}
      </div>

      <div style={{
        fontFamily: FONT, fontSize: 28, fontWeight: 900,
        color: PAL.ink, lineHeight: 1.15,
        marginBottom: 20, maxWidth: 680,
      }}>
        {question}
      </div>

      {visual && (
        <div style={{ marginBottom: 20, maxWidth: 700 }}>
          {visual}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
        <OptionRow letter="A" label={optionA} state={stateOf("A")} onClick={() => onPick("A")} />
        <OptionRow letter="B" label={optionB} state={stateOf("B")} onClick={() => onPick("B")} />
      </div>

      {submitted && (
        <FeedbackBanner correct={picked === correct} explain={explain} />
      )}
    </div>
  );
}
