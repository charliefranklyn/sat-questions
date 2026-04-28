"use client";
import { useState, useEffect } from "react";

function playCorrect() {
  const audio = new Audio("/sounds/correct.mp3");
  audio.play().catch(() => {});
}

const ACCENT  = "#3B5BDB";
const CREAM   = "#FFF7E4";
const INK     = "#1F2544";
const SOFT    = "#5A6088";
const GREEN   = "#38C76B";
const GREEN_DK= "#2CA555";
const ORANGE  = "#FF8A3D";
const PURPLE  = "#A86CE4";
const RED     = "#EF5A5A";
const YELLOW  = "#FFD23F";

const FONT = '"Inter", ui-sans-serif, system-ui, sans-serif';
const MONO = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';

function tagLabel(tag: string): string {
  const m = tag.match(/^0?(\d+)\s*·\s*(.+)/);
  if (m) return `${m[1]}. ${m[2].toUpperCase()}`;
  return tag.toUpperCase();
}

function BgCircles() {
  return (
    <>
      <div style={{ position:"absolute", right:"-5%", top:"-13%", width:"36vw", height:"36vw", maxWidth:520, maxHeight:520, borderRadius:"50%", background:YELLOW,    opacity:0.52, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:"19%",  top:"6%",   width:"20vw", height:"20vw", maxWidth:290, maxHeight:290, borderRadius:"50%", background:"#F4A088", opacity:0.58, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:"7%",   top:"44%",  width:"25vw", height:"25vw", maxWidth:360, maxHeight:360, borderRadius:"50%", background:"#8ECFA0", opacity:0.52, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:"-4%",  bottom:"-9%", width:"28vw", height:"28vw", maxWidth:400, maxHeight:400, borderRadius:"50%", background:"#A8C4E0", opacity:0.50, pointerEvents:"none" }}/>
    </>
  );
}

function MiniTable({ headers, rows, highlightCol = 2, accentColor = ACCENT }: {
  headers: string[]; rows: string[][]; highlightCol?: number; accentColor?: string;
}) {
  const cols = headers.length;
  return (
    <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 20px rgba(0,0,0,0.07)" }}>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, borderBottom:`2px solid #F0EAD8` }}>
        {headers.map((h,i) => (
          <div key={i} style={{ padding:"12px 20px", fontFamily:FONT, fontWeight:700, fontSize:14, color: i===highlightCol ? accentColor : INK }}>{h}</div>
        ))}
      </div>
      {rows.map((row,r) => (
        <div key={r} style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, borderTop: r===0 ? "none" : "1px solid #F0EAD8" }}>
          {row.map((cell,c) => (
            <div key={c} style={{ padding:"11px 20px", fontFamily:FONT, fontSize:15, fontWeight: c===highlightCol ? 700 : 500, color: c===highlightCol ? accentColor : INK }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PlotVisual() {
  const pts: [number,number][] = [[0,0],[1,20],[2,40],[3,60],[4,80]];
  const pad=36, W=400, H=260;
  const xs=(x:number)=>pad+(x/4)*(W-pad-20);
  const ys=(y:number)=>H-pad-(y/80)*(H-pad-20);
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)", maxWidth:700 }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0,1,2,3,4].map(x=><line key={`v${x}`} x1={xs(x)} y1={10} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>)}
        {[0,20,40,60,80].map(y=><line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-20} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>)}
        <line x1={pad} y1={H-pad} x2={W-20} y2={H-pad} stroke={INK} strokeWidth="2"/>
        <line x1={pad} y1={10} x2={pad} y2={H-pad} stroke={INK} strokeWidth="2"/>
        {[0,20,40,60,80].map(y=>(
          <text key={y} x={pad-8} y={ys(y)+5} fontFamily={MONO} fontSize="12" fill={SOFT} textAnchor="end">{y}</text>
        ))}
        {[0,1,2,3,4].map(x=>(
          <text key={x} x={xs(x)} y={H-pad+18} fontFamily={MONO} fontSize="12" fill={SOFT} textAnchor="middle">{x}</text>
        ))}
        <line x1={xs(0)} y1={ys(0)} x2={xs(4)} y2={ys(80)} stroke={ACCENT} strokeWidth="4" strokeLinecap="round"/>
        {pts.map(([x,y],i)=>(
          <circle key={i} cx={xs(x)} cy={ys(y)} r="8" fill={ACCENT} stroke="#fff" strokeWidth="3"/>
        ))}
      </svg>
    </div>
  );
}

function LineVsCurveSVG() {
  const graphs=[
    { label:"A", color:ACCENT, path:"M 10 110 L 140 20" },
    { label:"B", color:PURPLE, path:"M 10 110 Q 75 110 75 65 T 140 20" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, maxWidth:700 }}>
      {graphs.map(g=>(
        <div key={g.label} style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
          <svg width="100%" height={150} viewBox="0 0 150 130">
            {[30,60,90].map((v,k)=><line key={`h${k}`} x1={10} y1={v} x2={140} y2={v} stroke="#F0E9D1" strokeWidth="1"/>)}
            {[40,70,100].map((v,k)=><line key={`v${k}`} x1={v} y1={10} x2={v} y2={120} stroke="#F0E9D1" strokeWidth="1"/>)}
            <line x1={10} y1={120} x2={140} y2={120} stroke={INK} strokeWidth="1.5"/>
            <line x1={10} y1={10}  x2={10}  y2={120} stroke={INK} strokeWidth="1.5"/>
            <path d={g.path} stroke={g.color} strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily:FONT, fontSize:20, fontWeight:900, color:INK, textAlign:"center", marginTop:6 }}>{g.label}</div>
        </div>
      ))}
    </div>
  );
}

function FormulaCard() {
  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"28px 24px", textAlign:"center", boxShadow:"0 6px 0 rgba(31,37,68,0.08)", fontFamily:MONO, fontSize:52, fontWeight:500, color:INK, marginBottom:16 }}>
        <div style={{ fontSize:13, fontFamily:FONT, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>The formula</div>
        y = <span style={{ color:ORANGE, fontWeight:700 }}>m</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>b</span>
      </div>
      <div style={{ display:"flex", gap:14 }}>
        <div style={{ flex:1, background:ORANGE, color:"#fff", borderRadius:18, padding:"18px 20px" }}>
          <div style={{ fontFamily:MONO, fontSize:26, fontWeight:700 }}>m</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, marginTop:4 }}>rate of change</div>
        </div>
        <div style={{ flex:1, background:PURPLE, color:"#fff", borderRadius:18, padding:"18px 20px" }}>
          <div style={{ fontFamily:MONO, fontSize:26, fontWeight:700 }}>b</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, marginTop:4 }}>starting value</div>
        </div>
      </div>
    </div>
  );
}

function TaxiCard() {
  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)", marginBottom:14 }}>
        <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:SOFT, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>The ride</div>
        <div style={{ fontFamily:FONT, fontSize:16, color:INK, lineHeight:1.5 }}>
          Taxi charges <b style={{ color:PURPLE }}>$5</b> the second you sit down, then <b style={{ color:ORANGE }}>$2</b> for every mile.
        </div>
      </div>
      <div style={{ background:"#fff", borderRadius:20, padding:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)", fontFamily:MONO, fontSize:34, fontWeight:500, color:INK, textAlign:"center", marginBottom:14 }}>
        Cost = <span style={{ color:ORANGE, fontWeight:700 }}>2</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>5</span>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <div style={{ flex:1, background:ORANGE, color:"#fff", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ fontFamily:MONO, fontSize:20, fontWeight:700 }}>m = 2</div>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, marginTop:2 }}>$2 per mile</div>
        </div>
        <div style={{ flex:1, background:PURPLE, color:"#fff", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ fontFamily:MONO, fontSize:20, fontWeight:700 }}>b = 5</div>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, marginTop:2 }}>$5 before moving</div>
        </div>
      </div>
    </div>
  );
}

function EquationCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"28px 28px", textAlign:"center", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", fontFamily:MONO, fontSize:48, fontWeight:500, color:INK, maxWidth:520 }}>
      {children}
    </div>
  );
}

function EarningsVisual() {
  const hours = [0, 1, 2, 3, 4];
  const W = 260, H = 180, pad = 40;
  const xs = (x: number) => pad + (x / 4) * (W - pad - 16);
  const ys = (y: number) => H - pad - (y / 60) * (H - pad - 12);
  return (
    <div style={{ display:"flex", gap:16, maxWidth:700, alignItems:"stretch" }}>
      <div style={{ flex:"0 0 160px", background:"#fff", borderRadius:20, padding:"24px 20px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:`${ACCENT}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke={ACCENT} strokeWidth="2.5"/>
            <path d="M16 8v2M16 22v2M10 16h2M20 16h2" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill={ACCENT}/>
            <path d="M16 13v3l2 2" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily:FONT, textAlign:"center" }}>
          <div style={{ fontSize:28, fontWeight:900, color:INK }}>$15</div>
          <div style={{ fontSize:13, fontWeight:600, color:SOFT, marginTop:2 }}>per hour</div>
        </div>
        <div style={{ fontFamily:FONT, fontSize:12, color:SOFT, textAlign:"center", lineHeight:1.5 }}>More hours →<br/>more pay</div>
      </div>
      <div style={{ flex:1, background:"#fff", borderRadius:20, padding:"16px 16px 8px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          {[0, 15, 30, 45, 60].map(y => (
            <line key={y} x1={pad} y1={ys(y)} x2={W - 12} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>
          ))}
          <line x1={pad} y1={H - pad} x2={W - 12} y2={H - pad} stroke={INK} strokeWidth="2"/>
          <line x1={pad} y1={8} x2={pad} y2={H - pad} stroke={INK} strokeWidth="2"/>
          {[0, 15, 30, 45, 60].map(y => (
            <text key={y} x={pad - 6} y={ys(y) + 4} fontFamily={MONO} fontSize="10" fill={SOFT} textAnchor="end">${y}</text>
          ))}
          {hours.map(x => (
            <text key={x} x={xs(x)} y={H - pad + 14} fontFamily={MONO} fontSize="10" fill={SOFT} textAnchor="middle">{x}h</text>
          ))}
          <line x1={xs(0)} y1={ys(0)} x2={xs(4)} y2={ys(60)} stroke={ACCENT} strokeWidth="3.5" strokeLinecap="round"/>
          {hours.map((x, i) => (
            <circle key={i} cx={xs(x)} cy={ys(x * 15)} r="6" fill={ACCENT} stroke="#fff" strokeWidth="2.5"/>
          ))}
        </svg>
        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:600, color:SOFT, textAlign:"center", paddingBottom:6 }}>hours worked → pay earned</div>
      </div>
    </div>
  );
}

type OptionState = "idle" | "correct" | "wrong" | "dim";
function OptionRow({ letter, label, state, onClick }: {
  letter: string; label: string; state: OptionState; onClick?: () => void;
}) {
  const S: Record<OptionState,{ bg:string; border:string; text:string; badge:string; badgeText:string }> = {
    idle:    { bg:"#fff",     border:"rgba(31,37,68,0.14)", text:INK,  badge:"#F5F0E8",             badgeText:INK },
    correct: { bg:"#E7F8EC", border:GREEN,                  text:INK,  badge:GREEN,                 badgeText:"#fff" },
    wrong:   { bg:"#FDECEC", border:RED,                    text:SOFT, badge:RED,                   badgeText:"#fff" },
    dim:     { bg:"#fff",    border:"rgba(31,37,68,0.07)",  text:"rgba(31,37,68,0.35)", badge:"rgba(31,37,68,0.07)", badgeText:"rgba(31,37,68,0.3)" },
  };
  const s = S[state];
  return (
    <div
      onClick={state==="idle" ? onClick : undefined}
      style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px", borderRadius:16, background:s.bg, border:`2px solid ${s.border}`, cursor:state==="idle" ? "pointer" : "default", transition:"all 0.15s" }}
    >
      <div style={{ width:38, height:38, borderRadius:10, background:s.badge, color:s.badgeText, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:16, fontWeight:900, flexShrink:0 }}>
        {letter}
      </div>
      <div style={{ fontFamily:FONT, fontSize:17, fontWeight:600, color:s.text, flex:1, lineHeight:1.3 }}>{label}</div>
      {state==="correct" && (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill={GREEN}/>
          <path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {state==="wrong" && (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill={RED}/>
          <path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

type Slide =
  | { kind:"intro" }
  | { kind:"teach"; tag:string; tagColor?:string; headline:React.ReactNode; visual?:React.ReactNode; body?:React.ReactNode }
  | { kind:"ab"; tag:string; tagColor?:string; headline:string; visual?:React.ReactNode; optionA:string; optionB:string; correct:"A"|"B"; explain:string }
  | { kind:"transition"; variant:1|2|3 }
  | { kind:"recap" }
  | { kind:"complete" };

const SLIDES: Slide[] = [
  { kind:"intro" },
  {
    kind:"teach", tag:"What is a linear equation?",
    headline: <>Linear equations show relationships that <span style={{ color:ACCENT }}>grow at a steady rate</span>.</>,
    visual: <EarningsVisual />,
    body: <>Every hour you work, you earn exactly $15 more. That steady, predictable pattern is a linear relationship.</>,
  },
  {
    kind:"teach", tag:"01 · Recognise it",
    headline: <>The straight line happens because the change is <span style={{ color:ACCENT }}>always the same</span>.</>,
    visual: <MiniTable headers={["Week","Savings","Change"]} rows={[["0","$0","—"],["1","$20","+ $20"],["2","$40","+ $20"],["3","$60","+ $20"],["4","$80","+ $20"]]} highlightCol={2} accentColor={ACCENT}/>,
    body: <>Savings go up by <b style={{ color:ACCENT }}>$20 every week</b> — never more, never less. That constant gap is what makes the line straight.</>,
  },
  {
    kind:"ab", tag:"01 · Recognise it",
    headline:"Is this table linear?",
    visual: <MiniTable headers={["x","y","Gap"]} rows={[["0","5","—"],["1","15","+10"],["2","30","+15"],["3","50","+20"]]} highlightCol={2} accentColor={RED}/>,
    optionA:"Yes — the values are going up",
    optionB:"No — the gap changes each row",
    correct:"B", explain:"Going up isn't enough. The gap has to be identical every row — here it grows each time, so it's not linear.",
  },
  {
    kind:"ab", tag:"01 · Recognise it",
    headline:"Which graph shows a linear equation?",
    visual: <LineVsCurveSVG />,
    optionA:"A — the straight line", optionB:"B — the curved line",
    correct:"A", explain:"Linear always means straight. A curve means the rate of change isn't constant.",
  },
  {
    kind:"teach", tag:"02 · The equation",
    headline:"Every linear equation follows the same pattern.",
    visual: <FormulaCard />,
    body: <><b style={{ color:ORANGE }}>m</b> is how much y changes each step. <b style={{ color:PURPLE }}>b</b> is where y starts when x = 0.</>,
  },
  {
    kind:"teach", tag:"02 · The equation",
    headline: <>Real life: a <span style={{ color:ORANGE }}>taxi ride</span>.</>,
    visual: <TaxiCard />,
    body: <>Upfront fee = <b style={{ color:PURPLE }}>b</b>. Price per mile = <b style={{ color:ORANGE }}>m</b>. That&apos;s it.</>,
  },
  {
    kind:"ab", tag:"02 · The equation",
    headline:"In y = 3x + 7, which number is the rate of change?",
    visual: <EquationCard>y = <span style={{ color:ORANGE, fontWeight:700 }}>3</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>7</span></EquationCard>,
    optionA:"3", optionB:"7", correct:"A",
    explain:"m is always the number next to x. It's the rate of change — how much y changes per step.",
  },
  {
    kind:"ab", tag:"02 · The equation",
    headline:"In y = 3x + 7, which number is the starting value?",
    visual: <EquationCard>y = <span style={{ color:ORANGE, fontWeight:700 }}>3</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>7</span></EquationCard>,
    optionA:"3", optionB:"7", correct:"B",
    explain:"b is the number on its own — no x attached. It's where y starts when x = 0.",
  },
  {
    kind:"ab", tag:"02 · The equation",
    headline:"A plumber charges $75 to show up, then $40/hr. What's b in C = 40h + 75?",
    visual: (
      <div style={{ background:"#fff", borderRadius:20, padding:"28px 28px", textAlign:"center", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", fontFamily:MONO, fontSize:44, fontWeight:500, color:INK, maxWidth:520 }}>
        C = <span style={{ color:ORANGE, fontWeight:700 }}>40</span>h + <span style={{ color:PURPLE, fontWeight:700 }}>75</span>
        <div style={{ fontSize:14, color:SOFT, marginTop:12, fontFamily:FONT, fontWeight:600 }}>
          <span style={{ color:ORANGE }}>m = 40</span> &nbsp;·&nbsp; <span style={{ color:PURPLE }}>b = ?</span>
        </div>
      </div>
    ),
    optionA:"$40", optionB:"$75", correct:"B",
    explain:"b is what you owe before any hours pass. At h = 0, cost = $75.",
  },
  {
    kind:"ab", tag:"Selective Question", tagColor:RED,
    headline:"A gym charges $60 to join, then $25/month. Which equation is correct?",
    optionA:"C = 60m + 25", optionB:"C = 25m + 60", correct:"B",
    explain:"m = $25 (changes every month). b = $60 (what you pay upfront). Don't flip them.",
  },
  {
    kind:"ab", tag:"Selective Question", tagColor:RED,
    headline:"A phone plan costs $30/month plus a $50 activation fee. Which equation shows total cost C after m months?",
    optionA:"C = 50m + 30", optionB:"C = 30m + 50", correct:"B",
    explain:"The rate of change is $30 per month — sits next to m. The starting value is $50 — that's b.",
  },
  {
    kind:"ab", tag:"Selective Question", tagColor:RED,
    headline:"A pool is being filled: W = 4t + 12. Which statement is true?",
    visual: <EquationCard>W = <span style={{ color:ORANGE, fontWeight:700 }}>4</span>t + <span style={{ color:PURPLE, fontWeight:700 }}>12</span></EquationCard>,
    optionA:"Pool starts at 4 inches, rises 12 in/min",
    optionB:"Pool starts at 12 inches, rises 4 in/min",
    correct:"B", explain:"b = 12 is the starting value (water at t = 0). m = 4 is the rate — water rises 4 inches every minute.",
  },
  { kind:"transition", variant:1 },
  { kind:"transition", variant:2 },
  { kind:"transition", variant:3 },
  { kind:"recap" },
  { kind:"complete" },
];

export default function InteractiveLessonExp2({ onClose, onComplete }: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number,"A"|"B">>({});

  const slide      = SLIDES[slideIdx];
  const pickedHere = picks[slideIdx] ?? null;
  const submitted  = pickedHere !== null;
  const SEGS       = SLIDES.length - 1;
  const progress   = (slideIdx / SEGS) * 100;

  const isIntro      = slide.kind === "intro";
  const isComplete   = slide.kind === "complete";
  const isTransition = slide.kind === "transition";
  const showTopBar   = !isIntro && !isComplete && !isTransition;
  // When submitted on an AB slide, the feedback banner replaces the action bar in normal flow
  const showFeedback = slide.kind === "ab" && submitted;

  useEffect(() => {
    if (slide.kind === "complete") playCorrect();
  }, [slideIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    if (slideIdx + 1 >= SLIDES.length) { onComplete(); onClose(); return; }
    setSlideIdx(i => i + 1);
  }
  function goBack() { setSlideIdx(i => i - 1); }

  function getOptionState(letter: "A"|"B"): OptionState {
    if (!submitted) return "idle";
    const s = slide as Extract<Slide,{kind:"ab"}>;
    if (letter === s.correct) return "correct";
    if (letter === pickedHere) return "wrong";
    return "dim";
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"#E8E3DA", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, zIndex:100 }}>
      {/* Card — responsive height so it never overflows viewport */}
      <div style={{
        width:"min(1448px, 97vw)",
        height:"min(1086px, calc(100vh - 32px))",
        background:CREAM,
        borderRadius:20,
        boxShadow:"0 4px 32px rgba(0,0,0,0.10)",
        display:"flex",
        flexDirection:"column",
        position:"relative",
        overflow:"hidden",
      }}>
        <BgCircles />

        {/* 3-row grid: top bar (auto) | scrollable content (1fr) | bottom bar (auto)
            Grid 1fr rows always resolve to definite pixel heights, so overflowY:auto clips reliably */}
        <div style={{ position:"relative", zIndex:1, flex:1, minHeight:0, display:"grid", gridTemplateRows:"auto 1fr auto", overflow:"hidden" }}>

          {/* ── Row 1: top zone ── */}
          <div>
            {/* Teach / AB / Recap: progress bar + close */}
            {showTopBar && (
              <div style={{ padding:"22px 52px 0", display:"flex", alignItems:"center", gap:20 }}>
                <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 22 22">
                    <path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div style={{ flex:1, height:7, borderRadius:99, background:"rgba(31,37,68,0.1)", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${progress}%`, borderRadius:99, background:ACCENT, transition:"width 0.4s ease" }}/>
                </div>
              </div>
            )}
            {/* Intro: close button only */}
            {isIntro && (
              <div style={{ padding:"22px 52px 0" }}>
                <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
                  <svg width="20" height="20" viewBox="0 0 22 22">
                    <path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* ── Row 2: scrollable content (1fr — definite height from grid) ── */}
          <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, overflowY:"auto", padding:"28px 52px 0" }}>

            {/* INTRO */}
            {slide.kind === "intro" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column" }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:540, paddingBottom:40 }}>
                  <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>
                    Selective Maths · Lesson 01
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:64, fontWeight:900, color:INK, lineHeight:1.0, marginBottom:32 }}>
                    Linear<br/>Functions,<br/>from zero.
                  </div>
                  <div style={{ display:"flex", gap:14, marginBottom:24 }}>
                    <span style={{ background:ACCENT, color:"#fff", fontFamily:MONO, fontSize:18, padding:"12px 22px", borderRadius:9999, boxShadow:"0 5px 0 rgba(0,0,0,0.12)" }}>y = mx + b</span>
                    <span style={{ background:PURPLE, color:"#fff", fontFamily:FONT, fontSize:18, fontWeight:800, padding:"12px 22px", borderRadius:9999, boxShadow:"0 5px 0 rgba(0,0,0,0.12)" }}>made easy</span>
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:14, color:SOFT }}>12 steps · about 6 minutes</div>
                </div>
              </div>
            )}

            {/* TEACH */}
            {slide.kind === "teach" && (() => {
              const s = slide as Extract<Slide,{kind:"teach"}>;
              return (
                <div style={{ paddingBottom:28 }}>
                  <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:s.tagColor||ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
                    {tagLabel(s.tag)}
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:46, fontWeight:900, color:INK, lineHeight:1.1, marginBottom:14, maxWidth:660 }}>
                    {s.headline}
                  </div>
                  {s.body && (
                    <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:SOFT, lineHeight:1.55, marginBottom:26, maxWidth:580 }}>
                      {s.body}
                    </div>
                  )}
                  {s.visual && <div style={{ maxWidth:740 }}>{s.visual}</div>}
                </div>
              );
            })()}

            {/* AB */}
            {slide.kind === "ab" && (() => {
              const s = slide as Extract<Slide,{kind:"ab"}>;
              return (
                <div style={{ paddingBottom:28 }}>
                  <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:s.tagColor||ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
                    {tagLabel(s.tag)}
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:34, fontWeight:900, color:INK, lineHeight:1.15, marginBottom:22, maxWidth:680 }}>
                    {s.headline}
                  </div>
                  {s.visual && <div style={{ maxWidth:740, marginBottom:22 }}>{s.visual}</div>}
                  <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:660 }}>
                    <OptionRow letter="A" label={s.optionA} state={submitted ? getOptionState("A") : "idle"} onClick={() => { if (!submitted) { if ("A" === s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"A"})); } }}/>
                    <OptionRow letter="B" label={s.optionB} state={submitted ? getOptionState("B") : "idle"} onClick={() => { if (!submitted) { if ("B" === s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"B"})); } }}/>
                  </div>
                </div>
              );
            })()}

            {/* TRANSITION */}
            {slide.kind === "transition" && (() => {
              const v = (slide as Extract<Slide,{kind:"transition"}>).variant;
              return (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  background: v === 1 ? INK : v === 3 ? RED : CREAM,
                  borderRadius: "inherit",
                }}>
                  {/* Label */}
                  <div style={{ position:"absolute", top:20, left:28, fontFamily:FONT, fontSize:11, fontWeight:700, color: v===1?"rgba(255,255,255,0.4)":v===3?"rgba(255,255,255,0.6)":SOFT, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                    Option {v}
                  </div>

                  {/* Option 1 — Dark dramatic */}
                  {v === 1 && (
                    <div style={{ textAlign:"center", padding:"0 60px" }}>
                      <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:20 }}>You&apos;ve learned the concepts.</div>
                      <div style={{ fontFamily:FONT, fontSize:72, fontWeight:900, color:"#fff", lineHeight:0.95, marginBottom:40 }}>Now it&apos;s<br/>your turn.</div>
                      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:40 }}>
                        {Array.from({length:6}).map((_,i)=>(
                          <div key={i} style={{ width:36, height:10, borderRadius:99, background:RED,
                            opacity:0, animation:`fadeSlideUp 0.4s ease forwards`, animationDelay:`${i*120}ms`
                          }}/>
                        ))}
                      </div>
                      <div style={{ fontFamily:FONT, fontSize:14, color:"rgba(255,255,255,0.5)" }}>6 SAT Questions</div>
                    </div>
                  )}

                  {/* Option 2 — Gamified unlock */}
                  {v === 2 && (
                    <div style={{ textAlign:"center", padding:"0 60px" }}>
                      <div style={{ width:80, height:80, borderRadius:20, background:ACCENT, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", boxShadow:"0 8px 0 rgba(59,91,219,0.3)", animation:"bounceIn 0.5s ease" }}>
                        <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                          <rect x="14" y="28" width="36" height="26" rx="6" fill="white"/>
                          <path d="M22 28v-8a10 10 0 0 1 20 0v8" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
                          <circle cx="32" cy="41" r="4" fill={ACCENT}/>
                        </svg>
                      </div>
                      <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>SAT Questions unlocked</div>
                      <div style={{ fontFamily:FONT, fontSize:56, fontWeight:900, color:INK, lineHeight:1, marginBottom:32 }}>Prove what<br/>you know.</div>
                      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                        {Array.from({length:6}).map((_,i)=>(
                          <div key={i} style={{ width:32, height:32, borderRadius:10, background:RED, display:"flex", alignItems:"center", justifyContent:"center",
                            fontFamily:FONT, fontSize:13, fontWeight:800, color:"#fff",
                            opacity:0, animation:`popIn 0.3s ease forwards`, animationDelay:`${i*100}ms`
                          }}>{i+1}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Option 3 — Clean tension */}
                  {v === 3 && (
                    <div style={{ textAlign:"center", padding:"0 60px" }}>
                      <div style={{ fontFamily:FONT, fontSize:72, fontWeight:900, color:"#fff", lineHeight:0.95, marginBottom:20 }}>6 questions.<br/>No hints.</div>
                      <div style={{ fontFamily:FONT, fontSize:16, color:"rgba(255,255,255,0.7)", marginBottom:48 }}>Show what you&apos;ve learned.</div>
                      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                        {Array.from({length:6}).map((_,i)=>(
                          <div key={i} style={{ width:40, height:10, borderRadius:99, background:"rgba(255,255,255,0.25)", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", inset:0, background:"#fff", borderRadius:99,
                              animation:`fillBar 0.4s ease forwards`, animationDelay:`${i*150}ms`, transform:"scaleX(0)", transformOrigin:"left"
                            }}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Continue button */}
                  <button onClick={advance} style={{
                    position:"absolute", bottom:28, right:40,
                    padding:"13px 36px", border:"none", borderRadius:14, cursor:"pointer",
                    fontFamily:FONT, fontSize:14, fontWeight:800, letterSpacing:"0.04em",
                    background: v===2 ? ACCENT : "#fff",
                    color: v===2 ? "#fff" : v===1 ? INK : RED,
                    boxShadow: v===2 ? "0 4px 0 rgba(59,91,219,0.3)" : "0 4px 0 rgba(0,0,0,0.1)",
                  }}>
                    START →
                  </button>

                  <style>{`
                    @keyframes fadeSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                    @keyframes bounceIn { 0% { transform:scale(0.5); opacity:0; } 70% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }
                    @keyframes popIn { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
                    @keyframes fillBar { from { transform:scaleX(0); } to { transform:scaleX(1); } }
                  `}</style>
                </div>
              );
            })()}

            {/* RECAP */}
            {slide.kind === "recap" && (
              <div style={{ paddingBottom:28 }}>
                <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
                  Key concepts recap
                </div>
                <div style={{ fontFamily:FONT, fontSize:42, fontWeight:900, color:INK, lineHeight:1.1, marginBottom:24 }}>
                  A linear function in one sentence.
                </div>
                <div style={{ display:"flex", gap:40, alignItems:"flex-start", maxWidth:960 }}>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", gap:20 }}>
                    <div style={{ background:GREEN, borderRadius:20, padding:"22px 24px", boxShadow:`0 6px 0 ${GREEN_DK}`, color:"#fff", fontFamily:FONT, fontSize:16, fontWeight:700, lineHeight:1.55 }}>
                      A function is linear when it changes by the same amount each step — that&apos;s <b>m</b>. Its equation is y = mx + b, where <b>b</b> is the starting value.
                    </div>
                    <div>
                      <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:ORANGE, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>How to spot one on the Selective exam</div>
                      {["In a table: the gap between values is constant.","On a graph: the points form a straight line.","In a word problem: a fixed starting value + a fixed rate per unit."].map((t,i)=>(
                        <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:10 }}>
                          <div style={{ width:10, height:10, borderRadius:"50%", background:ORANGE, flexShrink:0, marginTop:6 }}/>
                          <span style={{ fontFamily:FONT, fontSize:15, fontWeight:600, color:INK, lineHeight:1.5 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ background:"#fff", borderRadius:20, padding:"22px 26px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", textAlign:"center", marginBottom:16 }}>
                      <div style={{ fontFamily:MONO, fontSize:11, color:SOFT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>The formula</div>
                      <div style={{ fontFamily:MONO, fontSize:50, fontWeight:500, color:INK }}>
                        y = <span style={{ color:ORANGE, fontWeight:700 }}>m</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>b</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:14 }}>
                      <div style={{ flex:1, background:ORANGE, color:"#fff", borderRadius:16, padding:"14px 18px" }}>
                        <div style={{ fontFamily:MONO, fontSize:22, fontWeight:700 }}>m</div>
                        <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, marginTop:4 }}>rate of change</div>
                      </div>
                      <div style={{ flex:1, background:PURPLE, color:"#fff", borderRadius:16, padding:"14px 18px" }}>
                        <div style={{ fontFamily:MONO, fontSize:22, fontWeight:700 }}>b</div>
                        <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, marginTop:4 }}>starting value</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COMPLETE */}
            {slide.kind === "complete" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:22, maxWidth:500 }}>
                  <div style={{ width:88, height:88, borderRadius:"50%", background:GREEN, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 7px 0 ${GREEN_DK}` }}>
                    <svg width="44" height="44" viewBox="0 0 64 64">
                      <path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:50, fontWeight:900, color:INK, lineHeight:1.05 }}>Lesson complete.</div>
                  <div style={{ fontFamily:FONT, fontSize:17, color:SOFT, lineHeight:1.6 }}>
                    You can now spot a linear function, graph one, and pick the right equation from a word problem.
                  </div>
                  <span style={{ background:GREEN, color:"#fff", fontFamily:FONT, fontSize:17, fontWeight:800, padding:"13px 26px", borderRadius:9999, display:"inline-block", boxShadow:`0 5px 0 ${GREEN_DK}` }}>
                    8 / 8 correct
                  </span>
                </div>
              </div>
            )}

          </div>{/* scrollable inner */}
          </div>{/* row 2: scrollable shell */}

          {/* ── Row 3: bottom zone — separator is the hard visual boundary ── */}
          <div style={{ borderTop: showFeedback || isTransition ? "none" : "2px solid rgba(31,37,68,0.10)" }}>
            {isIntro && (
              <div style={{ padding:"14px 52px 26px", display:"flex", justifyContent:"flex-end" }}>
                <button onClick={advance} style={{ padding:"15px 48px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>
                  START LESSON
                </button>
              </div>
            )}
            {isComplete && (
              <div style={{ padding:"14px 52px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <button onClick={() => setSlideIdx(0)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:FONT, fontSize:14, fontWeight:700, color:SOFT }}>
                  Review from the start
                </button>
                <button onClick={() => { onComplete(); onClose(); }} style={{ padding:"13px 36px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>
                  BACK TO LESSONS
                </button>
              </div>
            )}
            {showTopBar && !showFeedback && (
              <div style={{ padding:"14px 52px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                {slideIdx > 0 ? (
                  <button onClick={goBack} style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 22px", borderRadius:14, border:"2px solid rgba(31,37,68,0.18)", background:"#fff", cursor:"pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontFamily:FONT, fontSize:14, fontWeight:700, color:INK, letterSpacing:"0.04em" }}>BACK</span>
                  </button>
                ) : <div />}
                {slide.kind === "ab" ? (
                  <button disabled style={{ padding:"13px 40px", background:"rgba(31,37,68,0.1)", color:"rgba(31,37,68,0.35)", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"not-allowed", letterSpacing:"0.04em" }}>
                    PICK AN ANSWER
                  </button>
                ) : (
                  <button onClick={advance} style={{ padding:"13px 40px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>
                    {slide.kind === "recap" ? "FINISH LESSON" : "CONTINUE"}
                  </button>
                )}
              </div>
            )}
            {showFeedback && (() => {
              const s = slide as Extract<Slide,{kind:"ab"}>;
              const isCorrect = pickedHere === s.correct;
              return (
                <div style={{ background: isCorrect ? GREEN : RED, padding:"20px 52px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
                  <div>
                    <div style={{ fontFamily:FONT, fontSize:17, fontWeight:900, color:"#fff", marginBottom:3, display:"flex", alignItems:"center", gap:8 }}>
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        {isCorrect
                          ? <path d="M2 8l4 4 8-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          : <path d="M3 3l10 10M13 3L3 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                        }
                      </svg>
                      {isCorrect ? "Nice." : "Not quite."}
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.92)", lineHeight:1.5, maxWidth:620 }}>
                      {s.explain}
                    </div>
                  </div>
                  <button onClick={advance} style={{ padding:"12px 30px", background:"#fff", color: isCorrect ? GREEN_DK : RED, border:"none", borderRadius:12, fontFamily:FONT, fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                    Continue
                  </button>
                </div>
              );
            })()}
          </div>{/* row 3: bottom zone */}

        </div>{/* inner grid */}
      </div>{/* card */}
    </div>
  );
}
