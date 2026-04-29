"use client";
import React, { useState, useEffect } from "react";
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
const ORANGE   = "#F97316";
const PURPLE   = "#8B5CF6";

// ── Intro graph: circular grid with two crossing lines ────────────────────────
function IntroGraph() {
  const W=400, H=400, cx=200, cy=200, r=170;
  const xp=(v:number)=>cx+v/5.5*(r-20);
  const yp=(v:number)=>cy-v/5.5*(r-20);
  const pts:number[][] = [];
  for(let i=-5;i<=5;i++) pts.push([i,i]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="l6ax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1E293B"/>
        </marker>
        <clipPath id="l6clip"><circle cx={cx} cy={cy} r={r}/></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="rgba(59,91,219,0.07)"/>
      <g clipPath="url(#l6clip)">
        {[-4,-3,-2,-1,0,1,2,3,4].map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.8"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.8"/>
          </g>
        ))}
      </g>
      <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.5)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.5" markerEnd="url(#l6ax)"/>
      <line x1={xp(0)} y1={yp(5.5)} x2={xp(0)} y2={yp(-5.5)} stroke="#1E293B" strokeWidth="2.5"/>
      <text x={xp(5.5)+10} y={yp(0)+5} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">x</text>
      <text x={xp(0)+8} y={yp(5.5)-4} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">y</text>
      <line x1={xp(-5)} y1={yp(-5)} x2={xp(5)} y2={yp(5)} stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/>
      {pts.map(([x,y])=>(
        <circle key={x} cx={xp(x)} cy={yp(y)} r="7" fill={ACCENT}/>
      ))}
    </svg>
  );
}

// ── Two-lines crossing plot ───────────────────────────────────────────────────
function TwoLinesPlot({
  m1, c1, col1, name1,
  m2, c2, col2, name2,
  crossX, crossY,
  xMax = 8, yMax = 28,
  showCrossing = true,
  showLineLabels = true,
}: {
  m1: number; c1: number; col1: string; name1: string;
  m2: number; c2: number; col2: string; name2: string;
  crossX: number; crossY: number;
  xMax?: number; yMax?: number;
  showCrossing?: boolean;
  showLineLabels?: boolean;
}) {
  const W = 300, H = 240;
  const ML = 44, MR = 16, MT = 16, MB = 32;
  const pw = W - ML - MR, ph = H - MT - MB;
  const px = (x: number) => ML + x / xMax * pw;
  const py = (y: number) => MT + ph - y / yMax * ph;

  const gridStep = yMax <= 30 ? 5 : 20;
  const gridYs = Array.from({ length: Math.floor(yMax / gridStep) + 1 }, (_, i) => i * gridStep);
  const gridXs = Array.from({ length: xMax + 1 }, (_, i) => i);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {gridXs.map(x => <line key={`gv${x}`} x1={px(x)} y1={MT} x2={px(x)} y2={H-MB} stroke="rgba(31,37,68,0.07)" strokeWidth={1}/>)}
      {gridYs.map(y => <line key={`gh${y}`} x1={ML} y1={py(y)} x2={W-MR} y2={py(y)} stroke="rgba(31,37,68,0.07)" strokeWidth={1}/>)}
      <line x1={ML} y1={py(0)} x2={W-MR} y2={py(0)} stroke={INK} strokeWidth={2} opacity={0.2}/>
      <line x1={px(0)} y1={MT} x2={px(0)} y2={H-MB} stroke={INK} strokeWidth={2} opacity={0.2}/>
      {[2,4,6,8].filter(x=>x<=xMax).map(x=><text key={`xl${x}`} x={px(x)} y={H-MB+14} fontFamily={MONO} fontSize="10" fill={GRAY} textAnchor="middle">{x}</text>)}
      {gridYs.filter(y=>y>0).map(y=><text key={`yl${y}`} x={ML-6} y={py(y)+4} fontFamily={MONO} fontSize="10" fill={GRAY} textAnchor="end">{y}</text>)}

      {/* Line 1 */}
      <line
        x1={px(0)} y1={py(Math.max(0, c1))}
        x2={px(xMax)} y2={py(m1*xMax+c1)}
        stroke={col1} strokeWidth={2.5} strokeLinecap="round"
      />
      {/* Line 2 */}
      <line
        x1={px(0)} y1={py(Math.max(0, c2))}
        x2={px(xMax)} y2={py(m2*xMax+c2)}
        stroke={col2} strokeWidth={2.5} strokeLinecap="round"
      />

      {/* Labels */}
      {showLineLabels && <>
        <text x={px(xMax)-4} y={py(m1*xMax+c1)-6} fontFamily={FONT} fontSize="11" fill={col1} textAnchor="end" fontWeight="700">{name1}</text>
        <text x={px(xMax)-4} y={py(m2*xMax+c2)+14} fontFamily={FONT} fontSize="11" fill={col2} textAnchor="end" fontWeight="700">{name2}</text>
      </>}

      {/* Crossing point */}
      {showCrossing && <>
        <circle cx={px(crossX)} cy={py(crossY)} r={7} fill="#fff" stroke={INK} strokeWidth={2}/>
        <circle cx={px(crossX)} cy={py(crossY)} r={4} fill={INK}/>
        <text x={px(crossX)+10} y={py(crossY)-6} fontFamily={MONO} fontSize="11" fill={INK} fontWeight="700">({crossX}, {crossY})</text>
      </>}
    </svg>
  );
}

// ── ProgressPills ─────────────────────────────────────────────────────────────
function ProgressPills({ filled, total, color = ACCENT }: { filled: number; total: number; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 8, flex: 1, borderRadius: 99, background: i < filled ? color : "#CBD5E1", transition: "background 0.4s ease" }}/>
      ))}
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
            <linearGradient id="l6-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe"/><stop offset=".77" stopColor="#1c45f6"/>
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l6-logo-grad)"/>
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
            {showCheck && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {showCross && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
          </div>
        );
      })}
    </div>
  );
}

function QuestionBubble({ label = "Choose the best answer." }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 22, color: ACCENT }}>?</div>
      <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: INK }}>{label}</div>
    </div>
  );
}

// ── Algebra step card ─────────────────────────────────────────────────────────
function AlgebraCard({ title, steps }: { title?: string; steps: string[] }) {
  return (
    <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px 24px" }}>
      {title && <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: GRAY, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{title}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ fontFamily: MONO, fontSize: 17, fontWeight: i === steps.length - 1 ? 800 : 500, color: i === steps.length - 1 ? ACCENT : INK, lineHeight: 1.4 }}>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Taxi context card ─────────────────────────────────────────────────────────
function TaxiCard({ km }: { km: number }) {
  const a = 2 * km + 5;
  const b = 3 * km;
  return (
    <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: GRAY, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>Calculate the cost at {km}km</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: "#fff" }}>A</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 15, color: INK }}>
            2({km}) + 5 = <strong style={{ color: ACCENT }}>${a}</strong>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: "#fff" }}>B</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 15, color: INK }}>
            3({km}) = <strong style={{ color: ORANGE }}>${b}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Slide manifest ────────────────────────────────────────────────────────────
const SLIDES = [
  { id: "intro"           }, // 0
  { id: "taxi_1km"        }, // 1
  { id: "taxi_20km"       }, // 2
  { id: "system_def"      }, // 3
  { id: "graph_crossing"  }, // 4
  { id: "phone_plans"     }, // 5
  { id: "solve_taxi"      }, // 6
  { id: "plug_taxi"       }, // 7
  { id: "solve_stream"    }, // 8
  { id: "solve_stream2"   }, // 9
  { id: "solve_y_gym"     }, // 10
  { id: "final_test_x"    }, // 11
  { id: "final_test_y"    }, // 12
  { id: "practice_unlocked"},// 13
  { id: "p1"  }, { id: "p2"  }, { id: "p3"  }, { id: "p4"  }, { id: "p5"  },
  { id: "p6"  }, { id: "p7"  }, { id: "p8"  }, { id: "p9"  }, { id: "p10" },
  { id: "score"           }, // 24
  { id: "complete"        }, // 25
];

const PROGRESS = [
  0.04,0.09,0.14,0.19,0.24,0.29,0.34,0.39,0.44,0.49,0.54,0.59,0.64,
  1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0
];

export default function InteractiveLessonL6({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
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

  const isLast      = idx === SLIDES.length - 1;
  const isFirst     = idx === 0;
  const isPractice  = idx >= 14 && idx <= 23;
  const practiceStep = isPractice ? idx - 14 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isQuestionSlide = (idx >= 1 && idx <= 12) || isPractice;

  useEffect(() => {
    if (isLast) { setCompleteFilled(5); const t = setTimeout(() => setCompleteFilled(6), 600); return () => clearTimeout(t); }
  }, [idx, isLast]);

  const CORRECT_BY_IDX: Record<number, number> = {
    1: 1,  2: 0,  3: 1,  4: 1,  5: 1,  6: 1,  7: 1,  8: 1,  9: 1, 10: 1, 11: 1, 12: 1,
    14: 1, 15: 0, 16: 1, 17: 0, 18: 0, 19: 1, 20: 1, 21: 2, 22: 2, 23: 0,
  };

  const EXPLAIN_DATA: Record<number, [string, string]> = {
    1:  ["Taxi A: 2(1)+5 = $7. Taxi B: 3(1) = $3. Taxi B is cheaper for short trips.", "Check both: Taxi A costs 2(1)+5 = $7, Taxi B costs 3(1) = $3. Taxi B wins at 1km."],
    2:  ["Taxi A: 2(20)+5 = $45. Taxi B: 3(20) = $60. Taxi A is cheaper for long trips.", "Check both: Taxi A costs 2(20)+5 = $45, Taxi B costs 3(20) = $60. Taxi A wins at 20km."],
    3:  ["A system of equations finds the exact point where two functions are equal — the crossing point on a graph.", "It doesn't find the cheapest overall — it finds the specific distance where both taxis cost the same."],
    4:  ["The lines cross at (5, 15). At 5km both taxis cost $15 — that's where they're equal.", "Read the crossing point carefully: both lines meet at (5, 15), not (3, 9) or (8, 20)."],
    5:  ["The lines cross at (4, 60). After 4 months both plans have cost $60 — that's the breakeven point.", "The crossing point is (4, 60) — read where the two lines intersect on the graph."],
    6:  ["2x + 5 = 3x → subtract 2x from both sides → 5 = x. Both taxis cost the same at 5km.", "Move the x terms to one side: 2x + 5 = 3x → 5 = 3x − 2x → 5 = x."],
    7:  ["y = 3(5) = 15. At 5km both taxis cost $15. The crossing point is (5, 15).", "Substitute x = 5 into either equation: y = 3(5) = 15, or y = 2(5)+5 = 15. Both give 15."],
    8:  ["8x + 12 = 10x → 12 = 2x → x = 6. Both services cost the same after 6 months.", "Collect the x terms: 8x + 12 = 10x → 12 = 10x − 8x → 12 = 2x → x = 6."],
    9:  ["y = 10(6) = 60. At 6 months both services cost $60. The crossing point is (6, 60).", "Substitute x = 6: y = 10(6) = 60 or y = 8(6)+12 = 60. Both give 60."],
    10: ["2x + 3 = 4x − 1 → 3 + 1 = 4x − 2x → 4 = 2x → x = 2.", "Move like terms together: 2x + 3 = 4x − 1 → 4 = 2x → x = 2. Not 3 or 4."],
    11: ["y = 2(2) + 3 = 7. The crossing point is (2, 7).", "Substitute x = 2: y = 2(2)+3 = 7. Or check the other: y = 4(2)−1 = 7. Both match."],
  };

  const CORRECT_LABELS = ["That's right.", "Well done.", "Spot on.", "Correct!"];

  const TAKEAWAY_DATA: Record<number, string> = {
    1:  "To compare two functions, substitute the same x into both and compare the results.",
    2:  "At large x, the function with the smaller slope becomes cheaper.",
    3:  "A system of equations finds the one x where both functions give equal output.",
    4:  "The crossing point is (x, y) — read both coordinates where the lines meet.",
    5:  "The crossing point is where two lines physically intersect — not just where they're close.",
    6:  "Set equal, collect x terms, solve for x — that's where both functions give the same output.",
    7:  "After finding x, substitute back into either equation to find y.",
    8:  "Collect x terms on one side first, then solve for x.",
    9:  "Substitute x back in to find y. Both equations should give the same answer.",
    10: "Move all x terms to one side, all constants to the other, then solve.",
    11: "Always check: substitute x into both equations — they should both give the same y.",
  };

  const TIP_DATA: Record<number, string> = {
    1:  "To compare, substitute the same x value into both equations. The smaller result is cheaper.",
    2:  "At small x, a high fixed cost (c) makes a function expensive. At large x, the slope (m) dominates.",
    3:  "Setting equations equal finds the crossing point — the exact x where both give the same output.",
    4:  "Read the crossing point carefully: it's a pair (x, y), not just a single number.",
    5:  "The crossing point is where the two lines physically meet. Read both coordinates off the graph.",
    6:  "On the SAT: write both equations, set them equal, get all x terms on one side, solve.",
    7:  "After solving for x, pick the simpler equation to substitute into. Both give the same y.",
    8:  "Move all x terms to one side in one step. Then solve. Don't mix constants and x terms.",
    9:  "To verify: substitute x into both original equations. If both give the same y, you're right.",
    10: "Standard algebra: x terms left, constants right, then divide both sides by the x coefficient.",
    11: "Check your answer: substitute x = 2 into y = 2x + 3 and y = 4x − 1. Both should give 7.",
  };

  const tipMessage = TIP_DATA[idx];
  const autoMessage = (picked !== null && EXPLAIN_DATA[idx])
    ? picked === CORRECT_BY_IDX[idx]
      ? `Well done! ${EXPLAIN_DATA[idx][0]}\n\nKey takeaway: ${TAKEAWAY_DATA[idx] ?? ""}`
      : `Not quite. ${EXPLAIN_DATA[idx][1]}\n\nKey takeaway: ${TAKEAWAY_DATA[idx] ?? ""}`
    : undefined;

  const handleContinue = () => {
    if (isPractice) {
      const ok = picked === CORRECT_BY_IDX[idx];
      setPracticeResults(r => { const n=[...r]; n[practiceStep]=ok; return n; });
    }
    setPicked(null);
    setIdx(i => i + 1);
  };

  if (isMobile) return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"#F5F7FA", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, fontFamily:'"Inter, ui-sans-serif, system-ui, sans-serif"', flexDirection:"column", gap:16, padding:24, textAlign:"center" }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#94A3B8" strokeWidth="1.5"/><circle cx="12" cy="17" r="1" fill="#94A3B8"/></svg>
      <div style={{ fontSize:20, fontWeight:800, color:"#1E293B" }}>Desktop only</div>
      <div style={{ fontSize:14, color:"#94A3B8", maxWidth:240, lineHeight:1.6 }}>These lessons are not yet available on mobile. Please open on a desktop or laptop to continue.</div>
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
      answeredCorrect={picked !== null ? picked === CORRECT_BY_IDX[idx] : undefined}
    />
    <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, right:isMobile?0:CHAT_W, background: "#fff", fontFamily: FONT, zIndex: 100, overflowY: "auto" }}>

      <EdHeader onChatOpen={isMobile ? () => setChatOpen(true) : undefined} isMobile={isMobile} />

      {/* ── Progress bar ── */}
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
            <div style={{ height: "100%", width: `${(PROGRESS[idx] ?? 1) * 100}%`, borderRadius: 99, background: isLast ? GREEN : ACCENT, transition: "width 0.6s ease, background 0.4s ease" }}/>
          </div>
        )}
      </div>

      {/* ── Slide 0: INTRO ── */}
      {idx === 0 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase" as const, marginBottom: 10 }}>Today&apos;s lesson</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize:heroFs, color: INK, lineHeight: 0.95, marginBottom: 14 }}>Systems of<br/>Equations</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
              We&apos;ll learn how to find the exact point where two linear functions are equal — and why it matters.
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase" as const, marginBottom: 6 }}>Your progress</div>
                <ProgressPills filled={5} total={8} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: ACCENT }}>60%</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "75%" }}><IntroGraph /></div>
          </div>
        </div>
      )}

      {/* ── Slide 1: TAXI 1KM ── */}
      {idx === 1 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
              Sometimes we need to <span style={{ color: ACCENT }}>compare</span> between two linear equations.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
              For example, imagine you&apos;re choosing between taxi companies.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                [ACCENT, "A", "Taxi A charges $2 per km plus a $5 booking fee."],
                [ORANGE, "B", "Taxi B charges $3 per km with no booking fee."],
              ].map(([color, label, text]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 14, fontWeight: 900, color: "#fff" }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text as string}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <QuestionBubble label="Which taxi is cheaper for a 1km trip?" />
            <OptionList options={["Taxi A", "Taxi B"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 2: TAXI 20KM ── */}
      {idx === 2 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>What about a 20km trip?</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
              Is the same taxi service cheaper? Or a different one?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                [ACCENT, "A", "Taxi A charges $2 per km plus a $5 booking fee."],
                [ORANGE, "B", "Taxi B charges $3 per km with no booking fee."],
              ].map(([color, label, text]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 14, fontWeight: 900, color: "#fff" }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text as string}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <QuestionBubble label="Which taxi is cheaper for a 20km trip?" />
            <OptionList options={["Taxi A", "Taxi B"]} correct={0} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 3: SYSTEM DEFINITION ── */}
      {idx === 3 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              So the best choice of taxi service <span style={{ color: ACCENT }}>flips somewhere</span> between 1km and 20km.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "At some point both taxis cost exactly the same.",
                "After that point, one becomes cheaper forever.",
                "A system of equations finds the exact point where the cost of the two taxi services become equal.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(59,91,219,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{i + 1}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK, lineHeight: 1.5 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <QuestionBubble label="What does a system of equations find?" />
            <OptionList
              options={["The cheapest option overall", "The point where two equations are equal", "The highest value of both equations"]}
              correct={1} picked={picked} onPick={setPicked}
            />
          </div>
        </div>
      )}

      {/* ── Slide 4: GRAPH CROSSING (taxi) ── */}
      {idx === 4 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
              Plot both equations on the same graph to find where they cross.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
              Where they cross is where both taxis cost the same.
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px" }}>
              <TwoLinesPlot m1={2} c1={5} col1={ACCENT} name1="Taxi A" m2={3} c2={0} col2={ORANGE} name2="Taxi B" crossX={5} crossY={15} xMax={8} yMax={28} showCrossing={false} showLineLabels={false}/>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 10 }}>
                {[["Taxi A", ACCENT], ["Taxi B", ORANGE]].map(([name, color]) => (
                  <div key={name as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 3, borderRadius: 2, background: color as string }}/>
                    <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: color as string }}>{name as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <QuestionBubble label="Where do the two lines cross?" />
            <OptionList options={["(3, 9)", "(5, 15)", "(8, 20)"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 5: PHONE PLANS GRAPH ── */}
      {idx === 5 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 16 }}>Let&apos;s practice it again.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {[
                [PURPLE, "A", "Plan A charges $10 per month plus a $20 setup fee."],
                [GREEN,  "B", "Plan B charges $15 per month with no setup fee."],
              ].map(([color, label, text]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 14, fontWeight: 900, color: "#fff" }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text as string}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px 20px" }}>
              <TwoLinesPlot m1={10} c1={20} col1={PURPLE} name1="Plan A" m2={15} c2={0} col2={GREEN} name2="Plan B" crossX={4} crossY={60} xMax={7} yMax={90} showCrossing={false} showLineLabels={false}/>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 10 }}>
                {[["Plan A", PURPLE], ["Plan B", GREEN]].map(([name, color]) => (
                  <div key={name as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 3, borderRadius: 2, background: color as string }}/>
                    <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: color as string }}>{name as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <QuestionBubble label="At how many months do both plans cost the same?" />
            <OptionList options={["2 months", "4 months", "6 months"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 6: SOLVE 2x+5=3x ── */}
      {idx === 6 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              But what if you don&apos;t have a graph?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                You can also find the crossing point algebraically. Just set both equations equal to each other.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  [ACCENT, "A", "y = 2x + 5"],
                  [ORANGE, "B", "y = 3x"],
                ].map(([color, label, eq]) => (
                  <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 13, fontWeight: 900, color: "#fff" }}>{label}</div>
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY }}>Taxi {label}:</div>
                    <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                At the crossing point, both equal the same y. So:
              </div>
              <div style={{ background: "rgba(59,91,219,0.10)", borderRadius: 12, padding: "16px 20px", textAlign: "center" as const }}>
                <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT }}>2x + 5 = 3x</span>
              </div>
            </div>
          </div>
          <div>
            <QuestionBubble label="What would x tell us?" />
            <OptionList options={["The km where Taxi A is always cheaper", "The km where both taxis cost the same", "The total cost of the trip"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 7: SOLVE FOR x ── */}
      {idx === 7 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              But what if you don&apos;t have a graph?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                You can also find the crossing point algebraically. Just set both equations equal to each other.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  [ACCENT, "A", "y = 2x + 5"],
                  [ORANGE, "B", "y = 3x"],
                ].map(([color, label, eq]) => (
                  <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 13, fontWeight: 900, color: "#fff" }}>{label}</div>
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY }}>Taxi {label}:</div>
                    <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                At the crossing point, both equal the same y. So:
              </div>
              <div style={{ background: "rgba(59,91,219,0.10)", borderRadius: 12, padding: "16px 20px", textAlign: "center" as const }}>
                <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT }}>2x + 5 = 3x</span>
              </div>
            </div>
          </div>
          <div>
            <QuestionBubble label="Solve for x." />
            <OptionList options={["x = 3", "x = 5", "x = 7"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 8: SOLVE 8x+12=10x ── */}
      {idx === 8 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "start", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              Apply the same method.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                Two streaming services charge different rates.
              </div>
              {[
                [ACCENT, "A", "y = 8x + 12"],
                [ORANGE, "B", "y = 10x"],
              ].map(([color, label, eq]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 13, fontWeight: 900, color: "#fff" }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY }}>Service {label}:</div>
                  <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                </div>
              ))}
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                At the crossing point, both equal the same y. So:
              </div>
              <div style={{ background: "rgba(59,91,219,0.10)", borderRadius: 12, padding: "16px 20px", textAlign: "center" as const }}>
                <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT }}>8x + 12 = 10x</span>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 80 }}>
            <QuestionBubble label="Solve for x." />
            <OptionList options={["x = 4", "x = 6", "x = 8"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 9: PRACTICE 2 — solve 4x+15=7x ── */}
      {idx === 9 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "start", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              Apply the same method.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                Two gym memberships charge different rates.
              </div>
              {[
                [ACCENT, "A", "y = 4x + 15"],
                [ORANGE, "B", "y = 7x"],
              ].map(([color, label, eq]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 13, fontWeight: 900, color: "#fff" }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY }}>Gym {label}:</div>
                  <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                </div>
              ))}
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                At the crossing point, both equal the same y. So:
              </div>
              <div style={{ background: "rgba(59,91,219,0.10)", borderRadius: 12, padding: "16px 20px", textAlign: "center" as const }}>
                <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT }}>4x + 15 = 7x</span>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 80 }}>
            <QuestionBubble label="Solve for x." />
            <OptionList options={["x = 3", "x = 5", "x = 7"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 10: SOLVE FOR y (gym, x=5) ── */}
      {idx === 10 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "start", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
              One last thing. We can also solve for y.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
              Once you know x, substitute it into either equation to find the actual cost at the crossing point.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK, marginBottom: 14 }}>
                  Substitute x = 5 into either of these equations to find y:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    [ACCENT, "A", "y = 4x + 15"],
                    [ORANGE, "B", "y = 7x"],
                  ].map(([color, label, eq]) => (
                    <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 7, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 12, fontWeight: 900, color: "#fff" }}>{label}</div>
                      <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK, lineHeight: 1.6 }}>
                This tells us the exact cost at the crossing point — the amount both gyms charge after the same number of months.
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 80 }}>
            <QuestionBubble label="What is y at the crossing point?" />
            <OptionList options={["y = 28", "y = 35", "y = 42"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 11: PLUG x=6 BACK IN ── */}
      {/* ── Slide 13: PRACTICE UNLOCKED ── */}
      {idx === 13 && (
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
                {[20,30,40,50,60,70].map((_,i)=>(
                  <circle key={i} cx={20+i*10} cy={70-i*10} r="4.5" fill={ACCENT}/>
                ))}
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
            Solve 10 systems of equations questions.
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
          <button onClick={() => { setPicked(null); setIdx(14); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
            Start Practice
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}

      {/* ── Slide 11: FINAL TEST — solve for x ── */}
      {idx === 11 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "start", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              One final test.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                Two delivery services charge different rates.
              </div>
              {[
                [ACCENT, "A", "y = 2x + 6"],
                [ORANGE, "B", "y = 4x"],
              ].map(([color, label, eq]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 13, fontWeight: 900, color: "#fff" }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY }}>Service {label}:</div>
                  <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                </div>
              ))}
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>
                At the crossing point, both equal the same y. So:
              </div>
              <div style={{ background: "rgba(59,91,219,0.10)", borderRadius: 12, padding: "16px 20px", textAlign: "center" as const }}>
                <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT }}>2x + 6 = 4x</span>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 80 }}>
            <QuestionBubble label="Solve for x." />
            <OptionList options={["x = 2", "x = 3", "x = 4"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 12: FINAL TEST — solve for y ── */}
      {idx === 12 && (
        <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "start", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>
              Now let&apos;s find y.
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
              Once you know x, substitute it into either equation to find the actual cost at the crossing point.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK, marginBottom: 14 }}>
                  Substitute x = 3 into either of these equations to find y:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    [ACCENT, "A", "y = 2x + 6"],
                    [ORANGE, "B", "y = 4x"],
                  ].map(([color, label, eq]) => (
                    <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 7, background: color as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 12, fontWeight: 900, color: "#fff" }}>{label}</div>
                      <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: INK }}>{eq as string}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK, lineHeight: 1.6 }}>
                This tells us the exact cost at the crossing point — the amount both services charge after the same number of deliveries.
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 80 }}>
            <QuestionBubble label="What is y at the crossing point?" />
            <OptionList options={["y = 8", "y = 12", "y = 16"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Practice slides 14–23 ── */}
      {isPractice && (() => {
        const PDATA = [
          // Q1-Q2: which is cheaper?
          { type: "compare", question: "Which is cheaper for 1 month?",   options: ["Gym A", "Gym B"], cor: 1, km: 1  },
          { type: "compare", question: "Which is cheaper for 10 months?", options: ["Gym A", "Gym B"], cor: 0, km: 10 },
          // Q3-Q4: Plan A=2x+5, Plan B=3x → x=5, y=15
          { type: "solve_x", nameA:"Plan A", eqA:"y = 2x + 5", nameB:"Plan B", eqB:"y = 3x", setup:"2x + 5 = 3x", question:"Solve for x.", options:["x = 3","x = 5","x = 7"], cor:1 },
          { type: "solve_y", nameA:"Plan A", eqA:"y = 2x + 5", nameB:"Plan B", eqB:"y = 3x", xVal:5, question:"What is y at the crossing point?", options:["y = 15","y = 12","y = 18"], cor:0 },
          // Q5-Q6: Service A=4x+6, Service B=7x → x=2, y=14
          { type: "solve_x", nameA:"Service A", eqA:"y = 4x + 6", nameB:"Service B", eqB:"y = 7x", setup:"4x + 6 = 7x", question:"Solve for x.", options:["x = 2","x = 3","x = 4"], cor:0 },
          { type: "solve_y", nameA:"Service A", eqA:"y = 4x + 6", nameB:"Service B", eqB:"y = 7x", xVal:2, question:"What is y at the crossing point?", options:["y = 10","y = 14","y = 18"], cor:1 },
          // Q7-Q8: Plan A=x+8, Plan B=3x → x=4, y=12
          { type: "solve_x", nameA:"Plan A", eqA:"y = x + 8", nameB:"Plan B", eqB:"y = 3x", setup:"x + 8 = 3x", question:"Solve for x.", options:["x = 3","x = 4","x = 5"], cor:1 },
          { type: "solve_y", nameA:"Plan A", eqA:"y = x + 8", nameB:"Plan B", eqB:"y = 3x", xVal:4, question:"What is y at the crossing point?", options:["y = 8","y = 16","y = 12"], cor:2 },
          // Q9-Q10: Service A=3x+9, Service B=6x → x=3, y=18
          { type: "solve_x", nameA:"Service A", eqA:"y = 3x + 9", nameB:"Service B", eqB:"y = 6x", setup:"3x + 9 = 6x", question:"Solve for x.", options:["x = 2","x = 4","x = 3"], cor:2 },
          { type: "solve_y", nameA:"Service A", eqA:"y = 3x + 9", nameB:"Service B", eqB:"y = 6x", xVal:3, question:"What is y at the crossing point?", options:["y = 18","y = 12","y = 24"], cor:0 },
        ] as const;
        const q = PDATA[practiceStep];
        return (
          <div style={{ position: "relative", zIndex: 1, padding:slidePad, display: "grid", gridTemplateColumns:cols2, gap: 48, alignItems: "start", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK, lineHeight: 1.1, marginBottom: 24 }}>
                Question <span style={{ color: ACCENT }}>{practiceStep + 1}.</span>
              </div>
              {q.type === "compare" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>Two gyms charge different rates.</div>
                  {[
                    [ACCENT, "A", "Gym A charges $4 per month plus a $10 joining fee."],
                    [ORANGE, "B", "Gym B charges $6 per month with no joining fee."],
                  ].map(([col, lbl, txt]) => (
                    <div key={lbl as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: col as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 13, fontWeight: 900, color: "#fff" }}>{lbl}</div>
                      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: INK }}>{txt as string}</div>
                    </div>
                  ))}
                </div>
              ) : q.type === "solve_x" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    [ACCENT, (q as {nameA:string}).nameA, (q as {eqA:string}).eqA],
                    [ORANGE, (q as {nameB:string}).nameB, (q as {eqB:string}).eqB],
                  ].map(([col, name, eq]) => (
                    <div key={name as string} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 18px" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: col as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 11, fontWeight: 900, color: "#fff" }}>{(name as string).split(" ").pop()}</div>
                      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: GRAY }}>{name as string}:</div>
                      <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: INK }}>{eq as string}</div>
                    </div>
                  ))}
                  <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "13px 18px", fontFamily: FONT, fontSize: 14, fontWeight: 500, color: INK }}>At the crossing point, both equal the same y. So:</div>
                  <div style={{ background: "rgba(59,91,219,0.10)", borderRadius: 12, padding: "14px 18px", textAlign: "center" as const }}>
                    <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 800, color: ACCENT }}>{(q as {setup:string}).setup}</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: INK, marginBottom: 12 }}>
                      Substitute x = {(q as {xVal:number}).xVal} into either equation to find y:
                    </div>
                    {[
                      [ACCENT, (q as {nameA:string}).nameA, (q as {eqA:string}).eqA],
                      [ORANGE, (q as {nameB:string}).nameB, (q as {eqB:string}).eqB],
                    ].map(([col, name, eq]) => (
                      <div key={name as string} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: col as string, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 11, fontWeight: 900, color: "#fff" }}>{(name as string).split(" ").pop()}</div>
                        <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: INK }}>{eq as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ paddingTop: 60 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,91,219,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: INK }}>Choose the best answer.</div>
              </div>
              <OptionList options={q.options as unknown as string[]} correct={q.cor} picked={picked} onPick={setPicked} />
            </div>
          </div>
        );
      })()}

      {/* ── Slide 24: SCORE ── */}
      {idx === 24 && (() => {
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

      {/* ── Slide 25: COMPLETE ── */}
      {isLast && (
        <div style={{ position: "relative", zIndex: 1, padding:isMobile?"16px 16px 80px":"36px 52px 140px", display: "grid", gridTemplateColumns:cols2, gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GREENBG, borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
              <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN}/><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12, color: GREEN_DK, letterSpacing: "0.09em" }}>LESSON COMPLETE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 18 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, lineHeight: 0.92 }}>Systems of<br/>Equations</div>
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
            <div style={{ width: "75%" }}><IntroGraph /></div>
          </div>
        </div>
      )}

      {/* ── Bottom bar ── */}
      {isLast ? (
        <div style={{ position: "fixed", bottom: 0, left: 0, right:isMobile?0:CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding:barPad, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, color: "#475569" }}>You can find the exact crossing point of two linear equations — both graphically and algebraically.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: GRAY, cursor: "pointer" }}>Back to lessons</button>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: GREEN, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(44,165,85,0.35)" }}>
              Next lesson <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      ) : idx === 13 || idx === 24 ? null : (() => {
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
        const isCorrect = picked === CORRECT_BY_IDX[idx];
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
