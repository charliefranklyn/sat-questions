"use client";
import React, { useState } from "react";
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
const PURPLE   = "#8B5CF6";

function Graph2({ color = ACCENT }: { color?: string }) {
  const W=400, H=400, cx=200, cy=200, r=170;
  const xp=(v:number)=>cx+v/5.5*(r-20);
  const yp=(v:number)=>cy-v/5.5*(r-20);
  const pts:number[][] = [];
  for(let i=-5;i<=5;i++) pts.push([i,i]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="l4ax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1E293B"/>
        </marker>
        <clipPath id="l4clip"><circle cx={cx} cy={cy} r={r}/></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="rgba(59,91,219,0.07)"/>
      <g clipPath="url(#l4clip)">
        {[-4,-3,-2,-1,0,1,2,3,4].map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.8"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.8"/>
          </g>
        ))}
      </g>
      <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.5)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.5" markerEnd="url(#l4ax)"/>
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

function makeAxes(id: string) {
  return (
    <defs>
      <marker id={`${id}x`} markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
        <polygon points="0 0,7 2.5,0 5" fill="#334155"/>
      </marker>
      <marker id={`${id}y`} markerWidth="5" markerHeight="7" refX="2.5" refY="7" orient="auto">
        <polygon points="0 7,2.5 0,5 7" fill="#334155"/>
      </marker>
    </defs>
  );
}

function TwoLinesGraph() {
  const W=380, H=220, pL=44, pR=36, pT=22, pB=42;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xMin=0, xMax=6, yMin=0, yMax=12;
  const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
  const yp=(v:number)=>pT+(yMax-v)/(yMax-yMin)*ph;
  const xTicks=[1,2,3,4,5]; const yTicks=[2,4,6,8,10];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      {makeAxes("l4tl")}
      {xTicks.map(v=><line key={v} x1={xp(v)} y1={pT} x2={xp(v)} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      {yTicks.map(v=><line key={v} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#l4tlx)"/>
      <line x1={xp(0)} y1={yp(0)+4} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#l4tly)"/>
      {xTicks.map(v=><text key={v} x={xp(v)} y={yp(0)+16} textAnchor="middle" fontFamily={FONT} fontSize="11" fill={GRAY}>{v}</text>)}
      {yTicks.map(v=><text key={v} x={xp(0)-8} y={yp(v)+4} textAnchor="end" fontFamily={FONT} fontSize="11" fill={GRAY}>{v}</text>)}
      <text x={pL+pw+16} y={yp(0)+5} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">x</text>
      <text x={xp(0)+7} y={pT-4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">y</text>
      <line x1={xp(0)} y1={yp(0)} x2={xp(6)} y2={yp(6)} stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"/>
      <text x={xp(6)+6} y={yp(6)+4} fontFamily={FONT} fontSize="12" fill={GRAY} fontWeight="700">A</text>
      <line x1={xp(0)} y1={yp(0)} x2={xp(5)} y2={yp(10)} stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/>
      <text x={xp(5)+6} y={yp(10)+4} fontFamily={FONT} fontSize="12" fill={ACCENT} fontWeight="700">B</text>
    </svg>
  );
}

function FlatVsSteepGraph() {
  const W=380, H=200, pL=44, pR=56, pT=22, pB=42;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xMin=0, xMax=5, yMin=0, yMax=6;
  const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
  const yp=(v:number)=>pT+(yMax-v)/(yMax-yMin)*ph;
  const xTicks=[1,2,3,4,5]; const yTicks=[1,2,3,4,5];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      {makeAxes("l4fs")}
      {xTicks.map(v=><line key={v} x1={xp(v)} y1={pT} x2={xp(v)} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      {yTicks.map(v=><line key={v} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#l4fsx)"/>
      <line x1={xp(0)} y1={yp(0)+4} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#l4fsy)"/>
      {xTicks.map(v=><text key={v} x={xp(v)} y={yp(0)+16} textAnchor="middle" fontFamily={FONT} fontSize="11" fill={GRAY}>{v}</text>)}
      {yTicks.map(v=><text key={v} x={xp(0)-8} y={yp(v)+4} textAnchor="end" fontFamily={FONT} fontSize="11" fill={GRAY}>{v}</text>)}
      <text x={pL+pw+16} y={yp(0)+5} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">x</text>
      <text x={xp(0)+7} y={pT-4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">y</text>
      <line x1={xp(0)} y1={yp(0)} x2={xp(5)} y2={yp(5)} stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"/>
      <text x={xp(5)+6} y={yp(5)+4} fontFamily={FONT} fontSize="12" fill={GRAY} fontWeight="700">Flat</text>
      <line x1={xp(0)} y1={yp(0)} x2={xp(2.5)} y2={yp(5)} stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/>
      <text x={xp(2.5)+6} y={yp(5)+4} fontFamily={FONT} fontSize="12" fill={ACCENT} fontWeight="700">Steep</text>
    </svg>
  );
}

function GridGraph({ rise, run, showRiseRun = false }: {
  rise: number; run: number; gs?: number; showRiseRun?: boolean; minCols?: number;
}) {
  const yStep = rise <= 4 ? 1 : rise <= 8 ? 2 : 3;
  const xStep = run <= 2 ? 1 : run;
  const xMax = showRiseRun ? run * 3 : run * 2.5;
  const yMax = rise * 1.4;
  const W=380, H=220, pL=44, pR=showRiseRun ? 90 : 28, pT=22, pB=42;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xp=(v:number)=>pL+v/xMax*pw;
  const yp=(v:number)=>pT+(yMax-v)/yMax*ph;
  const xTicks=Array.from({length:Math.floor(xMax/xStep)},(_,i)=>(i+1)*xStep).filter(v=>v<xMax);
  const yTicks=Array.from({length:Math.floor(yMax/yStep)},(_,i)=>(i+1)*yStep).filter(v=>v<=rise);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      {makeAxes("l4gg")}
      {xTicks.map(v=><line key={v} x1={xp(v)} y1={pT} x2={xp(v)} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      {yTicks.map(v=><line key={v} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#l4ggx)"/>
      <line x1={xp(0)} y1={yp(0)+4} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#l4ggy)"/>
      <text x={pL+pw+16} y={yp(0)+5} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">x</text>
      <text x={xp(0)+7} y={pT-4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">y</text>
      <line x1={xp(0)} y1={yp(0)} x2={xp(run)} y2={yp(rise)} stroke={ACCENT} strokeWidth="3" strokeLinecap="round"/>
      <circle cx={xp(0)} cy={yp(0)} r={5} fill={ACCENT}/>
      <circle cx={xp(run)} cy={yp(rise)} r={5} fill={ACCENT}/>
      {showRiseRun && <>
        <line x1={xp(run)} y1={yp(0)} x2={xp(run)} y2={yp(rise)} stroke={GREEN} strokeWidth="2" strokeDasharray="5,4"/>
        <line x1={xp(0)} y1={yp(0)} x2={xp(run)} y2={yp(0)} stroke={ORANGE} strokeWidth="2" strokeDasharray="5,4"/>
        <text x={xp(run)+14} y={(yp(0)+yp(rise))/2+4} fontFamily={MONO} fontSize="13" fill={GREEN} textAnchor="start" fontWeight="700">rise = {rise}</text>
        <text x={(xp(0)+xp(run))/2} y={yp(0)+20} fontFamily={MONO} fontSize="13" fill={ORANGE} textAnchor="middle" fontWeight="700">run = {run}</text>
      </>}
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

function FormulaBox() {
  return (
    <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: ACCENT, textAlign: "center" }}>
        m = (y₂ − y₁) ÷ (x₂ − x₁)
      </div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: GRAY, textAlign: "center" }}>
        Subtract y values → rise &nbsp;·&nbsp; Subtract x values → run &nbsp;·&nbsp; Divide
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

function EdHeader() {
  return (
    <div style={{ borderBottom: "1px solid rgba(226,232,240,0.6)", padding: "0 52px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="28" height="28" viewBox="264 271 552 537" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="l4-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe"/><stop offset=".77" stopColor="#1c45f6"/>
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l4-logo-grad)"/>
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

function QuestionBubble({ label = "Choose the best answer." }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontWeight: 900, fontSize: 22, color: ACCENT }}>?</div>
      <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: INK }}>{label}</div>
    </div>
  );
}

// ── Slide manifest ────────────────────────────────────────────────────────────
const SLIDES = [
  { id: "intro"             }, // 0
  { id: "two_graphs"        }, // 1
  { id: "flat_slope"        }, // 2
  { id: "count_steps"       }, // 3
  { id: "rise_run"          }, // 4
  { id: "graph_4_2"         }, // 5
  { id: "graph_9_3"         }, // 6
  { id: "y_diff"            }, // 7
  { id: "x_diff"            }, // 8
  { id: "formula"           }, // 9
  { id: "two_coords"        }, // 10
  { id: "calc1"             }, // 11
  { id: "calc2"             }, // 12
  { id: "practice_unlocked" }, // 13
  { id: "p1"                }, // 14
  { id: "p2"                }, // 15
  { id: "p3"                }, // 16
  { id: "p4"                }, // 17
  { id: "p5"                }, // 18
  { id: "p6"                }, // 19
  { id: "p7"                }, // 20
  { id: "p8"                }, // 21
  { id: "p9"                }, // 22
  { id: "p10"               }, // 23
  { id: "score"             }, // 24
  { id: "complete"          }, // 25
];

const PROGRESS = [
  0.04,0.08,0.13,0.17,0.21,0.25,0.29,0.33,0.38,0.42,
  0.46,0.50,0.54, // 0-12
  0.59, // 13 practice_unlocked
  1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0, // 14-23
  1.0,1.0, // 24-25
];

export default function InteractiveLessonL4({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [idx, setIdx]               = useState(0);
  const [picked, setPicked]         = useState<number | null>(null);
  const [practiceResults, setPracticeResults] = useState<(boolean | null)[]>(
    [null,null,null,null,null,null,null,null,null,null]
  );

  const isLast       = idx === SLIDES.length - 1;
  const isFirst      = idx === 0;
  const isPractice   = idx >= 14 && idx <= 23;
  const practiceStep = isPractice ? idx - 14 : 0;
  const isQuestionSlide = [1,2,3,4,5,6,7,8,9,10,11,12].includes(idx) || isPractice;

  const CORRECT_BY_IDX: Record<number, number> = {
    1: 1, 2: 0, 3: 2, 4: 2, 5: 0, 6: 0, 7: 1, 8: 1, 9: 0, 10: 2,
    11: 1, // (1,3)→(3,9): gradient=3, opts=[2,3,6]
    12: 0, // (2,4)→(5,10): gradient=2, opts=[2,4,6]
    14: 1, // steeper: Line B
    15: 2, // rise=3,run=1 → 3, opts=[1,2,3]
    16: 0, // rise=4,run=2 → 2, opts=[2,4,6]
    17: 1, // rise=6,run=2 → 3, opts=[2,3,6]
    18: 0, // rise=8,run=4 → 2, opts=[2,4,8]
    19: 1, // (1,3)→(3,9): 3, opts=[2,3,6]
    20: 0, // (2,1)→(6,9): 2, opts=[2,4,8]
    21: 1, // (0,5)→(4,13): 2, opts=[1,2,4]
    22: 1, // (1,4)→(4,13): 3, opts=[2,3,9]
    23: 0, // (2,6)→(8,12): 1, opts=[1,2,3]
  };

  const EXPLAIN_DATA: Record<number, [string, string]> = {
    1:  ["Person B's line rises faster — for every step across, it jumps up more. The steeper the line, the higher the rate.", "Person A has the flatter line. Flat means slower growth — less earnings per hour."],
    2:  ["Steep = fast growth. Flat = slow growth. A flat slope means the value barely changes.", "A flat slope means slow growth. If the line were perfectly flat, the value wouldn't change at all."],
    3:  ["Count the steps: 1 across, 3 up. That ratio — 3 to 1 — is the slope.", "Count carefully. For every 1 step across, this line goes up 3 steps — not 1 or 2."],
    4:  ["6 ÷ 2 = 3. Rise divided by run gives you the slope.", "Slope is always rise ÷ run. 8 would be adding. 12 would be multiplying. Divide: 6 ÷ 2 = 3."],
    5:  ["Count the steps: 4 up, 2 across. 4 ÷ 2 = 2. The slope is 2.", "4 is just the rise. 6 would be rise + run. Always divide: rise ÷ run = 4 ÷ 2 = 2."],
    6:  ["Count the steps: 9 up, 3 across. 9 ÷ 3 = 3. The slope is 3.", "6 would be 9 ÷ 1.5 — not right. 9 is just the rise. Divide: 9 ÷ 3 = 3."],
    7:  ["The difference between y values tells you how far up the line travelled - that's the rise.", "The run comes from x values, not y values. 6 - 3 measures vertical change, which is the rise."],
    8:  ["The difference in x values (2 − 1 = 1) tells you how far across — that's the run.", "The rise comes from y values. 2 − 1 measures horizontal change: run."],
    9:  ["y values on top, x values on the bottom — (9 − 3) ÷ (3 − 1) = 6 ÷ 2 = 3.", "Option B gives the right answer too (negatives cancel), but C swaps y and x — that gives the wrong slope entirely."],
    10: ["(9 − 4) ÷ (5 − 2) = 5 ÷ 3. y values on top (rise), x values on the bottom (run).", "Option C swaps y and x — that gives run ÷ rise, which is the wrong way around."],
    11: ["Subtract y values: 9 − 3 = 6. Subtract x values: 3 − 1 = 2. Divide: 6 ÷ 2 = 3.", "Apply the formula: (y₂ − y₁) ÷ (x₂ − x₁) = (9 − 3) ÷ (3 − 1) = 6 ÷ 2 = 3."],
    12: ["Subtract y values: 10 − 4 = 6. Subtract x values: 5 − 2 = 3. Divide: 6 ÷ 3 = 2.", "(10 − 4) ÷ (5 − 2) = 6 ÷ 3 = 2. Divide rise by run — don't just write rise or run alone."],
    14: ["Line B is steeper — it rises more for the same horizontal step.", "Compare the angle of both lines. Line B makes a steeper angle — it rises faster for every step across."],
    15: ["3 up, 1 across. 3 ÷ 1 = 3. The gradient is 3.", "Count the steps: 3 up, 1 across. Gradient = rise ÷ run = 3 ÷ 1 = 3."],
    16: ["4 up, 2 across. 4 ÷ 2 = 2. The gradient is 2.", "Rise = 4, run = 2. Gradient = 4 ÷ 2 = 2, not 4 or 6."],
    17: ["6 up, 2 across. 6 ÷ 2 = 3. The gradient is 3.", "Rise = 6, run = 2. Gradient = 6 ÷ 2 = 3. Don't confuse the rise (6) with the gradient."],
    18: ["8 up, 4 across. 8 ÷ 4 = 2. The gradient is 2.", "Count carefully: 8 up, 4 across. 8 ÷ 4 = 2, not 4 or 8."],
    19: ["(9 − 3) ÷ (3 − 1) = 6 ÷ 2 = 3. y values on top, x values on bottom.", "Subtract y values first: 9 − 3 = 6. Then x: 3 − 1 = 2. Divide: 6 ÷ 2 = 3."],
    20: ["(9 − 1) ÷ (6 − 2) = 8 ÷ 4 = 2. y values on top, x values on bottom.", "Use (y₂ − y₁) ÷ (x₂ − x₁): (9 − 1) ÷ (6 − 2) = 8 ÷ 4 = 2."],
    21: ["(13 − 5) ÷ (4 − 0) = 8 ÷ 4 = 2. y values on top, x values on bottom.", "Subtract y values: 13 − 5 = 8. x values: 4 − 0 = 4. Divide: 8 ÷ 4 = 2."],
    22: ["(13 − 4) ÷ (4 − 1) = 9 ÷ 3 = 3. y values on top, x values on bottom.", "Subtract y values: 13 − 4 = 9. x values: 4 − 1 = 3. Divide: 9 ÷ 3 = 3."],
    23: ["(12 − 6) ÷ (8 − 2) = 6 ÷ 6 = 1. When rise equals run, gradient = 1.", "Subtract y values: 12 − 6 = 6. x values: 8 − 2 = 6. Divide: 6 ÷ 6 = 1."],
  };

  const CORRECT_LABELS = ["That's right.", "Well done.", "Spot on.", "Correct!"];

  const TAKEAWAY_DATA: Record<number, string> = {
    1:  "Steeper line = higher slope = faster growth.",
    2:  "A flat line has a low slope; a steep line has a high slope.",
    3:  "Slope = rise ÷ run. Count up (rise), count across (run), then divide.",
    4:  "Slope = rise ÷ run. Always divide, not add or subtract.",
    5:  "Count rise (up) and run (across) from any two clear points on the line.",
    6:  "Rise ÷ run every time. Count up first, then across.",
    7:  "Rise = difference in y values (how far up between two points).",
    8:  "Run = difference in x values (how far across between two points).",
    9:  "(y₂ − y₁) ÷ (x₂ − x₁) = slope. Subtract y values for rise, x values for run.",
    10: "Use the same point order for both: (y₂ − y₁) ÷ (x₂ − x₁).",
    11: "(y₂ − y₁) ÷ (x₂ − x₁) gives you the gradient from any two points.",
    12: "Always divide: 6 ÷ 3 = 2. The gradient is a ratio, not a difference.",
    14: "Steeper line = higher gradient. Compare the visual angle of the lines.",
    15: "Gradient = rise ÷ run. Always divide the vertical steps by the horizontal steps.",
    16: "4 up, 2 across: gradient = 4÷2 = 2. Rise ÷ run every time.",
    17: "Rise = 6, run = 2. Gradient = 3. The bigger the rise for the same run, the steeper.",
    18: "8 ÷ 4 = 2. Always simplify: gradient is the ratio of rise to run.",
    19: "Use (y₂−y₁)÷(x₂−x₁). Keep the order consistent.",
    20: "Subtract y values (rise) and x values (run), then divide.",
    21: "(13−5)÷(4−0)=2. Any two points on the line give the same gradient.",
    22: "(13−4)÷(4−1)=3. y values on top, x values on the bottom.",
    23: "(12−6)÷(8−2)=1. If rise equals run, gradient = 1.",
  };

  const TIP_DATA: Record<number, string> = {
    1:  "Visually: a steeper line jumps up more for the same step across. That ratio — up ÷ across — is slope.",
    2:  "Think of a flat road vs a steep hill. Flat = small slope. Vertical = huge slope.",
    3:  "Pick two points where the line passes through exact grid intersections. Count up then across. Divide.",
    4:  "Slope = rise ÷ run. Write it as a fraction: rise on top, run on the bottom. Then simplify.",
    5:  "Choose grid-aligned points so the counting is clean. Count the boxes up, then boxes across.",
    6:  "Never add rise and run together. Always divide: rise on top, run on bottom.",
    7:  "Rise = the vertical distance. Subtract the smaller y from the larger y.",
    8:  "Run = the horizontal distance. Subtract the smaller x from the larger x.",
    9:  "On the exam: (y₂ − y₁) ÷ (x₂ − x₁). Subtract y values first (rise), then x values (run), then divide.",
    10: "Keep the order consistent: pick point 1 and point 2, then always put 2 minus 1 in both.",
    11: "Write it as a fraction: (9−3) on top, (3−1) on bottom. Then simplify.",
    12: "Plug the values into the formula step by step: subtract y's, subtract x's, then divide.",
    14: "Visually, a steeper line makes a bigger angle with the horizontal axis.",
    15: "Pick the two points furthest apart that sit on grid intersections. Count up then across.",
    16: "The gradient is always rise ÷ run — never just the rise alone.",
    17: "Make sure to divide, not multiply. 6 × 2 = 12, but 6 ÷ 2 = 3.",
    18: "Simplify: 8 ÷ 4 = 2. You can also think of it as 'up 2 for every 1 across.'",
    19: "Choose point 1 and point 2 consistently: always (y₂−y₁)÷(x₂−x₁).",
    20: "Label your points first: (x₁=2, y₁=1) and (x₂=6, y₂=9). Then subtract.",
    21: "When x₁=0, (x₂−x₁) is just x₂. That makes it a bit simpler.",
    22: "The gradient formula: (y₂−y₁)÷(x₂−x₁). y values on top (rise), x values on bottom (run).",
    23: "If the gradient = 1, the line rises at exactly 45°.",
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
      setPracticeResults(r => { const n = [...r]; n[practiceStep] = ok; return n; });
    }
    setPicked(null);
    setIdx(i => i + 1);
  };

  const scoreCount = practiceResults.filter(r => r === true).length;

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
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: i <= practiceStep ? RED : "#E2E8F0", transition: "background 0.3s ease" }}/>
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
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, lineHeight: 0.95, marginBottom: 14 }}>The Slope<br/>of a Linear<br/>Function</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: INK, lineHeight: 1.6, marginBottom: 24, maxWidth: 400 }}>
              We&apos;ll learn what slope means, how to count it on a graph, and how to calculate it from any two points.
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 400 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,91,219,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: "0.10em", textTransform: "uppercase" as const, marginBottom: 6 }}>Your progress</div>
                <ProgressPills filled={3} total={10} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: ACCENT }}>40%</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "75%" }}><Graph2 /></div>
          </div>
        </div>
      )}

      {/* ── Slide 1: TWO GRAPHS ── */}
      {idx === 1 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Look at these two graphs.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", marginTop: 10, lineHeight: 1.6 }}>
              Both people earn money over time - but at different rates.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "24px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 }}>
              <TwoLinesGraph />
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 3, borderRadius: 2, background: "#CBD5E1" }} />
                  <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: GRAY }}>Person A</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 3, borderRadius: 2, background: ACCENT }} />
                  <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: ACCENT }}>Person B</span>
                </div>
              </div>
            </div>
            <div>
              <QuestionBubble label="Can you guess which person earns more per hour?" />
              <OptionList options={["Person A","Person B"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 2: FLAT VS STEEP ── */}
      {idx === 2 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "50%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Steep = fast. Flat = slow.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", marginTop: 10, lineHeight: 1.6 }}>
              The steeper the line, the faster it grows.<br/>In maths, we call this <strong style={{ color: INK }}>slope</strong>.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "16px" }}>
              <FlatVsSteepGraph />
            </div>
            <div>
              <QuestionBubble label="What does a flat slope tell you?" />
              <OptionList options={["The line grows slowly","The line grows quickly"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 3: COUNT STEPS ── */}
      {idx === 3 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "50%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Can you find the slope?</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", marginTop: 10, lineHeight: 1.6 }}>
              <span style={{ fontWeight: 700, color: INK }}>Hint:</span> Look at how many squares it goes up.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px" }}>
              <GridGraph rise={3} run={1} />
            </div>
            <div>
              <QuestionBubble label="What is the slope of this line?" />
              <OptionList options={["1","2","3"]} correct={2} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 4: RISE ÷ RUN ── */}
      {idx === 4 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "50%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>You just calculated slope.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", marginTop: 10, lineHeight: 1.7 }}>
              Steps up = <strong style={{ color: GREEN }}>rise</strong>&nbsp;&nbsp;Steps across = <strong style={{ color: ORANGE }}>run</strong><br/>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: INK }}>Slope = rise ÷ run</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px", display: "flex", justifyContent: "center" }}>
              <GridGraph rise={6} run={2} showRiseRun />
            </div>
            <div>
              <QuestionBubble label="What is the slope of this line?" />
              <OptionList options={["8","12","3"]} correct={2} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 5: 4 UP, 2 ACROSS ── */}
      {idx === 5 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "50%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Now try this one.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px", display: "flex", justifyContent: "center" }}>
              <GridGraph rise={4} run={2} showRiseRun />
            </div>
            <div>
              <QuestionBubble label="What is the slope of this line?" />
              <OptionList options={["2","4","6"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 6: 9 UP, 3 ACROSS ── */}
      {idx === 6 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "50%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Now try this one.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px" }}>
              <GridGraph rise={9} run={3} showRiseRun />
            </div>
            <div>
              <QuestionBubble label="What is the slope of this line?" />
              <OptionList options={["3","6","9"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 7: Y DIFF ── */}
      {idx === 7 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>You know that slope = rise ÷ run.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", marginTop: 10, lineHeight: 1.6 }}>
              Look at these two points: <span style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>(1, 3)</span> and <span style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>(2, 6)</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px" }}>
              {(() => {
                const W=320, H=220, pL=44, pR=28, pT=22, pB=42;
                const pw=W-pL-pR, ph=H-pT-pB;
                const xMin=0, xMax=4, yMax=8;
                const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
                const yp=(v:number)=>pT+(yMax-v)/yMax*ph;
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
                    <defs>
                      <marker id="s7x" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#334155"/></marker>
                      <marker id="s7y" markerWidth="5" markerHeight="7" refX="2.5" refY="7" orient="auto"><polygon points="0 7,2.5 0,5 7" fill="#334155"/></marker>
                    </defs>
                    {[1,2,3].map(v=><line key={`gx${v}`} x1={xp(v)} y1={pT} x2={xp(v)} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
                    {[1,2,3,4,5,6,7].map(v=><line key={`gy${v}`} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
                    <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#s7x)"/>
                    <line x1={xp(0)} y1={yp(0)+4} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#s7y)"/>
                    <text x={pL+pw+16} y={yp(0)+5} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">x</text>
                    <text x={xp(0)+7} y={pT-4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">y</text>
                    <line x1={xp(1)} y1={yp(3)} x2={xp(2)} y2={yp(6)} stroke={ACCENT} strokeWidth="3" strokeLinecap="round"/>
                    <line x1={pL} y1={yp(3)} x2={xp(1)} y2={yp(3)} stroke={GREEN} strokeWidth="1.5" strokeDasharray="5,4"/>
                    <line x1={pL} y1={yp(6)} x2={xp(2)} y2={yp(6)} stroke={GREEN} strokeWidth="1.5" strokeDasharray="5,4"/>
                    <text x={pL-6} y={yp(3)+4} fontFamily={MONO} fontSize="13" fill={GREEN} textAnchor="end" fontWeight="700">3</text>
                    <text x={pL-6} y={yp(6)+4} fontFamily={MONO} fontSize="13" fill={GREEN} textAnchor="end" fontWeight="700">6</text>
                    <circle cx={xp(1)} cy={yp(3)} r={7} fill={GREEN}/>
                    <circle cx={xp(2)} cy={yp(6)} r={7} fill={GREEN}/>
                    <text x={xp(1)+12} y={yp(3)+5} fontFamily={MONO} fontSize="12" fill={INK} textAnchor="start" fontWeight="700">(1, 3)</text>
                    <text x={xp(2)+12} y={yp(6)+5} fontFamily={MONO} fontSize="12" fill={INK} textAnchor="start" fontWeight="700">(2, 6)</text>
                  </svg>
                );
              })()}
            </div>
            <div>
              <QuestionBubble label="What does 6 - 3 tell you?" />
              <OptionList options={["The run","The rise"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 8: X DIFF ── */}
      {idx === 8 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, maxWidth: "50%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Now look at the x values.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px" }}>
              {(() => {
                const W=320, H=220, pL=44, pR=28, pT=22, pB=42;
                const pw=W-pL-pR, ph=H-pT-pB;
                const xMin=0, xMax=4, yMax=8;
                const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
                const yp=(v:number)=>pT+(yMax-v)/yMax*ph;
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
                    <defs>
                      <marker id="s8x" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#334155"/></marker>
                      <marker id="s8y" markerWidth="5" markerHeight="7" refX="2.5" refY="7" orient="auto"><polygon points="0 7,2.5 0,5 7" fill="#334155"/></marker>
                    </defs>
                    {[1,2,3].map(v=><line key={`gx${v}`} x1={xp(v)} y1={pT} x2={xp(v)} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
                    {[1,2,3,4,5,6,7].map(v=><line key={`gy${v}`} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
                    <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#s8x)"/>
                    <line x1={xp(0)} y1={yp(0)+4} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#s8y)"/>
                    <text x={pL+pw+16} y={yp(0)+5} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">x</text>
                    <text x={xp(0)+7} y={pT-4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">y</text>
                    <line x1={xp(1)} y1={yp(3)} x2={xp(2)} y2={yp(6)} stroke={ACCENT} strokeWidth="3" strokeLinecap="round"/>
                    <line x1={xp(1)} y1={yp(0)} x2={xp(1)} y2={yp(3)} stroke={ORANGE} strokeWidth="1.5" strokeDasharray="5,4"/>
                    <line x1={xp(2)} y1={yp(0)} x2={xp(2)} y2={yp(6)} stroke={ORANGE} strokeWidth="1.5" strokeDasharray="5,4"/>
                    <text x={xp(1)} y={yp(0)+18} fontFamily={MONO} fontSize="13" fill={ORANGE} textAnchor="middle" fontWeight="700">1</text>
                    <text x={xp(2)} y={yp(0)+18} fontFamily={MONO} fontSize="13" fill={ORANGE} textAnchor="middle" fontWeight="700">2</text>
                    <circle cx={xp(1)} cy={yp(3)} r={7} fill={ACCENT}/>
                    <circle cx={xp(2)} cy={yp(6)} r={7} fill={ACCENT}/>
                    <text x={xp(1)-12} y={yp(3)-10} fontFamily={MONO} fontSize="12" fill={INK} textAnchor="end" fontWeight="700">(1, 3)</text>
                    <text x={xp(2)+12} y={yp(6)-10} fontFamily={MONO} fontSize="12" fill={INK} textAnchor="start" fontWeight="700">(2, 6)</text>
                  </svg>
                );
              })()}
            </div>
            <div>
              <QuestionBubble label="What does 2 - 1 tell you?" />
              <OptionList options={["The rise","The run"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 9: FORMULA SETUP ── */}
      {idx === 9 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>We can calculate the slope<br/>from any <span style={{ color: ACCENT }}>two coordinates.</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 14 }}>Slope formula</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: INK }}>m =</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: ACCENT }}>y₂ − y₁</span>
                    <div style={{ width: "100%", height: 2.5, background: ACCENT, margin: "8px 0" }} />
                    <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: ACCENT }}>x₂ − x₁</span>
                  </div>
                </div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 18px" }}>
                <span style={{ fontFamily: FONT, fontWeight: 700, color: INK }}>Hint:</span>
                <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "#475569" }}> Plug the x and y values from both points into the formula.</span>
              </div>
            </div>
            <div>
              <QuestionBubble label="For the points (1, 3) and (3, 9), which setup is correct?" />
              {(() => {
                const correct9 = 0;
                const opts9 = [
                  { parts: [{ expr: "(9 − 3)", label: "rise (y₂ − y₁)", lc: PURPLE }, { expr: " ÷ ", label: null as string | null, lc: "" }, { expr: "(3 − 1)", label: "run (x₂ − x₁)", lc: GREEN }] },
                  { parts: [{ expr: "(3 − 9)", label: "y₁ − y₂", lc: PURPLE }, { expr: " ÷ ", label: null as string | null, lc: "" }, { expr: "(1 − 3)", label: "x₁ − x₂", lc: GREEN }] },
                  { parts: [{ expr: "(3 − 1)", label: "x₂ − x₁", lc: GREEN }, { expr: " ÷ ", label: null as string | null, lc: "" }, { expr: "(9 − 3)", label: "y₂ − y₁", lc: PURPLE }] },
                ];
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {opts9.map((opt, i) => {
                      let bg = "#fff", border = "rgba(31,37,68,0.14)", badgeBg = "#F5F0E8", badgeColor = INK;
                      let showCheck = false, showCross = false;
                      if (picked !== null) {
                        if (i === correct9) { bg = "#E7F8EC"; border = GREEN; badgeBg = GREEN; badgeColor = "#fff"; showCheck = true; }
                        else if (i === picked) { bg = "#FDECEC"; border = RED; badgeBg = RED; badgeColor = "#fff"; showCross = true; }
                        else { border = "rgba(31,37,68,0.07)"; badgeBg = "rgba(31,37,68,0.07)"; badgeColor = "rgba(31,37,68,0.3)"; }
                      }
                      const faded = picked !== null && i !== correct9 && i !== picked;
                      return (
                        <div key={i} onClick={() => { if (picked === null) { setPicked(i); if (i === correct9) playCorrect(); } }}
                          style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderRadius: 16, background: bg, border: `2px solid ${border}`, cursor: picked === null ? "pointer" : "default", transition: "all 0.15s" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: badgeBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 16, fontWeight: 900, color: badgeColor, flexShrink: 0 }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flex: 1 }}>
                            <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: faded ? "rgba(31,37,68,0.3)" : INK, paddingTop: 4 }}>m =</span>
                            {opt.parts.map((p, j) => (
                              <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: p.label ? (faded ? "rgba(31,37,68,0.3)" : p.lc) : (faded ? "rgba(31,37,68,0.3)" : INK), paddingTop: 4 }}>{p.expr}</span>
                                {p.label && (
                                  <div style={{ borderTop: `2px solid ${faded ? "rgba(31,37,68,0.15)" : p.lc}`, paddingTop: 3, marginTop: 3 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: faded ? "rgba(31,37,68,0.3)" : p.lc }}>{p.label}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {showCheck && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          {showCross && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 10: TWO COORDS ── */}
      {idx === 10 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Now try this one.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 14 }}>Slope formula</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: INK }}>m =</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: ACCENT }}>y₂ − y₁</span>
                    <div style={{ width: "100%", height: 2.5, background: ACCENT, margin: "8px 0" }} />
                    <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: ACCENT }}>x₂ − x₁</span>
                  </div>
                </div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 18px" }}>
                <span style={{ fontFamily: FONT, fontWeight: 700, color: INK }}>Hint:</span>
                <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "#475569" }}> Plug the x and y values from both points into the formula.</span>
              </div>
            </div>
            <div>
              <QuestionBubble label="For the points (2, 4) and (5, 9), which setup is correct?" />
              {(() => {
                const correct10 = 2;
                const opts10 = [
                  { parts: [{ expr: "(4 − 9)", label: "y₁ − y₂", lc: PURPLE }, { expr: " ÷ ", label: null as string | null, lc: "" }, { expr: "(2 − 5)", label: "x₁ − x₂", lc: GREEN }] },
                  { parts: [{ expr: "(5 − 2)", label: "x₂ − x₁", lc: GREEN }, { expr: " ÷ ", label: null as string | null, lc: "" }, { expr: "(9 − 4)", label: "y₂ − y₁", lc: PURPLE }] },
                  { parts: [{ expr: "(9 − 4)", label: "rise (y₂ − y₁)", lc: PURPLE }, { expr: " ÷ ", label: null as string | null, lc: "" }, { expr: "(5 − 2)", label: "run (x₂ − x₁)", lc: GREEN }] },
                ];
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {opts10.map((opt, i) => {
                      let bg = "#fff", border = "rgba(31,37,68,0.14)", badgeBg = "#F5F0E8", badgeColor = INK;
                      let showCheck = false, showCross = false;
                      if (picked !== null) {
                        if (i === correct10) { bg = "#E7F8EC"; border = GREEN; badgeBg = GREEN; badgeColor = "#fff"; showCheck = true; }
                        else if (i === picked) { bg = "#FDECEC"; border = RED; badgeBg = RED; badgeColor = "#fff"; showCross = true; }
                        else { border = "rgba(31,37,68,0.07)"; badgeBg = "rgba(31,37,68,0.07)"; badgeColor = "rgba(31,37,68,0.3)"; }
                      }
                      const faded = picked !== null && i !== correct10 && i !== picked;
                      return (
                        <div key={i} onClick={() => { if (picked === null) { setPicked(i); if (i === correct10) playCorrect(); } }}
                          style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderRadius: 16, background: bg, border: `2px solid ${border}`, cursor: picked === null ? "pointer" : "default", transition: "all 0.15s" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: badgeBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 16, fontWeight: 900, color: badgeColor, flexShrink: 0 }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flex: 1 }}>
                            <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: faded ? "rgba(31,37,68,0.3)" : INK, paddingTop: 4 }}>m =</span>
                            {opt.parts.map((p, j) => (
                              <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: p.label ? (faded ? "rgba(31,37,68,0.3)" : p.lc) : (faded ? "rgba(31,37,68,0.3)" : INK), paddingTop: 4 }}>{p.expr}</span>
                                {p.label && (
                                  <div style={{ borderTop: `2px solid ${faded ? "rgba(31,37,68,0.15)" : p.lc}`, paddingTop: 3, marginTop: 3 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: faded ? "rgba(31,37,68,0.3)" : p.lc }}>{p.label}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {showCheck && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          {showCross && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 11: CALC 1 ── */}
      {idx === 11 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Try it yourself.</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: "#475569", marginTop: 10 }}>
              Use the formula to calculate the gradient from these two points.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <FormulaBox />
              <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: GRAY, marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Given points</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ background: "#fff", borderRadius: 10, padding: "10px 18px", border: "1.5px solid #E2E8F0" }}>
                    <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 4 }}>Point 1</div>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>(1, 3)</div>
                  </div>
                  <div style={{ background: "#fff", borderRadius: 10, padding: "10px 18px", border: "1.5px solid #E2E8F0" }}>
                    <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 4 }}>Point 2</div>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>(3, 9)</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <QuestionBubble label="What is the gradient?" />
              <OptionList options={["2","3","6"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 12: CALC 2 ── */}
      {idx === 12 && (
        <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1.1 }}>Now try these coordinates.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <FormulaBox />
              <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: GRAY, marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Given points</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ background: "#fff", borderRadius: 10, padding: "10px 18px", border: "1.5px solid #E2E8F0" }}>
                    <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 4 }}>Point 1</div>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>(2, 4)</div>
                  </div>
                  <div style={{ background: "#fff", borderRadius: 10, padding: "10px 18px", border: "1.5px solid #E2E8F0" }}>
                    <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 4 }}>Point 2</div>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>(5, 10)</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <QuestionBubble label="What is the gradient?" />
              <OptionList options={["2","4","6"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 13: PRACTICE UNLOCKED ── */}
      {idx === 13 && (
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
          <div style={{ position: "relative", marginBottom: 20, width: 126, height: 126 }}>
            <div style={{ width: 126, height: 126, borderRadius: "50%", background: "rgba(59,91,219,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                <polyline points="10,55 30,30 50,42 70,18" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="30" cy="30" r="5" fill={ACCENT}/>
                <circle cx="50" cy="42" r="5" fill={ORANGE}/>
                <circle cx="70" cy="18" r="5" fill={ACCENT}/>
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
            Test yourself with 10 slope questions.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 42px)", gap: 10, marginBottom: 32 }}>
            {[1,2,3,4,5,6,7,8,9,10].map((n, i) => (
              <div key={n} style={{ width: 42, height: 42, borderRadius: "50%", background: i === 0 ? ACCENT : "transparent", border: i === 0 ? "none" : "2px solid #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: i === 0 ? "#fff" : "#94A3B8" }}>{n}</div>
            ))}
          </div>
          <button onClick={() => { setPicked(null); setIdx(14); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 36px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
            Start Practice
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}

      {/* ── Practice slides p1–p10 ── */}
      {isPractice && (() => {
        const step = practiceStep;
        const correctIdx = CORRECT_BY_IDX[idx];
        const header = (
          <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: RED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 16 }}>
            Selective Question {step + 1} / 10
          </div>
        );

        // p1: steeper line
        if (step === 0) {
          return (
            <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
              {header}
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.2, marginBottom: 20 }}>
                Which line has a steeper gradient?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
                <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "24px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 }}>
                  <TwoLinesGraph />
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 20, height: 3, borderRadius: 2, background: "#CBD5E1" }} />
                      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: GRAY }}>Line A</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 20, height: 3, borderRadius: 2, background: ACCENT }} />
                      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: ACCENT }}>Line B</span>
                    </div>
                  </div>
                </div>
                <div>
                  <QuestionBubble label="Which line has a steeper gradient?" />
                  <OptionList options={["Line A","Line B"]} correct={correctIdx} picked={picked} onPick={setPicked} />
                </div>
              </div>
            </div>
          );
        }

        // p2–p5: rise/run
        if (step >= 1 && step <= 4) {
          const rrData = [
            { rise: 3, run: 1, opts: ["1","2","3"] },
            { rise: 4, run: 2, opts: ["2","4","6"] },
            { rise: 6, run: 2, opts: ["2","3","6"] },
            { rise: 8, run: 4, opts: ["2","4","8"] },
          ][step - 1];
          return (
            <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
              {header}
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.2, marginBottom: 20 }}>
                What is the gradient?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
                <div style={{ background: "rgba(59,91,219,0.06)", borderRadius: 14, padding: "20px" }}>
                  <GridGraph rise={rrData.rise} run={rrData.run} showRiseRun />
                </div>
                <div>
                  <QuestionBubble label="What is the gradient of this line?" />
                  <OptionList options={rrData.opts} correct={correctIdx} picked={picked} onPick={setPicked} />
                </div>
              </div>
            </div>
          );
        }

        // p6–p10: coordinates
        const coordData = [
          { pts: [[1,3],[3,9]] as [number,number][], opts: ["2","3","6"] },
          { pts: [[2,1],[6,9]] as [number,number][], opts: ["2","4","8"] },
          { pts: [[0,5],[4,13]] as [number,number][], opts: ["1","2","4"] },
          { pts: [[1,4],[4,13]] as [number,number][], opts: ["2","3","9"] },
          { pts: [[2,6],[8,12]] as [number,number][], opts: ["1","2","3"] },
        ][step - 5];

        return (
          <div style={{ position: "relative", zIndex: 1, padding: "28px 52px 100px", maxWidth: 1280, margin: "0 auto" }}>
            {header}
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.2, marginBottom: 20 }}>
              Calculate the gradient.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                <FormulaBox />
                <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: GRAY, marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Given points</div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ background: "#fff", borderRadius: 10, padding: "10px 18px", border: "1.5px solid #E2E8F0" }}>
                      <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 4 }}>Point 1</div>
                      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>({coordData.pts[0][0]}, {coordData.pts[0][1]})</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 10, padding: "10px 18px", border: "1.5px solid #E2E8F0" }}>
                      <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: GRAY, marginBottom: 4 }}>Point 2</div>
                      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: INK }}>({coordData.pts[1][0]}, {coordData.pts[1][1]})</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <QuestionBubble label="What is the gradient?" />
                <OptionList options={coordData.opts} correct={correctIdx} picked={picked} onPick={setPicked} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Slide 24: SCORE ── */}
      {idx === 24 && (() => {
        const msg = scoreCount === 10 ? { text: "Perfect!", color: GREEN }
          : scoreCount >= 8 ? { text: "Great work.", color: GREEN }
          : scoreCount >= 6 ? { text: "Good work.", color: ACCENT }
          : scoreCount >= 4 ? { text: "Good effort.", color: RED }
          : { text: "Keep practising.", color: RED };
        return (
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 52px 80px", textAlign: "center", minHeight: "calc(100vh - 80px)" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.12em", marginBottom: 20 }}>PRACTICE QUESTIONS</div>
            <div style={{ marginBottom: 12, lineHeight: 1 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK }}>{scoreCount}</span>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 56, color: GRAY }}>/10</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: msg.color, marginBottom: 36 }}>{msg.text}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 52px)", gap: 10, marginBottom: 44 }}>
              {practiceResults.map((r, i) => (
                <div key={i} style={{ width: 52, height: 52, borderRadius: 12, background: r === true ? GREEN : r === false ? RED : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {r === true  && <svg width="22" height="22" viewBox="0 0 26 26" fill="none"><path d="M4 13l7 7 11-11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {r === false && <svg width="22" height="22" viewBox="0 0 26 26" fill="none"><path d="M6 6l14 14M20 6L6 20" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/></svg>}
                </div>
              ))}
            </div>
            <button onClick={() => { setPicked(null); setIdx(i => i + 1); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 48px", background: ACCENT, border: "none", borderRadius: 14, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#fff", cursor: "pointer", boxShadow: "0 4px 0 rgba(59,91,219,0.35)" }}>
              Continue
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        );
      })()}

      {/* ── Slide 25: COMPLETE ── */}
      {idx === 25 && (
        <div style={{ position: "relative", zIndex: 1, padding: "56px 52px 100px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 6px 0 ${GREEN_DK}` }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 21l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, marginBottom: 12 }}>Lesson complete!</div>
          <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: GREEN_DK, marginBottom: 16 }}>
            The Slope of a Linear Function — Mastered
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: GRAY, lineHeight: 1.6, marginBottom: 40 }}>
            You can now read slope from a graph, calculate it using rise ÷ run, and find it from any two coordinates.
          </div>
          <button onClick={onComplete} style={{ padding: "16px 40px", borderRadius: 14, background: GREEN, border: "none", fontFamily: FONT, fontSize: 16, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: `0 6px 0 ${GREEN_DK}` }}>
            Continue
          </button>
        </div>
      )}

      {/* ── Bottom bar ── */}
      {(() => {
        if (isLast) return null;
        if (idx === 13) return null;

        if (idx === 24) return null;

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
