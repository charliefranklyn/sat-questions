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

function TwoSlopesVisual() {
  const graphs = [
    { label:"A", sub:"rises fast", color:ORANGE, x1:14, y1:118, x2:136, y2:20 },
    { label:"B", sub:"rises slowly", color:ACCENT, x1:14, y1:100, x2:136, y2:70 },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      {graphs.map(g => (
        <div key={g.label} style={{ background:"#fff", borderRadius:18, padding:14, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
          <svg width="100%" height={130} viewBox="0 0 150 130">
            {[30,60,90].map((v,k) => <line key={`h${k}`} x1={10} y1={v} x2={140} y2={v} stroke="#F0E9D1" strokeWidth="1"/>)}
            {[40,70,100].map((v,k) => <line key={`v${k}`} x1={v} y1={10} x2={v} y2={120} stroke="#F0E9D1" strokeWidth="1"/>)}
            <line x1={10} y1={120} x2={140} y2={120} stroke={INK} strokeWidth="1.5"/>
            <line x1={10} y1={10}  x2={10}  y2={120} stroke={INK} strokeWidth="1.5"/>
            <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke={g.color} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily:FONT, fontSize:15, fontWeight:900, color:INK, textAlign:"center", marginTop:4 }}>{g.label}</div>
          <div style={{ fontFamily:FONT, fontSize:12, fontWeight:600, color:SOFT, textAlign:"center", marginTop:2 }}>{g.sub}</div>
        </div>
      ))}
    </div>
  );
}

function GradientFormulaCard() {
  const sz = 44;
  return (
    <div>
      <div style={{ background:"#fff", borderRadius:24, padding:"32px 20px", boxShadow:"0 6px 0 rgba(31,37,68,0.08)", fontFamily:MONO, color:INK, display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:14 }}>
        <div style={{ fontSize:sz, fontWeight:500 }}>m&nbsp;=&nbsp;</div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ color:ORANGE, fontSize:sz*0.8, fontWeight:700, padding:"0 10px 4px" }}>
            y<sub style={{ fontSize:sz*0.5 }}>2</sub>&nbsp;&minus;&nbsp;y<sub style={{ fontSize:sz*0.5 }}>1</sub>
          </div>
          <div style={{ width:"100%", height:3, background:INK, borderRadius:2 }}/>
          <div style={{ color:PURPLE, fontSize:sz*0.8, fontWeight:700, padding:"4px 10px 0" }}>
            x<sub style={{ fontSize:sz*0.5 }}>2</sub>&nbsp;&minus;&nbsp;x<sub style={{ fontSize:sz*0.5 }}>1</sub>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <div style={{ flex:1, background:ORANGE, color:"#fff", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", opacity:0.9 }}>Top</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:800, marginTop:2 }}>Change in y</div>
        </div>
        <div style={{ flex:1, background:PURPLE, color:"#fff", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", opacity:0.9 }}>Bottom</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:800, marginTop:2 }}>Change in x</div>
        </div>
      </div>
    </div>
  );
}

function WorkedGradientCard({ p1, p2 }: { p1:[number,number]; p2:[number,number] }) {
  const dy = p2[1] - p1[1];
  const dx = p2[0] - p1[0];
  const m  = dy / dx;
  const steps = [
    { n:1, label:"Label the points", body: <>(x<sub>1</sub>, y<sub>1</sub>) = ({p1[0]}, {p1[1]}) &nbsp;·&nbsp; (x<sub>2</sub>, y<sub>2</sub>) = ({p2[0]}, {p2[1]})</> },
    { n:2, label:"Subtract y-values", body: <><span style={{ color:ORANGE, fontWeight:700 }}>{p2[1]} &minus; {p1[1]} = {dy}</span></> },
    { n:3, label:"Subtract x-values", body: <><span style={{ color:PURPLE, fontWeight:700 }}>{p2[0]} &minus; {p1[0]} = {dx}</span></> },
    { n:4, label:"Divide", body: <span style={{ color:GREEN, fontWeight:700 }}>m = {dy} &divide; {dx} = {m}</span> },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {steps.map(s => (
        <div key={s.n} style={{ display:"flex", alignItems:"flex-start", gap:12, background:"#fff", borderRadius:16, padding:"12px 14px", boxShadow:"0 3px 0 rgba(31,37,68,0.05)" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"#FFEAB8", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:15, fontWeight:900 }}>{s.n}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:SOFT, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:1 }}>{s.label}</div>
            <div style={{ fontFamily:MONO, fontSize:15, fontWeight:500, color:INK }}>{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PointsCard({ p1, p2, c1=ACCENT, c2=GREEN }: { p1:[number,number]; p2:[number,number]; c1?:string; c2?:string }) {
  const fmt = ([x,y]:[number,number]) => `(${x}, ${y})`;
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"18px 16px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", alignItems:"center", justifyContent:"space-around" }}>
      {[{label:"Point 1",pt:p1,color:c1},{label:"Point 2",pt:p2,color:c2}].map((item,i) => (
        <div key={i} style={{ textAlign:"center" }}>
          <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:item.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{item.label}</div>
          <div style={{ fontFamily:MONO, fontSize:26, fontWeight:700, color:INK }}>{fmt(item.pt)}</div>
        </div>
      ))}
    </div>
  );
}

function EquationCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"28px 28px", textAlign:"center", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", fontFamily:MONO, fontSize:40, fontWeight:500, color:INK, maxWidth:520 }}>
      {children}
    </div>
  );
}

type OptionState = "idle" | "correct" | "wrong" | "dim";
function OptionRow({ letter, label, state, onClick }: {
  letter:string; label:string; state:OptionState; onClick?:() => void;
}) {
  const S: Record<OptionState,{bg:string;border:string;text:string;badge:string;badgeText:string}> = {
    idle:    { bg:"#fff",    border:"rgba(31,37,68,0.14)", text:INK,  badge:"#F5F0E8",            badgeText:INK },
    correct: { bg:"#E7F8EC",border:GREEN,                  text:INK,  badge:GREEN,                badgeText:"#fff" },
    wrong:   { bg:"#FDECEC",border:RED,                    text:SOFT, badge:RED,                  badgeText:"#fff" },
    dim:     { bg:"#fff",   border:"rgba(31,37,68,0.07)", text:"rgba(31,37,68,0.35)", badge:"rgba(31,37,68,0.07)", badgeText:"rgba(31,37,68,0.3)" },
  };
  const s = S[state];
  return (
    <div onClick={state==="idle" ? onClick : undefined}
      style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px", borderRadius:16, background:s.bg, border:`2px solid ${s.border}`, cursor:state==="idle"?"pointer":"default", transition:"all 0.15s" }}>
      <div style={{ width:38, height:38, borderRadius:10, background:s.badge, color:s.badgeText, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:16, fontWeight:900, flexShrink:0 }}>{letter}</div>
      <div style={{ fontFamily:FONT, fontSize:17, fontWeight:600, color:s.text, flex:1, lineHeight:1.3 }}>{label}</div>
      {state==="correct" && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {state==="wrong"   && <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
    </div>
  );
}

type Slide =
  | { kind:"intro" }
  | { kind:"teach"; tag:string; tagColor?:string; headline:React.ReactNode; visual?:React.ReactNode; body?:React.ReactNode }
  | { kind:"ab"; tag:string; tagColor?:string; headline:React.ReactNode; body?:React.ReactNode; visual?:React.ReactNode; optionA:string; optionB:string; correct:"A"|"B"; explain:string }
  | { kind:"transition" }
  | { kind:"recap" }
  | { kind:"results" }
  | { kind:"complete" };

const SLIDES: Slide[] = [
  { kind:"intro" },
  {
    kind:"teach", tag:"01 · What is Gradient?",
    headline: <>Gradient measures how <span style={{ color:ACCENT }}>steep</span> a line is.</>,
    visual: <TwoSlopesVisual />,
    body: <>A steep line has a large gradient. A shallow line has a small one. The steeper the hill, the bigger the number.</>,
  },
  {
    kind:"ab", tag:"01 · What is Gradient?",
    headline: <>Which line has the <span style={{ color:ACCENT }}>higher gradient</span>?</>,
    visual: <TwoSlopesVisual />,
    optionA:"A — the steeper line",
    optionB:"B — the shallower line",
    correct:"A",
    explain:"Line A rises much faster — it gains more in y for every step in x. That means a higher gradient.",
  },
  {
    kind:"ab", tag:"01 · What is Gradient?",
    headline: <>What is the gradient of this line?</>,
    body:"The table shows how much altitude (y) is gained for each kilometre walked (x).",
    visual: <MiniTable headers={["km walked (x)","altitude gain (y)","change"]} rows={[["1","4","+4"],["2","8","+4"],["3","12","+4"],["4","16","+4"]]} highlightCol={2} accentColor={ORANGE}/>,
    optionA:"4",
    optionB:"8",
    correct:"A",
    explain:"The altitude goes up by 4 for every 1 km. That constant change is the gradient: m = 4.",
  },
  {
    kind:"teach", tag:"02 · The Formula",
    headline: <>Gradient = <span style={{ color:ORANGE }}>rise</span> &divide; <span style={{ color:PURPLE }}>run</span>.</>,
    visual: <GradientFormulaCard />,
    body: <>Pick any two points. Subtract the <b style={{ color:ORANGE }}>y-values</b> (rise). Divide by the difference in <b style={{ color:PURPLE }}>x-values</b> (run).</>,
  },
  {
    kind:"teach", tag:"02 · The Formula",
    headline: <>Let&apos;s use it. Points: <span style={{ fontFamily:MONO }}>{"(0, 2)"}</span> and <span style={{ fontFamily:MONO }}>{"(3, 8)"}</span>.</>,
    visual: <WorkedGradientCard p1={[0,2]} p2={[3,8]} />,
    body: <>The y-values differ by <b style={{ color:ORANGE }}>6</b>. The x-values differ by <b style={{ color:PURPLE }}>3</b>. So m = 6 &divide; 3 = <b style={{ color:GREEN }}>2</b>.</>,
  },
  {
    kind:"ab", tag:"02 · The Formula",
    headline: "What is the gradient of the line through (0, 2) and (3, 8)?",
    visual: <PointsCard p1={[0,2]} p2={[3,8]} />,
    optionA:"2",
    optionB:"3",
    correct:"A",
    explain:"(8 − 2) ÷ (3 − 0) = 6 ÷ 3 = 2. Always put y on top and x on the bottom.",
  },
  {
    kind:"ab", tag:"02 · The Formula",
    headline: "What is the gradient of the line through (1, 6) and (3, 2)?",
    visual: <PointsCard p1={[1,6]} p2={[3,2]} />,
    optionA:"−2",
    optionB:"2",
    correct:"A",
    explain:"(2 − 6) ÷ (3 − 1) = −4 ÷ 2 = −2. Negative because y decreases as x increases — the line slopes downward.",
  },
  { kind:"recap" },
  { kind:"transition" },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"A road rises 8 m for every 4 m of horizontal distance. What is the gradient?",
    visual: <MiniTable headers={["horizontal (x)","height gained (y)"]} rows={[["4 m","8 m"],["8 m","16 m"],["12 m","24 m"]]} highlightCol={1} accentColor={RED}/>,
    optionA:"2",
    optionB:"0.5",
    correct:"A",
    explain:"Gradient = rise ÷ run = 8 ÷ 4 = 2. For every 1 metre forward, the road rises 2 metres.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"What is the gradient of the line through (1, 3) and (5, 11)?",
    visual: <PointsCard p1={[1,3]} p2={[5,11]} c1={RED} c2={ORANGE}/>,
    optionA:"4",
    optionB:"2",
    correct:"B",
    explain:"(11 − 3) ÷ (5 − 1) = 8 ÷ 4 = 2. Don't confuse the change in y (8) with the final gradient (2).",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"What is the gradient of the line through (2, 6) and (4, 2)?",
    visual: <PointsCard p1={[2,6]} p2={[4,2]} c1={RED} c2={ORANGE}/>,
    optionA:"2",
    optionB:"−2",
    correct:"B",
    explain:"(2 − 6) ÷ (4 − 2) = −4 ÷ 2 = −2. The y-values are going down, so the gradient is negative.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline: <>What is the gradient of the line <span style={{ fontFamily:MONO }}>y = 5x + 3</span>?</>,
    visual: <EquationCard>y = <span style={{ color:ORANGE, fontWeight:700 }}>5</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>3</span></EquationCard>,
    optionA:"5",
    optionB:"3",
    correct:"A",
    explain:"In y = mx + b, the gradient is always m — the number multiplied by x. Here m = 5. The 3 is the y-intercept, not the gradient.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Which line has a steeper gradient?",
    visual: (
      <div style={{ display:"flex", gap:12 }}>
        <EquationCard>A: y = <span style={{ color:ORANGE, fontWeight:700 }}>4</span>x − 2</EquationCard>
        <EquationCard>B: y = <span style={{ color:PURPLE, fontWeight:700 }}>3</span>x + 1</EquationCard>
      </div>
    ),
    optionA:"y = 4x − 2",
    optionB:"y = 3x + 1",
    correct:"A",
    explain:"Line A has gradient 4. Line B has gradient 3. 4 > 3, so line A is steeper. The y-intercepts don't affect steepness.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"What is the gradient of the line through (0, 4) and (2, 0)?",
    visual: <PointsCard p1={[0,4]} p2={[2,0]} c1={RED} c2={ORANGE}/>,
    optionA:"2",
    optionB:"−2",
    correct:"B",
    explain:"(0 − 4) ÷ (2 − 0) = −4 ÷ 2 = −2. The line goes from (0,4) down to (2,0) — it slopes downward, so negative.",
  },
  { kind:"results" },
  { kind:"complete" },
];

export default function InteractiveLesson02({ onClose, onComplete }: {
  onClose:() => void; onComplete:() => void;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [picks, setPicks]       = useState<Record<number,"A"|"B">>({});
  const [completeLevel, setCompleteLevel] = useState(1);
  const [completePct, setCompletePct]     = useState(20);
  const [recapPicks, setRecapPicks]       = useState<Record<number,boolean>>({});

  const slide      = SLIDES[slideIdx];
  const pickedHere = picks[slideIdx] ?? null;
  const submitted  = pickedHere !== null;
  const SAT_START  = SLIDES.findIndex(s => s.kind === "ab" && (s as Extract<Slide,{kind:"ab"}>).tag === "SAT Question");
  const SAT_COUNT  = 6;
  const inSAT      = slideIdx >= SAT_START && slideIdx < SAT_START + SAT_COUNT;
  const progress   = inSAT ? 100 : Math.min(100, (slideIdx / (SAT_START - 1)) * 100);

  const isIntro      = slide.kind === "intro";
  const isComplete   = slide.kind === "complete";
  const isTransition = slide.kind === "transition";
  const isResults    = slide.kind === "results";
  const showTopBar   = !isIntro && !isComplete && !isTransition && !isResults;
  const showFeedback = slide.kind === "ab" && submitted;

  useEffect(() => {
    if (slide.kind === "complete") {
      playCorrect();
      setCompleteLevel(2);
      setCompletePct(20);
      setTimeout(() => { setCompleteLevel(3); setCompletePct(30); }, 700);
    }
  }, [slideIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    if (slideIdx + 1 >= SLIDES.length) { onComplete(); onClose(); return; }
    setSlideIdx(i => i + 1);
  }
  function goBack() { setSlideIdx(i => i - 1); }

  function getOptionState(letter:"A"|"B"): OptionState {
    if (!submitted) return "idle";
    const s = slide as Extract<Slide,{kind:"ab"}>;
    if (letter === s.correct) return "correct";
    if (letter === pickedHere) return "wrong";
    return "dim";
  }

  const recapStatements = [
    { text:"Gradient measures how steep a line is.", answer:true },
    { text:"A negative gradient means the line goes down from left to right.", answer:true },
    { text:"Gradient is calculated by dividing the change in x by the change in y.", answer:false },
    { text:"Any two points on a line give the same gradient.", answer:true },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"#E8E3DA", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, zIndex:100 }}>
      <div style={{
        width:"min(1448px, 97vw)", height:"min(1086px, calc(100vh - 32px))",
        background:CREAM, borderRadius:20, boxShadow:"0 4px 32px rgba(0,0,0,0.10)",
        display:"flex", flexDirection:"column", position:"relative", overflow:"hidden",
      }}>
        <BgCircles />
        <div style={{ position:"relative", zIndex:1, flex:1, minHeight:0, display:"grid", gridTemplateRows:"auto 1fr auto", overflow:"hidden" }}>

          {/* Top bar */}
          <div>
            {showTopBar && (
              <div style={{ padding:"22px 52px 0", display:"flex", alignItems:"center", gap:20 }}>
                <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
                {inSAT ? (
                  <div style={{ flex:1, display:"flex", gap:6, alignItems:"center" }}>
                    {Array.from({ length:SAT_COUNT }).map((_,i) => {
                      const done = slideIdx - SAT_START;
                      const filled = i < done, current = i === done;
                      return <div key={i} style={{ flex:1, height:8, borderRadius:99, background: filled ? RED : current ? `${RED}55` : "rgba(31,37,68,0.1)", transition:"background 0.3s ease" }}/>;
                    })}
                  </div>
                ) : (
                  <div style={{ flex:1, height:7, borderRadius:99, background:"rgba(31,37,68,0.1)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${progress}%`, borderRadius:99, background:ACCENT, transition:"width 0.4s ease" }}/>
                  </div>
                )}
              </div>
            )}
            {isIntro && (
              <div style={{ padding:"22px 52px 0" }}>
                <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
                  <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, overflowY:"auto", padding:"28px 52px 0" }}>

            {/* TRANSITION */}
            {slide.kind === "transition" && (
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:CREAM, borderRadius:"inherit" }}>
                <div style={{ width:80, height:80, borderRadius:20, background:ACCENT, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", boxShadow:"0 8px 0 rgba(59,91,219,0.3)", animation:"bounceIn 0.5s ease" }}>
                  <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                    <rect x="14" y="28" width="36" height="26" rx="6" fill="white"/>
                    <path d="M22 28v-8a10 10 0 0 1 20 0v8" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
                    <circle cx="32" cy="41" r="4" fill={ACCENT}/>
                  </svg>
                </div>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>SAT Questions unlocked</div>
                <div style={{ fontFamily:FONT, fontSize:56, fontWeight:900, color:INK, lineHeight:1, marginBottom:32, textAlign:"center" }}>Prove what<br/>you know.</div>
                <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:40 }}>
                  {Array.from({length:6}).map((_,i) => (
                    <div key={i} style={{ width:40, height:40, borderRadius:12, background:RED, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:15, fontWeight:800, color:"#fff", opacity:0, animation:"popIn 0.3s ease forwards", animationDelay:`${i*100}ms` }}>{i+1}</div>
                  ))}
                </div>
                <button onClick={advance} style={{ padding:"14px 44px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>START →</button>
                <style>{`@keyframes bounceIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}@keyframes popIn{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}`}</style>
              </div>
            )}

            {/* RESULTS */}
            {slide.kind === "results" && (() => {
              const SAT_CORRECTS: ("A"|"B")[] = ["A","B","B","A","A","B"];
              const score = SAT_CORRECTS.filter((ans,i) => picks[SAT_START + i] === ans).length;
              return (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:CREAM, borderRadius:"inherit" }}>
                  <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:SOFT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>SAT Questions</div>
                  <div style={{ fontFamily:FONT, fontSize:80, fontWeight:900, color:INK, lineHeight:1, marginBottom:8, textAlign:"center" }}>
                    {score}<span style={{ color:SOFT, fontSize:48 }}>/6</span>
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:20, fontWeight:700, color: score===6 ? GREEN : score>=4 ? ORANGE : RED, marginBottom:40 }}>
                    {score===6 ? "Perfect score!" : score>=4 ? "Well done." : score>=2 ? "Good effort." : "Keep practising."}
                  </div>
                  <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:48 }}>
                    {SAT_CORRECTS.map((ans,i) => {
                      const correct = picks[SAT_START + i] === ans;
                      return (
                        <div key={i} style={{ width:48, height:48, borderRadius:14, background: correct ? GREEN : RED, display:"flex", alignItems:"center", justifyContent:"center", opacity:0, animation:"popIn 0.3s ease forwards", animationDelay:`${i*80}ms`, boxShadow: correct ? `0 4px 0 ${GREEN_DK}` : "0 4px 0 rgba(200,60,60,0.35)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            {correct ? <path d="M4 12l5 5 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/> : <path d="M5 5l14 14M19 5L5 19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>}
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={advance} style={{ padding:"14px 44px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>CONTINUE →</button>
                  <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}`}</style>
                </div>
              );
            })()}

            {/* INTRO */}
            {slide.kind === "intro" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:580, paddingBottom:40 }}>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>SAT Math · Today&apos;s lesson:</div>
                <div style={{ fontFamily:FONT, fontSize:72, fontWeight:900, color:INK, lineHeight:0.95, marginBottom:36 }}>Gradient<br/>&amp; Slope</div>
                <div style={{ display:"flex", gap:12, marginBottom:28 }}>
                  <span style={{ background:ORANGE, color:"#fff", fontFamily:MONO, fontSize:15, fontWeight:500, padding:"10px 20px", borderRadius:9999, boxShadow:"0 4px 0 rgba(0,0,0,0.12)" }}>m = Δy ÷ Δx</span>
                  <span style={{ background:ACCENT, color:"#fff", fontFamily:FONT, fontSize:15, fontWeight:800, padding:"10px 20px", borderRadius:9999, boxShadow:"0 4px 0 rgba(59,91,219,0.3)" }}>step by step</span>
                </div>
                <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Your progress</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {Array.from({length:10}).map((_,i) => <div key={i} style={{ height:10, flex:1, borderRadius:999, background: i < 2 ? ACCENT : "#E0DAD0" }}/>)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:ACCENT }}>20%</div>
                    <div style={{ fontFamily:FONT, fontSize:12, color:SOFT }}>Mastery</div>
                  </div>
                </div>
              </div>
            )}

            {/* TEACH */}
            {slide.kind === "teach" && (() => {
              const s = slide as Extract<Slide,{kind:"teach"}>;
              return (
                <div style={{ paddingBottom:28 }}>
                  <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:s.tagColor||ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{tagLabel(s.tag)}</div>
                  <div style={{ fontFamily:FONT, fontSize:46, fontWeight:900, color:INK, lineHeight:1.1, marginBottom:14, maxWidth:660 }}>{s.headline}</div>
                  {s.body && <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:SOFT, lineHeight:1.55, marginBottom:26, maxWidth:580 }}>{s.body}</div>}
                  {s.visual && <div style={{ maxWidth:740 }}>{s.visual}</div>}
                </div>
              );
            })()}

            {/* AB */}
            {slide.kind === "ab" && (() => {
              const s = slide as Extract<Slide,{kind:"ab"}>;
              return (
                <div style={{ paddingBottom:28 }}>
                  <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:s.tagColor||ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{tagLabel(s.tag)}</div>
                  <div style={{ fontFamily:FONT, fontSize:34, fontWeight:900, color:INK, lineHeight:1.15, marginBottom: s.body ? 10 : 22, maxWidth:680 }}>{s.headline}</div>
                  {s.body && <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:SOFT, lineHeight:1.55, marginBottom:22, maxWidth:580 }}>{s.body}</div>}
                  {s.visual && <div style={{ maxWidth:740, marginBottom:22 }}>{s.visual}</div>}
                  <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:660 }}>
                    <OptionRow letter="A" label={s.optionA} state={submitted ? getOptionState("A") : "idle"} onClick={() => { if (!submitted) { if ("A"===s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"A"})); }}}/>
                    <OptionRow letter="B" label={s.optionB} state={submitted ? getOptionState("B") : "idle"} onClick={() => { if (!submitted) { if ("B"===s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"B"})); }}}/>
                  </div>
                </div>
              );
            })()}

            {/* RECAP */}
            {slide.kind === "recap" && (
              <div style={{ paddingBottom:28, maxWidth:640 }}>
                <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Key concepts recap</div>
                <div style={{ fontFamily:FONT, fontSize:40, fontWeight:900, color:INK, lineHeight:1.1, marginBottom:8 }}>Let&apos;s check what you remember.</div>
                <div style={{ fontFamily:FONT, fontSize:16, color:SOFT, marginBottom:24 }}>Is each statement true or false?</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {recapStatements.map((s,i) => {
                    const picked = recapPicks[i];
                    const hasPicked = picked !== undefined;
                    const correct = hasPicked && picked === s.answer;
                    const wrong   = hasPicked && picked !== s.answer;
                    return (
                      <div key={i} style={{ background:"#fff", borderRadius:18, padding:"16px 20px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", border: correct ? `2px solid ${GREEN}` : wrong ? `2px solid ${RED}` : "2px solid transparent", display:"flex", alignItems:"center", gap:16 }}>
                        <div style={{ flex:1, fontFamily:FONT, fontSize:15, fontWeight:700, color:INK }}>{s.text}</div>
                        <div style={{ display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
                          {wrong && <span style={{ fontFamily:FONT, fontSize:12, color:RED, fontWeight:600 }}>{s.answer ? "Always true!" : "It goes down."}</span>}
                          {[true,false].map(opt => {
                            const isChosen = hasPicked && picked === opt;
                            const isCorrectOpt = opt === s.answer;
                            const bg = isChosen ? (isCorrectOpt ? GREEN : RED) : hasPicked && isCorrectOpt ? GREEN : "#F5F0E8";
                            const color = isChosen || (hasPicked && isCorrectOpt) ? "#fff" : SOFT;
                            return (
                              <button key={String(opt)} onClick={() => !hasPicked && setRecapPicks(p=>({...p,[i]:opt}))}
                                style={{ padding:"8px 18px", borderRadius:10, border:"none", cursor:hasPicked?"default":"pointer", background:bg, color, fontFamily:FONT, fontSize:13, fontWeight:800, transition:"all 0.2s" }}>
                                {opt ? "True" : "False"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COMPLETE */}
            {slide.kind === "complete" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:580, paddingBottom:40 }}>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:GREEN, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>Lesson complete</div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:36 }}>
                  <div style={{ fontFamily:FONT, fontSize:64, fontWeight:900, color:INK, lineHeight:0.95 }}>Gradient<br/>&amp; Slope</div>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:GREEN, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 0 ${GREEN_DK}`, flexShrink:0, marginTop:4 }}>
                    <svg width="20" height="20" viewBox="0 0 64 64"><path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#E7F8EC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="24" height="24" viewBox="0 0 64 64"><path d="M14 33l12 12 24-24" stroke={GREEN} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:GREEN, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Your progress</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {Array.from({length:10}).map((_,i) => <div key={i} style={{ height:10, flex:1, borderRadius:999, background: i < completeLevel ? GREEN : "#E0DAD0", transition:"background 0.4s ease" }}/>)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:GREEN, transition:"all 0.6s ease" }}>{completePct}%</div>
                    <div style={{ fontFamily:FONT, fontSize:12, color:SOFT }}>Mastery</div>
                  </div>
                </div>
              </div>
            )}

          </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: showFeedback || isTransition || isResults ? "none" : "2px solid rgba(31,37,68,0.10)" }}>
            {isIntro && (
              <div style={{ padding:"14px 52px 26px", display:"flex", justifyContent:"flex-end" }}>
                <button onClick={advance} style={{ padding:"15px 48px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>START LESSON</button>
              </div>
            )}
            {isComplete && (
              <div style={{ padding:"14px 52px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <button onClick={() => setSlideIdx(0)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:FONT, fontSize:14, fontWeight:700, color:SOFT }}>Review from the start</button>
                <button onClick={() => { onComplete(); onClose(); }} style={{ padding:"13px 36px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>BACK TO LESSONS</button>
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
                  <button disabled style={{ padding:"13px 40px", background:"rgba(31,37,68,0.1)", color:"rgba(31,37,68,0.35)", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"not-allowed", letterSpacing:"0.04em" }}>PICK AN ANSWER</button>
                ) : (
                  <button onClick={advance} style={{ padding:"13px 40px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>CONTINUE</button>
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
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">{isCorrect ? <path d="M2 8l4 4 8-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/> : <path d="M3 3l10 10M13 3L3 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>}</svg>
                      {isCorrect ? "Nice." : "Not quite."}
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.92)", lineHeight:1.5, maxWidth:620 }}>{s.explain}</div>
                  </div>
                  <button onClick={advance} style={{ padding:"12px 30px", background:"#fff", color: isCorrect ? GREEN_DK : RED, border:"none", borderRadius:12, fontFamily:FONT, fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0 }}>Continue</button>
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
}
