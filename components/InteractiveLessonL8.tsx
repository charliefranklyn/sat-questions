"use client";
import { useState, useEffect } from "react";
import ChatPanel, { CHAT_W } from "@/components/ChatPanel";
import { useIsMobile } from "@/hooks/useIsMobile";

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

// ── Intro graphic ────────────────────────────────────────────────────────────
function SolveGraphic({ color = ACCENT }: { color?: string }) {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", height: "auto", display: "block" }}>
      <circle cx="200" cy="200" r="170" fill="rgba(59,91,219,0.07)"/>
      <text x="200" y="185" textAnchor="middle" fontFamily={MONO} fontSize="42" fontWeight="900" fill={color} opacity="0.9">6x + 8 ≤ 50</text>
      <text x="200" y="228" textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="600" fill={color} opacity="0.4">solve for x</text>
      <text x="200" y="288" textAnchor="middle" fontFamily={MONO} fontSize="42" fontWeight="900" fill={color} opacity="0.5">x ≤ 7</text>
    </svg>
  );
}

// ── Progress pills ────────────────────────────────────────────────────────────
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
function EdHeader({ onChatOpen, isMobile }: { onChatOpen?: () => void; isMobile?: boolean }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(226,232,240,0.6)", padding: isMobile ? "0 16px" : "0 52px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="28" height="28" viewBox="264 271 552 537" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="l8-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe"/><stop offset=".77" stopColor="#1c45f6"/>
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l8-logo-grad)"/>
          <path d="M523.2,510.9c-5.5-16.4-17.2-29.9-32.2-38.6-6.8-3.9-15.2-7.6-25.1-9.8-24.1-5.4-43.5.6-51.1,3.4-8.5,3.7-33.3,15.9-46.7,43.7-12.6,26.3-10.9,57.9,3.5,85.5,6.9,13.2,17.4,24.2,30.4,31.4,12.1,6.7,29.3,13.3,50.6,13,33.8-.5,57.2-18,66.9-26.8,2.5-2.2,2.7-6,.6-8.6l-18.2-21.9c-1.8-2.1-5-2.5-7.2-.8-21.1,16.4-46.7,19.6-64.3,8.8-9.6-5.9-14.8-14.9-17.6-21.3-.3-.8.2-1.7,1-1.8l101.1-14.8c6.5-.95,11.4-6.4,11.8-13,.4-7.6-.2-17.4-3.7-28.1Zm-48.4,14-63.7,9.5c-.7.1-1.3-.45-1.3-1.15.2-4.8,1.8-19.9,14.7-29.3,11-7.9,28.2-10.3,40.1-.9,8.5,6.7,10.6,16.6,11.2,20.6.1.6-.3,1.2-.94,1.25Z" fill="#fff"/>
          <path d="M714.8,627.5l-2.2-12c-.4-2.1-.6-4.2-.6-6.3V399.4c0-4.2-3.8-7.3-7.9-6.5l-36.8,7.3c-3.2.6-5.4,3.4-5.4,6.6v71.3c-8.1-9.1-20.6-17.4-47.1-17.4-13.9,0-26.4,4.4-37.7,11.1-11.3,6.7-20.2,16.7-26.9,29.8-6.6,13.1-9.9,29.2-9.9,48.2,0,18.8,3.3,34.8,9.8,47.95s15.4,23.2,26.6,30.1c11.2,6.9,23.9,10.4,38.1,10.4,10.3,0,18.9-1.6,25.7-4.9,6.8-3.3,13.9-7.4,18.1-12,2-2.2,4.5-4.8,6.9-7.4l.8,13.8c.3,3.7,3.4,6.6,7.1,6.6h35.9c3.6,0,6.4-3.3,5.7-6.9Zm-51.4-54.3c-1.2,2.3-9.7,13.8-18.4,17.9-3.7,1.7-8.4,3.3-14,3.3-7.7,0-14.6-.95-20.7-4.7-6.1-3.7-10.9-9.2-14.5-16.3s-5.3-15.8-5.3-25.97c0-10.3,1.8-19,5.4-26.1,3.6-7.1,7.1-11.5,13.2-15.1,6.1-3.6,13-5.5,20.5-5.5,18.8,0,30,10.7,33.8,16.9v55.7Z" fill="#fff"/>
        </svg>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.01em" }}>EdAccelerator</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onChatOpen && (
          <button onClick={onChatOpen} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: ACCENT }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Chat
          </button>
        )}
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4e7efe 0%,#1c45f6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>C</span>
        </div>
      </div>
    </div>
  );
}

// ── Market breakdown visual ───────────────────────────────────────────────────
function MarketTable() {
  return (
    <div>
      <div style={{ background: "#F8FAFC", borderRadius: 14, overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: 12 }}>
        <div style={{ background: INK, padding: "10px 18px" }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Market visit</span>
        </div>
        {[{ label: "Entry fee", value: "$8" }, { label: "Cost per item", value: "$6" }].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderTop: "1px solid #E2E8F0", background: "#fff" }}>
            <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "#475569" }}>{row.label}</span>
            <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: INK }}>{row.value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(56,199,107,0.08)", border: "1.5px solid #38C76B", borderRadius: 12, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: GREEN_DK }}>You have a budget of</span>
        <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color: GREEN_DK }}>$50</span>
      </div>
    </div>
  );
}

// ── Slide manifest ────────────────────────────────────────────────────────────
const SLIDES = [
  { id: "intro"             }, // 0
  { id: "market_guess"      }, // 1  Q
  { id: "ineq_form"         }, // 2  Q
  { id: "why_equals"        }, // 3  Q
  { id: "check_working"     }, // 4  Q
  { id: "solve1"            }, // 5  Q
  { id: "solve2"            }, // 6  Q
  { id: "solve3"            }, // 7  Q
  { id: "practice_unlocked" }, // 8
  { id: "p1"  }, { id: "p2"  }, { id: "p3"  }, { id: "p4"  }, { id: "p5"  },
  { id: "p6"  }, { id: "p7"  }, { id: "p8"  }, { id: "p9"  }, { id: "p10" },
  { id: "score"             }, // 19
  { id: "complete"          }, // 20
];

const PROGRESS = [
  0.04, 0.14, 0.24, 0.34, 0.44, 0.56, 0.68, 0.80,
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
];

const LESSON_CORRECT: Record<number, number> = { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 1, 7: 1 };
const PRACTICE_CORRECT = [0, 1, 1, 0, 2, 2, 0, 1, 0, 2]; // A B B A C C A B A C

const EXPLAIN_DATA: Record<number, [string, string]> = {
  1: ["$50 − $8 = $42 left. $42 ÷ $6 = 7 items. The maximum is 7.", "Subtract the entry fee first: $50 − $8 = $42. Then divide by the cost per item: $42 ÷ $6 = 7."],
  2: ["Each item costs $6 (6x), plus the $8 entry fee, must stay at or under $50 — so 6x + 8 ≤ 50.", "The entry fee is added once ($8). Each item costs $6 (6x). Can't exceed $50, so the symbol is ≤ not ≥."],
  3: ["The algebra steps — subtracting, dividing — work identically. The symbol tells you what the answer means, not how to find it.", "The steps are the same whether it's = or ≤. The symbol only affects how you interpret the final answer."],
  4: ["Subtract 8 from both sides (6x ≤ 42), then divide by 6 (x ≤ 7). The ≤ carries through each step.", "The working is correct — subtract 8 first, then divide by 6. The ≤ symbol is preserved throughout."],
  5: ["5x + 3 ≤ 33 → subtract 3: 5x ≤ 30 → divide by 5: x ≤ 6.", "Subtract 3 from both sides first, then divide by 5. 5x ≤ 30 → x ≤ 6."],
  6: ["4x − 2 ≥ 18 → add 2: 4x ≥ 20 → divide by 4: x ≥ 5.", "Add 2 to both sides first: 4x ≥ 20. Then divide by 4: x ≥ 5."],
  7: ["7x + 4 ≤ 46 → subtract 4: 7x ≤ 42 → divide by 7: x ≤ 6.", "Subtract 4 first: 7x ≤ 42. Then divide by 7: x ≤ 6."],
};

const TIP_DATA: Record<number, string> = {
  1: "Subtract the $8 entry fee from your $50 budget first, then divide by the cost per item.",
  2: "What's the fixed cost? What varies per item? Which symbol means 'at most'?",
  3: "Think about what changes between = and ≤ when you add or subtract on both sides.",
  4: "Check each line: does 6x+8≤50 → 6x≤42 → x≤7 follow correctly?",
  5: "Swap ≤ for = : 5x+3=33. Solve for x, then restore the ≤ sign.",
  6: "Swap ≥ for = : 4x−2=18. Solve for x, then restore the ≥ sign.",
  7: "Swap ≤ for = : 7x+4=46. Solve for x, then restore the ≤ sign.",
};

const PDATA = [
  { q: "What is x?", ineq: "3x + 5 ≤ 29", steps: ["3x + 5 ≤ 29", "3x ≤ 24", "x ≤ 8"], opts: ["x ≤ 8", "x ≤ 7", "x ≤ 9"], cor: 0 }, // A
  { q: "What is x?", ineq: "2x + 6 ≥ 14", steps: ["2x + 6 ≥ 14", "2x ≥ 8",  "x ≥ 4"], opts: ["x ≥ 3", "x ≥ 4", "x ≥ 5"], cor: 1 }, // B
  { q: "What is x?", ineq: "4x − 2 ≤ 22", steps: ["4x − 2 ≤ 22", "4x ≤ 24", "x ≤ 6"], opts: ["x ≤ 5", "x ≤ 6", "x ≤ 7"], cor: 1 }, // B (break A B C)
  { q: "What is x?", ineq: "5x + 1 ≥ 21", steps: ["5x + 1 ≥ 21", "5x ≥ 20", "x ≥ 4"], opts: ["x ≥ 4", "x ≥ 3", "x ≥ 5"], cor: 0 }, // A
  { q: "What is x?", ineq: "6x − 3 ≤ 33", steps: ["6x − 3 ≤ 33", "6x ≤ 36", "x ≤ 6"], opts: ["x ≤ 7", "x ≤ 5", "x ≤ 6"], cor: 2 }, // C
  { q: "What is x?", ineq: "3x + 7 ≥ 22", steps: ["3x + 7 ≥ 22", "3x ≥ 15", "x ≥ 5"], opts: ["x ≥ 6", "x ≥ 4", "x ≥ 5"], cor: 2 }, // C
  { q: "What is x?", ineq: "8x − 4 ≤ 44", steps: ["8x − 4 ≤ 44", "8x ≤ 48", "x ≤ 6"], opts: ["x ≤ 6", "x ≤ 7", "x ≤ 5"], cor: 0 }, // A
  { q: "What is x?", ineq: "7x + 3 ≥ 38", steps: ["7x + 3 ≥ 38", "7x ≥ 35", "x ≥ 5"], opts: ["x ≥ 4", "x ≥ 5", "x ≥ 6"], cor: 1 }, // B
  { q: "What is x?", ineq: "9x − 5 ≤ 49", steps: ["9x − 5 ≤ 49", "9x ≤ 54", "x ≤ 6"], opts: ["x ≤ 6", "x ≤ 7", "x ≤ 5"], cor: 0 }, // A
  { q: "What is x?", ineq: "4x + 8 ≥ 36", steps: ["4x + 8 ≥ 36", "4x ≥ 28", "x ≥ 7"], opts: ["x ≥ 6", "x ≥ 8", "x ≥ 7"], cor: 2 }, // C
];

// ── Main component ────────────────────────────────────────────────────────────
export default function InteractiveLessonL8({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen]   = useState(false);
  const [idx, setIdx]             = useState(0);
  const [picked, setPicked]       = useState<number | null>(null);
  const [practiceResults, setPracticeResults] = useState<(boolean|null)[]>(Array(10).fill(null));
  const [completeFilled, setCompleteFilled]   = useState(1);

  const slidePad = isMobile ? "16px 16px 80px"  : "28px 52px 100px";
  const cols2    = isMobile ? "1fr"              : "1fr 1fr";
  const barPad   = isMobile ? "12px 16px"        : "20px 52px";
  const heroFs   = isMobile ? 32                 : 56;

  const isLast        = idx === SLIDES.length - 1;
  const isFirst       = idx === 0;
  const isPractice    = idx >= 9 && idx <= 18;
  const practiceStep  = isPractice ? idx - 9 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isLessonQ     = idx >= 1 && idx <= 7;
  const isQuestionSlide = isLessonQ || isPractice;

  useEffect(() => {
    if (isLast) {
      setCompleteFilled(7);
      const t = setTimeout(() => setCompleteFilled(8), 600);
      return () => clearTimeout(t);
    }
  }, [idx, isLast]);

  const correctForIdx = isPractice ? PRACTICE_CORRECT[practiceStep] : (LESSON_CORRECT[idx] ?? 0);
  const tipMessage    = isLessonQ ? TIP_DATA[idx] : undefined;
  const autoMessage   = (picked !== null && isLessonQ && EXPLAIN_DATA[idx])
    ? picked === LESSON_CORRECT[idx]
      ? `Well done! ${EXPLAIN_DATA[idx][0]}`
      : `Not quite. ${EXPLAIN_DATA[idx][1]}`
    : undefined;

  const handleContinue = () => {
    if (isPractice) {
      const ok = picked === PRACTICE_CORRECT[practiceStep];
      setPracticeResults(r => { const n = [...r]; n[practiceStep] = ok; return n; });
    }
    setPicked(null);
    setIdx(i => i + 1);
  };

  if (isMobile) return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: FONT, flexDirection: "column", gap: 16, padding: 24, textAlign: "center" }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#94A3B8" strokeWidth="1.5"/><circle cx="12" cy="17" r="1" fill="#94A3B8"/></svg>
      <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Desktop only</div>
      <div style={{ fontSize: 14, color: GRAY, maxWidth: 240, lineHeight: 1.6 }}>These lessons are not yet available on mobile. Please open on a desktop or laptop to continue.</div>
    </div>
  );

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
        mobileOpen={chatOpen}
        onMobileClose={() => setChatOpen(false)}
      />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: isMobile ? 0 : CHAT_W, background: "#fff", fontFamily: FONT, zIndex: 100, overflowY: "auto" }}>

        <EdHeader onChatOpen={isMobile ? () => setChatOpen(true) : undefined} isMobile={isMobile} />

        {/* Progress bar */}
        <div style={{ position: "relative", zIndex: 1, padding: isMobile ? "12px 16px 0" : "20px 52px 0", display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          {isPractice ? (
            <div style={{ flex: 1, display: "flex", gap: 5 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: i < practiceStep ? (practiceResults[i] === false ? RED : ACCENT) : i === practiceStep ? ACCENT : "#E2E8F0", transition: "background 0.3s" }} />
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
          <div style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 10 }}>Today&apos;s lesson</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: heroFs, color: INK, lineHeight: 0.95, marginBottom: 14 }}>Solving<br/>Inequalities</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
                Learn how to solve inequalities like <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>6x + 8 ≤ 50</span> step by step — and apply them to real problems.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6 }}>Your progress</div>
                  <ProgressPills filled={7} total={8} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: ACCENT }}>80%</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>Mastery</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "75%" }}><SolveGraphic /></div>
            </div>
          </div>
        )}

        {/* ── Slide 1: MARKET GUESS ── */}
        {idx === 1 && (
          <div style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 10 }}>
                What can you afford?
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                Imagine you have $50 to spend at a market.<br/>There&apos;s an $8 entry fee and each item costs $6.
              </div>
              {/* 6 item boxes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {["🎨 Art print","🧴 Candle","📚 Book","🎸 Pick set","🌿 Plant","🍫 Chocolates"].map((item) => (
                  <div key={item} style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 24 }}>{item.split(" ")[0]}</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#475569", textAlign: "center" as const }}>{item.split(" ").slice(1).join(" ")}</div>
                    <div style={{ background: ACCENT, borderRadius: 99, padding: "2px 10px", fontFamily: MONO, fontSize: 12, fontWeight: 800, color: "#fff" }}>$6</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>How many items can you afford to buy?</div>
              </div>
              <OptionList options={["6 items", "7 items", "8 items"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 2: INEQUALITY FORM ── */}
        {idx === 2 && (
          <div style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 10 }}>
                We can turn this scenario into an <span style={{ color: ACCENT }}>inequality</span>.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                Imagine you have $50 to spend at a market.<br/>There&apos;s an $8 entry fee and each item costs $6.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {["🎨 Art print","🧴 Candle","📚 Book","🎸 Pick set","🌿 Plant","🍫 Chocolates"].map((item) => (
                  <div key={item} style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 24 }}>{item.split(" ")[0]}</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#475569", textAlign: "center" as const }}>{item.split(" ").slice(1).join(" ")}</div>
                    <div style={{ background: ACCENT, borderRadius: 99, padding: "2px 10px", fontFamily: MONO, fontSize: 12, fontWeight: 800, color: "#fff" }}>$6</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Can you guess how this becomes an inequality?</div>
              </div>
              <OptionList options={["6x + 8 ≤ 50", "6x + 8 ≥ 50", "6x − 8 ≤ 50"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 3: WHY = SIGN ── */}
        {idx === 3 && (
          <div style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
                To <span style={{ color: ACCENT }}>solve</span> an inequality, just treat the symbol as an <span style={{ color: ACCENT }}>= sign</span>.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ background: "rgba(59,91,219,0.08)", borderRadius: 10, padding: "10px 16px", fontFamily: MONO, fontSize: 20, fontWeight: 800, color: ACCENT }}>6x + 8 ≤ 50</div>
                  <svg width="32" height="16" viewBox="0 0 32 16" fill="none"><path d="M2 8h28M22 2l8 6-8 6" stroke={GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div style={{ background: "rgba(59,91,219,0.08)", borderRadius: 10, padding: "10px 16px", fontFamily: MONO, fontSize: 20, fontWeight: 800, color: ACCENT }}>6x + 8 = 50</div>
                </div>
                <div style={{ background: "#FFF7E6", border: "1.5px solid #F59E0B", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round"/></svg>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#92400E", lineHeight: 1.5 }}>
                    <strong>Hint:</strong> You can then solve the equation like any normal equation.
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Why can you swap the inequality for an = sign?</div>
              </div>
              <OptionList options={["Because they mean the same thing", "Because the algebra steps work the same either way", "Because the symbol doesn't matter"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 4: CHECK WORKING ── */}
        {idx === 4 && (
          <div style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 8 }}>
                Imagine you are trying to solve 6x + 8 ≤ 50.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                To solve it, treat it as 6x + 8 = 50.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { expr: "6x + 8 ≤ 50", note: "start" },
                  { expr: "6x ≤ 42",      note: "− 8" },
                  { expr: "x ≤ 7",        note: "÷ 6", highlight: true },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                    <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: row.highlight ? 900 : 600, color: row.highlight ? ACCENT : INK }}>{row.expr}</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: row.highlight ? ACCENT : GRAY, background: row.highlight ? "rgba(59,91,219,0.08)" : "transparent", padding: "3px 8px", borderRadius: 6 }}>{row.note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Does this working look correct?</div>
              </div>
              <OptionList options={["Yes — correct", "No — incorrect"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slides 5-7: SOLVE PRACTICE ── */}
        {[
          { label: "Now you try.",       hint: "Hint: swap the ≤ for = first, then solve.", ineq: "5x + 3 ≤ 33", steps: ["5x + 3 ≤ 33", "5x ≤ 30", "x ≤ 6"], opts: ["x ≤ 5", "x ≤ 6", "x ≤ 7"], cor: 1 },
          { label: "Here's another one.", hint: "Hint: swap the ≥ for = first, then solve.", ineq: "4x − 2 ≥ 18", steps: ["4x − 2 ≥ 18", "4x ≥ 20", "x ≥ 5"], opts: ["x ≥ 4", "x ≥ 5", "x ≥ 6"], cor: 1 },
          { label: "And a final one.",    hint: "Hint: swap the ≤ for = first, then solve.", ineq: "7x + 4 ≤ 46", steps: ["7x + 4 ≤ 46", "7x ≤ 42", "x ≤ 6"], opts: ["x ≤ 5", "x ≤ 6", "x ≤ 7"], cor: 1 },
        ].map((slide, offset) => idx === 5 + offset && (
          <div key={offset} style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 8 }}>{slide.label}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>{slide.hint}</div>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 900, color: ACCENT }}>{slide.ineq}</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>What is x?</div>
              </div>
              <OptionList options={slide.opts} correct={slide.cor} picked={picked} onPick={setPicked} />
            </div>
          </div>
        ))}

        {/* ── Slide 8: PRACTICE UNLOCKED ── */}
        {idx === 8 && (
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px 16px 60px" : "24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
            <div style={{ position: "relative", marginBottom: 20, width: 126, height: 126 }}>
              <div style={{ width: 126, height: 126, borderRadius: "50%", background: "rgba(59,91,219,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                  <text x="40" y="52" textAnchor="middle" fontFamily={MONO} fontSize="40" fontWeight="900" fill={ACCENT}>≤</text>
                </svg>
              </div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.10em", marginBottom: 10 }}>PRACTICE UNLOCKED</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: INK, lineHeight: 1.1, marginBottom: 12, maxWidth: 520 }}>
              Now <span style={{ color: ACCENT }}>solve</span> these<br/>inequalities.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "#475569", marginBottom: 28 }}>
              Swap the symbol for = , solve, then put the symbol back.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {[[1,2,3,4,5],[6,7,8,9,10]].map((row, ri) => (
                <div key={ri} style={{ display: "flex", gap: 12 }}>
                  {row.map((n, i) => {
                    const gi = ri * 5 + i;
                    return <div key={n} style={{ width: 42, height: 42, borderRadius: "50%", background: gi === 0 ? ACCENT : "transparent", border: gi === 0 ? "none" : "2px solid #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: gi === 0 ? "#fff" : "#94A3B8" }}>{n}</div>;
                  })}
                </div>
              ))}
            </div>
            <button onClick={() => { setPicked(null); setIdx(9); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
              Start Practice
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}

        {/* ── Practice slides 9–18 ── */}
        {isPractice && (() => {
          const q = PDATA[practiceStep];
          return (
            <div style={{ position: "relative", zIndex: 1, padding: slidePad, display: "grid", gridTemplateColumns: cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK, lineHeight: 1.1, marginBottom: 24 }}>
                  Question <span style={{ color: ACCENT }}>{practiceStep + 1}.</span>
                </div>
                <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 900, color: ACCENT }}>{q.ineq}</span>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: GRAY, marginBottom: 8, letterSpacing: "0.05em" }}>Steps</div>
                <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 0 }}>
                  {q.steps.map((step, i, arr) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                      <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: i === arr.length - 1 ? 900 : 600, color: i === arr.length - 1 ? ACCENT : INK }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>{q.q}</div>
                </div>
                <OptionList options={q.opts} correct={q.cor} picked={picked} onPick={setPicked} />
              </div>
            </div>
          );
        })()}

        {/* ── Slide 19: SCORE ── */}
        {idx === 19 && (() => {
          const msg = practiceScore === 10 ? { text: "Perfect!", color: GREEN }
            : practiceScore >= 8 ? { text: "Great work.", color: GREEN }
            : practiceScore >= 6 ? { text: "Good work.", color: ACCENT }
            : practiceScore >= 4 ? { text: "Good effort.", color: RED }
            : { text: "Keep practising.", color: RED };
          return (
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px 16px 60px" : "24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.12em", marginBottom: 20 }}>SAT QUESTIONS</div>
              <div style={{ marginBottom: 12, lineHeight: 1 }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK }}>{practiceScore}</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: heroFs, color: GRAY }}>/10</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: msg.color, marginBottom: 36 }}>{msg.text}</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 44 }}>
                {practiceResults.map((r, i) => (
                  <div key={i} style={{ width: 60, height: 60, borderRadius: 14, background: r === true ? GREEN : r === false ? RED : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {r === true  && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l7 7 11-11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    {r === false && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 6l14 14M20 6L6 20" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/></svg>}
                  </div>
                ))}
              </div>
              <button onClick={() => setIdx(i => i + 1)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 48px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                Continue
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          );
        })()}

        {/* ── Slide 20: COMPLETE ── */}
        {isLast && (
          <div style={{ position: "relative", zIndex: 1, padding: isMobile ? "16px 16px 80px" : "36px 52px 140px", display: "grid", gridTemplateColumns: cols2, gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GREENBG, borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
                <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN}/><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12, color: GREEN_DK, letterSpacing: "0.09em" }}>LESSON COMPLETE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 18 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, lineHeight: 0.92 }}>Solving<br/>Inequalities</div>
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
                  <ProgressPills filled={completeFilled} total={8} color={GREEN} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: GREEN }}>90%</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY }}>Mastery</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "75%" }}><SolveGraphic color={GREEN} /></div>
            </div>
          </div>
        )}

        {/* ── Bottom bar ── */}
        {isLast ? (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: isMobile ? 0 : CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: barPad, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, color: "#475569" }}>
              You can now solve inequalities step by step.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: GRAY, cursor: "pointer" }}>Back to lessons</button>
              <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: GREEN, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(44,165,85,0.35)" }}>
                Done <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        ) : idx === 8 || idx === 19 ? null : (() => {
          if (!isQuestionSlide || picked === null) {
            return (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: isMobile ? 0 : CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: barPad, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div style={{ position: "fixed", bottom: 0, left: 0, right: isMobile ? 0 : CHAT_W, zIndex: 10, padding: isMobile ? "12px 16px" : "14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: isCorrect ? GREENBG : "#FDECEC", borderTop: `2px solid ${isCorrect ? GREEN : RED}` }}>
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
