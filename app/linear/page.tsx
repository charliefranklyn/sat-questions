"use client";
import { useState } from "react";
import InteractiveLesson from "@/components/InteractiveLesson";
import InteractiveLesson02 from "@/components/InteractiveLesson02";
import InteractiveLesson03 from "@/components/InteractiveLesson03";
import InteractiveLesson04 from "@/components/InteractiveLesson04";

const PAL = {
  cream:   "#FFF7E4",
  ink:     "#1F2544",
  inkSoft: "#5A6088",
  green:   "#38C76B",
  greenDk: "#2CA555",
};

const FONT = '"Nunito", var(--font-nunito), system-ui, sans-serif';

type LessonId = "lesson1" | "lesson2" | "lesson3" | "lesson4";

interface LessonMeta {
  id: LessonId;
  number: string;
  title: string;
  description: string;
}

const LESSONS: LessonMeta[] = [
  {
    id: "lesson1",
    number: "Lesson 01",
    title: "Linear Functions",
    description: "What a linear function is, the y = mx + b formula, and SAT word problem traps.",
  },
  {
    id: "lesson2",
    number: "Lesson 02",
    title: "Gradient & Slope",
    description: "Calculate slope from two points, read it off a graph, and apply it on the SAT.",
  },
  {
    id: "lesson3",
    number: "Lesson 03",
    title: "Write the Equation",
    description: "Find b from a known point and slope, then write the full equation of any line.",
  },
  {
    id: "lesson4",
    number: "Lesson 04",
    title: "Two Equations",
    description: "Find where two lines meet — and spot when they run parallel or are the same line.",
  },
];

function LessonCard({
  meta,
  done,
  onStart,
}: {
  meta: LessonMeta;
  done: boolean;
  onStart: () => void;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "24px 24px 20px",
      boxShadow: "0 4px 0 rgba(31,37,68,0.08)",
      display: "flex", flexDirection: "column", gap: 12,
      maxWidth: 360, width: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: done ? PAL.green : PAL.ink,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 5px 0 ${done ? PAL.greenDk : "rgba(31,37,68,0.3)"}`,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {done
              ? <path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M8 6l8 6-8 6V6z" fill="#fff"/>}
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: PAL.inkSoft, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{meta.number}</div>
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 900, color: PAL.ink, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{meta.title}</div>
        </div>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: PAL.inkSoft, lineHeight: 1.5, margin: 0 }}>{meta.description}</p>
      <div
        onClick={onStart}
        style={{
          padding: "16px 0", borderRadius: 18,
          background: PAL.ink, color: "#fff",
          fontFamily: FONT, fontSize: 17, fontWeight: 800,
          textAlign: "center", cursor: "pointer",
          boxShadow: "0 5px 0 rgba(0,0,0,0.18)",
          userSelect: "none",
        }}
      >
        {done ? "Restart lesson" : "Start lesson"}
      </div>
    </div>
  );
}

export default function LinearPage() {
  const [open, setOpen] = useState<LessonId | null>(null);
  const [done, setDone] = useState<Record<LessonId, boolean>>({ lesson1: false, lesson2: false, lesson3: false, lesson4: false });

  return (
    <div style={{
      minHeight: "100vh",
      background: PAL.cream,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      fontFamily: FONT,
    }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: PAL.inkSoft, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>SAT Math</div>
        <h1 style={{ fontFamily: FONT, fontSize: 36, fontWeight: 900, color: PAL.ink, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>Linear Functions</h1>
        <p style={{ fontFamily: FONT, fontSize: 16, color: PAL.inkSoft, marginTop: 10, lineHeight: 1.5 }}>Two lessons. Start from zero.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center" }}>
        {LESSONS.map((meta) => (
          <LessonCard
            key={meta.id}
            meta={meta}
            done={done[meta.id]}
            onStart={() => setOpen(meta.id)}
          />
        ))}
      </div>

      {open === "lesson1" && (
        <InteractiveLesson
          onClose={() => setOpen(null)}
          onComplete={() => setDone(d => ({ ...d, lesson1: true }))}
        />
      )}
      {open === "lesson2" && (
        <InteractiveLesson02
          onClose={() => setOpen(null)}
          onComplete={() => setDone(d => ({ ...d, lesson2: true }))}
        />
      )}
      {open === "lesson3" && (
        <InteractiveLesson03
          onClose={() => setOpen(null)}
          onComplete={() => setDone(d => ({ ...d, lesson3: true }))}
        />
      )}
      {open === "lesson4" && (
        <InteractiveLesson04
          onClose={() => setOpen(null)}
          onComplete={() => setDone(d => ({ ...d, lesson4: true }))}
        />
      )}
    </div>
  );
}
