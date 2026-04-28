"use client";
import { useState } from "react";
import InteractiveLesson from "@/components/InteractiveLesson";
import InteractiveLesson02 from "@/components/InteractiveLesson02";
import InteractiveLesson03 from "@/components/InteractiveLesson03";
import InteractiveLesson04 from "@/components/InteractiveLesson04";
import InteractiveLessonL5 from "@/components/InteractiveLessonL5";
import InteractiveLessonL6 from "@/components/InteractiveLessonL6";

const PAL = {
  cream:   "#FFF7E4",
  ink:     "#1F2544",
  inkSoft: "#5A6088",
  green:   "#38C76B",
  greenDk: "#2CA555",
  orange:  "#FF8A3D",
  blue:    "#2DADE8",
  purple:  "#A86CE4",
  yellow:  "#FFD23F",
};

const FONT = '"Inter", ui-sans-serif, system-ui, sans-serif';
const MONO = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';

type LessonId = "lesson1" | "lesson2" | "lesson3" | "lesson4" | "lesson5" | "lesson6";

interface LessonMeta {
  id: LessonId;
  tag: string;
  title: string;
  description: string;
  accent: string;
  accentDk: string;
  icon: React.ReactNode;
}

const LESSONS: LessonMeta[] = [
  {
    id: "lesson1", tag: "01",
    title: "Linear Functions",
    description: "What a linear function is and the y = mx + b formula.",
    accent: PAL.orange, accentDk: "#DB6D22",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22L24 6" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="4" cy="22" r="3" fill="#fff"/>
        <circle cx="24" cy="6" r="3" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "lesson2", tag: "02",
    title: "Gradient & Slope",
    description: "Calculate slope from two points and read it off a graph.",
    accent: PAL.blue, accentDk: "#1A8AB8",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22L14 10L24 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 6L24 10L19 14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "lesson3", tag: "03",
    title: "Write the Equation",
    description: "Find b from a known point and slope, write the full equation.",
    accent: PAL.purple, accentDk: "#8A50C8",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 20L10 8h3l4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 15h7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M19 8v12M16 11h6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "lesson4", tag: "04",
    title: "Two Equations",
    description: "Find where two lines meet and spot when they never do.",
    accent: PAL.green, accentDk: PAL.greenDk,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22L24 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M4 6L24 22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="4" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "lesson5", tag: "05",
    title: "Equations from Graphs",
    description: "Read the y-intercept and slope off a graph, then write the equation.",
    accent: PAL.yellow, accentDk: "#D4A800",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <line x1="4" y1="24" x2="24" y2="4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="4" cy="24" r="3" fill="#fff"/>
        <line x1="4" y1="4" x2="24" y2="4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,2" opacity="0.6"/>
        <line x1="4" y1="4" x2="4" y2="24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,2" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: "lesson6", tag: "06",
    title: "Systems of Equations",
    description: "Find where two lines meet — on a graph and by solving algebraically.",
    accent: "#E85D5D", accentDk: "#C44444",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22L24 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M4 6L24 22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="4" fill="#fff"/>
      </svg>
    ),
  },
];

function LessonNode({ meta, done, locked, onStart }: {
  meta: LessonMeta; done: boolean; locked: boolean; onStart: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flex: "0 0 auto", width: 200 }}>
      <div
        onClick={locked ? undefined : onStart}
        style={{
          width: 96, height: 96, borderRadius: "50%",
          background: done ? PAL.green : locked ? "rgba(31,37,68,0.12)" : meta.accent,
          boxShadow: done
            ? `0 7px 0 ${PAL.greenDk}`
            : locked
              ? "none"
              : `0 7px 0 ${meta.accentDk}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: locked ? "default" : "pointer",
          transition: "transform 0.15s",
          position: "relative",
        }}
      >
        {done ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 21l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : locked ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="6" y="13" width="16" height="11" rx="3" stroke="rgba(31,37,68,0.3)" strokeWidth="2.5"/>
            <path d="M10 13V10a4 4 0 018 0v3" stroke="rgba(31,37,68,0.3)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <div style={{ color: "#fff" }}>{meta.icon}</div>
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: MONO, fontSize: 11, fontWeight: 600,
          color: done ? PAL.green : locked ? "rgba(31,37,68,0.3)" : meta.accent,
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4,
        }}>Lesson {meta.tag}</div>
        <div style={{
          fontFamily: FONT, fontSize: 17, fontWeight: 900,
          color: locked ? "rgba(31,37,68,0.3)" : PAL.ink,
          letterSpacing: "-0.02em", lineHeight: 1.2,
        }}>{meta.title}</div>
        <div style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 500,
          color: locked ? "rgba(31,37,68,0.25)" : PAL.inkSoft,
          lineHeight: 1.45, marginTop: 6,
        }}>{meta.description}</div>
      </div>

      {!locked && (
        <div
          onClick={onStart}
          style={{
            padding: "12px 28px", borderRadius: 14,
            background: done ? PAL.green : PAL.ink,
            color: "#fff",
            fontFamily: FONT, fontSize: 15, fontWeight: 800,
            cursor: "pointer", userSelect: "none",
            boxShadow: done ? `0 4px 0 ${PAL.greenDk}` : "0 4px 0 rgba(0,0,0,0.2)",
            letterSpacing: "-0.01em", whiteSpace: "nowrap",
          }}
        >{done ? "Redo" : "Start"}</div>
      )}
    </div>
  );
}

function Connector({ done }: { done: boolean }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", paddingBottom: 80, minWidth: 32 }}>
      <div style={{
        width: "100%", height: 5, borderRadius: 99,
        background: done ? PAL.green : "rgba(31,37,68,0.12)",
        transition: "background 0.4s",
      }} />
    </div>
  );
}

export default function LinearSelectivePage() {
  const [open, setOpen] = useState<LessonId | null>(null);
  const [done, setDone] = useState<Record<LessonId, boolean>>({ lesson1: false, lesson2: false, lesson3: false, lesson4: false, lesson5: false, lesson6: false });

  const completedCount = Object.values(done).filter(Boolean).length;
  const totalCount = LESSONS.length;

  return (
    <div style={{ minHeight: "100vh", background: PAL.cream, fontFamily: FONT, display: "flex", flexDirection: "column" }}>

      <div style={{ padding: "56px 48px 0", textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: PAL.inkSoft, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          Selective · Linear Functions
        </div>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: PAL.ink, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 16px" }}>
          Linear Functions<br/>
          <span style={{ color: PAL.inkSoft, fontWeight: 700, fontSize: "0.68em" }}>Mini course</span>
        </h1>
        {completedCount > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: PAL.green, color: "#fff",
            fontFamily: FONT, fontSize: 13, fontWeight: 800,
            padding: "6px 14px", borderRadius: 9999,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13">
              <path d="M2 6.5l3 3 6-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {completedCount} of {totalCount} complete
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", overflowX: "auto", padding: "24px 48px 48px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, minWidth: "max-content", margin: "0 auto" }}>
          {LESSONS.map((meta, i) => (
            <div key={meta.id} style={{ display: "flex", alignItems: "center" }}>
              <LessonNode
                meta={meta}
                done={done[meta.id]}
                locked={false}
                onStart={() => setOpen(meta.id)}
              />
              {i < LESSONS.length - 1 && (
                <Connector done={done[meta.id]} />
              )}
            </div>
          ))}
        </div>
      </div>

      {open === "lesson1" && <InteractiveLesson onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, lesson1: true }))} />}
      {open === "lesson2" && <InteractiveLesson02 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, lesson2: true }))} />}
      {open === "lesson3" && <InteractiveLesson03 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, lesson3: true }))} />}
      {open === "lesson4" && <InteractiveLesson04 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, lesson4: true }))} />}
      {open === "lesson5" && <InteractiveLessonL5 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, lesson5: true }))} />}
      {open === "lesson6" && <InteractiveLessonL6 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, lesson6: true }))} />}
    </div>
  );
}
