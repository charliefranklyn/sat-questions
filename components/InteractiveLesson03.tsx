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

function EquationCard({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"24px 28px", textAlign:"center", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", fontFamily:MONO, fontSize:40, fontWeight:500, color:INK, maxWidth:520 }}>
      {label && <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>{label}</div>}
      {children}
    </div>
  );
}

function FormulaBreakdown() {
  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"28px 24px", textAlign:"center", boxShadow:"0 6px 0 rgba(31,37,68,0.08)", fontFamily:MONO, fontSize:52, fontWeight:500, color:INK, marginBottom:16 }}>
        y = <span style={{ color:ORANGE, fontWeight:700 }}>m</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>b</span>
      </div>
      <div style={{ display:"flex", gap:14 }}>
        <div style={{ flex:1, background:ORANGE, color:"#fff", borderRadius:18, padding:"18px 20px" }}>
          <div style={{ fontFamily:MONO, fontSize:26, fontWeight:700 }}>m</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, marginTop:4 }}>slope — how steep</div>
        </div>
        <div style={{ flex:1, background:PURPLE, color:"#fff", borderRadius:18, padding:"18px 20px" }}>
          <div style={{ fontFamily:MONO, fontSize:26, fontWeight:700 }}>b</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, marginTop:4 }}>where it crosses y-axis</div>
        </div>
      </div>
    </div>
  );
}

function SubstitutionCard({ lines, highlightLast = true }: { lines: React.ReactNode[]; highlightLast?: boolean }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"18px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", flexDirection:"column", gap:8, maxWidth:520 }}>
      {lines.map((ln, i) => {
        const last = i === lines.length - 1 && highlightLast;
        return (
          <div key={i} style={{ fontFamily:MONO, fontSize: last ? 22 : 20, fontWeight: last ? 700 : 500, color: last ? GREEN : INK, textAlign:"center", padding: last ? "10px 0 2px" : 0 }}>{ln}</div>
        );
      })}
    </div>
  );
}

function PointCard({ point, slope }: { point:[number,number]; slope:number }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"20px 16px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", alignItems:"center", justifyContent:"space-around", gap:10 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:ACCENT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>On the line</div>
        <div style={{ fontFamily:MONO, fontSize:28, fontWeight:700, color:INK }}>({point[0]}, {point[1]})</div>
      </div>
      <div style={{ width:1, alignSelf:"stretch", background:"rgba(31,37,68,0.1)" }}/>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:ORANGE, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Slope</div>
        <div style={{ fontFamily:MONO, fontSize:28, fontWeight:700, color:INK }}>m = {slope}</div>
      </div>
    </div>
  );
}

function PointsCard({ p1, p2 }: { p1:[number,number]; p2:[number,number] }) {
  const fmt = ([x,y]:[number,number]) => `(${x}, ${y})`;
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"18px 16px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", alignItems:"center", justifyContent:"space-around" }}>
      {[{label:"Point 1",pt:p1,color:ACCENT},{label:"Point 2",pt:p2,color:GREEN}].map((item,i) => (
        <div key={i} style={{ textAlign:"center" }}>
          <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:item.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{item.label}</div>
          <div style={{ fontFamily:MONO, fontSize:26, fontWeight:700, color:INK }}>{fmt(item.pt)}</div>
        </div>
      ))}
    </div>
  );
}

function TwoStepCard({ step1, step2, result }: { step1:React.ReactNode; step2:React.ReactNode; result:React.ReactNode }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:520 }}>
      {[{n:1,label:"Find the slope (m)",body:step1},{n:2,label:"Find b",body:step2}].map(s => (
        <div key={s.n} style={{ background:"#fff", borderRadius:16, padding:"10px 12px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 3px 0 rgba(31,37,68,0.05)" }}>
          <div style={{ width:30, height:30, borderRadius:9, background:INK, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:15, fontWeight:900, flexShrink:0 }}>{s.n}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:SOFT, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:1 }}>{s.label}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:500, color:INK, lineHeight:1.35 }}>{s.body}</div>
          </div>
        </div>
      ))}
      <div style={{ background:GREEN, borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, boxShadow:`0 4px 0 ${GREEN_DK}` }}>
        <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.85)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Equation</div>
        <div style={{ flex:1, fontFamily:MONO, fontSize:22, fontWeight:700, color:"#fff", textAlign:"right" }}>{result}</div>
      </div>
    </div>
  );
}

function ParallelLinesVisual() {
  const W=340, H=200, pad=22;
  const xMin=-4, xMax=4, yMin=-3, yMax=5;
  const xs=(x:number)=>pad+((x-xMin)/(xMax-xMin))*(W-pad*2);
  const ys=(y:number)=>H-pad-((y-yMin)/(yMax-yMin))*(H-pad*2);
  const drawLine=(b:number)=>{const x1=xMin,y1=2*x1+b,x2=xMax,y2=2*x2+b;return{x1:xs(x1),y1:ys(y1),x2:xs(x2),y2:ys(y2)};};
  const L1=drawLine(2), L2=drawLine(-2);
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:14, boxShadow:"0 4px 0 rgba(31,37,68,0.06)", maxWidth:520 }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[-4,-3,-2,-1,0,1,2,3,4].map(x=><line key={`v${x}`} x1={xs(x)} y1={pad} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>)}
        {[-3,-2,-1,0,1,2,3,4,5].map(y=><line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-pad} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>)}
        <line x1={xs(xMin)} y1={ys(0)} x2={xs(xMax)} y2={ys(0)} stroke={INK} strokeWidth="1.5"/>
        <line x1={xs(0)} y1={ys(yMin)} x2={xs(0)} y2={ys(yMax)} stroke={INK} strokeWidth="1.5"/>
        <line {...L1} stroke={ORANGE} strokeWidth="4" strokeLinecap="round"/>
        <line {...L2} stroke={PURPLE} strokeWidth="4" strokeLinecap="round"/>
        <rect x={W-100} y={18} width="88" height="22" rx="6" fill={ORANGE}/>
        <text x={W-56} y={34} textAnchor="middle" fontFamily={MONO} fontSize="12" fontWeight="700" fill="#fff">m = 2, b = 2</text>
        <rect x={12} y={H-42} width="88" height="22" rx="6" fill={PURPLE}/>
        <text x={56} y={H-26} textAnchor="middle" fontFamily={MONO} fontSize="12" fontWeight="700" fill="#fff">m = 2, b = −2</text>
      </svg>
      <div style={{ marginTop:8, padding:"8px 12px", background:CREAM, borderRadius:12, fontFamily:FONT, fontSize:13, fontWeight:700, color:INK, textAlign:"center" }}>
        Same slope (m=2), different b → parallel.
      </div>
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
    kind:"teach", tag:"01 · The Equation",
    headline: <>Every straight line has an equation: <span style={{ fontFamily:MONO }}>y = mx + b</span>.</>,
    visual: <FormulaBreakdown />,
    body: <><b style={{ color:ORANGE }}>m</b> is the slope. <b style={{ color:PURPLE }}>b</b> is where the line crosses the y-axis. To write the equation of any line, you need both.</>,
  },
  {
    kind:"teach", tag:"01 · The Equation",
    headline: <>If you know the slope and one point, you can find <span style={{ color:PURPLE }}>b</span>.</>,
    visual: <SubstitutionCard lines={[
      <>Slope = 3, point (2, 9)</>,
      <>y = mx + b</>,
      <>9 = <span style={{ color:ORANGE, fontWeight:700 }}>3</span>(2) + b</>,
      <>9 = 6 + b</>,
      <>b = <span style={{ color:PURPLE, fontWeight:700 }}>3</span></>,
      <>y = 3x + 3</>,
    ]} />,
    body: <>Swap the x and y from the known point into the equation. Solve for <b style={{ color:PURPLE }}>b</b>. That&apos;s it.</>,
  },
  {
    kind:"ab", tag:"01 · The Equation",
    headline: "A line has slope 3 and passes through (2, 9). What is b?",
    visual: <PointCard point={[2,9]} slope={3} />,
    optionA:"3",
    optionB:"6",
    correct:"A",
    explain:"Substitute: 9 = 3(2) + b → 9 = 6 + b → b = 3. Full equation: y = 3x + 3.",
  },
  {
    kind:"ab", tag:"01 · The Equation",
    headline: "A line has slope 4 and passes through (1, 10). What is b?",
    visual: <PointCard point={[1,10]} slope={4} />,
    optionA:"6",
    optionB:"14",
    correct:"A",
    explain:"10 = 4(1) + b → 10 = 4 + b → b = 6. Full equation: y = 4x + 6.",
  },
  {
    kind:"teach", tag:"02 · From Two Points",
    headline: <>Two points are all you need. Find slope first, then find <span style={{ color:PURPLE }}>b</span>.</>,
    visual: <TwoStepCard
      step1={<>m = (9 &minus; 5) &divide; (3 &minus; 1) = <b style={{ color:ORANGE }}>2</b></>}
      step2={<>Swap in (1, 5): 5 = 2(1) + b &rarr; b = <b style={{ color:PURPLE }}>3</b></>}
      result={<>y = 2x + 3</>}
    />,
    body: <>First find the slope using the two points. Then use either point to find b. Two steps — done.</>,
  },
  {
    kind:"ab", tag:"02 · From Two Points",
    headline: "Line through (1, 5) and (3, 9). What is the equation?",
    visual: <PointsCard p1={[1,5]} p2={[3,9]} />,
    optionA:"y = 2x + 3",
    optionB:"y = 2x + 5",
    correct:"A",
    explain:"Slope = (9 − 5) ÷ (3 − 1) = 2. Swap in (1, 5): 5 = 2 + b → b = 3.",
  },
  {
    kind:"ab", tag:"02 · From Two Points",
    headline: "Line through (2, 1) and (4, 7). What is the equation?",
    visual: <PointsCard p1={[2,1]} p2={[4,7]} />,
    optionA:"y = 3x + 5",
    optionB:"y = 3x − 5",
    correct:"B",
    explain:"Slope = (7 − 1) ÷ (4 − 2) = 3. Swap in (2, 1): 1 = 6 + b → b = −5.",
  },
  {
    kind:"teach", tag:"03 · Parallel Lines",
    headline: <>Parallel lines have the <span style={{ color:ACCENT }}>same slope</span> but different starting points.</>,
    visual: <ParallelLinesVisual />,
    body: <>If two lines have the same m, they go in exactly the same direction and never cross. Change b, keep m the same.</>,
  },
  {
    kind:"ab", tag:"03 · Parallel Lines",
    headline: "Which line is parallel to y = 4x + 1?",
    visual: <EquationCard label="Given">y = <span style={{ color:ORANGE, fontWeight:700 }}>4</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>1</span></EquationCard>,
    optionA:"y = −4x + 1",
    optionB:"y = 4x − 3",
    correct:"B",
    explain:"Parallel means same slope. The slope here is 4. Option B also has slope 4. Option A has slope −4 — completely different direction.",
  },
  { kind:"recap" },
  { kind:"transition" },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"A line has slope 3 and passes through (2, 9). What is b?",
    visual: <PointCard point={[2,9]} slope={3} />,
    optionA:"3",
    optionB:"6",
    correct:"A",
    explain:"9 = 3(2) + b → 9 = 6 + b → b = 3. Equation: y = 3x + 3.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Line through (1, 5) and (3, 9). What is the equation?",
    visual: <PointsCard p1={[1,5]} p2={[3,9]} />,
    optionA:"y = 2x + 3",
    optionB:"y = 2x + 5",
    correct:"A",
    explain:"Slope = (9 − 5) ÷ (3 − 1) = 2. Substitute (1, 5): 5 = 2 + b → b = 3.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Line through (2, 1) and (4, 7). What is the equation?",
    visual: <PointsCard p1={[2,1]} p2={[4,7]} />,
    optionA:"y = 3x + 5",
    optionB:"y = 3x − 5",
    correct:"B",
    explain:"Slope = (7 − 1) ÷ (4 − 2) = 3. Substitute (2, 1): 1 = 6 + b → b = −5.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Which line is parallel to y = 5x − 3?",
    visual: <EquationCard label="Given">y = <span style={{ color:ORANGE, fontWeight:700 }}>5</span>x &minus; <span style={{ color:PURPLE, fontWeight:700 }}>3</span></EquationCard>,
    optionA:"y = −5x + 3",
    optionB:"y = 5x + 2",
    correct:"B",
    explain:"Parallel = same slope. Slope here is 5. Option B also has slope 5, just a different y-intercept.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"A line passes through (0, 7) with slope 2. What is the equation?",
    visual: <PointCard point={[0,7]} slope={2} />,
    optionA:"y = 7x + 2",
    optionB:"y = 2x + 7",
    correct:"B",
    explain:"When x = 0, b = y directly. So b = 7. The equation is y = 2x + 7. Don't swap m and b.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Line through (1, 2) and (3, 8). What is y when x = 5?",
    visual: <PointsCard p1={[1,2]} p2={[3,8]} />,
    optionA:"14",
    optionB:"19",
    correct:"A",
    explain:"Slope = (8 − 2) ÷ (3 − 1) = 3. Substitute (1, 2): 2 = 3 + b → b = −1. Equation: y = 3x − 1. At x = 5: y = 15 − 1 = 14.",
  },
  { kind:"results" },
  { kind:"complete" },
];

export default function InteractiveLesson03({ onClose, onComplete }: {
  onClose:() => void; onComplete:() => void;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [picks, setPicks]       = useState<Record<number,"A"|"B">>({});
  const [completeLevel, setCompleteLevel] = useState(3);
  const [completePct, setCompletePct]     = useState(30);
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
      setCompleteLevel(3);
      setCompletePct(30);
      setTimeout(() => { setCompleteLevel(4); setCompletePct(40); }, 700);
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
    { text:"The slope m tells you how much y changes per unit of x.", answer:true },
    { text:"The y-intercept is where the line crosses the x-axis.", answer:false },
    { text:"You need a slope and at least one point to write the equation.", answer:true },
    { text:"Parallel lines have the same slope.", answer:true },
  ];

  const SAT_CORRECTS: ("A"|"B")[] = ["A","A","B","B","B","A"];

  return (
    <div style={{ position:"fixed", inset:0, background:"#E8E3DA", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, zIndex:100 }}>
      <div style={{
        width:"min(1448px, 97vw)", height:"min(1086px, calc(100vh - 32px))",
        background:CREAM, borderRadius:20, boxShadow:"0 4px 32px rgba(0,0,0,0.10)",
        display:"flex", flexDirection:"column", position:"relative", overflow:"hidden",
      }}>
        <BgCircles />
        <div style={{ position:"relative", zIndex:1, flex:1, minHeight:0, display:"grid", gridTemplateRows:"auto 1fr auto", overflow:"hidden" }}>

          <div>
            {showTopBar && (
              <div style={{ padding:"22px 52px 0", display:"flex", alignItems:"center", gap:20 }}>
                <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
                {inSAT ? (
                  <div style={{ flex:1, display:"flex", gap:6 }}>
                    {Array.from({length:SAT_COUNT}).map((_,i) => {
                      const done=slideIdx-SAT_START, filled=i<done, current=i===done;
                      return <div key={i} style={{ flex:1, height:8, borderRadius:99, background: filled?RED:current?`${RED}55`:"rgba(31,37,68,0.1)", transition:"background 0.3s" }}/>;
                    })}
                  </div>
                ) : (
                  <div style={{ flex:1, height:7, borderRadius:99, background:"rgba(31,37,68,0.1)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${progress}%`, borderRadius:99, background:ACCENT, transition:"width 0.4s" }}/>
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

          <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, overflowY:"auto", padding:"28px 52px 0" }}>

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
                <div style={{ display:"flex", gap:8, marginBottom:40 }}>
                  {Array.from({length:6}).map((_,i) => (
                    <div key={i} style={{ width:40, height:40, borderRadius:12, background:RED, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:15, fontWeight:800, color:"#fff", opacity:0, animation:"popIn 0.3s ease forwards", animationDelay:`${i*100}ms` }}>{i+1}</div>
                  ))}
                </div>
                <button onClick={advance} style={{ padding:"14px 44px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>START →</button>
                <style>{`@keyframes bounceIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}@keyframes popIn{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}`}</style>
              </div>
            )}

            {slide.kind === "results" && (() => {
              const score = SAT_CORRECTS.filter((ans,i) => picks[SAT_START+i] === ans).length;
              return (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:CREAM, borderRadius:"inherit" }}>
                  <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:SOFT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>SAT Questions</div>
                  <div style={{ fontFamily:FONT, fontSize:80, fontWeight:900, color:INK, lineHeight:1, marginBottom:8 }}>
                    {score}<span style={{ color:SOFT, fontSize:48 }}>/6</span>
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:20, fontWeight:700, color: score===6?GREEN:score>=4?ORANGE:RED, marginBottom:40 }}>
                    {score===6?"Perfect score!":score>=4?"Well done.":score>=2?"Good effort.":"Keep practising."}
                  </div>
                  <div style={{ display:"flex", gap:10, marginBottom:48 }}>
                    {SAT_CORRECTS.map((ans,i) => {
                      const correct = picks[SAT_START+i] === ans;
                      return (
                        <div key={i} style={{ width:48, height:48, borderRadius:14, background:correct?GREEN:RED, display:"flex", alignItems:"center", justifyContent:"center", opacity:0, animation:"popIn 0.3s ease forwards", animationDelay:`${i*80}ms`, boxShadow:correct?`0 4px 0 ${GREEN_DK}`:"0 4px 0 rgba(200,60,60,0.35)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            {correct?<path d="M4 12l5 5 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>:<path d="M5 5l14 14M19 5L5 19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>}
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={advance} style={{ padding:"14px 44px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>CONTINUE →</button>
                  <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}`}</style>
                </div>
              );
            })()}

            {slide.kind === "intro" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:580, paddingBottom:40 }}>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>SAT Math · Today&apos;s lesson:</div>
                <div style={{ fontFamily:FONT, fontSize:72, fontWeight:900, color:INK, lineHeight:0.95, marginBottom:36 }}>Write the<br/>Equation</div>
                <div style={{ display:"flex", gap:12, marginBottom:28 }}>
                  <span style={{ background:ORANGE, color:"#fff", fontFamily:MONO, fontSize:15, fontWeight:500, padding:"10px 20px", borderRadius:9999, boxShadow:"0 4px 0 rgba(0,0,0,0.12)" }}>y = mx + b</span>
                  <span style={{ background:PURPLE, color:"#fff", fontFamily:FONT, fontSize:15, fontWeight:800, padding:"10px 20px", borderRadius:9999, boxShadow:"0 4px 0 rgba(168,108,228,0.3)" }}>slope &amp; intercept</span>
                </div>
                <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Your progress</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {Array.from({length:10}).map((_,i) => <div key={i} style={{ height:10, flex:1, borderRadius:999, background: i<3?ACCENT:"#E0DAD0" }}/>)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:ACCENT }}>30%</div>
                    <div style={{ fontFamily:FONT, fontSize:12, color:SOFT }}>Mastery</div>
                  </div>
                </div>
              </div>
            )}

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

            {slide.kind === "ab" && (() => {
              const s = slide as Extract<Slide,{kind:"ab"}>;
              return (
                <div style={{ paddingBottom:28 }}>
                  <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:s.tagColor||ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{tagLabel(s.tag)}</div>
                  <div style={{ fontFamily:FONT, fontSize:34, fontWeight:900, color:INK, lineHeight:1.15, marginBottom:s.body?10:22, maxWidth:680 }}>{s.headline}</div>
                  {s.body && <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:SOFT, lineHeight:1.55, marginBottom:22, maxWidth:580 }}>{s.body}</div>}
                  {s.visual && <div style={{ maxWidth:740, marginBottom:22 }}>{s.visual}</div>}
                  <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:660 }}>
                    <OptionRow letter="A" label={s.optionA} state={submitted?getOptionState("A"):"idle"} onClick={() => { if (!submitted) { if ("A"===s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"A"})); }}}/>
                    <OptionRow letter="B" label={s.optionB} state={submitted?getOptionState("B"):"idle"} onClick={() => { if (!submitted) { if ("B"===s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"B"})); }}}/>
                  </div>
                </div>
              );
            })()}

            {slide.kind === "recap" && (
              <div style={{ paddingBottom:28, maxWidth:640 }}>
                <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Key concepts recap</div>
                <div style={{ fontFamily:FONT, fontSize:40, fontWeight:900, color:INK, lineHeight:1.1, marginBottom:8 }}>Let&apos;s check what you remember.</div>
                <div style={{ fontFamily:FONT, fontSize:16, color:SOFT, marginBottom:24 }}>Is each statement true or false?</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {recapStatements.map((s,i) => {
                    const picked=recapPicks[i], hasPicked=picked!==undefined;
                    const correct=hasPicked&&picked===s.answer, wrong=hasPicked&&picked!==s.answer;
                    return (
                      <div key={i} style={{ background:"#fff", borderRadius:18, padding:"16px 20px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", border:correct?`2px solid ${GREEN}`:wrong?`2px solid ${RED}`:"2px solid transparent", display:"flex", alignItems:"center", gap:16 }}>
                        <div style={{ flex:1, fontFamily:FONT, fontSize:15, fontWeight:700, color:INK }}>{s.text}</div>
                        <div style={{ display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
                          {wrong && <span style={{ fontFamily:FONT, fontSize:12, color:RED, fontWeight:600 }}>{s.answer?"Always true!":"It crosses the y-axis."}</span>}
                          {[true,false].map(opt => {
                            const isChosen=hasPicked&&picked===opt, isCorrectOpt=opt===s.answer;
                            const bg=isChosen?(isCorrectOpt?GREEN:RED):hasPicked&&isCorrectOpt?GREEN:"#F5F0E8";
                            const color=isChosen||(hasPicked&&isCorrectOpt)?"#fff":SOFT;
                            return (
                              <button key={String(opt)} onClick={() => !hasPicked&&setRecapPicks(p=>({...p,[i]:opt}))}
                                style={{ padding:"8px 18px", borderRadius:10, border:"none", cursor:hasPicked?"default":"pointer", background:bg, color, fontFamily:FONT, fontSize:13, fontWeight:800, transition:"all 0.2s" }}>
                                {opt?"True":"False"}
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

            {slide.kind === "complete" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:580, paddingBottom:40 }}>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:GREEN, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>Lesson complete</div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:36 }}>
                  <div style={{ fontFamily:FONT, fontSize:64, fontWeight:900, color:INK, lineHeight:0.95 }}>Write the<br/>Equation</div>
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
                      {Array.from({length:10}).map((_,i) => <div key={i} style={{ height:10, flex:1, borderRadius:999, background:i<completeLevel?GREEN:"#E0DAD0", transition:"background 0.4s ease" }}/>)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:GREEN }}>{completePct}%</div>
                    <div style={{ fontFamily:FONT, fontSize:12, color:SOFT }}>Mastery</div>
                  </div>
                </div>
              </div>
            )}

          </div>
          </div>

          <div style={{ borderTop: showFeedback||isTransition||isResults ? "none" : "2px solid rgba(31,37,68,0.10)" }}>
            {isIntro && (
              <div style={{ padding:"14px 52px 26px", display:"flex", justifyContent:"flex-end" }}>
                <button onClick={advance} style={{ padding:"15px 48px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>START LESSON</button>
              </div>
            )}
            {isComplete && (
              <div style={{ padding:"14px 52px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <button onClick={() => setSlideIdx(0)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:FONT, fontSize:14, fontWeight:700, color:SOFT }}>Review from the start</button>
                <button onClick={() => { onComplete(); onClose(); }} style={{ padding:"13px 36px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>BACK TO LESSONS</button>
              </div>
            )}
            {showTopBar && !showFeedback && (
              <div style={{ padding:"14px 52px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                {slideIdx > 0 ? (
                  <button onClick={goBack} style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 22px", borderRadius:14, border:"2px solid rgba(31,37,68,0.18)", background:"#fff", cursor:"pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontFamily:FONT, fontSize:14, fontWeight:700, color:INK }}>BACK</span>
                  </button>
                ) : <div />}
                {slide.kind === "ab" ? (
                  <button disabled style={{ padding:"13px 40px", background:"rgba(31,37,68,0.1)", color:"rgba(31,37,68,0.35)", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"not-allowed" }}>PICK AN ANSWER</button>
                ) : (
                  <button onClick={advance} style={{ padding:"13px 40px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>CONTINUE</button>
                )}
              </div>
            )}
            {showFeedback && (() => {
              const s = slide as Extract<Slide,{kind:"ab"}>;
              const isCorrect = pickedHere === s.correct;
              return (
                <div style={{ background:isCorrect?GREEN:RED, padding:"20px 52px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
                  <div>
                    <div style={{ fontFamily:FONT, fontSize:17, fontWeight:900, color:"#fff", marginBottom:3, display:"flex", alignItems:"center", gap:8 }}>
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">{isCorrect?<path d="M2 8l4 4 8-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>:<path d="M3 3l10 10M13 3L3 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>}</svg>
                      {isCorrect?"Nice.":"Not quite."}
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.92)", lineHeight:1.5, maxWidth:620 }}>{s.explain}</div>
                  </div>
                  <button onClick={advance} style={{ padding:"12px 30px", background:"#fff", color:isCorrect?GREEN_DK:RED, border:"none", borderRadius:12, fontFamily:FONT, fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0 }}>Continue</button>
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
}
