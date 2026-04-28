"use client";
import React from "react";
import { PAL, FONT, MONO, PILL_COLORS, PillColor } from "./shared";

export interface SlideIntroProps {
  subject: string;        // "Selective Maths · Lesson 01"
  title: string;          // "Linear Functions, from zero."
  pill1: { text: string; color: PillColor };
  pill2: { text: string; color: PillColor };
  stepCount: number;      // 11
  minuteCount: number;    // 5
  onStart: () => void;
}

function Pill({ text, color }: { text: string; color: PillColor }) {
  const c = PILL_COLORS[color];
  return (
    <div style={{
      background: c.bg, color: c.text,
      fontFamily: MONO, fontSize: 15, fontWeight: 700,
      padding: "10px 20px", borderRadius: 9999,
      boxShadow: `0 4px 0 ${c.bg}99`,
    }}>
      {text}
    </div>
  );
}

export default function SlideIntro({ subject, title, pill1, pill2, stepCount, minuteCount, onStart }: SlideIntroProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 560 }}>
      <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: PAL.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {subject}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 900, color: PAL.ink, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Pill text={pill1.text} color={pill1.color} />
        <Pill text={pill2.text} color={pill2.color} />
      </div>
      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: PAL.inkSoft }}>
        {stepCount} steps · about {minuteCount} minutes
      </div>
      {/* CTA lives in the shell bottom bar — onStart wired there */}
    </div>
  );
}
