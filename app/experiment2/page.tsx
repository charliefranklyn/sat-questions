"use client";
import { useState, useEffect } from "react";

function playCorrect() {
  new Audio("/sounds/correct.mp3").play().catch(() => {});
}

const FONT     = '"Inter", ui-sans-serif, system-ui, sans-serif';
const INK      = "#1E293B";
const GRAY     = "#94A3B8";
const ACCENT   = "#3B5BDB";
const GREEN    = "#38C76B";
const GREEN_DK = "#2CA555";
const RED      = "#EF5A5A";
const GREENBG  = "#DCFCE7";
const ORANGE   = "#D97706";
const ORANGEBG = "#FEF3C7";

// ── Coordinate graph: Screen 1 (y = x + 2, labeled points) ───────────────────
function Graph1() {
  const W=320, H=280, pL=42, pR=18, pT=18, pB=34;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xp=(v:number) => pL + (v+7)/14*pw;
  const yp=(v:number) => pT + (7-v)/14*ph;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="ax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#334155"/>
        </marker>
        <marker id="abl" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={ACCENT}/>
        </marker>
      </defs>

      {[-6,-4,-2,0,2,4,6].map(v => (
        <g key={v}>
          <line x1={xp(v)} y1={pT} x2={xp(v)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="1"/>
          <line x1={pL}    y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="1"/>
        </g>
      ))}

      <line x1={pL} y1={yp(0)} x2={pL+pw+6} y2={yp(0)} stroke="#334155" strokeWidth="1.8" markerEnd="url(#ax)"/>
      <line x1={xp(0)} y1={pT+ph} x2={xp(0)} y2={pT-2} stroke="#334155" strokeWidth="1.8"/>
      <polygon points={`${xp(0)},${pT-8} ${xp(0)-5},${pT+2} ${xp(0)+5},${pT+2}`} fill="#334155"/>

      <text x={pL+pw+14} y={yp(0)+5} fontFamily={FONT} fontSize="12" fill={INK} fontStyle="italic">x</text>
      <text x={xp(0)+5}  y={pT-8}    fontFamily={FONT} fontSize="12" fill={INK} fontStyle="italic">y</text>

      {[-6,-4,-2,2,4,6].map(v=>(
        <text key={v} x={xp(v)} y={yp(0)+14} fontFamily={FONT} fontSize="9.5" fill={GRAY} textAnchor="middle">{v}</text>
      ))}
      {[2,4,6].map(v=>(
        <text key={v} x={xp(0)+6} y={yp(v)+4} fontFamily={FONT} fontSize="9.5" fill={GRAY}>{v}</text>
      ))}

      <line x1={xp(-6.3)} y1={yp(-4.3)} x2={xp(4.8)} y2={yp(6.8)} stroke={ACCENT} strokeWidth="2.8" strokeLinecap="round" markerEnd="url(#abl)"/>

      {([[-4,-2,"(-4, -2)"],[0,2,"(0, 2)"],[4,6,"(4, 6)"]] as [number,number,string][]).map(([x,y,label])=>(
        <g key={x}>
          <circle cx={xp(x)} cy={yp(y)} r="5.5" fill={ACCENT}/>
          <text x={xp(x)+9} y={yp(y)+4} fontFamily={FONT} fontSize="9.5" fontWeight="600" fill={INK}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Coordinate graph: Screen 2 (dots on a line, circle bg) ───────────────────
function Graph2({ color = ACCENT }: { color?: string }) {
  const W=400, H=400;
  const cx=200, cy=200, r=170;
  const xp=(v:number)=>cx+v/5.5*(r-20);
  const yp=(v:number)=>cy-v/5.5*(r-20);
  const pts:number[][] = [];
  for(let i=-5;i<=5;i++) pts.push([i,i]);

  const circleFill = color === GREEN ? "rgba(56,199,107,0.07)" : "rgba(59,91,219,0.07)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="ax2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1E293B"/>
        </marker>
        <clipPath id="circleClip">
          <circle cx={cx} cy={cy} r={r}/>
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill={circleFill}/>

      <g clipPath="url(#circleClip)">
        {[-4,-3,-2,-1,0,1,2,3,4].map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.8"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.8"/>
          </g>
        ))}
      </g>

      <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.5)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.5" markerEnd="url(#ax2)"/>
      <line x1={xp(0)} y1={yp(5.5)} x2={xp(0)} y2={yp(-5.5)} stroke="#1E293B" strokeWidth="2.5"/>
      <text x={xp(5.5)+10} y={yp(0)+5} fontFamily={FONT} fontSize="16" fill={INK} fontStyle="italic" fontWeight="600">x</text>
      <line x1={xp(-5)} y1={yp(-5)} x2={xp(5)} y2={yp(5)} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {pts.map(([x,y])=>(
        <circle key={x} cx={xp(x)} cy={yp(y)} r="7" fill={color}/>
      ))}
    </svg>
  );
}

// ── Progress pills ────────────────────────────────────────────────────────────
function ProgressPills({ filled, total, color = ACCENT }: { filled:number; total:number; color?:string }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{ height:8, flex:1, borderRadius:99, background: i < filled ? color : "#CBD5E1", transition:"background 0.5s ease" }}/>
      ))}
    </div>
  );
}

// ── Bullet card ───────────────────────────────────────────────────────────────
function BulletCard({ icon, text }: { icon:React.ReactNode; text:React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:18, background:"#fff", borderRadius:18, padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", border:"1px solid rgba(0,0,0,0.06)" }}>
      {icon}
      <div style={{ fontFamily:FONT, fontSize:16, fontWeight:500, color:INK, lineHeight:1.5 }}>{text}</div>
    </div>
  );
}

function IconCalc() {
  return (
    <div style={{ width:52, height:52, borderRadius:14, background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={ACCENT} strokeWidth="1.8"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke={ACCENT} strokeWidth="1.5"/>
        <line x1="8"  y1="13" x2="10" y2="13" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9"  y1="12" x2="9"  y2="14" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="14" y1="13" x2="16" y2="13" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="14" y1="17" x2="16" y2="17" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8"  y1="17" x2="10" y2="17" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function IconPie() {
  return (
    <div style={{ width:52, height:52, borderRadius:"50%", background:GREENBG, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" fill={GREEN}/>
        <path d="M12 2a10 10 0 0 1 10 10h-10V2z" fill={GREEN} opacity="0.4"/>
      </svg>
    </div>
  );
}

function IconTrophy() {
  return (
    <div style={{ width:52, height:52, borderRadius:"50%", background:ORANGEBG, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 21h8M12 17v4" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 3h14v8a7 7 0 0 1-14 0V3z" stroke={ORANGE} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M5 5H2v3a3 3 0 0 0 3 3M19 5h3v3a3 3 0 0 1-3 3" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function AlgebraCard() {
  return (
    <div style={{ background:"#fff", borderRadius:16, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", width:190 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:ACCENT, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <text x="2" y="18" fontFamily="serif" fontSize="16" fontWeight="700" fill="#fff">√x</text>
        </svg>
      </div>
      <span style={{ fontFamily:FONT, fontWeight:700, fontSize:16, color:INK }}>Algebra</span>
    </div>
  );
}

function ClipboardCard() {
  return (
    <div style={{ background:"#fff", borderRadius:16, padding:"16px 18px", boxShadow:"0 4px 20px rgba(0,0,0,0.12)", width:180 }}>
      <div style={{ fontFamily:FONT, fontWeight:700, fontSize:13, color:INK, marginBottom:12 }}>SAT Math</div>
      {[true, false, true, false].map((checked, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${checked ? ACCENT : "#CBD5E1"}`, background: checked ? ACCENT : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {checked && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2.5 2.5L7 1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div style={{ height:8, flex:1, borderRadius:4, background: checked ? "#E2E8F0" : "#F1F5F9" }}/>
        </div>
      ))}
    </div>
  );
}

// ── Option list ───────────────────────────────────────────────────────────────
function OptionList({ options, correct, picked, onPick }: {
  options: string[];
  correct: number;
  picked: number | null;
  onPick: (i: number) => void;
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {options.map((label, i) => {
        let bg = "#fff", border = "rgba(31,37,68,0.14)", badgeBg = "#F5F0E8", badgeColor = INK, textColor = INK;
        let showCheck = false, showCross = false;

        if (picked !== null) {
          if (i === correct) {
            bg = "#E7F8EC"; border = GREEN; badgeBg = GREEN; badgeColor = "#fff"; showCheck = true;
          } else if (i === picked) {
            bg = "#FDECEC"; border = RED; badgeBg = RED; badgeColor = "#fff"; showCross = true; textColor = "#5A6088";
          } else {
            border = "rgba(31,37,68,0.07)"; textColor = "rgba(31,37,68,0.35)"; badgeBg = "rgba(31,37,68,0.07)"; badgeColor = "rgba(31,37,68,0.3)";
          }
        }

        return (
          <div
            key={i}
            onClick={() => { if (picked === null) { onPick(i); if (i === correct) playCorrect(); } }}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px", borderRadius:16, background:bg, border:`2px solid ${border}`, cursor:picked===null?"pointer":"default", transition:"all 0.15s" }}
          >
            <div style={{ width:38, height:38, borderRadius:10, background:badgeBg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:16, fontWeight:900, color:badgeColor, flexShrink:0 }}>
              {["A","B","C","D"][i]}
            </div>
            <div style={{ fontFamily:FONT, fontSize:17, fontWeight:600, color:textColor, flex:1, lineHeight:1.3 }}>{label}</div>
            {showCheck && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {showCross && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
          </div>
        );
      })}
    </div>
  );
}

// ── Graph card (slide 4) ──────────────────────────────────────────────────────
function GraphCard() {
  const W=500, H=280;
  const cx=W/2-20, cy=H/2;
  const xp=(v:number)=>cx+v/5.5*(W/2-50);
  const yp=(v:number)=>cy-v/5.5*(H/2-24);
  const pts:number[] = [-4,-3,-2,-1,0,1,2,3,4];
  return (
    <div style={{ background:"rgba(59,91,219,0.07)", borderRadius:20, overflow:"hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
        {pts.map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.7"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.7"/>
          </g>
        ))}
        <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.2)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.2"/>
        <polygon points={`${xp(5.5)},${yp(0)} ${xp(5.5)-10},${yp(0)-5} ${xp(5.5)-10},${yp(0)+5}`} fill="#1E293B"/>
        <line x1={xp(0)} y1={yp(-5.5)} x2={xp(0)} y2={yp(5.2)} stroke="#1E293B" strokeWidth="2.2"/>
        <polygon points={`${xp(0)},${yp(5.5)} ${xp(0)-5},${yp(5.5)+10} ${xp(0)+5},${yp(5.5)+10}`} fill="#1E293B"/>
        <line x1={xp(-4.5)} y1={yp(-4.5)} x2={xp(4.2)} y2={yp(4.2)} stroke="#3B5BDB" strokeWidth="2.2" strokeLinecap="round"/>
        <polygon points={`${xp(4.6)},${yp(4.6)} ${xp(4.6)-12},${yp(4.6)+4} ${xp(4.6)-4},${yp(4.6)+12}`} fill="#3B5BDB"/>
        {pts.map(v=>(
          <circle key={v} cx={xp(v)} cy={yp(v)} r="7" fill="#3B5BDB"/>
        ))}
      </svg>
    </div>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function SlideHeader({ tag, headline }: { tag: string; headline: React.ReactNode }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontFamily:FONT, fontWeight:600, fontSize:12, color:GRAY, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:10 }}>{tag}</div>
      <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1 }}>{headline}</div>
    </div>
  );
}

function QuestionBubble({ label = "?" }: { label?: string }) {
  return (
    <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>
      {label}
    </div>
  );
}

function ContextCard({ emoji, children }: { emoji: string; children: React.ReactNode }) {
  return (
    <div style={{ background:"rgba(59,91,219,0.06)", borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(59,91,219,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:20 }}>
        {emoji}
      </div>
      <div style={{ fontFamily:FONT, fontWeight:500, fontSize:15, color:INK, lineHeight:1.5 }}>{children}</div>
    </div>
  );
}

function DataTable({ cols, rows }: { cols: string[]; rows: string[][] }) {
  return (
    <div style={{ borderRadius:14, overflow:"hidden", border:"1px solid rgba(59,91,219,0.10)" }}>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols.length}, 1fr)`, background:"rgba(59,91,219,0.05)", borderBottom:"1px solid rgba(59,91,219,0.12)" }}>
        {cols.map(c => (
          <div key={c} style={{ padding:"12px 24px", fontFamily:FONT, fontWeight:700, fontSize:14, color:INK }}>{c}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display:"grid", gridTemplateColumns:`repeat(${cols.length}, 1fr)`, borderTop:"1px solid rgba(59,91,219,0.08)", background:"#fff" }}>
          {row.map((cell, j) => (
            <div key={j} style={{ padding:"14px 24px", fontFamily:FONT, fontSize:16, color:INK, textAlign:"center" }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Slide data ────────────────────────────────────────────────────────────────
const SLIDES = [
  { id:"today" }, { id:"why" }, { id:"explore" }, { id:"understand" },
  { id:"check" }, { id:"gym" }, { id:"taxi" }, { id:"practice_unlocked" },
  { id:"plant" }, { id:"savings" }, { id:"company" }, { id:"phone" }, { id:"parking" },
  { id:"score" }, { id:"complete" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Experiment2Page() {
  const [idx, setIdx]       = useState(0);
  const [picked, setPicked] = useState<number|null>(null);
  const [completeFilled, setCompleteFilled] = useState(1);
  const [practiceResults, setPracticeResults] = useState<(boolean|null)[]>([null,null,null,null,null]);

  useEffect(() => {
    if (idx === SLIDES.length - 1) {
      setCompleteFilled(1);
      const t = setTimeout(() => setCompleteFilled(2), 600);
      return () => clearTimeout(t);
    }
  }, [idx]);

  const PROGRESS = [0.18, 0.28, 0.38, 0.48, 0.54, 0.60, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  const isPractice = idx >= 8 && idx <= 12;
  const practiceStep = isPractice ? idx - 8 : 0;
  const PRACTICE_CORRECT = [0, 1, 0, 0, 1];
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isFirst = idx === 0;
  const isLast  = idx === SLIDES.length - 1;

  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:FONT, position:"relative" }}>

      {/* ── Top bar ── */}
      <div style={{ position:"relative", zIndex:1, padding:"20px 52px 0", display:"flex", alignItems:"center", gap:20 }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        {isPractice ? (
          <div style={{ flex:1, display:"flex", gap:6 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{ flex:1, height:8, borderRadius:99, background: i <= practiceStep ? "#EF5A5A" : "#E2E8F0", transition:"background 0.3s ease" }}/>
            ))}
          </div>
        ) : (
          <div style={{ flex:1, height:8, borderRadius:99, background:"#E2E8F0", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${PROGRESS[idx]*100}%`, borderRadius:99, background:isLast ? GREEN : ACCENT, transition:"width 0.6s ease, background 0.4s ease" }}/>
          </div>
        )}
      </div>

      {/* ── Slide 1: TODAY'S LESSON ── */}
      {idx === 0 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"center", maxWidth:1280, margin:"0 auto" }}>
          <div>
            <div style={{ fontFamily:FONT, fontWeight:600, fontSize:12, color:GRAY, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:10 }}>Today&apos;s lesson</div>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:56, color:INK, lineHeight:0.95, marginBottom:14 }}>Linear<br/>Functions</div>
            <div style={{ fontFamily:FONT, fontWeight:500, fontSize:16, color:INK, lineHeight:1.6, marginBottom:24, maxWidth:400 }}>
              We&apos;ll focus on <span style={{ color:ACCENT, fontWeight:600 }}>recognising linear functions</span> in different forms and situations.
            </div>
            <div style={{ background:"#F8FAFC", borderRadius:16, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, maxWidth:400 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT, fontSize:10, fontWeight:800, color:ACCENT, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:6 }}>Your progress</div>
                <ProgressPills filled={1} total={10} />
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:FONT, fontSize:18, fontWeight:800, color:ACCENT }}>10%</div>
                <div style={{ fontFamily:FONT, fontSize:11, color:GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"75%" }}><Graph2 /></div>
          </div>
        </div>
      )}

      {/* ── Slide 2: WHY IT MATTERS ── */}
      {idx === 1 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"center", maxWidth:1280, margin:"0 auto" }}>
          <div>
            <div style={{ fontFamily:FONT, fontWeight:600, fontSize:12, color:GRAY, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:10 }}>Why it matters</div>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:20 }}>
              Linear functions are<br/>a <span style={{ color:ACCENT }}>big deal</span> on the SAT.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <BulletCard icon={<IconCalc />} text={<>Linear functions fall under the <span style={{ color:ACCENT, fontWeight:700 }}>Algebra</span> domain on the SAT.</>} />
              <BulletCard icon={<IconPie />} text={<>They account for roughly <span style={{ color:GREEN, fontWeight:700 }}>8–12</span> of the 44 math questions (about <span style={{ color:GREEN, fontWeight:700 }}>20–25%</span>).</>} />
              <BulletCard icon={<IconTrophy />} text={<>Master this, and you&apos;ve secured a <span style={{ color:ORANGE, fontWeight:700 }}>big chunk</span> of your math score.</>} />
            </div>
          </div>
          <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"75%" }}><Graph1 /></div>
            <div style={{ position:"absolute", top:0, right:0 }}><AlgebraCard /></div>
            <div style={{ position:"absolute", bottom:0, right:0 }}><ClipboardCard /></div>
          </div>
        </div>
      )}

      {/* ── Slide 3: EXPLORE ── */}
      {idx === 2 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", maxWidth:1280, margin:"0 auto" }}>
          <SlideHeader tag="Explore" headline={<>What is a <span style={{ color:ACCENT }}>Linear Function?</span></>} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <ContextCard emoji="💵">
                You earn <span style={{ color:ACCENT, fontWeight:700 }}>$15</span> for <span style={{ color:ACCENT, fontWeight:700 }}>every hour</span> you work.
              </ContextCard>
              <DataTable cols={["Hours worked","Earnings"]} rows={[["1","$15"],["2","$30"],["3","$45"]]} />
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <QuestionBubble />
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:17, color:INK }}>What do you notice about how the earnings change?</div>
              </div>
              <OptionList options={["The amount it increases by changes each time.", "The amount it increases by stays the same each time."]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 4: UNDERSTAND ── */}
      {idx === 3 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", maxWidth:1280, margin:"0 auto" }}>
          <SlideHeader tag="Understand" headline={<>A <span style={{ color:ACCENT }}>linear function</span> is a relationship where the <span style={{ color:ACCENT }}>change is constant.</span></>} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
            <GraphCard />
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
                <QuestionBubble />
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:17, color:INK }}>Can you pick the key part of that definition?</div>
              </div>
              <OptionList options={["The value is constant", "The change is constant"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 5: CHECK ── */}
      {idx === 4 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", maxWidth:1280, margin:"0 auto" }}>
          <SlideHeader tag="Check your understanding" headline={<>Before we move on,<br/>let&apos;s <span style={{ color:ACCENT }}>lock this in.</span></>} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <ContextCard emoji="🍕">
                A pizza takes 10 minutes to cook. Each additional topping adds a <span style={{ color:ACCENT, fontWeight:700 }}>different</span> amount of time.
              </ContextCard>
              <DataTable
                cols={["Topping","Additional time (minutes)"]}
                rows={[["🍕 Pepperoni","+2 min"],["🍄 Mushrooms","+4 min"],["🫑 Bell Peppers","+3 min"]]}
              />
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <QuestionBubble />
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:17, color:INK }}>Choose the best answer.</div>
              </div>
              <OptionList options={["Yes – linear", "No – not linear"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 6: GYM ── */}
      {idx === 5 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", maxWidth:1280, margin:"0 auto" }}>
          <SlideHeader tag="Check your understanding" headline={<>How about this one.<br/>Is it a <span style={{ color:ACCENT }}>linear function?</span></>} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <ContextCard emoji="🏋️">
                A gym charges <span style={{ color:ACCENT, fontWeight:700 }}>$3</span> for <span style={{ color:ACCENT, fontWeight:700 }}>every hour</span> you stay.
              </ContextCard>
              <DataTable cols={["Hours","Total Cost"]} rows={[["1","$3"],["2","$6"],["3","$9"]]} />
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <QuestionBubble />
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:17, color:INK }}>Choose the best answer.</div>
              </div>
              <OptionList options={["Yes – linear","No – not linear"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 7: TAXI ── */}
      {idx === 6 && (
        <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", maxWidth:1280, margin:"0 auto" }}>
          <SlideHeader tag="Check your understanding" headline={<>Is this a <span style={{ color:ACCENT }}>linear function?</span></>} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <ContextCard emoji="🚕">
                A taxi charges a <span style={{ color:ACCENT, fontWeight:700 }}>$4 base fare</span>, plus <span style={{ color:ACCENT, fontWeight:700 }}>$2 for every kilometre</span> travelled.
              </ContextCard>
              <DataTable cols={["Distance (km)","Total Cost ($)"]} rows={[["0","$4"],["1","$6"],["2","$8"],["3","$10"]]} />
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <QuestionBubble />
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:17, color:INK }}>Choose the best answer.</div>
              </div>
              <OptionList options={["Yes – linear","No – not linear"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 8: PRACTICE UNLOCKED ── */}
      {idx === 7 && (
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 52px 80px", textAlign:"center", minHeight:"calc(100vh - 80px)" }}>
          <div style={{ position:"relative", marginBottom:20, width:126, height:126 }}>
            <div style={{ width:126, height:126, borderRadius:"50%", background:"rgba(59,91,219,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="70" height="70" viewBox="0 0 90 90" fill="none">
                <line x1="10" y1="45" x2="80" y2="45" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/>
                <polygon points="82,45 76,41 76,49" fill={INK}/>
                <line x1="45" y1="80" x2="45" y2="10" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/>
                <polygon points="45,8 41,14 49,14" fill={INK}/>
                <line x1="20" y1="70" x2="70" y2="20" stroke={ACCENT} strokeWidth="2.8" strokeLinecap="round"/>
                <polygon points="72,18 66,20 70,26" fill={ACCENT}/>
                {[20,30,40,50,60,70].map((v,i)=>(
                  <circle key={i} cx={20+i*10} cy={70-i*10} r="4.5" fill={ACCENT}/>
                ))}
              </svg>
            </div>
            <div style={{ position:"absolute", bottom:2, right:2, width:36, height:36, borderRadius:"50%", background:GREEN, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 30 30" style={{ position:"absolute", top:-2, right:-2 }}>
              <line x1="15" y1="2" x2="15" y2="8" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="6" x2="20" y2="10" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
              <line x1="28" y1="15" x2="22" y2="15" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div style={{ fontFamily:FONT, fontWeight:800, fontSize:11, color:ACCENT, letterSpacing:"0.10em", marginBottom:10 }}>PRACTICE UNLOCKED</div>
          <div style={{ fontFamily:FONT, fontWeight:900, fontSize:42, color:INK, lineHeight:1.1, marginBottom:12, maxWidth:520 }}>
            Now <span style={{ color:ACCENT }}>apply</span> what<br/>you&apos;ve learned.
          </div>
          <div style={{ fontFamily:FONT, fontWeight:400, fontSize:15, color:"#475569", marginBottom:28 }}>
            Test yourself with real SAT-style questions.
          </div>

          <div style={{ display:"flex", gap:12, marginBottom:32 }}>
            {[1,2,3,4,5].map((n,i) => (
              <div key={n} style={{ width:42, height:42, borderRadius:"50%", background: i === 0 ? ACCENT : "transparent", border: i === 0 ? "none" : "2px solid #CBD5E1", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontWeight:700, fontSize:15, color: i === 0 ? "#fff" : "#94A3B8" }}>{n}</div>
            ))}
          </div>

          <button onClick={() => { setPicked(null); setIdx(8); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 36px", background:ACCENT, border:"none", borderRadius:14, fontFamily:FONT, fontWeight:700, fontSize:15, color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>
            Start Practice
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}

      {/* ── Practice slides ── */}
      {isPractice && (() => {
        const PSLIDES = [
          { emoji:"🌱", context:<>A plant grows <span style={{color:ACCENT,fontWeight:700}}>2 cm</span> on Day 1, <span style={{color:ACCENT,fontWeight:700}}>4 cm</span> on Day 2, and <span style={{color:ACCENT,fontWeight:700}}>6 cm</span> on Day 3.</>, cols:["Day","Height (cm)"], rows:[["Day 1","2 cm"],["Day 2","4 cm"],["Day 3","6 cm"]], options:["Yes – linear","No – not linear"], correct:0 },
          { emoji:"💰", context:<>A savings account <span style={{color:ACCENT,fontWeight:700}}>doubles</span> each year — the balance doesn&apos;t grow by the same amount.</>, cols:["Year","Balance"], rows:[["1","$100"],["2","$200"],["3","$400"]], options:["Yes – linear","No – not linear"], correct:1 },
          { emoji:"📦", context:<><span style={{color:ACCENT,fontWeight:700}}>$5</span> for the first item, <span style={{color:ACCENT,fontWeight:700}}>$8</span> for the second, <span style={{color:ACCENT,fontWeight:700}}>$11</span> for the third.</>, cols:["Items","Cost"], rows:[["1","$5"],["2","$8"],["3","$11"]], options:["Yes – linear","No – not linear"], correct:0 },
          { emoji:"📱", context:<>A phone plan costs <span style={{color:ACCENT,fontWeight:700}}>$20/month</span> plus <span style={{color:ACCENT,fontWeight:700}}>$5 per GB</span> of data used.</>, cols:["GB used","Total Cost"], rows:[["1","$25"],["2","$30"],["3","$35"],["5","$45"],["6","$50"]], options:["Yes – linear","No – not linear"], correct:0 },
          { emoji:"🚗", context:<><span style={{color:ACCENT,fontWeight:700}}>$3</span> for the first hour, <span style={{color:ACCENT,fontWeight:700}}>$2</span> for the second, then <span style={{color:ACCENT,fontWeight:700}}>$3</span> for every hour after.</>, cols:["Hours","Total Cost"], rows:[["1","$3"],["2","$5"],["3","$8"],["4","$11"]], options:["Yes – linear","No – not linear"], correct:1 },
        ];
        const s = PSLIDES[practiceStep];
        return (
          <div style={{ position:"relative", zIndex:1, padding:"28px 52px 100px", maxWidth:1280, margin:"0 auto" }}>
            <SlideHeader tag="Check your understanding" headline={<>Is this a <span style={{ color:ACCENT }}>linear function?</span></>} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <ContextCard emoji={s.emoji}>{s.context}</ContextCard>
                <DataTable cols={s.cols} rows={s.rows} />
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                  <QuestionBubble />
                  <div style={{ fontFamily:FONT, fontWeight:700, fontSize:17, color:INK }}>Choose the best answer.</div>
                </div>
                <OptionList options={s.options} correct={s.correct} picked={picked} onPick={setPicked} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Slide 14: SCORE ── */}
      {idx === 13 && (() => {
        const msg = practiceScore === 5 ? { text:"Perfect!", color:GREEN }
          : practiceScore >= 4 ? { text:"Great work.", color:GREEN }
          : practiceScore >= 3 ? { text:"Good work.", color:ACCENT }
          : practiceScore >= 2 ? { text:"Good effort.", color:RED }
          : { text:"Keep practising.", color:RED };
        return (
          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 52px 80px", textAlign:"center", minHeight:"calc(100vh - 80px)" }}>
            <div style={{ fontFamily:FONT, fontWeight:800, fontSize:11, color:ACCENT, letterSpacing:"0.12em", marginBottom:20 }}>SAT QUESTIONS</div>
            <div style={{ marginBottom:12, lineHeight:1 }}>
              <span style={{ fontFamily:FONT, fontWeight:900, fontSize:120, color:INK }}>{practiceScore}</span>
              <span style={{ fontFamily:FONT, fontWeight:700, fontSize:56, color:GRAY }}>/5</span>
            </div>
            <div style={{ fontFamily:FONT, fontWeight:700, fontSize:28, color:msg.color, marginBottom:36 }}>{msg.text}</div>
            <div style={{ display:"flex", gap:12, marginBottom:44 }}>
              {practiceResults.map((r, i) => (
                <div key={i} style={{ width:60, height:60, borderRadius:14, background: r === true ? GREEN : r === false ? RED : "#E2E8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {r === true && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l7 7 11-11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {r === false && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 6l14 14M20 6L6 20" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/></svg>}
                </div>
              ))}
            </div>
            <button onClick={() => setIdx(i => i + 1)} style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 48px", background:ACCENT, border:"none", borderRadius:14, fontFamily:FONT, fontWeight:700, fontSize:16, color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>
              Continue
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        );
      })()}

      {/* ── Slide 15: COMPLETE ── */}
      {isLast && (
        <div style={{ position:"relative", zIndex:1, padding:"36px 52px 140px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"center", maxWidth:1280, margin:"0 auto" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:GREENBG, borderRadius:99, padding:"6px 16px", marginBottom:28 }}>
              <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN}/><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily:FONT, fontWeight:800, fontSize:12, color:GREEN_DK, letterSpacing:"0.09em" }}>LESSON COMPLETE</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:28, marginBottom:18 }}>
              <div style={{ fontFamily:FONT, fontWeight:900, fontSize:68, color:INK, lineHeight:0.92 }}>Linear<br/>Functions</div>
              <div style={{ position:"relative", width:76, height:76, flexShrink:0 }}>
                <svg width="76" height="76" viewBox="0 0 76 76" style={{ position:"absolute", inset:0 }}>
                  {([[38,4,38,14],[38,62,38,72],[4,38,14,38],[62,38,72,38],[11,11,18,18],[58,58,65,65],[11,65,18,58],[65,11,58,18]] as number[][]).map(([x1,y1,x2,y2],i)=>(
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
                  ))}
                </svg>
                <div style={{ position:"absolute", inset:10, borderRadius:"50%", background:GREEN, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M5 15l8 8 12-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            <div style={{ height:1.5, background:"rgba(59,91,219,0.12)", maxWidth:460, marginBottom:24 }}/>
            <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:16, boxShadow:"0 2px 16px rgba(0,0,0,0.07)", maxWidth:460 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:GREENBG, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,17 8,12 13,14 21,6" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="6" x2="21" y2="11" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="6" x2="21" y2="6" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:GRAY, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:8 }}>Your Progress</div>
                <ProgressPills filled={completeFilled} total={10} color={GREEN} />
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:FONT, fontSize:26, fontWeight:800, color:GREEN }}>20%</div>
                <div style={{ fontFamily:FONT, fontSize:12, color:GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"80%" }}><Graph2 color={GREEN} /></div>
          </div>
        </div>
      )}

      {/* ── Bottom bar ── */}
      {idx === 7 || idx === 13 ? null : isLast ? (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:10, background:"#fff", borderTop:"1px solid #E2E8F0", padding:"20px 52px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19V7a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke={ACCENT} strokeWidth="1.8"/><path d="M8 7v12M8 11h8" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontFamily:FONT, fontWeight:700, fontSize:15, color:INK, marginBottom:3 }}>Great work!</div>
              <div style={{ fontFamily:FONT, fontWeight:400, fontSize:14, color:"#475569" }}>You&apos;ve locked in the foundation of linear functions. Keep building from here!</div>
            </div>
          </div>
          <button style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background:ACCENT, border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", flexShrink:0 }}>
            BACK TO LESSONS
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      ) : (() => {
        const isQuestionSlide = (idx >= 2 && idx <= 6) || (idx >= 8 && idx <= 12);

        if (!isQuestionSlide || picked === null) {
          const needsAnswer = isQuestionSlide && picked === null;
          return (
            <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:10, padding:"20px 52px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", borderTop:"1px solid #E2E8F0" }}>
              <button
                onClick={() => { if (!isFirst) { setPicked(null); setIdx(i => i - 1); } }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 24px", background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:12, fontFamily:FONT, fontWeight:700, fontSize:14, color:INK, cursor:isFirst?"default":"pointer", opacity:isFirst?0.4:1, boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                BACK
              </button>
              <button
                onClick={() => { if (!needsAnswer) { setPicked(null); setIdx(i => i + 1); } }}
                style={{ padding:"14px 44px", border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", background:needsAnswer?"#CBD5E1":ACCENT, color:needsAnswer?"#94A3B8":"#fff", cursor:needsAnswer?"default":"pointer", boxShadow:needsAnswer?"none":"0 4px 0 rgba(59,91,219,0.35)", transition:"all 0.15s" }}
              >
                CONTINUE
              </button>
            </div>
          );
        }

        const CORRECT_BY_IDX: Record<number,number> = {
          2:1, 3:1, 4:1, 5:0, 6:0,
          8:PRACTICE_CORRECT[0], 9:PRACTICE_CORRECT[1], 10:PRACTICE_CORRECT[2], 11:PRACTICE_CORRECT[3], 12:PRACTICE_CORRECT[4],
        };
        const isCorrect = picked === CORRECT_BY_IDX[idx];

        const EXPLAIN_DATA: Record<number,[string,string]> = {
          2: ["Every extra hour adds exactly $15. The earnings increase by the same amount each time — that's a linear function.", "Look at the differences: $15 → $30 → $45. Each step adds exactly $15 — the same amount every time. That makes it linear."],
          3: ["Exactly. Any value can go up or down — but for a function to be linear, the change must always be the same amount.", "Not quite. Any function can go up or down. What makes it linear is that the change is always the same amount."],
          4: ["The increases are +2, +4, +3 — they're all different. Linear functions need that constant, predictable change.", "Look at the increases: +2, then +4, then +3 minutes — they're all different. A linear function needs the same change every time."],
          5: ["Every hour costs exactly $3 more. The change is constant — that's a linear function.", "Look at the costs: $3, $6, $9. Each hour adds exactly $3 — the same amount every time. That makes it linear."],
          6: ["A $4 base plus $2 per km means every kilometre adds exactly the same amount. Constant change — linear.", "$4, $6, $8, $10 — every kilometre adds exactly $2. Same change every step — that's a linear function."],
          8: ["2 cm, 4 cm, 6 cm — the plant grows by exactly 2 cm each day. Constant change means linear.", "Look at the heights: +2, +2, +2. The plant grows the same amount each day — that's linear."],
          9: ["$100 → $200 → $400 — the balance doubles each year, so the increase keeps growing. Not a constant change.", "The balance goes $100, $200, $400. That's +$100 then +$200 — the increase changes each time. Not linear."],
          10: ["$5, $8, $11 — each extra item adds exactly $3. Same change every time — linear.", "Look at the gaps: +$3, then +$3 again. The cost increases by the same amount each time — linear."],
          11: ["$25, $30, $35 — every GB adds exactly $5. Constant rate, so it's linear.", "Each extra GB adds $5: $25 → $30 → $35. The change is always $5 — that's a linear function."],
          12: ["Hour 1: $3. Hour 2: $5 (+$2). Hour 3: $8 (+$3). The amount added keeps changing — not linear.", "The costs are $3, $5, $8, $11. First gap is $2, then $3, $3. The change isn't the same every time — not linear."],
        };
        const [explainCorrect, explainWrong] = EXPLAIN_DATA[idx] ?? ["",""];
        const CORRECT_LABELS = ["That's right.", "Well done.", "Spot on.", "Correct!"];
        const correctLabel = CORRECT_LABELS[idx % CORRECT_LABELS.length];

        const handleContinue = () => {
          if (isPractice) {
            const step = practiceStep;
            setPracticeResults(r => { const n=[...r]; n[step] = picked === PRACTICE_CORRECT[step]; return n; });
          }
          setPicked(null);
          setIdx(i => i + 1);
        };

        return (
          <div style={{ background:isCorrect?GREEN:RED, padding:"20px 52px", position:"fixed", bottom:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, borderTop:"1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {isCorrect
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
                }
              </div>
              <div>
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:15, color:"#fff", marginBottom:3 }}>{isCorrect ? correctLabel : "Not quite."}</div>
                <div style={{ fontFamily:FONT, fontWeight:400, fontSize:14, color:"rgba(255,255,255,0.88)", lineHeight:1.5, maxWidth:620 }}>
                  {isCorrect ? explainCorrect : explainWrong}
                </div>
              </div>
            </div>
            <button onClick={handleContinue} style={{ padding:"12px 30px", background:"#fff", color:isCorrect?GREEN_DK:RED, border:"none", borderRadius:12, fontFamily:FONT, fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
              Continue
            </button>
          </div>
        );
      })()}
    </div>
  );
}
