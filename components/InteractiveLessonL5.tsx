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
const ORANGE   = "#F97316";

// ── Intro circular graph ──────────────────────────────────────────────────────
function Graph2({ color = ACCENT }: { color?: string }) {
  const W=400, H=400, cx=200, cy=200, r=170;
  const xp=(v:number)=>cx+v/5.5*(r-20);
  const yp=(v:number)=>cy-v/5.5*(r-20);
  const pts:number[][] = [];
  for(let i=-5;i<=5;i++) pts.push([i, 2*i+3 > 5.5 ? 5.5 : 2*i+3 < -5.5 ? -5.5 : 2*i+3]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="l5ax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1E293B"/>
        </marker>
        <clipPath id="l5clip"><circle cx={cx} cy={cy} r={r}/></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="rgba(59,91,219,0.07)"/>
      <g clipPath="url(#l5clip)">
        {[-4,-3,-2,-1,0,1,2,3,4].map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.8"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.8"/>
          </g>
        ))}
        <line x1={xp(-3.25)} y1={yp(-3.5)} x2={xp(1.25)} y2={yp(5.5)} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.5)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.5" markerEnd="url(#l5ax)"/>
      <line x1={xp(0)} y1={yp(5.5)} x2={xp(0)} y2={yp(-5.5)} stroke="#1E293B" strokeWidth="2.5"/>
      <text x={xp(5.5)+10} y={yp(0)+5} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">x</text>
      <text x={xp(0)+8} y={yp(5.5)-4} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">y</text>
      <circle cx={xp(0)} cy={yp(3)} r={8} fill={color}/>
      <text x={xp(0)+12} y={yp(3)+5} fontFamily={MONO} fontSize="13" fill={color} fontWeight="700">(0, 3)</text>
    </svg>
  );
}

// ── Parameterised line graph ──────────────────────────────────────────────────
function LineGraph({ m, c, showYIntercept = true, showSlope = false, showPlotPoints = false, highlightIntercept = false }: {
  m: number; c: number;
  showYIntercept?: boolean;
  showSlope?: boolean;
  showPlotPoints?: boolean;
  highlightIntercept?: boolean;
}) {
  const W = 380, H = 210;
  const ML = 36, MR = 16, MT = 16, MB = 26;
  const xMin = -1, xMax = 5, yMin = 0, yMax = 11;
  const pw = W - ML - MR, ph = H - MT - MB;
  const px = (x: number) => ML + (x - xMin) / (xMax - xMin) * pw;
  const py = (y: number) => MT + (yMax - y) / (yMax - yMin) * ph;

  const candidates: [number, number][] = [];
  const yAtXmin = m * xMin + c; if (yAtXmin >= yMin && yAtXmin <= yMax) candidates.push([xMin, yAtXmin]);
  const yAtXmax = m * xMax + c; if (yAtXmax >= yMin && yAtXmax <= yMax) candidates.push([xMax, yAtXmax]);
  if (m !== 0) {
    const xAtYmin = (yMin - c) / m; if (xAtYmin > xMin && xAtYmin < xMax) candidates.push([xAtYmin, yMin]);
    const xAtYmax = (yMax - c) / m; if (xAtYmax > xMin && xAtYmax < xMax) candidates.push([xAtYmax, yMax]);
  }
  candidates.sort((a, b) => a[0] - b[0]);
  const seg = candidates.length >= 2 ? [candidates[0], candidates[candidates.length - 1]] : null;

  const yInt = c;
  const gridXs = [-1, 0, 1, 2, 3, 4, 5];
  const gridYs = [0, 2, 4, 6, 8, 10];
  const slopeAx = 1, slopeAy = m * 1 + c;
  const slopeBx = 2, slopeBy = m * 2 + c;
  const plotPts = [0, 1, 2].map(x => ({ x, y: m * x + c })).filter(p => p.y >= yMin && p.y <= yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="l5ax" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill={INK} opacity="0.35"/>
        </marker>
      </defs>
      {gridXs.map(x => <line key={`gv${x}`} x1={px(x)} y1={MT} x2={px(x)} y2={H-MB} stroke={x === 0 ? "#94A3B8" : "#E2E8F0"} strokeWidth={x === 0 ? 1.5 : 1}/>)}
      {gridYs.map(y => <line key={`gh${y}`} x1={ML} y1={py(y)} x2={W-MR} y2={py(y)} stroke={y === 0 ? "#94A3B8" : "#E2E8F0"} strokeWidth={y === 0 ? 1.5 : 1}/>)}
      <line x1={px(0)} y1={MT-8} x2={px(0)} y2={H-MB} stroke={INK} strokeWidth={1.5} opacity={0.3} markerEnd="url(#l5ax)"/>
      <line x1={ML} y1={py(0)} x2={W-MR+8} y2={py(0)} stroke={INK} strokeWidth={1.5} opacity={0.3} markerEnd="url(#l5ax)"/>
      {[-1,1,2,3,4].map(x => <text key={`xl${x}`} x={px(x)} y={H-MB+16} fontFamily={FONT} fontSize="11" fill={GRAY} textAnchor="middle">{x}</text>)}
      {[2,4,6,8].map(y => <text key={`yl${y}`} x={px(0)-6} y={py(y)+4} fontFamily={FONT} fontSize="11" fill={GRAY} textAnchor="end">{y}</text>)}
      {seg && <line x1={px(seg[0][0])} y1={py(seg[0][1])} x2={px(seg[1][0])} y2={py(seg[1][1])} stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round"/>}
      {showYIntercept && yInt >= yMin && yInt <= yMax && (
        <>
          <circle cx={px(0)} cy={py(yInt)} r={highlightIntercept ? 8 : 6} fill={highlightIntercept ? ORANGE : ACCENT}/>
          <text x={px(0)+10} y={py(yInt)+4} fontFamily={FONT} fontSize="11" fill={highlightIntercept ? ORANGE : ACCENT} fontWeight="700">(0, {yInt})</text>
        </>
      )}
      {showSlope && slopeAy >= yMin && slopeBx <= xMax && (
        <>
          <line x1={px(slopeAx)} y1={py(slopeAy)} x2={px(slopeBx)} y2={py(slopeAy)} stroke={ORANGE} strokeWidth={1.8} strokeDasharray="4,3"/>
          <line x1={px(slopeBx)} y1={py(slopeAy)} x2={px(slopeBx)} y2={py(slopeBy)} stroke={GREEN} strokeWidth={1.8} strokeDasharray="4,3"/>
          <text x={px((slopeAx+slopeBx)/2)} y={py(slopeAy)+16} fontFamily={FONT} fontSize="10" fill={ORANGE} textAnchor="middle" fontWeight="700">run=1</text>
          <text x={px(slopeBx)+14} y={py((slopeAy+slopeBy)/2)+4} fontFamily={FONT} fontSize="10" fill={GREEN} textAnchor="start" fontWeight="700">rise={m}</text>
        </>
      )}
      {showPlotPoints && plotPts.map((p, i) => (
        <g key={i}>
          <circle cx={px(p.x)} cy={py(p.y)} r={6} fill={ACCENT}/>
          <text x={px(p.x)+10} y={py(p.y)+4} fontFamily={FONT} fontSize="10" fill={ACCENT} fontWeight="700">({p.x},{p.y})</text>
        </g>
      ))}
    </svg>
  );
}


function ProgressPills({ filled, total, color = ACCENT }: { filled: number; total: number; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 8, flex: 1, borderRadius: 99, background: i < filled ? color : "#CBD5E1", transition: "background 0.4s ease" }}/>
      ))}
    </div>
  );
}

function EdHeader() {
  return (
    <div style={{ borderBottom: "1px solid rgba(226,232,240,0.6)", padding: "0 52px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="28" height="28" viewBox="264 271 552 537" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="l5-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe"/><stop offset=".77" stopColor="#1c45f6"/>
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l5-logo-grad)"/>
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

// ── Slide manifest ────────────────────────────────────────────────────────────
// 21 slides total (0=intro, 1-7=lesson, 8=practice_unlocked, 9-18=p1-p10, 19=score, 20=complete)
const SLIDES = [
  { id: "intro"            }, // 0
  { id: "y_intercept_1"   }, // 1  Q
  { id: "slope_teach"     }, // 2  Q
  { id: "equation_assemble"},// 3  Q
  { id: "equation_q"      }, // 4  Q
  { id: "new_graph_q1"    }, // 5  Q
  { id: "new_graph_q2"    }, // 6  Q
  { id: "neg_slope_q"     }, // 7  Q
  { id: "practice_unlocked"},// 8
  { id: "p1"  }, { id: "p2"  }, { id: "p3"  }, { id: "p4"  }, { id: "p5"  },
  { id: "p6"  }, { id: "p7"  }, { id: "p8"  }, { id: "p9"  }, { id: "p10" },
  { id: "score"            }, // 19
  { id: "complete"         }, // 20
];

const PROGRESS = [
  0.05,0.11,0.17,0.23,0.29,0.35,0.41,0.47,
  1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0
];

export default function InteractiveLessonL5({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [idx, setIdx]             = useState(0);
  const [picked, setPicked]       = useState<number | null>(null);
  const [practiceResults, setPracticeResults] = useState<(boolean|null)[]>(Array(10).fill(null));
  const [completeFilled, setCompleteFilled] = useState(1);

  useEffect(() => {
    if (idx === SLIDES.length - 1) {
      setCompleteFilled(1);
      const t = setTimeout(() => setCompleteFilled(2), 600);
      return () => clearTimeout(t);
    }
  }, [idx]);

  const isLast      = idx === SLIDES.length - 1;
  const isFirst     = idx === 0;
  const isPractice  = idx >= 9 && idx <= 18;
  const practiceStep = isPractice ? idx - 9 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isQuestionSlide = [1,2,3,4,5,6,7].includes(idx) || isPractice;

  const CORRECT_BY_IDX: Record<number, number> = {
    1:  0,  // (0, 3)
    2:  1,  // slope = 2
    3:  1,  // y = 2x + 3
    4:  1,  // y = 2x + 6
    5:  2,  // y = 3x + 1
    6:  1,  // y = x + 4
    7:  1,  // y = −2x + 8
    // practice q1-q10 (idx 9-18)
    9:  1,  10: 1,  11: 2,  12: 1,  13: 2,
    14: 1,  15: 1,  16: 2,  17: 0,  18: 2,
  };

  const EXPLAIN_DATA: Record<number, [string, string]> = {
    1:  ["The y-intercept is where the line crosses the y-axis — always at x = 0. Here that's (0, 3), so c = 3.", "The y-intercept is where x = 0. The point (3, 0) is on the x-axis, not the y-axis. Look for where the line crosses the vertical axis."],
    2:  ["For every 1 step across, the line goes up 2. Rise ÷ run = 2 ÷ 1 = 2. So m = 2.", "Count carefully — for every 1 step across, the line goes up 2 steps, not 1 or 3. Always divide rise by run."],
    3:  ["m goes before x, c gets added at the end. Slope m = 2, intercept c = 3, so y = 2x + 3.", "Match each part: m (slope = 2) goes before x, c (intercept = 3) gets added. That gives y = 2x + 3, not y = 3x + 2."],
    4:  ["The line crosses the y-axis at 6, so c = 6. It rises 2 for every 1 across, so m = 2. That gives y = 2x + 6.", "Check both parts separately: where does the line cross the y-axis (c)? And how steep is it (m)? Then write y = mx + c."],
    5:  ["The line crosses at (0, 1) so c = 1. It rises 3 for every 1 step, so m = 3. That gives y = 3x + 1.", "The y-intercept is 1 (where it crosses the y-axis), not 2 or 3. Slope = 3. So the equation is y = 3x + 1."],
    6:  ["The line crosses at (0, 4) so c = 4. It rises 1 for every 1 step, so m = 1. That gives y = x + 4.", "Check both parts: the y-intercept is 4 (not 1), and the slope is 1 (not 4). That gives y = x + 4."],
    7:  ["The line is falling — so the slope is negative. It falls 2 for every 1 step across, so m = −2. It crosses at 8, so c = 8. That gives y = −2x + 8.", "A falling line always has a negative slope. The y-intercept is still positive — it crosses at 8, not −8."],
    9:  ["Crosses y-axis at 1, so c = 1. Rises 2 each step, so m = 2. That gives y = 2x + 1.", "Check c (where line crosses y-axis) and m (rise ÷ run) separately."],
    10: ["Crosses y-axis at 4, so c = 4. Rises 3 each step, so m = 3. That gives y = 3x + 4.", "Read c from the y-axis first, then count the slope."],
    11: ["Crosses y-axis at 2, so c = 2. Rises 1 each step, so m = 1. That gives y = x + 2.", "m = 1 is written as just x, not 1x."],
    12: ["Crosses y-axis at 5, so c = 5. Falls 1 each step, so m = −1. That gives y = −x + 5.", "A falling line has a negative slope. m = −1 is written as −x."],
    13: ["Crosses y-axis at 3, so c = 3. Falls 2 each step, so m = −2. That gives y = −2x + 3.", "Falling line means negative slope. The y-intercept is still positive."],
    14: ["Crosses y-axis at 7, so c = 7. Rises 2 each step, so m = 2. That gives y = 2x + 7.", "Don't confuse c and m — c is where it crosses the y-axis, m is how steep."],
    15: ["Crosses y-axis at 6, so c = 6. Falls 3 each step, so m = −3. That gives y = −3x + 6.", "Falling line = negative slope. c stays positive if it crosses above zero."],
    16: ["Crosses y-axis at 3, so c = 3. Rises 1 each step, so m = 1. That gives y = x + 3.", "m = 1 simplifies to just x, not 1x."],
    17: ["Crosses y-axis at 6, so c = 6. Falls 1 each step, so m = −1. That gives y = −x + 6.", "m = −1 is written as −x. The y-intercept is positive even though the slope is negative."],
    18: ["Crosses y-axis at 2, so c = 2. Rises 3 each step, so m = 3. That gives y = 3x + 2.", "Always read c from the y-axis before counting the slope."],
  };

  const TAKEAWAY_DATA: Record<number, string> = {
    1:  "The y-intercept is where x = 0 — always the point on the vertical y-axis.",
    2:  "Slope = rise ÷ run. Count up (rise) then across (run) between two clear grid points.",
    3:  "y = mx + c. Slope (m) goes before x; intercept (c) is added at the end.",
    4:  "Read c from where the line crosses the y-axis, count m from the slope, then write y = mx + c.",
    5:  "Find c (y-intercept) first, then calculate m (slope), then write the full equation.",
    6:  "Always check both c and m separately before combining into y = mx + c.",
    7:  "A falling line has a negative slope. The y-intercept (c) stays positive if the line crosses above zero.",
    9:  "Read c (y-intercept) then m (slope). Write y = mx + c.",
    10: "Read c (y-intercept) then m (slope). Write y = mx + c.",
    11: "m = 1 is just written as x.", 12: "m = −1 is written as −x.",
    13: "Negative slope + positive intercept: y = −mx + c.",
    14: "c is the y-intercept, m is the slope. Never mix them up.",
    15: "Falling line = negative slope.", 16: "m = 1 simplifies to x.",
    17: "m = −1 is −x. c stays positive.", 18: "Always find c first, then m.",
  };

  const TIP_DATA: Record<number, string> = {
    1:  "The y-intercept is always where the line crosses the y-axis — the vertical one. Look for where x = 0.",
    2:  "Pick two points where the line crosses exact grid intersections. Count boxes up (rise), then boxes across (run). Divide.",
    3:  "Build the equation in order: y = mx + c. m goes before x, c gets added at the end.",
    4:  "Build the equation in order: y = [slope]x + [intercept]. Never reverse slope and intercept.",
    5:  "Two steps: (1) find where the line crosses the y-axis (that's c), (2) count rise ÷ run for slope (that's m).",
    6:  "Find c first (y-intercept), then m (slope). Don't mix up which number is which.",
    7:  "If the line goes downhill left to right, the slope is negative.",
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
    <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: CHAT_W, background: "#fff", fontFamily: FONT, zIndex: 100, overflowY: "auto" }}>

      <EdHeader />

      {/* ── Progress bar ── */}
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
            <div style={{ height: "100%", width: `${(PROGRESS[idx] ?? 1) * 100}%`, borderRadius: 99, background: isLast ? GREEN : ACCENT, transition: "width 0.6s ease, background 0.4s ease" }}/>
          </div>
        )}
      </div>

      {/* ── Slide 0: INTRO ── */}
      {idx === 0 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase" as const, marginBottom: 10 }}>Today&apos;s lesson</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, lineHeight: 0.95, marginBottom: 14 }}>Reading<br/>Equations<br/>from Graphs</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
              We&apos;ll learn how to find the equation of any straight line just by looking at its graph.
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase" as const, marginBottom: 6 }}>Your progress</div>
                <ProgressPills filled={4} total={10} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: ACCENT }}>50%</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "75%" }}><Graph2 /></div>
          </div>
        </div>
      )}

      {/* ── Slide 1: Y-INTERCEPT Q ── */}
      {idx === 1 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>Every graph hides an equation. Can you find it?</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
              To find it, the first thing we need is the y-intercept.<br />
              This is where the line crosses the y-axis.
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <LineGraph m={2} c={3} showYIntercept={false} />
            </div>
          </div>
          <div>
            <QuestionBubble label="Where does the line cross the y-axis?" />
            <OptionList options={["(0, 3)", "(3, 0)", "(0, 0)"]} correct={0} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 2: SLOPE TEACH ── */}
      {idx === 2 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>Now we need the slope.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
              The slope tells us how steep the line is.<br />
              We find it by counting: rise ÷ run.
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <LineGraph m={2} c={3} showYIntercept showSlope={picked !== null} />
            </div>
          </div>
          <div>
            <QuestionBubble label="What is the slope of this line?" />
            <OptionList options={["1", "2", "3"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 3: EQUATION ASSEMBLE ── */}
      {idx === 3 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
              You&apos;re ready to write your own linear function.
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "20px 24px" }}>
              {[
                ["1", "You found the y-intercept", "The line crosses at y = 3, so c = 3"],
                ["2", "You found the slope", "Up 2 for every 1 across, so m = 2"],
                ["3", "Now write the equation", "Put m and c into y = mx + c"],
              ].map(([num, title, desc]) => (
                <div key={num} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(59,91,219,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{num}</div>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{title}</div>
                    <div style={{ fontFamily: FONT, fontSize: 13, color: GRAY, marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1.5px solid #E2E8F0", paddingTop: 16, marginTop: 4, textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 800, color: ACCENT, letterSpacing: "0.04em" }}>y = mx + c</div>
              </div>
            </div>
          </div>
          <div>
            <QuestionBubble label="What is the equation of this line?" />
            <OptionList options={["y = 3x + 2", "y = 2x + 3", "y = 2x − 3"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 4: EQUATION Q ── */}
      {idx === 4 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 14 }}>What is the equation?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                ["1", "Find where the line crosses the y-axis. That’s c."],
                ["2", "Count rise ÷ run. That’s m."],
              ].map(([num, text]) => (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(59,91,219,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{num}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <LineGraph m={2} c={6} showYIntercept={picked !== null} showSlope={picked !== null} />
            </div>
          </div>
          <div>
            <QuestionBubble label="What is the equation?" />
            <OptionList options={["y = 6x + 2", "y = 2x + 6", "y = 2x − 6"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 5: NEW GRAPH Q ── */}
      {idx === 5 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 16 }}>Now try a new graph.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                ["1", "Find where the line crosses the y-axis. That's c."],
                ["2", "Count rise ÷ run. That's m."],
              ].map(([num, text]) => (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(59,91,219,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{num}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <LineGraph m={3} c={1} showYIntercept={picked !== null} showSlope={picked !== null} />
            </div>
          </div>
          <div>
            <QuestionBubble label="What is the equation?" />
            <OptionList options={["y = 3x + 2", "y = x + 3", "y = 3x + 1"]} correct={2} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 6: NEW GRAPH Q2 ── */}
      {idx === 6 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 16 }}>One more.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                ["1", "Find where the line crosses the y-axis. That's c."],
                ["2", "Count rise ÷ run. That's m."],
              ].map(([num, text]) => (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(59,91,219,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{num}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <LineGraph m={1} c={4} showYIntercept={picked !== null} showSlope={picked !== null} />
            </div>
          </div>
          <div>
            <QuestionBubble label="What is the equation?" />
            <OptionList options={["y = 4x + 1", "y = x + 4", "y = x − 4"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 7: NEGATIVE SLOPE INTRO Q ── */}
      {idx === 7 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1, marginBottom: 10 }}>Not all lines go up.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
              A line that falls from left to right has a <strong style={{ color: RED, fontWeight: 700 }}>negative slope</strong>.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                ["1", "Find where the line crosses the y-axis. That's c."],
                ["2", "Count rise ÷ run — but if the line falls, m is negative."],
              ].map(([num, text]) => (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(59,91,219,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{num}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <LineGraph m={-2} c={8} showYIntercept={picked !== null} showSlope={picked !== null} />
            </div>
          </div>
          <div>
            <QuestionBubble label="What is the equation?" />
            <OptionList options={["y = 2x + 8", "y = −2x + 8", "y = −2x − 8"]} correct={1} picked={picked} onPick={setPicked} />
          </div>
        </div>
      )}

      {/* ── Slide 8: PRACTICE UNLOCKED ── */}
      {idx === 8 && (
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
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.10em", marginBottom: 10 }}>PRACTICE UNLOCKED</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: INK, lineHeight: 1.1, marginBottom: 12, maxWidth: 520 }}>
            Now <span style={{ color: ACCENT }}>apply</span> what<br/>you&apos;ve learned.
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "#475569", marginBottom: 28 }}>
            Read the equation from each graph.
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
          <button onClick={() => { setPicked(null); setIdx(9); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
            Start Practice
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}

      {/* ── Practice slides 9–18 ── */}
      {isPractice && (() => {
        const PDATA = [
          { m:  2, c: 1, opts: ["y = x + 2",   "y = 2x + 1",  "y = 2x − 1"],  cor: 1, guided: true  },
          { m:  3, c: 4, opts: ["y = 4x + 3",   "y = 3x + 4",  "y = 3x − 4"],  cor: 1, guided: true  },
          { m:  1, c: 2, opts: ["y = 2x + 1",   "y = x − 2",   "y = x + 2"],   cor: 2, guided: true  },
          { m: -1, c: 5, opts: ["y = x + 5",    "y = −x + 5",  "y = −x − 5"],  cor: 1, guided: true  },
          { m: -2, c: 3, opts: ["y = 2x + 3",   "y = −2x − 3", "y = −2x + 3"], cor: 2, guided: true  },
          { m:  2, c: 7, opts: ["y = 7x + 2",   "y = 2x + 7",  "y = 2x − 7"],  cor: 1, guided: false },
          { m: -3, c: 6, opts: ["y = 3x + 6",   "y = −3x + 6", "y = −3x − 6"], cor: 1, guided: false },
          { m:  1, c: 3, opts: ["y = 3x + 1",   "y = x − 3",   "y = x + 3"],   cor: 2, guided: false },
          { m: -1, c: 6, opts: ["y = −x + 6",   "y = x + 6",   "y = −x − 6"],  cor: 0, guided: false },
          { m:  3, c: 2, opts: ["y = 2x + 3",   "y = 3x − 2",  "y = 3x + 2"],  cor: 2, guided: false },
        ];
        const q = PDATA[practiceStep];
        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: INK, lineHeight: 1.1, marginBottom: 20 }}>
                What is the <span style={{ color: ACCENT }}>equation?</span>
              </div>
              {q.guided && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {[
                    ["1", "Find where the line crosses the y-axis. That's c."],
                    ["2", "Count rise ÷ run — if the line falls, m is negative."],
                  ].map(([num, text]) => (
                    <div key={num} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(59,91,219,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{num}</div>
                      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: INK }}>{text}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
                <LineGraph m={q.m} c={q.c} showYIntercept={picked !== null} showSlope={picked !== null && q.m > 0} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,91,219,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 18, color: ACCENT }}>?</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: INK }}>Choose the best answer.</div>
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

      {/* ── Slide 20: COMPLETE ── */}
      {isLast && (
        <div style={{ position: "relative", zIndex: 1, padding: "36px 52px 140px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GREENBG, borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
              <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN}/><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 12, color: GREEN_DK, letterSpacing: "0.09em" }}>LESSON COMPLETE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 18 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, lineHeight: 0.92 }}>Reading<br/>Equations<br/>from Graphs</div>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,17 8,12 13,14 21,6" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="6" x2="21" y2="11" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="6" x2="21" y2="6" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: GRAY, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8 }}>Your Progress</div>
                <ProgressPills filled={completeFilled} total={10} color={GREEN} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: GREEN }}>60%</div>
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
      {isLast ? (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: CHAT_W, zIndex: 10, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "20px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, color: "#475569" }}>
            You can now read the equation of any straight line from its graph.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: GRAY, cursor: "pointer" }}>
              Back to lessons
            </button>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: GREEN, border: "none", borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(44,165,85,0.35)" }}>
              Next lesson
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      ) : (() => {
        if (idx === 8 || idx === 19) return null;

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

        const isCorrect = picked === CORRECT_BY_IDX[idx];

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
