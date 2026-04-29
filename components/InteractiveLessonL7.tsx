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
function EdHeader({ onChatOpen, isMobile }: { onChatOpen?: () => void; isMobile?: boolean }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(226,232,240,0.6)", padding: isMobile ? "0 16px" : "0 52px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
  { id: "hard6"             }, // 11 Q  painter word problem
  { id: "practice_unlocked" }, // 12
  { id: "p1"  }, { id: "p2"  }, { id: "p3"  }, { id: "p4"  }, { id: "p5"  },
  { id: "p6"  }, { id: "p7"  }, { id: "p8"  }, { id: "p9"  }, { id: "p10" },
  { id: "score"             }, // 23
  { id: "complete"          }, // 24
];

const PROGRESS = [
  0.04, 0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.56, 0.62, 0.68, 0.74, 0.80,
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
];

// Lesson Q correct answers (idx 1–11)
const LESSON_CORRECT: Record<number, number> = { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0, 10: 1, 11: 0 };

// Practice correct answers (idx 13–22)
const PRACTICE_CORRECT = [0, 1, 0, 1, 0, 1, 0, 1, 0, 0]; // A B A B A B A B A A

const EXPLAIN_DATA: Record<number, [string, string]> = {
  1: ["The elephant weighs more — so its value is greater. The symbol opens towards the larger value, so Elephant > Mouse.", "The > symbol opens towards the bigger value. The elephant is heavier, so Elephant > Mouse."],
  2: ["10 is greater than 3 — so 10 > 3.", "The > symbol means 'greater than'. 10 is bigger, so 10 > 3, not 10 < 3."],
  3: ["5 is less than 12 — so 5 < 12.", "The < symbol means 'less than'. 5 is smaller than 12, so 5 < 12."],
  4: ["'At least 5' means 5 or more — that's ≥.", "'At least' means the minimum is 5 — it could be 5, 6, 7... That's x ≥ 5."],
  5: ["'No more than 10' means 10 or less — that's ≤.", "'No more than' means the maximum is 10. That's x ≤ 10, not x ≥ 10."],
  6: ["Sam is 128cm — the only one above the 120cm minimum. 128 ≥ 120 ✓", "The requirement is height ≥ 120. Only Sam at 128cm satisfies this. Alex (112), Mia (108) and Jake (117) are all below 120."],
  7: ["Only −1 satisfies x < 3. Substituting: −1 < 3 ✓. But 3 < 3 is false, and 5, 7 are greater than 3.", "Check each value: does it make x < 3 true? Only −1 does."],
  8: ["5, 8 and 11 all satisfy x ≥ 5. The ≥ symbol includes equal to, so 5 itself counts. 2 is less than 5.", "≥ means greater than OR equal to. So 5 counts, and anything above 5 counts too. Only 2 is too small."],
  9: ["45 + m ≥ 70 means she needs at least 25 more marks.", "'At least 70' means ≥ 70. Her current marks plus extra m gives 45 + m ≥ 70."],
  10: ["You can't go over $20 — so the total must be ≤ 20. That's 3x + 5 ≤ 20.", "The total cost is 3x + 5. It must not exceed $20, so we use ≤, not ≥ or =."],
  11: ["The total cost is 20 + 15h. It must not exceed $80, so 20 + 15h ≤ 80.", "The callout fee is fixed at $20. Each hour costs $15. Total must stay within $80 budget — that's ≤."],
};

const TIP_DATA: Record<number, string> = {
  1: "Think about which animal weighs more. The > symbol opens towards the heavier side.",
  2: "Which number is bigger — 10 or 3? The > symbol means 'greater than'.",
  3: "Which is smaller — 5 or 12? The < symbol means 'less than'.",
  4: "'At least' means that value or more. Which symbol includes equal to?",
  5: "'No more than' means that value or less. Which symbol allows equal to?",
  6: "The minimum is 120cm. Which person's height is greater than or equal to 120?",
  7: "Substitute each value into x < 3. Which ones make it true?",
  8: "≥ means greater than or equal to. Which values are 5 or more?",
  9: "'At least 70' — which symbol means at least?",
  10: "You have $20 to spend. Can the total go over $20? Which symbol means 'at most'?",
  11: "The total is callout fee + (cost per hour × hours). It must stay within budget. Which symbol means 'at most'?",
};

// Practice questions
const PDATA = [
  // Q1-Q2: simple number line comparisons
  { q: "Which symbol goes in the blank?  8 ___ 3", opts: ["8 > 3", "8 < 3"], cor: 0 },
  { q: "Which is correct?", opts: ["2 > 9", "2 < 9"], cor: 1 },
  // Q3-Q5: pick values that satisfy
  { q: "Which values from {1, 4, 6, 9} satisfy x > 5?", opts: ["6 and 9", "4, 6 and 9"], cor: 0 },
  { q: "Which values from {0, 3, 7, 10} satisfy x ≤ 3?", opts: ["0, 3 and 7", "0 and 3"], cor: 1 },
  { q: "Which values from {2, 5, 8, 11} satisfy x ≥ 8?", opts: ["8 and 11", "5, 8 and 11"], cor: 0 },
  // Q6-Q10: real world (breakdown table format)
  { q: "Which inequality shows the hours h you can book?", opts: ["30 + 45h ≥ 210", "30 + 45h ≤ 210"], cor: 1 }, // B
  { q: "Which inequality shows the hours h?", opts: ["15 + 20h ≤ 95", "15 + 20h ≥ 95"], cor: 0 },              // A
  { q: "Which inequality shows the number of people p?", opts: ["50 + 8p ≥ 130", "50 + 8p ≤ 130"], cor: 1 },   // B
  { q: "Which inequality shows the km x you can travel?", opts: ["3x + 5 ≤ 26", "3x + 5 ≥ 26"], cor: 0 },      // A
  { q: "Which inequality shows the hours h you can book?", opts: ["25 + 30h ≤ 175", "25 + 30h ≥ 175"], cor: 0 }, // A (break pattern)
];

type PTableData = { title: string; sub: string; rows: { label: string; value: string }[]; budget: string } | null;
const PTABLE: PTableData[] = [
  null, null, null, null, null, // Q1-Q5: number line
  { title: "Electrician fees",  sub: "An electrician charges a $30 callout fee plus $45 per hour. You have $210 to spend.", rows: [{ label: "Callout fee", value: "$30" }, { label: "Per hour", value: "$45" }], budget: "$210" },
  { title: "Cleaning service",  sub: "A cleaner charges a $15 booking fee plus $20 per hour. You have $95 to spend.",    rows: [{ label: "Booking fee", value: "$15" }, { label: "Per hour",    value: "$20" }], budget: "$95"  },
  { title: "Party planning",    sub: "A party venue charges $50 hire plus $8 per person. You have $130 to spend.",        rows: [{ label: "Venue hire",  value: "$50" }, { label: "Per person",  value: "$8"  }], budget: "$130" },
  { title: "Taxi fare",         sub: "A taxi charges a $5 booking fee plus $3 per km. You have $26 to spend.",            rows: [{ label: "Booking fee", value: "$5"  }, { label: "Per km",     value: "$3"  }], budget: "$26"  },
  { title: "Gardener fees",     sub: "A gardener charges $25 callout plus $30 per hour. You have $175 to spend.",         rows: [{ label: "Callout fee", value: "$25" }, { label: "Per hour",    value: "$30" }], budget: "$175" },
];

const PNLDATA: { start: number; end: number; marks: number[]; ticks: number[]; dots: { val: number; color: string }[]; ray?: { from: number; dir: "left" | "right" }; band?: { from: number; to: number } }[] = [
  // Q1: 8 vs 3
  { start:0,  end:10, marks:[3,8],  ticks:[0,1,2,3,4,5,6,7,8,9,10],         dots:[{val:3,color:"#F97316"},{val:8,color:ACCENT}] },
  // Q2: 2 vs 9
  { start:0,  end:10, marks:[2,9],  ticks:[0,1,2,3,4,5,6,7,8,9,10],         dots:[{val:2,color:"#F97316"},{val:9,color:ACCENT}] },
  // Q3: {1,4,6,9} satisfy x>5 → 6,9
  { start:0,  end:10, marks:[1,4,6,9],  ticks:[0,1,2,3,4,5,6,7,8,9,10], dots:[{val:1,color:"#F97316"},{val:4,color:"#F97316"},{val:6,color:ACCENT},{val:9,color:ACCENT}] },
  // Q4: {0,3,7,10} satisfy x≤3 → 0,3
  { start:0,  end:11, marks:[0,3,7,10], ticks:[0,1,2,3,4,5,6,7,8,9,10,11], dots:[{val:0,color:ACCENT},{val:3,color:ACCENT},{val:7,color:"#F97316"},{val:10,color:"#F97316"}] },
  // Q5: {2,5,8,11} satisfy x≥8 → 8,11
  { start:0,  end:12, marks:[2,5,8,11], ticks:[0,1,2,3,4,5,6,7,8,9,10,11,12], dots:[{val:2,color:"#F97316"},{val:5,color:"#F97316"},{val:8,color:ACCENT},{val:11,color:ACCENT}] },
  // Q6-Q10: table layout (PNLDATA unused for these)
  { start:0, end:1, marks:[], ticks:[], dots:[] },
  { start:0, end:1, marks:[], ticks:[], dots:[] },
  { start:0, end:1, marks:[], ticks:[], dots:[] },
  { start:0, end:1, marks:[], ticks:[], dots:[] },
  { start:0, end:1, marks:[], ticks:[], dots:[] },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function InteractiveLessonL7({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);
  const slidePad = isMobile ? "16px 16px 80px"  : "28px 52px 100px";
  const cols2    = isMobile ? "1fr"              : "1fr 1fr";
  const barPad   = isMobile ? "12px 16px"        : "20px 52px";
  const heroFs   = isMobile ? 32                 : 56;
  const [idx, setIdx]           = useState(0);
  const [picked, setPicked]     = useState<number | null>(null);
  const [practiceResults, setPracticeResults] = useState<(boolean|null)[]>(Array(10).fill(null));
  const [completeFilled, setCompleteFilled]   = useState(1);

  const isLast       = idx === SLIDES.length - 1;
  const isFirst      = idx === 0;
  const isPractice   = idx >= 13 && idx <= 22;
  const practiceStep = isPractice ? idx - 13 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isLessonQ    = idx >= 1 && idx <= 11;
  const isQuestionSlide = isLessonQ || isPractice;

  useEffect(() => {
    if (isLast) {
      setCompleteFilled(6);
      const t = setTimeout(() => setCompleteFilled(7), 600);
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

  if (isMobile) return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"#F5F7FA", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, fontFamily: FONT, flexDirection:"column", gap:16, padding:24, textAlign:"center" }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#94A3B8" strokeWidth="1.5"/><circle cx="12" cy="17" r="1" fill="#94A3B8"/></svg>
      <div style={{ fontSize:20, fontWeight:800, color:INK }}>Desktop only</div>
      <div style={{ fontSize:14, color:GRAY, maxWidth:240, lineHeight:1.6 }}>These lessons are not yet available on mobile. Please open on a desktop or laptop to continue.</div>
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
      />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, right:isMobile?0:CHAT_W, background: "#fff", fontFamily: FONT, zIndex: 100, overflowY: "auto" }}>

        <EdHeader onChatOpen={isMobile ? () => setChatOpen(true) : undefined} isMobile={isMobile} />

        {/* Progress bar */}
        <div style={{ position: "relative", zIndex: 1, padding:isMobile?"12px 16px 0":"20px 52px 0", display: "flex", alignItems: "center", gap: 20 }}>
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
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 10 }}>Today&apos;s lesson</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize:heroFs, color: INK, lineHeight: 0.95, marginBottom: 14 }}>Linear<br/>Inequalities</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
                Learn the four inequality symbols — <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>&gt;</span>, <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>&lt;</span>, <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>≥</span>, <span style={{ fontFamily: MONO, fontWeight: 700, color: ACCENT }}>≤</span> — and how to use them to compare values.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6 }}>Your progress</div>
                  <ProgressPills filled={6} total={8} />
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
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
                Inequalities allow us to <span style={{ color: ACCENT }}>compare</span> two values mathematically.
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
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>How would you write this comparison?</div>
              </div>
            <OptionList options={["Elephant's weight > Mouse's weight", "Elephant's weight < Mouse's weight"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 2: SYMBOLS ── */}
        {idx === 2 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which is correct?</div>
              </div>
              <OptionList options={["10 > 3", "10 < 3"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 3: PRACTICE < ── */}
        {idx === 3 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which is correct?</div>
              </div>
              <OptionList options={["5 > 12", "5 < 12"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 4: ≥ and ≤ ── */}
        {idx === 4 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which is correct for a number that is at least 5?</div>
              </div>
              <OptionList options={["x ≤ 5", "x ≥ 5"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 5: ≤ PRACTICE ── */}
        {idx === 5 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which is correct for a number that is no more than 10?</div>
              </div>
              <OptionList options={["x ≥ 10", "x ≤ 10"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 6: HARD 1 — multi-step ── */}
        {idx === 6 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 12 }}>
                Sometimes we need to find which values <span style={{ color: ACCENT }}>satisfy</span> an inequality.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                A rollercoaster has a minimum height of 120cm.<br/>Which of these people can ride?
              </div>
              {/* Bar chart: 4 people, only Sam (128cm) meets the requirement */}
              {(() => {
                const BASE = 148, SCALE = 0.82;
                const py = (v: number) => BASE - v * SCALE;
                const people = [
                  { name: "Alex", h: 112, color: RED },
                  { name: "Sam",  h: 128, color: GREEN },
                  { name: "Mia",  h: 108, color: RED },
                  { name: "Jake", h: 117, color: RED },
                ];
                return (
                  <svg viewBox="0 0 300 170" style={{ width: "100%", height: "auto", display: "block" }}>
                    {[0, 40, 80, 120, 160].map(v => (
                      <g key={v}>
                        <line x1="40" y1={py(v)} x2="280" y2={py(v)} stroke={v === 120 ? "#F59E0B" : "#E2E8F0"} strokeWidth={v === 120 ? 1.5 : 1} strokeDasharray={v === 120 ? "4,3" : undefined}/>
                        <text x="34" y={py(v) + 4} textAnchor="end" fontFamily={MONO} fontSize="9" fill={v === 120 ? "#F59E0B" : GRAY}>{v}</text>
                      </g>
                    ))}
                    <text x="284" y={py(120) + 4} fontFamily={FONT} fontSize="9" fontWeight="700" fill="#F59E0B">min</text>
                    {people.map(({ name, h, color }, i) => {
                      const x = 56 + i * 52;
                      const bh = h * SCALE;
                      return (
                        <g key={name}>
                          <rect x={x} y={py(h)} width={36} height={bh} rx="3" fill={color} opacity="0.85"/>
                          <text x={x + 18} y={BASE + 16} textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="600" fill={INK}>{name}</text>
                        </g>
                      );
                    })}
                    <line x1="40" y1={BASE} x2="280" y2={BASE} stroke={INK} strokeWidth="1.5" opacity="0.3"/>
                  </svg>
                );
              })()}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Who meets the height requirement of 120cm?</div>
              </div>
              <OptionList options={["Sam (128cm)", "Jake (117cm)"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 7: test values ── */}
        {idx === 7 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 24 }}>
                Here&apos;s a harder one.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["−1", "3", "5", "7"].map(v => (
                  <div key={v} style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 900, color: INK }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which values from &#123;−1, 3, 5, 7&#125; satisfy x &lt; 3?</div>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY, marginBottom: 20, paddingLeft: 54 }}>Select all that apply.</div>
              <OptionList options={["−1 only", "−1 and 3"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 8: test values ≥ ── */}
        {idx === 8 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 24 }}>
                And another one.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["2", "5", "8", "11"].map(v => (
                  <div key={v} style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 900, color: INK }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which values from &#123;2, 5, 8, 11&#125; satisfy x ≥ 5?</div>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY, marginBottom: 20, paddingLeft: 54 }}>Select all that apply.</div>
              <OptionList options={["5, 8 and 11", "2, 5 and 8"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 9: HARD 4 — word problem ── */}
        {idx === 9 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 12 }}>
                We can use inequalities to solve <span style={{ color: ACCENT }}>real world</span> problems.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                A student has 45 marks. They need at least 70 to pass.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 14 }}>Score breakdown</div>
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
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which inequality shows the extra marks needed to pass?</div>
              </div>
              <OptionList options={["45 + m ≥ 70", "45 + m > 70"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 10: taxi word problem ── */}
        {idx === 10 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 10 }}>
                Here&apos;s another one.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                A taxi charges $3 per km plus a $5 booking fee.<br/>You have $20 to spend.
              </div>
              {/* Taxi fare table */}
              <div style={{ background: "#F8FAFC", borderRadius: 14, overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: 12 }}>
                <div style={{ background: INK, padding: "10px 18px" }}>
                  <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Taxi fare breakdown</span>
                </div>
                {[
                  { label: "Booking fee", value: "$5" },
                  { label: "Cost per km", value: "$3" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderTop: "1px solid #E2E8F0", background: "#fff" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "#475569" }}>{row.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: INK }}>{row.value}</span>
                  </div>
                ))}
              </div>
              {/* Budget box */}
              <div style={{ background: "rgba(56,199,107,0.08)", border: "1.5px solid #38C76B", borderRadius: 12, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: GREEN_DK }}>You have a budget of</span>
                <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color: GREEN_DK }}>$20</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which inequality represents this situation?</div>
              </div>
              <OptionList options={["3x + 5 ≥ 20", "3x + 5 ≤ 20", "3x + 5 = 20"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 11: painter word problem ── */}
        {idx === 11 && (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 10 }}>
                And a final one.
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
                A painter charges a $20 callout fee<br/>plus $15 per hour. You have $80 to spend.
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 14, overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: 12 }}>
                <div style={{ background: INK, padding: "10px 18px" }}>
                  <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Painter fee breakdown</span>
                </div>
                {[
                  { label: "Callout fee",   value: "$20" },
                  { label: "Cost per hour", value: "$15" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderTop: "1px solid #E2E8F0", background: "#fff" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "#475569" }}>{row.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: INK }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(56,199,107,0.08)", border: "1.5px solid #38C76B", borderRadius: 12, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: GREEN_DK }}>You have a budget of</span>
                <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color: GREEN_DK }}>$80</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: INK }}>Which inequality represents this situation?</div>
              </div>
              <OptionList options={["20 + 15h ≤ 80", "20 + 15h ≥ 80"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        )}

        {/* ── Slide 12: PRACTICE UNLOCKED ── */}
        {idx === 12 && (

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding:isMobile?"16px 16px 60px":"24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
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
            <button onClick={() => { setPicked(null); setIdx(13); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
              Start Practice
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}

        {/* ── Practice slides 13–22 ── */}
        {isPractice && (() => {
          const q   = PDATA[practiceStep];
          const nl  = PNLDATA[practiceStep];
          const tbl = PTABLE[practiceStep];

          if (tbl) {
            // Real-world table layout (Q6–Q10)
            return (
              <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK, lineHeight: 1.1, marginBottom: 10 }}>
                    Question <span style={{ color: ACCENT }}>{practiceStep + 1}.</span>
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>{tbl.sub}</div>
                  <div style={{ background: "#F8FAFC", borderRadius: 14, overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: 12 }}>
                    <div style={{ background: INK, padding: "10px 18px" }}>
                      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{tbl.title}</span>
                    </div>
                    {tbl.rows.map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderTop: "1px solid #E2E8F0", background: "#fff" }}>
                        <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "#475569" }}>{row.label}</span>
                        <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: INK }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "rgba(56,199,107,0.08)", border: "1.5px solid #38C76B", borderRadius: 12, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: GREEN_DK }}>You have a budget of</span>
                    <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color: GREEN_DK }}>{tbl.budget}</span>
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
          }

          // Number line layout (Q1–Q5)
          const pos = (v: number) => 20 + (v - nl.start) / (nl.end - nl.start) * 290;
          return (
            <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
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

        {/* ── Slide 23: SCORE ── */}
        {idx === 23 && (() => {
          const msg = practiceScore === 10 ? { text: "Perfect!", color: GREEN }
            : practiceScore >= 8 ? { text: "Great work.", color: GREEN }
            : practiceScore >= 6 ? { text: "Good work.", color: ACCENT }
            : practiceScore >= 4 ? { text: "Good effort.", color: RED }
            : { text: "Keep practising.", color: RED };
          return (
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding:isMobile?"16px 16px 60px":"24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.12em", marginBottom: 20 }}>SAT QUESTIONS</div>
              <div style={{ marginBottom: 12, lineHeight: 1 }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK }}>{practiceScore}</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize:heroFs, color: GRAY }}>/10</span>
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
          <div style={{ position: "relative", zIndex: 1, padding:isMobile?"16px 16px 80px":"36px 52px 140px", display: "grid", gridTemplateColumns:cols2, gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
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
                  <ProgressPills filled={completeFilled} total={8} color={GREEN} />
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
          <div style={{ position: "fixed", bottom: 0, left: 0, right:isMobile?0:CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding:barPad, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
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
        ) : idx === 12 || idx === 23 ? null : (() => {
          if (!isQuestionSlide || picked === null) {
            return (
              <div style={{ position: "fixed", bottom: 0, left: 0, right:isMobile?0:CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding:barPad, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div style={{ position: "fixed", bottom: 0, left: 0, right:isMobile?0:CHAT_W, zIndex: 10, padding:isMobile?"12px 16px":"14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: isCorrect ? GREENBG : "#FDECEC", borderTop: `2px solid ${isCorrect ? GREEN : RED}` }}>
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
