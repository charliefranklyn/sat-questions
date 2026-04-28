"use client";
import React from "react";
import ChatPanel, { CHAT_W } from "@/components/ChatPanel";
import { useState, useEffect, useRef } from "react";

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
const ORANGE   = "#F97316";
const PURPLE   = "#8B5CF6";

// ── Circular grid graph ───────────────────────────────────────────────────────
function Graph2({ color = ACCENT }: { color?: string }) {
  const W=400, H=400, cx=200, cy=200, r=170;
  const xp=(v:number)=>cx+v/5.5*(r-20);
  const yp=(v:number)=>cy-v/5.5*(r-20);
  const pts:number[][] = [];
  for(let i=-5;i<=5;i++) pts.push([i,i]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="l3ax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1E293B"/>
        </marker>
        <clipPath id="l3clip"><circle cx={cx} cy={cy} r={r}/></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="rgba(59,91,219,0.07)"/>
      <g clipPath="url(#l3clip)">
        {[-4,-3,-2,-1,0,1,2,3,4].map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.8"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.8"/>
          </g>
        ))}
      </g>
      <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.5)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.5" markerEnd="url(#l3ax)"/>
      <line x1={xp(0)} y1={yp(5.5)} x2={xp(0)} y2={yp(-5.5)} stroke="#1E293B" strokeWidth="2.5"/>
      <text x={xp(5.5)+10} y={yp(0)+5} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">x</text>
      <text x={xp(0)+8} y={yp(5.5)-4} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">y</text>
      <line x1={xp(-5)} y1={yp(-5)} x2={xp(5)} y2={yp(5)} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {pts.map(([x,y])=>(
        <circle key={x} cx={xp(x)} cy={yp(y)} r="7" fill={color}/>
      ))}
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
          if (i === correct)     { bg = "#E7F8EC"; border = GREEN;  badgeBg = GREEN;  badgeColor = "#fff"; showCheck = true; }
          else if (i === picked) { bg = "#FDECEC"; border = RED;    badgeBg = RED;    badgeColor = "#fff"; showCross = true; textColor = "#5A6088"; }
          else                   { border = "rgba(31,37,68,0.07)"; textColor = "rgba(31,37,68,0.35)"; badgeBg = "rgba(31,37,68,0.07)"; badgeColor = "rgba(31,37,68,0.3)"; }
        }
        return (
          <div key={i} onClick={() => { if (picked === null) { onPick(i); if (i === correct) playCorrect(); } }}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderRadius: 16, background: bg, border: `2px solid ${border}`, cursor: picked === null ? "pointer" : "default", transition: "all 0.15s" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: badgeBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 16, fontWeight: 900, color: badgeColor, flexShrink: 0 }}>
              {String.fromCharCode(65 + i)}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: textColor, flex: 1, lineHeight: 1.3 }}>{label}</div>
            {showCheck && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN} /><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            {showCross && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED} /><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>}
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
            <linearGradient id="l3-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe" /><stop offset=".77" stopColor="#1c45f6" />
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l3-logo-grad)" />
          <path d="M523.2,510.9c-5.5-16.4-17.2-29.9-32.2-38.6-6.8-3.9-15.2-7.6-25.1-9.8-24.1-5.4-43.5.6-51.1,3.4-8.5,3.7-33.3,15.9-46.7,43.7-12.6,26.3-10.9,57.9,3.5,85.5,6.9,13.2,17.4,24.2,30.4,31.4,12.1,6.7,29.3,13.3,50.6,13,33.8-.5,57.2-18,66.9-26.8,2.5-2.2,2.7-6,.6-8.6l-18.2-21.9c-1.8-2.1-5-2.5-7.2-.8-21.1,16.4-46.7,19.6-64.3,8.8-9.6-5.9-14.8-14.9-17.6-21.3-.3-.8.2-1.7,1-1.8l101.1-14.8c6.5-.95,11.4-6.4,11.8-13,.4-7.6-.2-17.4-3.7-28.1Zm-48.4,14-63.7,9.5c-.7.1-1.3-.45-1.3-1.15.2-4.8,1.8-19.9,14.7-29.3,11-7.9,28.2-10.3,40.1-.9,8.5,6.7,10.6,16.6,11.2,20.6.1.6-.3,1.2-.94,1.25Z" fill="#fff" />
          <path d="M714.8,627.5l-2.2-12c-.4-2.1-.6-4.2-.6-6.3V399.4c0-4.2-3.8-7.3-7.9-6.5l-36.8,7.3c-3.2.6-5.4,3.4-5.4,6.6v71.3c-8.1-9.1-20.6-17.4-47.1-17.4-13.9,0-26.4,4.4-37.7,11.1-11.3,6.7-20.2,16.7-26.9,29.8-6.6,13.1-9.9,29.2-9.9,48.2,0,18.8,3.3,34.8,9.8,47.95s15.4,23.2,26.6,30.1c11.2,6.9,23.9,10.4,38.1,10.4,10.3,0,18.9-1.6,25.7-4.9,6.8-3.3,13.9-7.4,18.1-12,2-2.2,4.5-4.8,6.9-7.4l.8,13.8c.3,3.7,3.4,6.6,7.1,6.6h35.9c3.6,0,6.4-3.3,5.7-6.9Zm-51.4-54.3c-1.2,2.3-9.7,13.8-18.4,17.9-3.7,1.7-8.4,3.3-14,3.3-7.7,0-14.6-.95-20.7-4.7-6.1-3.7-10.9-9.2-14.5-16.3s-5.3-15.8-5.3-25.97c0-10.3,1.8-19,5.4-26.1,3.6-7.1,7.1-11.5,13.2-15.1,6.1-3.6,13-5.5,20.5-5.5,18.8,0,30,10.7,33.8,16.9v55.7Z" fill="#fff" />
        </svg>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.01em" }}>EdAccelerator</span>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4e7efe 0%,#1c45f6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>C</span>
      </div>
    </div>
  );
}

// ── Formula reference ─────────────────────────────────────────────────────────
function FormulaRef({ type }: { type: "ymx" | "ymxc" }) {
  return (
    <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Formula</div>
      {type === "ymx" ? (
        <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700 }}>
          <span style={{ color: GREEN }}>y</span>
          <span style={{ color: INK }}> = </span>
          <span style={{ color: ACCENT }}>m</span>
          <span style={{ color: ORANGE }}>x</span>
        </div>
      ) : (
        <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700 }}>
          <span style={{ color: GREEN }}>y</span>
          <span style={{ color: INK }}> = </span>
          <span style={{ color: ACCENT }}>m</span>
          <span style={{ color: ORANGE }}>x</span>
          <span style={{ color: INK }}> + </span>
          <span style={{ color: PURPLE }}>c</span>
        </div>
      )}
    </div>
  );
}

// ── Slide manifest ────────────────────────────────────────────────────────────
const SLIDES = [
  { id: "intro"             }, // 0
  { id: "earn_formula"      }, // 1  drag
  { id: "teach_ymx"         }, // 2  drag
  { id: "drag_m"            }, // 3  drag
  { id: "drag_taxi"         }, // 4  drag
  { id: "car"               }, // 5  AB
  { id: "baker"             }, // 6  AB
  { id: "plumber"           }, // 7  AB
  { id: "callout"           }, // 8  AB
  { id: "drag_ymxc"         }, // 9  drag
  { id: "trainer"           }, // 10 AB: what is c?
  { id: "practice_unlocked" }, // 11
  { id: "p1"                }, // 12
  { id: "p2"                }, // 13
  { id: "p3"                }, // 14
  { id: "p4"                }, // 15
  { id: "p5"                }, // 16
  { id: "p6"                }, // 17
  { id: "p7"                }, // 18
  { id: "p8"                }, // 19
  { id: "p9"                }, // 20
  { id: "p10"               }, // 21
  { id: "score"             }, // 22
  { id: "complete"          }, // 23
];

const PROGRESS = [0.05,0.11,0.18,0.22,0.26,0.31,0.37,0.43,0.50,0.53,0.64,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0];

// ── Component ─────────────────────────────────────────────────────────────────
export default function InteractiveLessonL3({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [idx, setIdx]               = useState(0);
  const [picked, setPicked]         = useState<number | null>(null);
  const [completeFilled, setCompleteFilled] = useState(1);
  const [practiceResults, setPracticeResults] = useState<(boolean | null)[]>([null,null,null,null,null,null,null,null,null,null]);
  const [dragMatches, setDragMatches] = useState<Record<string, string | null>>({ y: null, m: null, x: null, c: null });
  const [dragSubmitted, setDragSubmitted] = useState(false);
  const dragRef = useRef<string | null>(null);

  useEffect(() => {
    if (idx === SLIDES.length - 1) {
      setCompleteFilled(1);
      const t = setTimeout(() => setCompleteFilled(2), 600);
      return () => clearTimeout(t);
    }
  }, [idx]);

  const isPractice   = idx >= 12 && idx <= 21;
  const practiceStep = isPractice ? idx - 12 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isFirst = idx === 0;
  const isLast  = idx === SLIDES.length - 1;
  const isDragSlide = [1, 2, 3, 4, 9].includes(idx);
  const isQuestionSlide = [5, 6, 7, 8, 10].includes(idx) || (idx >= 12 && idx <= 21);

  const DRAG_CORRECT_MAP: Record<number, Record<string, string>> = {
    1: { y: "$15,000 total", m: "$15 per hour", x: "1,000 hours" },
    2: { y: "output", m: "rate", x: "input" },
    3: { y: "$60 total", m: "$12 per hour", x: "5 hours" },
    4: { y: "$45 total", m: "$3 per km", x: "15 km" },
    9: { y: "Total Earnings", m: "Pay Per Hour", x: "Hours Worked", c: "$50 Callout Fee" },
  };
  const DRAG_EXPLAIN: Record<number, [string, string]> = {
    1: ["$15 per hour is m (the rate), 1,000 hours is x (the input), $15,000 is y (the total).", "Think: what repeats each hour? That's m. How many hours? That's x. What's the result? That's y."],
    2: ["y is the output (total fare), m is the rate (per km), x is the input (km driven).", "y is always the result you calculate, m is the rate per unit, x is what you plug in."],
    3: ["m is $12 per hour (the rate), x is 5 hours (the input), y is $60 (the result).", "The amount per hour is always m, what you plug in is x, and the result is y."],
    4: ["m is $3 per km (the rate), x is 15 km (the input), y is $45 (the total).", "Rate per unit is m, the variable quantity is x, and the total is y."],
    9: ["y (output), m (rate), x (input), c (fixed fee) — all four matched.", "y is the total, m is the per-unit rate, x is what you plug in, and c is the fixed amount added every time."],
  };
  const DRAG_TAKEAWAY: Record<number, string> = {
    1: "In y = mx, m is the rate — the amount y changes per unit of x.",
    2: "y = output, m = rate, x = input.",
    3: "m is the rate, x is the input, y is the output.",
    4: "Rate × input = output. That's y = mx.",
    9: "In y = mx + c: m is rate, x is input, y is output, c is the fixed amount.",
  };
  const dragCorrectMap = DRAG_CORRECT_MAP[idx] ?? {};
  const dragIsAllCorrect = isDragSlide && dragSubmitted && Object.entries(dragCorrectMap).every(([k, v]) => dragMatches[k] === v);

  const CORRECT_BY_IDX: Record<number, number> = {
    1: 0,
    5: 0, 6: 1, 7: 2, 8: 1,
    10: 2,
    12: 2, 13: 2, 14: 0, 15: 1, 16: 1,
    17: 1, 18: 2, 19: 2, 20: 2, 21: 1,
  };

  const EXPLAIN_DATA: Record<number, [string, string]> = {
    1:  ["We multiply — every hour adds another $15, so the total grows through multiplication, not addition.", "We multiply, not add. Adding would give the same total regardless of hours. Multiplication compounds each hour."],
    5:  ["m is always the rate — the fixed amount y changes per step. Here that's 60 km/hr.", "Hours travelled is x (the input). Total distance is y (the output). 60 is m — the rate at which distance grows."],
    6:  ["x is always the input — the value you plug in. Here that's the number of batches.", "12 is m (cookies per batch). Total cookies is y (the output). x is what you plug in: number of batches."],
    7:  ["y is the output — the total charge. It's what you're solving for.", "$50 is the callout fee (c), not the output. Hours worked is x (the input). y is the result: the total charge."],
    8:  ["The $50 is added on top every time, no matter how many hours. So we add it to the end: y = mx + 50.", "Subtracting would reduce the total. Multiplying by 50 changes the rate. A fixed fee always gets added on."],
    10: ["c is the fixed amount added every time regardless of input — that's the $20 registration fee.", "$45 is m (the rate per session). c is the fixed, one-off fee: $20."],
    11: ["m is always the rate — the amount that changes each step. Here that's $8 per month.", "$15 is c (the one-off setup fee). The monthly rate that changes every step is $8."],
    12: ["Cinema tickets are $12 each, so total cost = 12 × tickets: y = 12x.", "No fixed fee means no + c. The rate is $12 and x is the number of tickets."],
    13: ["$25 per hour is m, x is hours, and the $30 booking fee is c. So y = 25x + 30.", "The booking fee is added every time, not multiplied by hours — it belongs as + c."],
    14: ["$80 per hour is m and x is hours. No booking fee, so y = 80x.", "Watch out for option C — adding 80 again as a constant implies a fixed fee, but there isn't one."],
    15: ["$5 per hour is m, x is hours, and the $10 entry fee is c. So y = 5x + 10.", "The entry fee is paid once regardless of time — it's c, not part of the hourly rate."],
    16: ["$40 per session is m, x is sessions, and the $60 joining fee is c. So y = 40x + 60.", "Option A reverses m and c — $60 per session with a $40 joining fee would be the wrong way around."],
    17: ["$15 per walk is m and x is walks. No joining fee, so y = 15x.", "Option D adds +15 on top — that would mean a $15 fixed fee, but none is mentioned."],
    18: ["$70 per hour is m, x is hours, and the $50 callout fee is c. So y = 70x + 50.", "Option B swaps m and c — $50 per hour with a $70 fee. Always check which number is the per-unit rate."],
    19: ["$35 per lesson is m and x is lessons. No registration fee, so y = 35x.", "Options A and C add a constant, but no registration fee is mentioned — so there's no c."],
    20: ["$45 per month is m, x is months, and the $100 joining fee is c. So y = 45x + 100.", "Option B swaps the rate and fee. Always check: what's paid every month (m) vs what's paid once (c)."],
    21: ["$20 per hour is m and x is hours. No call-out fee, so y = 20x.", "Options A and C add a constant. No fixed fee is mentioned, so there is no c."],
  };

  const TAKEAWAY_DATA: Record<number, string> = {
    1:  "In y = mx, m is the multiplier — the rate per unit of x.",
    5:  "m is the rate — the fixed amount y changes per unit of x.",
    6:  "x is the input — the value you plug in.",
    7:  "y is the output — the result you calculate.",
    8:  "A fixed fee is always added: write it as + c.",
    10: "c is the fixed amount — what you'd pay even at x = 0.",
    11: "m is the rate — the coefficient of x in the equation.",
    12: "Rate × input = total. Write y = mx when there's no fixed fee.",
    13: "Fixed fee is c — it's added once, not per hour. Write y = mx + c.",
    14: "No fixed fee means y = mx. Don't add a c that isn't there.",
    15: "Entry fee is always c — paid once, independent of time.",
    16: "Joining fees are c — paid once, not per session.",
    17: "No fee mentioned means no + c. y = mx when rate × input = total.",
    18: "The callout fee is always paid — it's c, not the per-hour rate.",
    19: "No registration fee means y = mx. Only add + c for a one-off cost.",
    20: "Joining fee is always c — paid once, regardless of how many months.",
    21: "No fixed fee means y = mx. Only add + c when there's a one-off cost.",
  };

  const TIP_DATA: Record<number, string> = {
    1:  "In y = mx, the m is always the number that multiplies x. It's the rate — what you earn, travel, or pay per unit.",
    5:  "x is the input — the value you control or plug in. On the SAT, look for the quantity that varies.",
    6:  "m is the rate — the coefficient of x. It tells you how much y changes for every one unit of x.",
    7:  "y is the output — the end result. It's what you calculate after plugging in x.",
    8:  "A fixed fee gets added to the equation, never multiplied. If you'd pay it at x = 0, it's c.",
    10: "c is independent of x — it's the amount you'd pay even if x were zero. Look for the one-off or base cost.",
    11: "m is the monthly/per-unit rate. It's the coefficient of x — the number that changes proportionally.",
    12: "Identify the rate (amount per ticket) and what you're calculating (total cost). Is there a fixed fee?",
    13: "There are two costs: one that grows with hours and one that doesn't. Which is which?",
    14: "What is the cost per hour? Is there any fixed fee mentioned?",
    15: "Two costs: one per hour and one fixed. Identify m and c.",
    16: "One fee is paid every session; one is paid once. Which is m and which is c?",
    17: "What changes each walk? Is there any fixed fee on top?",
    18: "The callout fee is paid regardless of hours. Think: is it m or c?",
    19: "What is the rate per lesson? Is there any registration fee?",
    20: "The gym charges two things: a monthly rate and a one-off fee. Which is m and which is c?",
    21: "What is the hourly rate? Is there a call-out fee?",
  };

  const tipMessage = TIP_DATA[idx];
  let autoMessage: string | undefined;
  if (isDragSlide && dragSubmitted && DRAG_EXPLAIN[idx]) {
    autoMessage = dragIsAllCorrect
      ? `Well done! ${DRAG_EXPLAIN[idx][0]}\n\nKey takeaway: ${DRAG_TAKEAWAY[idx] ?? ""}`
      : `Not quite. ${DRAG_EXPLAIN[idx][1]}\n\nKey takeaway: ${DRAG_TAKEAWAY[idx] ?? ""}`;
  } else if (picked !== null && EXPLAIN_DATA[idx]) {
    autoMessage = picked === CORRECT_BY_IDX[idx]
      ? `Well done! ${EXPLAIN_DATA[idx][0]}\n\nKey takeaway: ${TAKEAWAY_DATA[idx] ?? ""}`
      : `Not quite. ${EXPLAIN_DATA[idx][1]}\n\nKey takeaway: ${TAKEAWAY_DATA[idx] ?? ""}`;
  }

  const handleContinue = () => {
    if (isPractice) {
      const isCorrect = picked === CORRECT_BY_IDX[idx];
      setPracticeResults(r => { const n = [...r]; n[practiceStep] = isCorrect; return n; });
    }
    setPicked(null);
    setIdx(i => i + 1);
  };

  return (
    <>
    <ChatPanel
      locked={!isQuestionSlide && !isDragSlide}
      hintOnly={(isQuestionSlide && picked === null) || (isDragSlide && !dragSubmitted)}
      autoMessage={autoMessage}
      tipMessage={tipMessage}
      slideKey={idx}
      answeredLabel={isDragSlide ? (dragSubmitted ? (dragIsAllCorrect ? "✓" : "✗") : undefined) : picked !== null ? ["A","B","C","D"][picked] : undefined}
      answeredCorrect={isDragSlide ? (dragSubmitted ? dragIsAllCorrect : undefined) : picked !== null ? picked === CORRECT_BY_IDX[idx] : undefined}
    />
    <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: CHAT_W, background: "#fff", fontFamily: FONT, zIndex: 100, overflowY: "auto" }}>

      <EdHeader />

      {/* ── Progress bar ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px 52px 0", display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>
        {isPractice ? (
          <div style={{ flex: 1, display: "flex", gap: 6 }}>
            {Array.from({ length: 10 }, (_, i) => i).map(i => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: i <= practiceStep ? RED : "#E2E8F0", transition: "background 0.3s ease" }} />
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, height: 8, borderRadius: 99, background: "#E2E8F0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${PROGRESS[idx] * 100}%`, borderRadius: 99, background: isLast ? GREEN : ACCENT, transition: "width 0.6s ease, background 0.4s ease" }} />
          </div>
        )}
      </div>

      {/* ── Slide 0: INTRO ── */}
      {idx === 0 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 10 }}>Today&apos;s lesson</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, lineHeight: 0.95, marginBottom: 14 }}>Writing<br />Linear<br />Equations</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
              We&apos;ll learn how to <span style={{ color: ACCENT, fontWeight: 600 }}>write linear functions as equations</span>, building up to the formula <span style={{ fontFamily: MONO, fontWeight: 700 }}>y = mx + c</span>.
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6 }}>Your progress</div>
                <ProgressPills filled={2} total={10} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: ACCENT }}>30%</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "75%" }}><Graph2 /></div>
          </div>
        </div>
      )}

      {/* ── Slide 1: DRAG — earn formula ── */}
      {idx === 1 && (() => {
        const DRAG_CORRECT1: Record<string, string> = { y: "$15,000", m: "$15 per hour", x: "1,000 hours" };
        const ZONE_LABELS1: Record<string, string> = { y: "Total Earnings", m: "Pay Per Hour", x: "Hours Worked" };
        const DRAG_COLORS1: Record<string, string> = { y: GREEN, m: ACCENT, x: ORANGE };
        const ZONE_BG1: Record<string, string> = { y: "rgba(56,199,107,0.07)", m: "rgba(59,91,219,0.07)", x: "rgba(249,115,22,0.07)" };
        const ALL_CHIPS1 = ["$15 per hour", "1,000 hours", "$15,000"];
        const placed1 = (["y","m","x"] as const).map(k => dragMatches[k]).filter(Boolean) as string[];
        const available1 = ALL_CHIPS1.filter(l => !placed1.includes(l));

        const handleDrop1 = (letter: string) => {
          const item = dragRef.current;
          if (!item || dragSubmitted) return;
          setDragMatches(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === item) next[k] = null; });
            next[letter] = item;
            return next;
          });
        };

        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.15, marginBottom: 8 }}>
              All linear functions can be written as an <span style={{ color: ACCENT }}>equation.</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: GRAY, marginBottom: 20, lineHeight: 1.5 }}>
              Can you write the equation for this scenario?
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>💼</span>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.55 }}>
                Imagine you earn <strong>$15 per hour</strong> and work for <strong>1,000 hours</strong>. Write the equation.
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: GRAY, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              Match each part:
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 14, marginBottom: 24 }}>
              {(["y", "m", "x"] as const).map((letter, i) => {
                const val = dragMatches[letter];
                const color = DRAG_COLORS1[letter];
                const isCorrect1 = dragSubmitted && val === DRAG_CORRECT1[letter];
                const isWrong1   = dragSubmitted && val !== null && val !== DRAG_CORRECT1[letter];
                return (
                  <React.Fragment key={letter}>
                    {i === 1 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 4px" }}>=</div>}
                    {i === 2 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 4px" }}>×</div>}
                    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleDrop1(letter); }}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "20px 16px", borderRadius: 16, minHeight: 120, position: "relative", background: isCorrect1 ? "#E7F8EC" : isWrong1 ? "#FDECEC" : ZONE_BG1[letter], border: `2px dashed ${isCorrect1 ? GREEN : isWrong1 ? RED : color}`, transition: "all 0.15s" }}>
                      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" }}>{ZONE_LABELS1[letter]}</div>
                      {val ? (
                        <>
                          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: isWrong1 ? RED : INK, textAlign: "center", lineHeight: 1.3 }}>{val}</div>
                          {!dragSubmitted && <button onClick={() => setDragMatches(p => ({ ...p, [letter]: null }))} style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", cursor: "pointer", color: GRAY, fontSize: 18, lineHeight: 1 }}>×</button>}
                        </>
                      ) : (
                        <div style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontStyle: "italic" }}>Drop here</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            {available1.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {available1.map(label => (
                  <div key={label} draggable onDragStart={() => { dragRef.current = label; }} onDragEnd={() => { dragRef.current = null; }}
                    style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", border: "1.5px solid #E2E8F0", cursor: "grab", userSelect: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Slide 2: DRAG — y = mx formula ── */}
      {idx === 2 && (() => {
        const DRAG_CORRECT2: Record<string, string> = { y: "output", m: "rate", x: "input" };
        const DRAG_COLORS2: Record<string, string> = { y: GREEN, m: ACCENT, x: ORANGE };
        const ZONE_LABELS2: Record<string, string> = { y: "Output", m: "Rate of change", x: "Input" };
        const ZONE_BG2: Record<string, string> = { y: "rgba(56,199,107,0.07)", m: "rgba(59,91,219,0.07)", x: "rgba(249,115,22,0.07)" };
        const ALL_LABELS2 = ["output", "rate", "input"];
        const placed2 = (["y","m","x"] as const).map(k => dragMatches[k]).filter(Boolean) as string[];
        const available2 = ALL_LABELS2.filter(l => !placed2.includes(l));

        const handleDrop2 = (letter: string) => {
          const item = dragRef.current;
          if (!item || dragSubmitted) return;
          setDragMatches(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === item) next[k] = null; });
            next[letter] = item;
            return next;
          });
        };

        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.15, marginBottom: 20 }}>
              The linear equation you wrote follows a formula:
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 48, lineHeight: 1, marginBottom: 16, display: "flex", alignItems: "baseline", gap: "0.18em" }}>
              <span style={{ color: GREEN }}>y</span>
              <span style={{ color: INK }}>=</span>
              <span style={{ color: ACCENT }}>m</span><span style={{ color: ORANGE }}>x</span>
              <span style={{ color: "#CBD5E1" }}>+</span>
              <span style={{ position: "relative", display: "inline-block", cursor: "help" }} className="c-tooltip-wrap">
                <span style={{ color: "#CBD5E1" }}>c</span>
                <span style={{ position: "absolute", bottom: "120%", left: "50%", transform: "translateX(-50%)", background: INK, color: "#fff", fontFamily: FONT, fontSize: 12, fontWeight: 500, padding: "8px 12px", borderRadius: 10, whiteSpace: "nowrap", pointerEvents: "none", opacity: 0, transition: "opacity 0.15s", lineHeight: 1.4 }} className="c-tooltip">Wondering what <strong>c</strong> is? We&apos;ll get to it later in today&apos;s lesson.</span>
              </span>
            </div>
            <style>{`.c-tooltip-wrap:hover .c-tooltip { opacity: 1 !important; }`}</style>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: GRAY, marginBottom: 20, lineHeight: 1.6 }}>
              Can you guess what each part of the formula means?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {(["y","m","x"] as const).map((letter) => {
                const val = dragMatches[letter];
                const color = DRAG_COLORS2[letter];
                const isCorrect2 = dragSubmitted && val === DRAG_CORRECT2[letter];
                const isWrong2   = dragSubmitted && val !== null && val !== DRAG_CORRECT2[letter];
                return (
                  <div key={letter} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleDrop2(letter); }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 14px", borderRadius: 16, minHeight: 110, position: "relative", background: isCorrect2 ? "#E7F8EC" : isWrong2 ? "#FDECEC" : ZONE_BG2[letter], border: `2px dashed ${isCorrect2 ? GREEN : isWrong2 ? RED : color}`, transition: "all 0.15s" }}>
                    <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 900, color }}>({letter})</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" }}>{ZONE_LABELS2[letter]}</div>
                    {val ? (
                      <>
                        <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: isWrong2 ? RED : INK, textAlign: "center" }}>{val}</div>
                        {!dragSubmitted && <button onClick={() => setDragMatches(p => ({ ...p, [letter]: null }))} style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", cursor: "pointer", color: GRAY, fontSize: 18, lineHeight: 1 }}>×</button>}
                      </>
                    ) : (
                      <div style={{ fontFamily: FONT, fontSize: 12, color: "#CBD5E1", fontStyle: "italic" }}>Drop here</div>
                    )}
                  </div>
                );
              })}
            </div>
            {available2.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {available2.map(label => (
                  <div key={label} draggable onDragStart={() => { dragRef.current = label; }} onDragEnd={() => { dragRef.current = null; }}
                    style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", border: "1.5px solid #E2E8F0", cursor: "grab", userSelect: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Slide 3: DRAG — drag_m ── */}
      {idx === 3 && (() => {
        const DRAG_CORRECT3: Record<string, string> = { y: "$60 total", m: "$12 per hour", x: "5 hours" };
        const ZONE_LABELS3: Record<string, string> = { y: "Output", m: "Rate of change", x: "Input" };
        const DRAG_COLORS3: Record<string, string> = { y: GREEN, m: ACCENT, x: ORANGE };
        const ZONE_BG3: Record<string, string> = { y: "rgba(56,199,107,0.07)", m: "rgba(59,91,219,0.07)", x: "rgba(249,115,22,0.07)" };
        const ALL_CHIPS3 = ["$12 per hour", "5 hours", "$60 total"];
        const placed3 = (["y","m","x"] as const).map(k => dragMatches[k]).filter(Boolean) as string[];
        const available3 = ALL_CHIPS3.filter(l => !placed3.includes(l));

        const handleDrop3 = (letter: string) => {
          const item = dragRef.current;
          if (!item || dragSubmitted) return;
          setDragMatches(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === item) next[k] = null; });
            next[letter] = item;
            return next;
          });
        };

        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.15, marginBottom: 20 }}>
              Can you turn this into an equation?
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🛠️</span>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.55 }}>
                A worker earns <strong>$12 per hour</strong> and works for <strong>5 hours</strong>.
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: GRAY, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              Match each part:
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 14, marginBottom: 24 }}>
              {(["y", "m", "x"] as const).map((letter, i) => {
                const val = dragMatches[letter];
                const color = DRAG_COLORS3[letter];
                const isCorrect3 = dragSubmitted && val === DRAG_CORRECT3[letter];
                const isWrong3   = dragSubmitted && val !== null && val !== DRAG_CORRECT3[letter];
                return (
                  <React.Fragment key={letter}>
                    {i === 1 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 4px" }}>=</div>}
                    {i === 2 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 4px" }}>×</div>}
                    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleDrop3(letter); }}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "20px 16px", borderRadius: 16, minHeight: 120, position: "relative", background: isCorrect3 ? "#E7F8EC" : isWrong3 ? "#FDECEC" : ZONE_BG3[letter], border: `2px dashed ${isCorrect3 ? GREEN : isWrong3 ? RED : color}`, transition: "all 0.15s" }}>
                      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" }}>{ZONE_LABELS3[letter]}</div>
                      <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color }}>({letter})</div>
                      {val ? (
                        <>
                          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: isWrong3 ? RED : INK, textAlign: "center", lineHeight: 1.3 }}>{val}</div>
                          {!dragSubmitted && <button onClick={() => setDragMatches(p => ({ ...p, [letter]: null }))} style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", cursor: "pointer", color: GRAY, fontSize: 18, lineHeight: 1 }}>×</button>}
                        </>
                      ) : (
                        <div style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontStyle: "italic" }}>Drop here</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            {available3.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {available3.map(label => (
                  <div key={label} draggable onDragStart={() => { dragRef.current = label; }} onDragEnd={() => { dragRef.current = null; }}
                    style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", border: "1.5px solid #E2E8F0", cursor: "grab", userSelect: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Slide 4: DRAG — taxi ── */}
      {idx === 4 && (() => {
        const DRAG_CORRECT4: Record<string, string> = { y: "$45 total", m: "$3 per km", x: "15 km" };
        const ZONE_LABELS4: Record<string, string> = { y: "Output", m: "Rate of change", x: "Input" };
        const DRAG_COLORS4: Record<string, string> = { y: GREEN, m: ACCENT, x: ORANGE };
        const ALL_CHIPS4 = ["$3 per km", "$45 total", "15 km"];
        const placed4 = (["y","m","x"] as const).map(k => dragMatches[k]).filter(Boolean) as string[];
        const available4 = ALL_CHIPS4.filter(l => !placed4.includes(l));

        const handleDrop4 = (letter: string) => {
          const item = dragRef.current;
          if (!item || dragSubmitted) return;
          setDragMatches(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === item) next[k] = null; });
            next[letter] = item;
            return next;
          });
        };

        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.15, marginBottom: 20 }}>
              Can you turn this into an equation?
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🚕</span>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.55 }}>
                A taxi charges <strong>$3 per km</strong>. Jake&apos;s ride is <strong>15 km</strong>.
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: GRAY, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              Match each part:
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 14, marginBottom: 24 }}>
              {(["y", "m", "x"] as const).map((letter, i) => {
                const val = dragMatches[letter];
                const color = DRAG_COLORS4[letter];
                const isCorrect4 = dragSubmitted && val === DRAG_CORRECT4[letter];
                const isWrong4   = dragSubmitted && val !== null && val !== DRAG_CORRECT4[letter];
                return (
                  <React.Fragment key={letter}>
                    {i === 1 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 4px" }}>=</div>}
                    {i === 2 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 32, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 4px" }}>×</div>}
                    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleDrop4(letter); }}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "20px 16px", borderRadius: 16, minHeight: 120, position: "relative", background: isCorrect4 ? "#E7F8EC" : isWrong4 ? "#FDECEC" : ({ y: "rgba(56,199,107,0.07)", m: "rgba(59,91,219,0.07)", x: "rgba(249,115,22,0.07)" })[letter], border: `2px dashed ${isCorrect4 ? GREEN : isWrong4 ? RED : color}`, transition: "all 0.15s" }}>
                      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" }}>{ZONE_LABELS4[letter]}</div>
                      <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color }}>({letter})</div>
                      {val ? (
                        <>
                          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: isWrong4 ? RED : INK, textAlign: "center", lineHeight: 1.3 }}>{val}</div>
                          {!dragSubmitted && <button onClick={() => setDragMatches(p => ({ ...p, [letter]: null }))} style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", cursor: "pointer", color: GRAY, fontSize: 18, lineHeight: 1 }}>×</button>}
                        </>
                      ) : (
                        <div style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontStyle: "italic" }}>Drop here</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            {available4.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {available4.map(label => (
                  <div key={label} draggable onDragStart={() => { dragRef.current = label; }} onDragEnd={() => { dragRef.current = null; }}
                    style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", border: "1.5px solid #E2E8F0", cursor: "grab", userSelect: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Slide 5: CAR — what is m? ── */}
      {idx === 5 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "55%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 12 }}>
              <span style={{ color: ACCENT }}>m</span> is always the rate.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, color: GRAY, lineHeight: 1.7 }}>
              The price per hour. The km per litre. The dollars per item.<br />
              It&apos;s always the &ldquo;per&rdquo; number.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🚗</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.6 }}>
                  A car travels at <strong>60 km/hr</strong>. After <strong>h hours</strong>, the total distance is <strong>60h km</strong>.
                </div>
              </div>
              <FormulaRef type="ymx" />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: INK, marginBottom: 20 }}>What is <span style={{ fontFamily: MONO, color: ACCENT }}>m</span> in this scenario?</div>
              <OptionList options={["60 km/hr", "Hours driven", "Total distance"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 6: BAKER — what is x? ── */}
      {idx === 6 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "55%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 12 }}>
              <span style={{ color: ORANGE }}>x</span> is always the input.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, color: GRAY, lineHeight: 1.7 }}>
              The hours worked. The litres used. The items bought.<br />
              x is what you start with.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🍪</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.6 }}>
                  A baker makes <strong>12 cookies per batch</strong>. The total number of cookies is <strong>12 × batches</strong>.
                </div>
              </div>
              <FormulaRef type="ymx" />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: INK, marginBottom: 20 }}>What is <span style={{ fontFamily: MONO, color: ORANGE }}>x</span> in this scenario?</div>
              <OptionList options={["12 cookies per batch", "Number of batches", "Total cookies"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 7: PLUMBER — what is y? ── */}
      {idx === 7 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "55%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 12 }}>
              <span style={{ color: GREEN }}>y</span> is always the output.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, color: GRAY, lineHeight: 1.7 }}>
              The total cost. The total distance. The total items.<br />
              y is what you end up with.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🔧</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.6 }}>
                  A plumber charges <strong>$80 per hour</strong>. There is also a <strong>$50 callout fee</strong>.
                </div>
              </div>
              <FormulaRef type="ymx" />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: INK, marginBottom: 20 }}>What is <span style={{ fontFamily: MONO, color: GREEN }}>y</span> in this scenario?</div>
              <OptionList options={["$50 callout fee", "Hours worked", "Total charge"]} correct={2} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 8: CALLOUT — add the fixed fee ── */}
      {idx === 8 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "55%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 10 }}>
              What if the plumber also charges a $50 callout fee just to show up?
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, color: GRAY, lineHeight: 1.6 }}>
              Now y = mx doesn&apos;t tell the full story.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🔧</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.6 }}>
                  The same plumber charges <strong>$80 per hour</strong> and a fixed <strong>$50 callout fee</strong> every time.
                </div>
              </div>
              <FormulaRef type="ymxc" />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: INK, marginBottom: 20 }}>How would you add the $50 to the equation?</div>
              <OptionList options={["y = mx − 50", "y = mx + 50", "y = 50mx"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 9: DRAG — y = mx + c all four parts ── */}
      {idx === 9 && (() => {
        const DRAG_CORRECT9: Record<string, string> = { y: "Total Earnings", m: "Pay Per Hour", x: "Hours Worked", c: "$50 Callout Fee" };
        const ZONE_LABELS9: Record<string, string> = { y: "Output", m: "Rate of change", x: "Input", c: "Constant" };
        const DRAG_COLORS9: Record<string, string> = { y: GREEN, m: ACCENT, x: ORANGE, c: PURPLE };
        const ZONE_BG9: Record<string, string> = { y: "rgba(56,199,107,0.07)", m: "rgba(59,91,219,0.07)", x: "rgba(249,115,22,0.07)", c: "rgba(139,92,246,0.07)" };
        const ALL_CHIPS9 = ["Pay Per Hour", "Hours Worked", "Total Earnings", "$50 Callout Fee"];
        const placed9 = (["y","m","x","c"] as const).map(k => dragMatches[k]).filter(Boolean) as string[];
        const available9 = ALL_CHIPS9.filter(l => !placed9.includes(l));
        const allFilled9 = (["y","m","x","c"] as const).every(k => dragMatches[k] !== null);

        const handleDrop9 = (letter: string) => {
          const item = dragRef.current;
          if (!item || dragSubmitted) return;
          setDragMatches(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === item) next[k] = null; });
            next[letter] = item;
            return next;
          });
        };

        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.2, marginBottom: 8, maxWidth: "55%" }}>
              That $50 is the <span style={{ color: PURPLE }}>constant</span> — a fixed value added every time.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, color: GRAY, marginBottom: 20, lineHeight: 1.6 }}>
              In the equation we write it as <span style={{ fontFamily: MONO, fontWeight: 700, color: PURPLE }}>c</span>: <span style={{ fontFamily: MONO, fontWeight: 700 }}>y = mx + c</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: GRAY, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              Drag each label to the correct letter:
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 24 }}>
              {(["y", "m", "x", "c"] as const).map((letter, i) => {
                const val = dragMatches[letter];
                const color = DRAG_COLORS9[letter];
                const isCorrect9 = dragSubmitted && val === DRAG_CORRECT9[letter];
                const isWrong9   = dragSubmitted && val !== null && val !== DRAG_CORRECT9[letter];
                return (
                  <React.Fragment key={letter}>
                    {i === 1 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 28, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 2px" }}>=</div>}
                    {i === 2 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 28, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 2px" }}>×</div>}
                    {i === 3 && <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 28, fontWeight: 700, color: INK, flexShrink: 0, padding: "0 2px" }}>+</div>}
                    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleDrop9(letter); }}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "16px 10px", borderRadius: 16, minHeight: 120, position: "relative", background: isCorrect9 ? "#E7F8EC" : isWrong9 ? "#FDECEC" : ZONE_BG9[letter], border: `2px dashed ${isCorrect9 ? GREEN : isWrong9 ? RED : color}`, transition: "all 0.15s" }}>
                      <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" }}>{ZONE_LABELS9[letter]}</div>
                      <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color }}>({letter})</div>
                      {val ? (
                        <>
                          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: isWrong9 ? RED : INK, textAlign: "center", lineHeight: 1.3 }}>{val}</div>
                          {!dragSubmitted && <button onClick={() => setDragMatches(p => ({ ...p, [letter]: null }))} style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", cursor: "pointer", color: GRAY, fontSize: 16, lineHeight: 1 }}>×</button>}
                        </>
                      ) : (
                        <div style={{ fontFamily: FONT, fontSize: 12, color: "#CBD5E1", fontStyle: "italic" }}>Drop here</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            {available9.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {available9.map(label => (
                  <div key={label} draggable onDragStart={() => { dragRef.current = label; }} onDragEnd={() => { dragRef.current = null; }}
                    style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", border: "1.5px solid #E2E8F0", cursor: "grab", userSelect: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
            {allFilled9 && !dragSubmitted && (
              <div style={{ marginTop: 8 }} />
            )}
          </div>
        );
      })()}

      {/* ── Slide 10: TRAINER — what is c? ── */}
      {idx === 10 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "55%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 12 }}>
              <span style={{ color: PURPLE }}>c</span> is the fixed amount.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, color: GRAY, lineHeight: 1.6 }}>
              The registration fee. The callout charge. The one-off setup cost.<br />
              It&apos;s always the amount you pay regardless of x.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🏋️</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.6 }}>
                  A personal trainer charges <strong>$45 per session</strong> and a one-off <strong>$20 registration fee</strong>.
                </div>
              </div>
              <FormulaRef type="ymxc" />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: INK, marginBottom: 20 }}>What is <span style={{ fontFamily: MONO, color: PURPLE }}>c</span> in this scenario?</div>
              <OptionList options={["$45 per session", "Number of sessions", "$20 registration fee"]} correct={2} picked={picked} onPick={setPicked} />
            </div>
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
                {[20,30,40,50,60,70].map((_,i)=>(
                  <circle key={i} cx={20+i*10} cy={70-i*10} r="4.5" fill={ACCENT}/>
                ))}
              </svg>
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 30 30" style={{ position: "absolute", top: -2, right: -2 }}>
              <line x1="15" y1="2" x2="15" y2="8" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="6" x2="20" y2="10" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
              <line x1="28" y1="15" x2="22" y2="15" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.10em", marginBottom: 10 }}>PRACTICE UNLOCKED</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: INK, lineHeight: 1.1, marginBottom: 12, maxWidth: 520 }}>
            Now <span style={{ color: ACCENT }}>apply</span> what<br/>you&apos;ve learned.
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "#475569", marginBottom: 28 }}>
            Write the equation for each scenario.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {[[1,2,3,4,5],[6,7,8,9,10]].map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: "flex", gap: 12 }}>
                {row.map((n, i) => {
                  const globalIdx = rowIdx * 5 + i;
                  return (
                    <div key={n} style={{ width: 42, height: 42, borderRadius: "50%", background: globalIdx === 0 ? ACCENT : "transparent", border: globalIdx === 0 ? "none" : "2px solid #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: globalIdx === 0 ? "#fff" : "#94A3B8" }}>{n}</div>
                  );
                })}
              </div>
            ))}
          </div>
          <button onClick={() => setIdx(i => i + 1)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
            Start Practice
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}

      {/* ── Practice slides (12–21) ── */}
      {(idx >= 12 && idx <= 21) && (() => {
        const PRACTICE_DATA: Record<number, { emoji: string; question: string; options: string[]; formula: "ymx" | "ymxc" }> = {
          0: { emoji: "🎬", question: "Cinema tickets cost $12 each. You buy x tickets. Write an equation for the total cost y.", options: ["y = x + 12", "y = 12 + x", "y = 12x"], formula: "ymx" },
          1: { emoji: "🔨", question: "A handyman charges $25 per hour plus a $30 booking fee. Write an equation for the total cost y after x hours.", options: ["y = 25x", "y = 30x + 25", "y = 25x + 30", "y = 30 + 25"], formula: "ymxc" },
          2: { emoji: "🚿", question: "A plumber charges $80 per hour. There is no booking fee. Write an equation for the total charge y after x hours.", options: ["y = 80x", "y = x + 80", "y = 80x + 80"], formula: "ymx" },
          3: { emoji: "🎽", question: "A swimming pool charges $5 per hour and has a $10 entry fee. Write an equation for the total cost y after x hours.", options: ["y = 5x", "y = 5x + 10", "y = 10x + 5"], formula: "ymxc" },
          4: { emoji: "🏋️", question: "A gym charges $40 per session and a one-off $60 joining fee. Write an equation for the total cost y after x sessions.", options: ["y = 60x + 40", "y = 40x + 60", "y = 40x"], formula: "ymxc" },
          5: { emoji: "🐕", question: "A dog walker charges $15 per walk. There is no joining fee. Write an equation for total cost y after x walks.", options: ["y = x + 15", "y = 15x", "y = 15x + 15", "y = 15"], formula: "ymx" },
          6: { emoji: "🔧", question: "An electrician charges $70 per hour plus a $50 callout fee. Write an equation for the total cost y after x hours.", options: ["y = 70x", "y = 50x + 70", "y = 70x + 50"], formula: "ymxc" },
          7: { emoji: "📚", question: "A tutor charges $35 per lesson. There is no registration fee. Write an equation for the total cost y after x lessons.", options: ["y = 35x + 35", "y = x + 35", "y = 35x"], formula: "ymx" },
          8: { emoji: "🏊", question: "A gym charges $45 per month and a one-off $100 joining fee. Write an equation for the total cost y after x months.", options: ["y = 45x", "y = 100x + 45", "y = 45x + 100"], formula: "ymxc" },
          9: { emoji: "🔌", question: "An electrician charges $20 per hour. There is no call-out fee. Write an equation for the total charge y after x hours.", options: ["y = 20x + 20", "y = 20x", "y = x + 20"], formula: "ymx" },
        };
        const q = PRACTICE_DATA[practiceStep];
        if (!q) return null;
        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK, lineHeight: 1.1 }}>
                Write the <span style={{ color: ACCENT }}>equation.</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>{q.emoji}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: INK, lineHeight: 1.55 }}>{q.question}</div>
                </div>
                <FormulaRef type={q.formula} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,91,219,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                  <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: INK }}>Choose the best answer.</div>
                </div>
                <OptionList options={q.options} correct={CORRECT_BY_IDX[idx]} picked={picked} onPick={setPicked} />
              </div>
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
                <div key={i} style={{ width: 60, height: 60, borderRadius: 14, background: r === true ? GREEN : r === false ? RED : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {r === true  && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l7 7 11-11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {r === false && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 6l14 14M20 6L6 20" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" /></svg>}
                </div>
              ))}
            </div>
            <button onClick={() => setIdx(i => i + 1)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 48px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
              Continue
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        );
      })()}

      {/* ── Slide 23: COMPLETE ── */}
      {isLast && (
        <div style={{ position: "relative", zIndex: 1, padding: "36px 52px 140px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GREENBG, borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
              <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN} /><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12, color: GREEN_DK, letterSpacing: "0.09em" }}>LESSON COMPLETE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 18 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, lineHeight: 0.92 }}>Writing<br />Linear<br />Equations</div>
              <div style={{ position: "relative", width: 76, height: 76, flexShrink: 0 }}>
                <svg width="76" height="76" viewBox="0 0 76 76" style={{ position: "absolute", inset: 0 }}>
                  {[[38,4,38,14],[38,62,38,72],[4,38,14,38],[62,38,72,38],[11,11,18,18],[58,58,65,65],[11,65,18,58],[65,11,58,18]].map(([x1,y1,x2,y2],i)=>(
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
                  ))}
                </svg>
                <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M5 15l8 8 12-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
            <div style={{ height: 1.5, background: "rgba(59,91,219,0.12)", maxWidth: 460, marginBottom: 24 }} />
            <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", maxWidth: 460 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: GREENBG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,17 8,12 13,14 21,6" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="21" y1="6" x2="21" y2="11" stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="6" x2="21" y2="6" stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8 }}>Your Progress</div>
                <ProgressPills filled={completeFilled} total={10} color={GREEN} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: GREEN }}>40%</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "80%" }}><Graph2 color={GREEN} /></div>
          </div>
        </div>
      )}

      {/* ── Bottom bar ── */}
      {idx === 11 || idx === 22 ? null : isLast ? (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19V7a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke={ACCENT} strokeWidth="1.8" /><path d="M8 7v12M8 11h8" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: INK, marginBottom: 3 }}>Great work!</div>
              <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, color: "#475569" }}>You can now identify y, m, x and c in any linear equation.</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: GRAY, cursor: "pointer" }}>
              Back to lessons
            </button>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: GREEN, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(44,165,85,0.35)" }}>
              Next lesson
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      ) : (() => {
        // Drag slide bottom bars
        if ([1, 3, 4].includes(idx)) {
          const localCorrect: Record<number, Record<string, string>> = {
            1: { y: "$15,000", m: "$15 per hour", x: "1,000 hours" },
            3: { y: "$60 total", m: "$12 per hour", x: "5 hours" },
            4: { y: "$45 total", m: "$3 per km", x: "15 km" },
          };
          const keys = ["y","m","x"];
          const allFilled = keys.every(k => dragMatches[k] !== null);
          const allCorrect = allFilled && Object.entries(localCorrect[idx]).every(([k, v]) => dragMatches[k] === v);

          if (!dragSubmitted) {
            return (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {!isFirst ? (
                  <button onClick={() => { setPicked(null); setIdx(i => i - 1); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: INK, cursor: "pointer" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    BACK
                  </button>
                ) : <div />}
                {allFilled ? (
                  <button onClick={() => { setDragSubmitted(true); if (allCorrect) playCorrect(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: ACCENT, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                    CHECK ANSWERS
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                ) : <div />}
              </div>
            );
          }
          return (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: allCorrect ? GREENBG : "#FDECEC", borderTop: `2px solid ${allCorrect ? GREEN : RED}` }}>
              <button onClick={() => { setDragMatches({ y: null, m: null, x: null, c: null }); setDragSubmitted(false); setPicked(null); setIdx(i => i + 1); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: allCorrect ? GREEN_DK : RED, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: `0 4px 0 ${allCorrect ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink: 0 }}>
                CONTINUE
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          );
        }

        if (idx === 2) {
          const allFilled2 = ["y","m","x"].every(k => dragMatches[k] !== null);
          const allCorrect2 = allFilled2 && dragMatches.y === "output" && dragMatches.m === "rate" && dragMatches.x === "input";
          if (!dragSubmitted) {
            return (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => { setPicked(null); setIdx(i => i - 1); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: INK, cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  BACK
                </button>
                {allFilled2 ? (
                  <button onClick={() => { setDragSubmitted(true); if (allCorrect2) playCorrect(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: ACCENT, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                    CHECK ANSWERS
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                ) : <div />}
              </div>
            );
          }
          return (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: allCorrect2 ? GREENBG : "#FDECEC", borderTop: `2px solid ${allCorrect2 ? GREEN : RED}` }}>
              <button onClick={() => { setDragMatches({ y: null, m: null, x: null, c: null }); setDragSubmitted(false); setPicked(null); setIdx(i => i + 1); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: allCorrect2 ? GREEN_DK : RED, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: `0 4px 0 ${allCorrect2 ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink: 0 }}>
                CONTINUE
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          );
        }

        if (idx === 9) {
          const allFilled9 = (["y","m","x","c"] as const).every(k => dragMatches[k] !== null);
          const allCorrect9 = allFilled9 && dragMatches.y === "Total Earnings" && dragMatches.m === "Pay Per Hour" && dragMatches.x === "Hours Worked" && dragMatches.c === "$50 Callout Fee";
          if (!dragSubmitted) {
            return (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => { setPicked(null); setIdx(i => i - 1); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: INK, cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  BACK
                </button>
                {allFilled9 ? (
                  <button onClick={() => { setDragSubmitted(true); if (allCorrect9) playCorrect(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: ACCENT, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                    CHECK ANSWERS
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                ) : <div />}
              </div>
            );
          }
          return (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: allCorrect9 ? GREENBG : "#FDECEC", borderTop: `2px solid ${allCorrect9 ? GREEN : RED}` }}>
              <button onClick={() => { setDragMatches({ y: null, m: null, x: null, c: null }); setDragSubmitted(false); setPicked(null); setIdx(i => i + 1); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: allCorrect9 ? GREEN_DK : RED, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: `0 4px 0 ${allCorrect9 ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink: 0 }}>
                CONTINUE
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          );
        }

        if (!isQuestionSlide || picked === null) {
          return (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {!isFirst ? (
                <button onClick={() => { setPicked(null); setIdx(i => i - 1); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: INK, cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  BACK
                </button>
              ) : <div />}
              {isQuestionSlide ? (
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: GRAY }}>Pick an answer to continue</div>
              ) : (
                <button onClick={() => { setPicked(null); setIdx(i => i + 1); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: ACCENT, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
                  CONTINUE
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              )}
            </div>
          );
        }

        const isCorrect = picked === CORRECT_BY_IDX[idx];
        return (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "flex-end", background: isCorrect ? GREENBG : "#FDECEC", borderTop: `2px solid ${isCorrect ? GREEN : RED}` }}>
            <button onClick={handleContinue} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: isCorrect ? GREEN_DK : RED, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: `0 4px 0 ${isCorrect ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink: 0 }}>
              CONTINUE
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        );
      })()}

    </div>
    </>
  );
}
