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

function TwoPlanCard({ plan1, plan2 }: {
  plan1: { label:string; color:string; detail:string; eq:string };
  plan2: { label:string; color:string; detail:string; eq:string };
}) {
  return (
    <div style={{ display:"flex", gap:12 }}>
      {[plan1, plan2].map((p, i) => (
        <div key={i} style={{ flex:1, background:"#fff", borderRadius:20, padding:"16px 14px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", borderTop:`6px solid ${p.color}`, display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ fontFamily:FONT, fontSize:12, fontWeight:800, color:p.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{p.label}</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:600, color:SOFT, lineHeight:1.4 }}>{p.detail}</div>
          <div style={{ marginTop:4, fontFamily:MONO, fontSize:18, fontWeight:700, color:INK }}>{p.eq}</div>
        </div>
      ))}
    </div>
  );
}

function TwoEquationsCard({ eq1, eq2, label1="Equation 1", label2="Equation 2" }: {
  eq1:string; eq2:string; label1?:string; label2?:string;
}) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"18px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", flexDirection:"column", gap:12, maxWidth:520 }}>
      {[{label:label1,eq:eq1,color:ORANGE},{label:label2,eq:eq2,color:PURPLE}].map((row,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:10, height:36, borderRadius:4, background:row.color, flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT, fontSize:11, fontWeight:800, color:row.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{row.label}</div>
            <div style={{ fontFamily:MONO, fontSize:22, fontWeight:700, color:INK }}>{row.eq}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SolveCard({ lines }: { lines: React.ReactNode[] }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"18px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", flexDirection:"column", gap:8, maxWidth:520 }}>
      {lines.map((ln, i) => {
        const last = i === lines.length - 1;
        return (
          <div key={i} style={{ fontFamily:MONO, fontSize: last?22:20, fontWeight: last?700:500, color: last?GREEN:INK, textAlign:"center", padding: last?"10px 0 2px":0 }}>{ln}</div>
        );
      })}
    </div>
  );
}

function IntersectionGraph() {
  const W=340, H=220, padL=40, padR=16, padT=18, padB=34;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const xMax=10, yMax=160;
  const xToPx=(x:number)=>padL+(x/xMax)*plotW;
  const yToPx=(y:number)=>padT+plotH-(y/yMax)*plotH;
  const l1:[[number,number],[number,number]]=[[xToPx(0),yToPx(10)],[xToPx(xMax),yToPx(10*xMax+10)]];
  const l2:[[number,number],[number,number]]=[[xToPx(0),yToPx(20)],[xToPx(xMax),yToPx(20*xMax)]];
  // intersection: 10m+10=20m → m=1, C=30... actually let's just hardcode at (1,20)
  const ix=xToPx(1), iy=yToPx(20);
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"14px 14px 10px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", maxWidth:520 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT+plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <line x1={padL} y1={padT+plotH} x2={padL+plotW} y2={padT+plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <text x={padL+plotW/2} y={H-8} fontFamily={MONO} fontSize="11" fill={SOFT} textAnchor="middle">months</text>
        <text x={12} y={padT+plotH/2} fontFamily={MONO} fontSize="11" fill={SOFT} textAnchor="middle" transform={`rotate(-90 12 ${padT+plotH/2})`}>cost ($)</text>
        <line x1={l1[0][0]} y1={l1[0][1]} x2={l1[1][0]} y2={l1[1][1]} stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1={l2[0][0]} y1={l2[0][1]} x2={l2[1][0]} y2={l2[1][1]} stroke={PURPLE} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1={ix} y1={padT+plotH} x2={ix} y2={iy} stroke={INK} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
        <line x1={padL} y1={iy} x2={ix} y2={iy} stroke={INK} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
        <circle cx={ix} cy={iy} r={8} fill="#fff" stroke={INK} strokeWidth="3"/>
        <text x={xToPx(6)} y={yToPx(10*6+10)-8} fontFamily={MONO} fontSize="12" fontWeight="700" fill={ORANGE} textAnchor="end">Plan A</text>
        <text x={xToPx(3)} y={yToPx(20*3)+16} fontFamily={MONO} fontSize="12" fontWeight="700" fill={PURPLE} textAnchor="start">Plan B</text>
      </svg>
      <div style={{ marginTop:6, textAlign:"center", fontFamily:FONT, fontSize:13, fontWeight:700, color:INK }}>
        They cross at month 1, cost $20
      </div>
    </div>
  );
}

function ParallelNoAnswerCard() {
  const W=320, H=180, padL=24, padR=16, padT=16, padB=28, plotW=W-padL-padR, plotH=H-padT-padB;
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"14px 14px 10px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", maxWidth:520 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT+plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <line x1={padL} y1={padT+plotH} x2={padL+plotW} y2={padT+plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <line x1={padL+10} y1={padT+plotH-30} x2={padL+plotW-10} y2={padT+40} stroke={ORANGE} strokeWidth="4" strokeLinecap="round"/>
        <line x1={padL+10} y1={padT+plotH-70} x2={padL+plotW-10} y2={padT} stroke={PURPLE} strokeWidth="4" strokeLinecap="round"/>
      </svg>
      <div style={{ textAlign:"center", fontFamily:FONT, fontSize:13, fontWeight:700, color:INK }}>Same slope → parallel → never cross</div>
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
    kind:"teach", tag:"01 · The Setup",
    headline: <>Sometimes two rules both need to be true at the <span style={{ color:ACCENT }}>same time</span>.</>,
    visual: <TwoPlanCard
      plan1={{ label:"Plan A", color:ORANGE, detail:"$10 sign-up + $10 per month", eq:"C = 10m + 10" }}
      plan2={{ label:"Plan B", color:PURPLE, detail:"$20 per month, no sign-up fee", eq:"C = 20m" }}
    />,
    body: <>Plan A has a sign-up fee but lower monthly cost. Plan B has no fee but costs more per month. When do they cost the same?</>,
  },
  {
    kind:"teach", tag:"01 · The Setup",
    headline: <>Each plan is a line. The answer is <span style={{ color:ACCENT }}>where they cross</span>.</>,
    visual: <IntersectionGraph />,
    body: <>The lines meet at month 1, when both cost $20. Before that, Plan B is cheaper. After month 1, Plan A becomes cheaper.</>,
  },
  {
    kind:"ab", tag:"01 · The Setup",
    headline:"At which month do both plans cost the same?",
    visual: <TwoEquationsCard eq1="C = 10m + 10" eq2="C = 20m" label1="Plan A" label2="Plan B"/>,
    optionA:"Month 1",
    optionB:"Month 5",
    correct:"A",
    explain:"At m = 1: Plan A = 10(1) + 10 = $20. Plan B = 20(1) = $20. Both match at month 1.",
  },
  {
    kind:"teach", tag:"02 · Solve It",
    headline: <>Set both sides equal. Solve for one variable, then find the other.</>,
    visual: <SolveCard lines={[
      <>10m + 10 = 20m</>,
      <>10 = 10m</>,
      <>m = <span style={{ color:ORANGE, fontWeight:700 }}>1</span></>,
      <>C = 20(1) = <span style={{ color:GREEN, fontWeight:700 }}>$20</span></>,
    ]} />,
    body: <>When both equations equal the same y, set their right-hand sides equal. Solve for x, then substitute back to find y.</>,
  },
  {
    kind:"ab", tag:"02 · Solve It",
    headline: "What is x?",
    visual: <TwoEquationsCard eq1="y = x + 3" eq2="y = 2x" />,
    optionA:"3",
    optionB:"6",
    correct:"A",
    explain:"Set equal: x + 3 = 2x. Subtract x from both sides: 3 = x. Then y = 2(3) = 6.",
  },
  {
    kind:"ab", tag:"02 · Solve It",
    headline: "What is y?",
    visual: <TwoEquationsCard eq1="y = 3x − 1" eq2="y = x + 3" />,
    optionA:"2",
    optionB:"5",
    correct:"B",
    explain:"3x − 1 = x + 3 → 2x = 4 → x = 2. Substitute back: y = 2 + 3 = 5.",
  },
  {
    kind:"teach", tag:"03 · Special Cases",
    headline: <>Same slope = parallel lines = <span style={{ color:RED }}>no solution</span>.</>,
    visual: <ParallelNoAnswerCard />,
    body: <>If two lines have the same slope but different starting points, they go in the same direction and never meet. No crossing point means no solution.</>,
  },
  {
    kind:"ab", tag:"03 · Special Cases",
    headline:"How many solutions do these two equations have?",
    visual: <TwoEquationsCard eq1="y = 2x + 1" eq2="y = 2x + 3" />,
    optionA:"One solution",
    optionB:"No solutions — they never cross",
    correct:"B",
    explain:"Both have slope 2 but different y-intercepts (1 vs 3). Same direction, never meet. No solution.",
  },
  {
    kind:"ab", tag:"03 · Special Cases",
    headline:"How many solutions do these two equations have?",
    visual: <TwoEquationsCard eq1="y = x + 4" eq2="y = x + 4" />,
    optionA:"Infinitely many — every point works",
    optionB:"No solutions",
    correct:"A",
    explain:"Both equations are identical — they describe the same line. Every point on the line satisfies both equations.",
  },
  { kind:"recap" },
  { kind:"transition" },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"What is x?",
    visual: <TwoEquationsCard eq1="y = x + 3" eq2="y = 2x" />,
    optionA:"3",
    optionB:"6",
    correct:"A",
    explain:"x + 3 = 2x → 3 = x. Then y = 2(3) = 6. Always substitute back to check.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"What is y?",
    visual: <TwoEquationsCard eq1="y = 3x − 1" eq2="y = x + 3" />,
    optionA:"2",
    optionB:"5",
    correct:"B",
    explain:"3x − 1 = x + 3 → 2x = 4 → x = 2. Then y = 2 + 3 = 5. Don't stop at x — find y too.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"How many solutions?",
    visual: <TwoEquationsCard eq1="y = 2x + 5" eq2="y = 2x − 1" />,
    optionA:"One solution",
    optionB:"No solutions",
    correct:"B",
    explain:"Both lines have slope 2 but different y-intercepts (5 vs −1). Parallel — they never cross. No solution.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"How many solutions?",
    visual: <TwoEquationsCard eq1="y = x + 4" eq2="y = x + 4" />,
    optionA:"Infinitely many",
    optionB:"No solutions",
    correct:"A",
    explain:"Same equation, same line. Every point on it satisfies both — infinitely many solutions.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"What is x?",
    visual: <TwoEquationsCard eq1="y = 4x" eq2="y = x + 6" />,
    optionA:"6",
    optionB:"2",
    correct:"B",
    explain:"4x = x + 6 → 3x = 6 → x = 2. Then y = 4(2) = 8.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Plan A: C = 0.1t + 30. Plan B: C = 0.3t + 10. At how many texts are they equal?",
    visual: <TwoPlanCard
      plan1={{ label:"Plan A", color:ORANGE, detail:"$30/month + $0.10 per text", eq:"C = 0.1t + 30" }}
      plan2={{ label:"Plan B", color:PURPLE, detail:"$10/month + $0.30 per text", eq:"C = 0.3t + 10" }}
    />,
    optionA:"50 texts",
    optionB:"100 texts",
    correct:"B",
    explain:"0.1t + 30 = 0.3t + 10 → 20 = 0.2t → t = 100. At 100 texts both plans cost $40.",
  },
  { kind:"results" },
  { kind:"complete" },
];

export default function InteractiveLesson04({ onClose, onComplete }: {
  onClose:() => void; onComplete:() => void;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [picks, setPicks]       = useState<Record<number,"A"|"B">>({});
  const [completeLevel, setCompleteLevel] = useState(4);
  const [completePct, setCompletePct]     = useState(40);
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
      setCompleteLevel(4);
      setCompletePct(40);
      setTimeout(() => { setCompleteLevel(5); setCompletePct(50); }, 700);
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
    { text:"The solution to two equations is where their graphs cross.", answer:true },
    { text:"You solve two equations by setting their right-hand sides equal.", answer:true },
    { text:"Two lines with the same slope always have exactly one solution.", answer:false },
    { text:"The solution (x, y) must satisfy both equations.", answer:true },
  ];

  const SAT_CORRECTS: ("A"|"B")[] = ["A","B","B","A","B","B"];

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
                <div style={{ fontFamily:FONT, fontSize:72, fontWeight:900, color:INK, lineHeight:0.95, marginBottom:36 }}>Two<br/>Equations</div>
                <div style={{ display:"flex", gap:12, marginBottom:28 }}>
                  <span style={{ background:ORANGE, color:"#fff", fontFamily:MONO, fontSize:15, fontWeight:500, padding:"10px 20px", borderRadius:9999, boxShadow:"0 4px 0 rgba(0,0,0,0.12)" }}>two lines</span>
                  <span style={{ background:GREEN, color:"#fff", fontFamily:FONT, fontSize:15, fontWeight:800, padding:"10px 20px", borderRadius:9999, boxShadow:`0 4px 0 ${GREEN_DK}` }}>one point</span>
                </div>
                <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Your progress</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {Array.from({length:10}).map((_,i) => <div key={i} style={{ height:10, flex:1, borderRadius:999, background: i<4?ACCENT:"#E0DAD0" }}/>)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:ACCENT }}>40%</div>
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
                          {wrong && <span style={{ fontFamily:FONT, fontSize:12, color:RED, fontWeight:600 }}>{s.answer?"Always true!":"Can have 0 or infinite."}</span>}
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
                  <div style={{ fontFamily:FONT, fontSize:64, fontWeight:900, color:INK, lineHeight:0.95 }}>Two<br/>Equations</div>
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
