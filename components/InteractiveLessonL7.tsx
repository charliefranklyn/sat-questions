"use client";
import { useState, useEffect } from "react";
import ChatPanel, { CHAT_W } from "@/components/ChatPanel";

function playCorrect() { new Audio("/sounds/correct.mp3").play().catch(() => {}); }

const FONT     = '"Inter", ui-sans-serif, system-ui, sans-serif';
const MONO     = '"DM Mono", ui-monospace, monospace';
const INK      = "#1E293B";
const GRAY     = "#94A3B8";
const ACCENT   = "#3B5BDB";
const GREEN    = "#38C76B";
const GREEN_DK = "#2CA555";
const RED      = "#EF5A5A";
const GREENBG  = "#DCFCE7";

// ── Intro graphic ─────────────────────────────────────────────────────────────
function IneqGraphic({ color = ACCENT }: { color?: string }) {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", height: "auto", display: "block" }}>
      <circle cx="200" cy="200" r="170" fill="rgba(59,91,219,0.07)"/>
      <text x="200" y="175" textAnchor="middle" fontFamily={MONO} fontSize="80" fontWeight="900" fill={color} opacity="0.9">{">"}</text>
      <text x="200" y="270" textAnchor="middle" fontFamily={MONO} fontSize="80" fontWeight="900" fill={color} opacity="0.5">{"<"}</text>
    </svg>
  );
}

// ── Progress pills ─────────────────────────────────────────────────────────────
function ProgressPills({ filled, total, color = ACCENT }: { filled: number; total: number; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 8, flex: 1, borderRadius: 99, background: i < filled ? color : "#CBD5E1", transition: "background 0.4s ease" }} />
      ))}
    </div>
  );
}

// ── Option list ───────────────────────────────────────────────────────────────
function OptionList({ options, correct, picked, onPick }: {
  options: string[]; correct: number; picked: number | null; onPick: (i: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((label, i) => {
        let bg = "#fff", border = "rgba(31,37,68,0.14)", textColor = INK;
        let badgeBg = "#F5F0E8", badgeColor = INK;
        let showCheck = false, showCross = false;
        if (picked !== null) {
          if (i === correct)     { bg = "#E7F8EC"; border = GREEN; badgeBg = GREEN; badgeColor = "#fff"; showCheck = true; }
          else if (i === picked) { bg = "#FDECEC"; border = RED;   badgeBg = RED;   badgeColor = "#fff"; showCross = true; textColor = "#5A6088"; }
          else                   { border = "rgba(31,37,68,0.07)"; textColor = "rgba(31,37,68,0.35)"; badgeBg = "rgba(31,37,68,0.07)"; badgeColor = "rgba(31,37,68,0.3)"; }
        }
        return (
          <div key={i} onClick={() => { if (picked === null) { onPick(i); if (i === correct) playCorrect(); } }}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderRadius: 16, background: bg, border: `2px solid ${border}`, cursor: picked === null ? "pointer" : "default", transition: "all 0.15s" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: badgeBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 16, fontWeight: 900, color: badgeColor, flexShrink: 0 }}>
              {String.fromCharCode(65 + i)}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 600, color: textColor, flex: 1, lineHeight: 1.3 }}>{label}</div>
            {showCheck && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {showCross && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
          </div>
        );
      })}
    </div>
  );
}

// ── EdAccelerator header ──────────────────────────────────────────────────────
function EdHeader() {
  return (
    <div style={{ borderBottom: "1px solid rgba(226,232,240,0.6)", padding: "0 52px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="28" height="28" viewBox="264 271 552 537" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="l7-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe"/><stop offset=".77" stopColor="#1c45f6"/>
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l7-logo-grad)"/>
          <path d="M523.2,510.9c-5.5-16.4-17.2-29.9-32.2-38.6-6.8-3.9-15.2-7.6-25.1-9.8-24.1-5.4-43.5.6-51.1,3.4-8.5,3.7-33.3,15.9-46.7,43.7-12.6,26.3-10.9,57.9,3.5,85.5,6.9,13.2,17.4,24.2,30.4,31.4,12.1,6.7,29.3,13.3,50.6,13,33.8-.5,57.2-18,66.9-26.8,2.5-2.2,2.7-6,.6-8.6l-18.2-21.9c-1.8-2.1-5-2.5-7.2-.8-21.1,16.4-46.7,19.6-64.3,8.8-9.6-5.9-14.8-14.9-17.6-21.3-.3-.8.2-1.7,1-1.8l101.1-14.8c6.5-.95,11.4-6.4,11.8-13,.4-7.6-.2-17.4-3.7-28.1Zm-48.4,14-63.7,9.5c-.7.1-1.3-.45-1.3-1.15.2-4.8,1.8-19.9,14.7-29.3,11-7.9,28.2-10.3,40.1-.9,8.5,6.7,10.6,16.6,11.2,20.6.1.6-.3,1.2-.94,1.25Z" fill="#fff"/>
          <path d="M714.8,627.5l-2.2-12c-.4-2.1-.6-4.2-.6-6.3V399.4c0-4.2-3.8-7.3-7.9-6.5l-36.8,7.3c-3.2.6-5.4,3.4-5.4,6.6v71.3c-8.1-9.1-20.6-17.4-47.1-17.4-13.9,0-26.4,4.4-37.7,11.1-11.3,6.7-20.2,16.7-26.9,29.8-6.6,13.1-9.9,29.2-9.9,48.2,0,18.8,3.3,34.8,9.8,47.95s15.4,23.2,26.6,30.1c11.2,6.9,23.9,10.4,38.1,10.4,10.3,0,18.9-1.6,25.7-4.9,6.8-3.3,13.9-7.4,18.1-12,2-2.2,4.5-4.8,6.9-7.4l.8,13.8c.3,3.7,3.4,6.6,7.1,6.6h35.9c3.6,0,6.4-3.3,5.7-6.9Zm-51.4-54.3c-1.2,2.3-9.7,13.8-18.4,17.9-3.7,1.7-8.4,3.3-14,3.3-7.7,0-14.6-.95-20.7-4.7-6.1-3.7-10.9-9.2-14.5-16.3s-5.3-15.8-5.3-25.97c0-10.3,1.8-19,5.4-26.1,3.6-7.1,7.1-11.5,13.2-15.1,6.1-3.6,13-5.5,20.5-5.5,18.8,0,30,10.7,33.8,16.9v55.7Z" fill="#fff"/>
        </svg>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.01em" }}>EdAccelerator</span>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4e7efe 0%,#1c45f6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>C</span>
      </div>
    </div>
  );
}

// ── Symbol box helper ─────────────────────────────────────────────────────────
function SymbolBox({ symbol, meaning }: { symbol: string; meaning: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 20px" }}>
      <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 900, color: ACCENT, flexShrink: 0, minWidth: 40, textAlign: "center" as const }}>{symbol}</div>
      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{meaning}</div>
    </div>
  );
}

// ── Slide manifest ─────────────────────────────────────────────────────────────
const SLIDES = [
  { id: "intro"             }, // 0
  { id: "elephant"          }, // 1  Q
  { id: "symbols"           }, // 2  Q
  { id: "practice1"         }, // 3  Q
  { id: "gte_lte"           }, // 4  Q
  { id: "practice2"         }, // 5  Q
  { id: "hard1"             }, // 6  Q  multi-step
  { id: "hard2"             }, // 7  Q  negative flip
  { id: "hard3"             }, // 8  Q  two-sided
  { id: "hard4"             }, // 9  Q  word problem
  { id: "hard5"             }, // 10 Q  test values
  { id: "practice_unlocked" }, // 11
  { id: "p1"  }, { id: "p2"  }, { id: "p3"  }, { id: "p4"  }, { id: "p5"  },
  { id: "p6"  }, { id: "p7"  }, { id: "p8"  }, { id: "p9"  }, { id: "p10" },
  { id: "score"             }, // 22
  { id: "complete"          }, // 23
];

const PROGRESS = [
  0.04, 0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.56, 0.62, 0.68, 0.74,
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
];

// Lesson Q correct answers (idx 1–10)
const LESSON_CORRECT: Record<number, number> = { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 0, 7: 1, 8: 0, 9: 0, 10: 0 };

// Practice correct answers (idx 12–21)
const PRACTICE_CORRECT = [0, 1, 0, 1, 1, 0, 0, 0, 0, 0];

const EXPLAIN_DATA: Record<number, [string, string]> = {
  1: ["The elephant weighs more — so its value is greater. The symbol opens towards the larger value, so Elephant > Mouse.", "The > symbol opens towards the bigger value. The elephant is heavier, so Elephant > Mouse."],
  2: ["10 is greater than 3 — so 10 > 3.", "The > symbol means 'greater than'. 10 is bigger, so 10 > 3, not 10 < 3."],
  3: ["5 is less than 12 — so 5 < 12.", "The < symbol means 'less than'. 5 is smaller than 12, so 5 < 12."],
  4: ["'At least 5' means 5 or more — that's ≥.", "'At least' means the minimum is 5 — it could be 5, 6, 7... That's x ≥ 5."],
  5: ["'No more than 10' means 10 or less — that's ≤.", "'No more than' means the maximum is 10. That's x ≤ 10, not x ≥ 10."],
  6: ["Expand first: 3(x+2) = 3x+6. Then 3x+6 ≤ 18 → 3x ≤ 12 → x ≤ 4.", "Expand the brackets: 3(x+2) = 3x+6. Subtract 6: 3x ≤ 12. Divide by 3: x ≤ 4."],
  7: ["Dividing by −2 flips the symbol: −2x > 8 → x < −4.", "When you divide by a negative, the symbol flips. −2x > 8 ÷ (−2) gives x < −4, not x > −4."],
  8: ["Subtract 1 from all three parts: 2 < 2x < 10. Divide by 2: 1 < x < 5.", "Apply the same operation to all three parts: 3−1 < 2x < 11−1 → 2 < 2x < 10 → 1 < x < 5."],
  9: ["45 + m ≥ 70 means she needs at least 25 more marks.", "'At least 70' means ≥ 70. Her current marks plus extra m gives 45 + m ≥ 70."],
  10: ["-1 is the only value less than 3. 3 itself does not satisfy x < 3 (strict inequality).", "Substitute each: −1 < 3 ✓. But 3 is not less than 3, and 5, 7 are greater than 3."],
};

const TIP_DATA: Record<number, string> = {
  1: "Think about which animal weighs more. The > symbol opens towards the heavier side.",
  2: "Which number is bigger — 10 or 3? The > symbol means 'greater than'.",
  3: "Which is smaller — 5 or 12? The < symbol means 'less than'.",
  4: "'At least' means that value or more. Which symbol includes equal to?",
  5: "'No more than' means that value or less. Which symbol allows equal to?",
  6: "Start by expanding the brackets: 3(x + 2) = 3x + ?",
  7: "Remember: dividing or multiplying by a negative number flips the inequality symbol.",
  8: "Apply the same operation to all three parts of the inequality at once.",
  9: "'At least 70' — which symbol means at least?",
  10: "Substitute each value into x < 3. Does −1 < 3? Does 3 < 3?",
};

// Practice questions (hard)
const PDATA = [
  { q: "Solve: 2x + 3 > 9", opts: ["x > 3", "x > 6"], cor: 0 },
  { q: "Solve: 4x − 2 ≤ 10", opts: ["x ≤ 2", "x ≤ 3"], cor: 1 },
  { q: "Solve: 3(x − 1) < 12", opts: ["x < 5", "x < 4"], cor: 0 },
  { q: "Solve: −x > 4", opts: ["x > −4", "x < −4"], cor: 1 },
  { q: "Solve: −3x ≤ 9", opts: ["x ≤ −3", "x ≥ −3"], cor: 1 },
  { q: "Solve: −1 < x + 2 < 5", opts: ["−3 < x < 3", "−1 < x < 7"], cor: 0 },
  { q: "Sam needs more than 80 points to win. She has 52. Which inequality shows the extra points m she needs?", opts: ["m > 28", "m ≥ 28"], cor: 0 },
  { q: "Which values satisfy x ≤ −2?", opts: ["−3 and −2", "−2 and −1"], cor: 0 },
  { q: "Solve: 2(x + 4) ≥ 14", opts: ["x ≥ 3", "x ≥ 5"], cor: 0 },
  { q: "Solve: 2 ≤ 3x − 1 ≤ 8", opts: ["1 ≤ x ≤ 3", "2 ≤ x ≤ 3"], cor: 0 },
];

const PNLDATA: { start: number; end: number; marks: number[]; ticks: number[]; dots: { val: number; color: string }[]; ray?: { from: number; dir: "left" | "right" }; band?: { from: number; to: number } }[] = [
  // Q1: 2x+3>9, x>3
  { start:0,  end:8,  marks:[3],     ticks:[0,1,2,3,4,5,6,7,8],              dots:[{val:3,color:ACCENT}],              ray:{from:3,  dir:"right"} },
  // Q2: 4x-2≤10, x≤3
  { start:0,  end:8,  marks:[3],     ticks:[0,1,2,3,4,5,6,7,8],              dots:[{val:3,color:ACCENT}],              ray:{from:3,  dir:"left"}  },
  // Q3: 3(x-1)<12, x<5
  { start:0,  end:8,  marks:[5],     ticks:[0,1,2,3,4,5,6,7,8],              dots:[{val:5,color:"#F97316"}],           ray:{from:5,  dir:"left"}  },
  // Q4: -x>4, x<-4
  { start:-8, end:0,  marks:[-4],    ticks:[-8,-7,-6,-5,-4,-3,-2,-1,0],      dots:[{val:-4,color:"#F97316"}],          ray:{from:-4, dir:"left"}  },
  // Q5: -3x≤9, x≥-3
  { start:-6, end:2,  marks:[-3],    ticks:[-6,-5,-4,-3,-2,-1,0,1,2],        dots:[{val:-3,color:ACCENT}],             ray:{from:-3, dir:"right"} },
  // Q6: -1<x+2<5, -3<x<3
  { start:-5, end:5,  marks:[-3,3],  ticks:[-5,-4,-3,-2,-1,0,1,2,3,4,5],    dots:[{val:-3,color:"#F97316"},{val:3,color:ACCENT}], band:{from:-3,to:3} },
  // Q7: m>28
  { start:24, end:36, marks:[28],    ticks:[24,25,26,27,28,29,30,31,32,33,34,35,36], dots:[{val:28,color:ACCENT}],    ray:{from:28, dir:"right"} },
  // Q8: x≤-2, test -3,-2,-1,0
  { start:-4, end:2,  marks:[-3,-2,-1,0], ticks:[-4,-3,-2,-1,0,1,2],        dots:[{val:-3,color:ACCENT},{val:-2,color:ACCENT},{val:-1,color:RED},{val:0,color:RED}], ray:{from:-2, dir:"left"} },
  // Q9: 2(x+4)≥14, x≥3
  { start:0,  end:8,  marks:[3],     ticks:[0,1,2,3,4,5,6,7,8],              dots:[{val:3,color:ACCENT}],              ray:{from:3,  dir:"right"} },
  // Q10: 2≤3x-1≤8, 1≤x≤3
  { start:-1, end:5,  marks:[1,3],   ticks:[-1,0,1,2,3,4,5],                dots:[{val:1,color:"#F97316"},{val:3,color:ACCENT}], band:{from:1,to:3} },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function InteractiveLessonL7({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [idx, setIdx]           = useState(0);
  const [picked, setPicked]     = useState<number | null>(null);
  const [practiceResults, setPracticeResults] = useState<(boolean|null)[]>(Array(10).fill(null));
  const [completeFilled, setCompleteFilled]   = useState(1);

  const isLast       = idx === SLIDES.length - 1;
  const isFirst      = idx === 0;
  const isPractice   = idx >= 12 && idx <= 21;
  const practiceStep = isPractice ? idx - 12 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isLessonQ    = idx >= 1 && idx <= 10;
  const isQuestionSlide = isLessonQ || isPractice;

  useEffect(() => {
    if (isLast) {
      setCompleteFilled(1);
      const t = setTimeout(() => setCompleteFilled(2), 600);
      return () => clearTimeout(t);
    }
  }, [idx, isLast]);

  const correctForIdx = isPractice ? PRACTICE_CORRECT[practiceStep] : (LESSON_CORRECT[idx] ?? 0);

  const tipMessage  = isLessonQ ? TIP_DATA[idx] : undefined;
  const autoMessage = (picked !== null && isLessonQ && EXPLAIN_DATA[idx])
    ? picked === LESSON_CORRECT[idx]
      ? `Well done! ${EXPLAIN_DATA[idx][0]}`
      : `Not quite. ${EXPLAIN_DATA[idx][1]}`
    : undefined;

  const handleContinue = () => {
    if (isPractice) {
      const ok = picked === PRACTICE_CORRECT[practiceStep];
      setPracticeResults(r => { const n=[...r]; n[practiceStep]=ok; return n; });
    }
    setPicked(null);
    setIdx(i => i + 1);
  };

  return (
    <>
      <ChatPanel
        locked={!isQuestionSlide}
        hintOnly={isQuestionSlide && picked === null}
        autoMessage={autoMessage}
        tipMessage={tipMessage}
        slideKey={idx}
        answeredLabel={picked !== null ? ["A","B","C","D"][picked] : undefined}
        answeredCorrect={picked !== null ? picked === correctForIdx : undefined}
      />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: CHAT_W, background: "#fff", fontFamily: FONT, zIndex: 100, overflowY: "auto" }}>

        <EdHeader />

        {/* Progress bar */}
        <div style={{ position: "relative", zIndex: 1, padding: "20px 52px 0", display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          {isPractice ? (
            <div style={{ flex: 1, display: "flex", gap: 5 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: i < practiceStep ? (practiceResults[i]===false ? RED : ACCENT) : i===practiceStep ? ACCENT : "#E2E8F0", transition: "background 0.3s" }} />
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, height: 8, borderRadius: 99, background: "#E2E8F0", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${PROGRESS[idx] * 100}%`, borderRadius: 99, background: isLast ? GREEN : ACCENT, transition: "width 0.6s ease, background 0.4s ease" }}/>
            </div>
          )}
        </div>

        {/* ── Slide 0: INTRO ── */}
        {idx === 0 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 10 }}>Today&apos;s lesson</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, lineHeight: 0.95, marginBottom: 14 }}>Linear<br/>Inequalities</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
                Learn the four inequality symbols — <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>&gt;</span>, <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>&lt;</span>, <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>≥</span>, <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>≤</span> — and how to use them to compare values.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6 }}>Your progress</div>
                  <ProgressPills filled={6} total={10} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: ACCENT }}>70%</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>Mastery</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "75%" }}><IneqGraphic /></div>
            </div>
          </div>
        )}

        {/* ── Slide 1: ELEPHANT ── */}
        {idx === 1 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
                Inequalities allow us to compare two values mathematically.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                They show us which value is greater, smaller, or equal.
              </div>
              <div style={{ padding: "8px 0" }}>
                <svg viewBox="0 0 260 160" style={{ width: "100%", height: "auto", display: "block" }}>
                  {[0, 50, 100].map(v => (
                    <g key={v}>
                      <line x1="44" y1={130 - v * 1.2} x2="240" y2={130 - v * 1.2} stroke="#E2E8F0" strokeWidth="1"/>
                      <text x="38" y={130 - v * 1.2 + 4} textAnchor="end" fontFamily={MONO} fontSize="9" fill={GRAY}>{v}</text>
                    </g>
                  ))}
                  <rect x="60" y={130 - 126 * 1.2} width="60" height={126 * 1.2} rx="4" fill={ACCENT} opacity="0.85"/>
                  <text x="90" y={130 - 126 * 1.2 - 7} textAnchor="middle" fontFamily={MONO} fontSize="11" fontWeight="700" fill={ACCENT}>126 kg</text>
                  <text x="90" y="148" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={INK}>Elephant</text>
                  <rect x="155" y={130 - 6 * 1.2} width="60" height={Math.max(6 * 1.2, 4)} rx="4" fill="#F97316" opacity="0.85"/>
                  <text x="185" y="148" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={INK}>Mouse</text>
                  <line x1="44" y1="130" x2="240" y2="130" stroke={INK} strokeWidth="1.5" opacity="0.3"/>
                </svg>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>How would you write this comparison?</div>
            <OptionList options={["Elephant's weight > Mouse's weight", "Elephant's weight < Mouse's weight"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 2: SYMBOLS ── */}
        {idx === 2 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 16 }}>
                There are two main inequality symbols.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <SymbolBox symbol=">" meaning={'"greater than" — opens towards the bigger value'} />
                <SymbolBox symbol="<" meaning={'"less than" — opens towards the smaller value'} />
              </div>
              {/* Number line */}
              <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                {/* axis line with arrow */}
                <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                {/* tick marks */}
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                  const x = 20 + n * 20;
                  const isMark = n === 3 || n === 10;
                  return (
                    <g key={n}>
                      <line x1={x} y1={isMark ? 12 : 16} x2={x} y2={24} stroke={isMark ? INK : "#CBD5E1"} strokeWidth={isMark ? 2 : 1}/>
                      {isMark && <text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}
                    </g>
                  );
                })}
                {/* dot at 3 — orange */}
                <circle cx={20 + 3 * 20} cy="20" r="8" fill="#F97316"/>
                {/* dot at 10 — blue */}
                <circle cx={20 + 10 * 20} cy="20" r="8" fill={ACCENT}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Which is correct?</div>
              <OptionList options={["10 > 3", "10 < 3"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 3: PRACTICE < ── */}
        {idx === 3 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 16 }}>
                Let&apos;s practise it again.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <SymbolBox symbol=">" meaning='"greater than" — opens towards the bigger value' />
                <SymbolBox symbol="<" meaning='"less than" — opens towards the smaller value' />
              </div>
              <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                  const x = 20 + n * 20;
                  const isMark = n === 5 || n === 12;
                  return (
                    <g key={n}>
                      <line x1={x} y1={isMark ? 12 : 16} x2={x} y2={24} stroke={isMark ? INK : "#CBD5E1"} strokeWidth={isMark ? 2 : 1}/>
                      {isMark && <text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}
                    </g>
                  );
                })}
                <circle cx={20 + 5 * 20} cy="20" r="8" fill="#F97316"/>
                <circle cx={20 + 12 * 20} cy="20" r="8" fill={ACCENT}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Which is correct?</div>
              <OptionList options={["5 > 12", "5 < 12"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 4: ≥ and ≤ ── */}
        {idx === 4 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
                Sometimes a value can be equal to the limit too.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
                For this we add a line underneath:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <SymbolBox symbol="≥" meaning='"greater than or equal to"' />
                <SymbolBox symbol="≤" meaning='"less than or equal to"' />
              </div>
              {/* Number line showing x ≥ 5 */}
              <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                <line x1={20 + 5 * 20} y1="20" x2="310" y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                  const x = 20 + n * 20;
                  const isMark = n === 5;
                  return (
                    <g key={n}>
                      <line x1={x} y1={isMark ? 12 : 16} x2={x} y2={24} stroke={isMark ? INK : "#CBD5E1"} strokeWidth={isMark ? 2 : 1}/>
                      {isMark && <text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}
                    </g>
                  );
                })}
                <circle cx={20 + 5 * 20} cy="20" r="8" fill={ACCENT}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Which is correct for a number that is at least 5?</div>
              <OptionList options={["x ≤ 5", "x ≥ 5"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 5: ≤ PRACTICE ── */}
        {idx === 5 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 16 }}>
                Can you solve this one?
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <SymbolBox symbol="≥" meaning='"greater than or equal to"' />
                <SymbolBox symbol="≤" meaning='"less than or equal to"' />
              </div>
              {/* Number line showing x ≤ 10 */}
              <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                <line x1="20" y1="20" x2={20 + 10 * 20} y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                  const x = 20 + n * 20;
                  const isMark = n === 10;
                  return (
                    <g key={n}>
                      <line x1={x} y1={isMark ? 12 : 16} x2={x} y2={24} stroke={isMark ? INK : "#CBD5E1"} strokeWidth={isMark ? 2 : 1}/>
                      {isMark && <text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}
                    </g>
                  );
                })}
                <circle cx={20 + 10 * 20} cy="20" r="8" fill={ACCENT}/>
              </svg>
            </div>
            <div>
              <OptionList options={["x ≥ 10", "x ≤ 10"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 6: HARD 1 — multi-step ── */}
        {idx === 6 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 8 }}>
                You can solve inequalities step by step.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                Expand brackets first, then simplify.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { expr: "3(x + 2) ≤ 18", note: "start" },
                  { expr: "3x + 6 ≤ 18",   note: "expand" },
                  { expr: "3x ≤ 12",        note: "− 6" },
                  { expr: "x ≤ 4",          note: "÷ 3", highlight: true },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid #E2E8F0" : "none" }}>
                    <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: row.highlight ? 900 : 600, color: row.highlight ? ACCENT : INK }}>{row.expr}</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: row.highlight ? ACCENT : GRAY, background: row.highlight ? "rgba(59,91,219,0.08)" : "transparent", padding: "3px 8px", borderRadius: 6 }}>{row.note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Solve: 3(x + 2) ≤ 18</div>
              <OptionList options={["x ≤ 4", "x ≤ 6"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 7: HARD 2 — negative flip ── */}
        {idx === 7 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
                Dividing by a negative flips the symbol.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>−2x &gt; 8</span>
                  <svg width="28" height="16" viewBox="0 0 28 16" fill="none"><path d="M2 8h24M18 2l6 6-6 6" stroke={GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 900, color: ACCENT }}>x &lt; −4</span>
                </div>
                <div style={{ background: "#FFF7E6", border: "1.5px solid #F59E0B", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round"/></svg>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#92400E", lineHeight: 1.5 }}>
                    Divide both sides by <strong>−2</strong> — the symbol flips from <strong>&gt;</strong> to <strong>&lt;</strong>.
                  </div>
                </div>
                <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                  <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                  <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                  <line x1="20" y1="20" x2={20 + ((-4 - (-8)) / 8) * 290} y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
                  {[-8,-7,-6,-5,-4,-3,-2,-1,0].map(n => {
                    const x = 20 + ((n - (-8)) / 8) * 290;
                    const isMark = n === -4;
                    return (
                      <g key={n}>
                        <line x1={x} y1={isMark ? 12 : 16} x2={x} y2={24} stroke={isMark ? INK : "#CBD5E1"} strokeWidth={isMark ? 2 : 1}/>
                        {isMark && <text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}
                      </g>
                    );
                  })}
                  <circle cx={20 + ((-4 - (-8)) / 8) * 290} cy="20" r="8" fill={ACCENT}/>
                </svg>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Solve: −2x &gt; 8</div>
              <OptionList options={["x > −4", "x < −4"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 8: HARD 3 — two-sided ── */}
        {idx === 8 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 8 }}>
                A double inequality traps x between two values.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                Apply the same operation to all three parts.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0, marginBottom: 16 }}>
                {[
                  { expr: "3 < 2x + 1 < 11",  note: "start" },
                  { expr: "2 < 2x < 10",       note: "− 1" },
                  { expr: "1 < x < 5",          note: "÷ 2", highlight: true },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                    <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: row.highlight ? 900 : 600, color: row.highlight ? ACCENT : INK }}>{row.expr}</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: row.highlight ? ACCENT : GRAY, background: row.highlight ? "rgba(59,91,219,0.08)" : "transparent", padding: "3px 8px", borderRadius: 6 }}>{row.note}</span>
                  </div>
                ))}
              </div>
              <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                {(() => { const s=-1,e=7,W=290; const pos=(v:number)=>20+(v-s)/(e-s)*W; return (<>
                  <line x1={pos(1)} y1="20" x2={pos(5)} y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
                  {[-1,0,1,2,3,4,5,6,7].map(n => { const x=pos(n); const m=n===1||n===5; return (<g key={n}><line x1={x} y1={m?12:16} x2={x} y2={24} stroke={m?INK:"#CBD5E1"} strokeWidth={m?2:1}/>{m&&<text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}</g>); })}
                  <circle cx={pos(1)} cy="20" r="8" fill="#F97316"/>
                  <circle cx={pos(5)} cy="20" r="8" fill={ACCENT}/>
                </>); })()}
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Solve: 3 &lt; 2x + 1 &lt; 11</div>
              <OptionList options={["1 < x < 5", "2 < x < 10"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 9: HARD 4 — word problem ── */}
        {idx === 9 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
                Inequalities model real-world problems.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: GRAY, marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Score needed to pass</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: ACCENT }}>45 (current)</span>
                  <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: GREEN }}>70 (target)</span>
                </div>
                <div style={{ height: 20, borderRadius: 99, background: "#E2E8F0", overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${(45/70)*100}%`, height: "100%", background: ACCENT, borderRadius: 99 }}/>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(45/70)*100}%`, right: 0, background: "repeating-linear-gradient(45deg,rgba(59,91,219,0.12) 0,rgba(59,91,219,0.12) 4px,transparent 4px,transparent 10px)", borderRadius: "0 99px 99px 0" }}/>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: GRAY, marginTop: 10 }}>
                  Needs <strong style={{ color: INK }}>m</strong> more marks to reach at least 70.
                </div>
              </div>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: MONO, fontSize: 20, fontWeight: 700, color: ACCENT, textAlign: "center" as const }}>
                45 + m ≥ 70
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>A student has 45 marks. They need at least 70 to pass. Which inequality shows the extra marks m needed?</div>
              <OptionList options={["45 + m ≥ 70", "45 + m > 70"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 10: HARD 5 — test values ── */}
        {idx === 10 && (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
                Substitute each value to test it.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {[{v:"-1", ok:true},{v:"3",ok:false},{v:"5",ok:false},{v:"7",ok:false}].map(row => (
                  <div key={row.v} style={{ display: "flex", alignItems: "center", gap: 14, background: row.ok ? "#E7F8EC" : "#FDECEC", borderRadius: 12, padding: "12px 18px" }}>
                    <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: INK, minWidth: 28 }}>{row.v}</div>
                    <div style={{ fontFamily: FONT, fontSize: 14, color: row.ok ? "#2CA555" : "#EF5A5A", flex: 1 }}>
                      {row.v} &lt; 3? <strong>{row.ok ? "Yes ✓" : "No ✗"}</strong>
                    </div>
                    {row.ok
                      ? <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
                    }
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK, marginBottom: 20 }}>Which values from &#123;−1, 3, 5, 7&#125; satisfy x &lt; 3?</div>
              <OptionList options={["−1 only", "−1 and 3"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 11: PRACTICE UNLOCKED ── */}
        {idx === 11 && (
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
            <div style={{ position: "relative", marginBottom: 20, width: 126, height: 126 }}>
              <div style={{ width: 126, height: 126, borderRadius: "50%", background: "rgba(59,91,219,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="70" height="70" viewBox="0 0 90 90" fill="none">
                  <line x1="10" y1="45" x2="80" y2="45" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/>
                  <polygon points="82,45 76,41 76,49" fill={INK}/>
                  <line x1="45" y1="80" x2="45" y2="10" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/>
                  <polygon points="45,8 41,14 49,14" fill={INK}/>
                  <line x1="20" y1="70" x2="70" y2="20" stroke={ACCENT} strokeWidth="2.8" strokeLinecap="round"/>
                  <polygon points="72,18 66,20 70,26" fill={ACCENT}/>
                  {[20,30,40,50,60,70].map((_,i)=>( <circle key={i} cx={20+i*10} cy={70-i*10} r="4.5" fill={ACCENT}/> ))}
                </svg>
              </div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.10em", marginBottom: 10 }}>PRACTICE UNLOCKED</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: INK, lineHeight: 1.1, marginBottom: 12, maxWidth: 520 }}>
              Now <span style={{ color: ACCENT }}>apply</span> what<br/>you&apos;ve learned.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "#475569", marginBottom: 28 }}>
              Pick the correct inequality for each question.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {[[1,2,3,4,5],[6,7,8,9,10]].map((row, ri) => (
                <div key={ri} style={{ display: "flex", gap: 12 }}>
                  {row.map((n, i) => {
                    const gi = ri*5+i;
                    return <div key={n} style={{ width: 42, height: 42, borderRadius: "50%", background: gi===0?ACCENT:"transparent", border: gi===0?"none":"2px solid #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: gi===0?"#fff":"#94A3B8" }}>{n}</div>;
                  })}
                </div>
              ))}
            </div>
            <button onClick={() => { setPicked(null); setIdx(12); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
              Start Practice
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}

        {/* ── Practice slides 12–21 ── */}
        {isPractice && (() => {
          const q  = PDATA[practiceStep];
          const nl = PNLDATA[practiceStep];
          const pos = (v: number) => 20 + (v - nl.start) / (nl.end - nl.start) * 290;
          return (
            <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK, lineHeight: 1.1, marginBottom: 24 }}>
                  Question <span style={{ color: ACCENT }}>{practiceStep + 1}.</span>
                </div>
                <svg viewBox="0 0 340 60" style={{ width: "100%", height: "auto", display: "block" }}>
                  <line x1="20" y1="20" x2="310" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                  <polygon points="314,20 304,15 304,25" fill="#CBD5E1"/>
                  {nl.ray?.dir === "right" && <line x1={pos(nl.ray.from)} y1="20" x2="310" y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>}
                  {nl.ray?.dir === "left"  && <line x1="20" y1="20" x2={pos(nl.ray.from)} y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>}
                  {nl.band && <line x1={pos(nl.band.from)} y1="20" x2={pos(nl.band.to)} y2="20" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.35"/>}
                  {nl.ticks.map(n => {
                    const x = pos(n);
                    const isMark = nl.marks.includes(n);
                    return (
                      <g key={n}>
                        <line x1={x} y1={isMark ? 12 : 16} x2={x} y2={24} stroke={isMark ? INK : "#CBD5E1"} strokeWidth={isMark ? 2 : 1}/>
                        {isMark && <text x={x} y="46" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>{n}</text>}
                      </g>
                    );
                  })}
                  {nl.dots.map(d => <circle key={d.val} cx={pos(d.val)} cy="20" r="8" fill={d.color}/>)}
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: INK, marginBottom: 20 }}>{q.q}</div>
                <OptionList options={q.opts} correct={q.cor} picked={picked} onPick={setPicked} />
              </div>
            </div>
          );
        })()}

        {/* ── Slide 22: SCORE ── */}
        {idx === 22 && (() => {
          const msg = practiceScore === 10 ? { text: "Perfect!", color: GREEN }
            : practiceScore >= 8 ? { text: "Great work.", color: GREEN }
            : practiceScore >= 6 ? { text: "Good work.", color: ACCENT }
            : practiceScore >= 4 ? { text: "Good effort.", color: RED }
            : { text: "Keep practising.", color: RED };
          return (
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.12em", marginBottom: 20 }}>SAT QUESTIONS</div>
              <div style={{ marginBottom: 12, lineHeight: 1 }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK }}>{practiceScore}</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 56, color: GRAY }}>/10</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: msg.color, marginBottom: 36 }}>{msg.text}</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 44 }}>
                {practiceResults.map((r, i) => (
                  <div key={i} style={{ width: 60, height: 60, borderRadius: 14, background: r===true?GREEN:r===false?RED:"#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {r===true  && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l7 7 11-11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    {r===false && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 6l14 14M20 6L6 20" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/></svg>}
                  </div>
                ))}
              </div>
              <button onClick={() => setIdx(i => i+1)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 48px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                Continue
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          );
        })()}

        {/* ── Slide 18: COMPLETE ── */}
        {isLast && (
          <div style={{ position: "relative", zIndex: 1, padding: "36px 52px 140px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GREENBG, borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
                <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN}/><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12, color: GREEN_DK, letterSpacing: "0.09em" }}>LESSON COMPLETE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 18 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, lineHeight: 0.92 }}>Linear<br/>Inequalities</div>
                <div style={{ position: "relative", width: 76, height: 76, flexShrink: 0 }}>
                  <svg width="76" height="76" viewBox="0 0 76 76" style={{ position: "absolute", inset: 0 }}>
                    {[[38,4,38,14],[38,62,38,72],[4,38,14,38],[62,38,72,38],[11,11,18,18],[58,58,65,65],[11,65,18,58],[65,11,58,18]].map(([x1,y1,x2,y2],i)=>(
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
                    ))}
                  </svg>
                  <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M5 15l8 8 12-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
              <div style={{ height: 1.5, background: "rgba(59,91,219,0.12)", maxWidth: 460, marginBottom: 24 }}/>
              <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", maxWidth: 460 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: GREENBG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8 }}>Your Progress</div>
                  <ProgressPills filled={completeFilled} total={10} color={GREEN} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: GREEN }}>80%</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY }}>Mastery</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "75%" }}><IneqGraphic color={GREEN} /></div>
            </div>
          </div>
        )}

        {/* ── Bottom bar ── */}
        {isLast ? (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, color: "#475569" }}>
              You can now read and write all four inequality symbols.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: GRAY, cursor: "pointer" }}>Back to lessons</button>
              <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: GREEN, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(44,165,85,0.35)" }}>
                Next lesson <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        ) : idx === 11 || idx === 22 ? null : (() => {
          if (!isQuestionSlide || picked === null) {
            return (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {!isFirst
                  ? <button onClick={() => { setPicked(null); setIdx(i => i - 1); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: INK, cursor: "pointer" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      BACK
                    </button>
                  : <div />
                }
                {isQuestionSlide
                  ? <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: GRAY }}>Pick an answer to continue</div>
                  : <button onClick={() => { setPicked(null); setIdx(i => i + 1); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: ACCENT, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                      CONTINUE <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                }
              </div>
            );
          }
          const isCorrect = picked === correctForIdx;
          return (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: isCorrect ? GREENBG : "#FDECEC", borderTop: `2px solid ${isCorrect ? GREEN : RED}` }}>
              <button onClick={handleContinue} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: isCorrect ? GREEN_DK : RED, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: `0 4px 0 ${isCorrect ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink: 0 }}>
                CONTINUE <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          );
        })()}

      </div>
    </>
  );
}
