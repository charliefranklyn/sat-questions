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

function TwoTablesVisual() {
  const tables = [
    { label:"A", headers:["x","y"], rows:[["1","5"],["2","10"],["3","15"],["4","20"]], linear:true },
    { label:"B", headers:["x","y"], rows:[["1","2"],["2","5"],["3","10"],["4","17"]], linear:false },
  ];
  return (
    <div style={{ display:"flex", gap:16 }}>
      {tables.map(t => (
        <div key={t.label} style={{ flex:1, background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.07)" }}>
          <div style={{ padding:"10px 16px 8px", fontFamily:FONT, fontWeight:800, fontSize:14, color:INK, borderBottom:"2px solid #F0EAD8" }}>
            Table {t.label}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:"1px solid #F0EAD8" }}>
            {t.headers.map((h,i) => (
              <div key={i} style={{ padding:"8px 16px", fontFamily:FONT, fontWeight:700, fontSize:13, color:SOFT }}>{h}</div>
            ))}
          </div>
          {t.rows.map((row,r) => (
            <div key={r} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderTop: r===0?"none":"1px solid #F0EAD8" }}>
              {row.map((cell,c) => (
                <div key={c} style={{ padding:"9px 16px", fontFamily:FONT, fontSize:14, fontWeight: c===1?700:500, color:INK }}>{cell}</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NumberSequenceCard({ items }: { items: (number | null)[] }) {
  return (
    <div style={{ display:"flex", gap:12, justifyContent:"center", alignItems:"center" }}>
      {items.map((n, i) => (
        <div key={i} style={{
          width:72, height:72, borderRadius:16,
          background: n === null ? "#EEF2FF" : "#fff",
          border: n === null ? `2px dashed ${ACCENT}` : "2px solid #E8E4D8",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:MONO, fontWeight:700, fontSize:26,
          color: n === null ? ACCENT : INK,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {n === null ? "?" : n}
        </div>
      ))}
    </div>
  );
}

function TwoYInterceptSVG() {
  const W = 160, H = 130, PAD = 22;
  const toSVG = (x: number, y: number, yMax: number) => ({
    cx: PAD + (x / 3) * (W - PAD - 10),
    cy: H - PAD - (y / yMax) * (H - PAD - 10),
  });
  const graphs = [
    { label:"A", color:ACCENT, pts:[{x:0,y:0},{x:3,y:21}] },
    { label:"B", color:PURPLE, pts:[{x:0,y:8},{x:3,y:29}] },
  ];
  const yMax = 32;
  return (
    <div style={{ display:"flex", gap:16 }}>
      {graphs.map(g => {
        const [p0, p1] = g.pts.map(p => toSVG(p.x, p.y, yMax));
        return (
          <div key={g.label} style={{ background:"#fff", borderRadius:16, padding:"14px 14px 10px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", textAlign:"center" }}>
            <svg width={W} height={H} style={{ display:"block" }}>
              {/* axes */}
              <line x1={PAD} y1={8} x2={PAD} y2={H-PAD} stroke="#C8C2B8" strokeWidth={1.5}/>
              <line x1={PAD} y1={H-PAD} x2={W-8} y2={H-PAD} stroke="#C8C2B8" strokeWidth={1.5}/>
              {/* axis labels */}
              <text x={PAD-6} y={14} fontFamily={FONT} fontSize="11" fill={SOFT} textAnchor="middle" fontWeight="600">y</text>
              <text x={W-6} y={H-PAD+4} fontFamily={FONT} fontSize="11" fill={SOFT} textAnchor="middle" fontWeight="600">x</text>
              {/* line */}
              <line x1={p0.cx} y1={p0.cy} x2={p1.cx} y2={p1.cy} stroke={g.color} strokeWidth={2.5} strokeLinecap="round"/>
              {/* y-intercept dot */}
              <circle cx={p0.cx} cy={p0.cy} r={5} fill={g.color}/>
            </svg>
            <div style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:INK, marginTop:4 }}>{g.label}</div>
          </div>
        );
      })}
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

function SavingsEquationCard() {
  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"18px 24px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", marginBottom:14 }}>
        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>From the table</div>
        <div style={{ fontFamily:FONT, fontSize:16, color:INK, lineHeight:1.6 }}>
          Start at <b style={{ color:PURPLE }}>$10</b>. Add <b style={{ color:ORANGE }}>$5</b> for every week that passes.
        </div>
      </div>
      <div style={{ background:"#fff", borderRadius:20, padding:"24px 28px", textAlign:"center", boxShadow:"0 6px 0 rgba(31,37,68,0.08)", fontFamily:MONO, fontSize:50, fontWeight:500, color:INK }}>
        <div style={{ fontSize:12, fontFamily:FONT, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>The equation</div>
        y = <span style={{ color:ORANGE, fontWeight:700 }}>5</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>10</span>
        <div style={{ fontSize:13, fontFamily:FONT, color:SOFT, marginTop:10, fontWeight:600 }}>
          <span style={{ color:ORANGE }}>$5 per week</span>&nbsp;&nbsp;·&nbsp;&nbsp;<span style={{ color:PURPLE }}>starts at $10</span>
        </div>
      </div>
    </div>
  );
}

function SavingsPlotVisual() {
  const pts: [number,number][] = [[0,10],[1,15],[2,20],[3,25],[4,30]];
  const pad=42, W=400, H=250, yMax=35;
  const xs = (x:number) => pad + (x/4)*(W-pad-20);
  const ys = (y:number) => H - pad - (y/yMax)*(H-pad-20);
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)", maxWidth:700 }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0,10,20,30].map(y=><line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-20} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>)}
        {[0,1,2,3,4].map(x=><line key={`v${x}`} x1={xs(x)} y1={10} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>)}
        <line x1={pad} y1={H-pad} x2={W-20} y2={H-pad} stroke={INK} strokeWidth="2"/>
        <line x1={pad} y1={10} x2={pad} y2={H-pad} stroke={INK} strokeWidth="2"/>
        {[0,10,20,30].map(y=>(
          <text key={y} x={pad-8} y={ys(y)+5} fontFamily={MONO} fontSize="11" fill={SOFT} textAnchor="end">${y}</text>
        ))}
        {[0,1,2,3,4].map(x=>(
          <text key={x} x={xs(x)} y={H-pad+16} fontFamily={MONO} fontSize="11" fill={SOFT} textAnchor="middle">wk{x}</text>
        ))}
        <line x1={xs(0)} y1={ys(10)} x2={xs(4)} y2={ys(30)} stroke={ACCENT} strokeWidth="4" strokeLinecap="round"/>
        {pts.map(([x,y],i)=>(
          <circle key={i} cx={xs(x)} cy={ys(y)} r="8" fill={ACCENT} stroke="#fff" strokeWidth="3"/>
        ))}
      </svg>
    </div>
  );
}

function LinearWarmupVisual({ rate = 25, start = 0, challengeX = 4 }: { rate?: number; start?: number; challengeX?: number }) {
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);

  const rows = [1, 2, 3].map(x => ({ x, y: start + rate * x }));
  const answer = start + rate * challengeX;
  const isCorrect = parseInt(input) === answer;

  return (
    <div style={{ display:"flex", gap:16, maxWidth:700, alignItems:"stretch" }}>
      <div style={{ flex:1, background:"#fff", borderRadius:20, padding:"22px 24px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:18 }}>Map it out</div>
        {rows.map((row, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
            <div style={{ fontFamily:FONT, fontSize:15, fontWeight:600, color:INK, flex:"0 0 72px" }}>Week {row.x}</div>
            <div style={{ color:SOFT, fontSize:18 }}>→</div>
            {revealed[i] ? (
              <div style={{ fontFamily:MONO, fontSize:22, fontWeight:700, color:ACCENT }}>${row.y}</div>
            ) : (
              <button onClick={() => setRevealed(r => r.map((v, j) => j === i ? true : v))}
                style={{ padding:"8px 18px", borderRadius:10, border:`2px dashed ${ACCENT}`, background:`${ACCENT}0A`, color:ACCENT, fontFamily:FONT, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                Click to reveal
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ flex:"0 0 210px", background:"#fff", borderRadius:20, padding:"22px 24px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.08em" }}>Now you try</div>
        <div style={{ fontFamily:FONT, fontSize:17, fontWeight:800, color:INK }}>Week {challengeX} = <span style={{ color:ACCENT }}>$?</span></div>
        <input type="number" value={input} onChange={e => { setInput(e.target.value); setChecked(false); }} placeholder="Enter amount..."
          style={{ padding:"10px 14px", borderRadius:10, border:`2px solid rgba(31,37,68,0.15)`, fontFamily:MONO, fontSize:18, color:INK, outline:"none", width:"100%", boxSizing:"border-box" }}/>
        <button onClick={() => setChecked(true)}
          style={{ padding:"11px", borderRadius:10, background:ACCENT, color:"#fff", border:"none", fontFamily:FONT, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 3px 0 rgba(59,91,219,0.3)" }}>
          Check
        </button>
        {checked && (
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, color: isCorrect ? GREEN : RED, lineHeight:1.4 }}>
            {isCorrect ? `Yes — $${answer}. The pattern holds.` : "Not quite. Look at the gap between each row."}
          </div>
        )}
      </div>
    </div>
  );
}

function TutorBubble({ text }: { text: string }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:22 }}>
      <div style={{ flexShrink:0, width:48, height:48, borderRadius:"50%", background:ACCENT, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 0 rgba(59,91,219,0.25)" }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="9" cy="10" r="2.5" fill="white"/>
          <circle cx="17" cy="10" r="2.5" fill="white"/>
          <path d="M8 17 Q13 21 18 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div style={{ position:"relative", background:"#fff", borderRadius:"4px 18px 18px 18px", padding:"11px 18px", boxShadow:"0 2px 16px rgba(0,0,0,0.08)", fontFamily:FONT, fontSize:15, color:INK, lineHeight:1.5, maxWidth:500 }}>
        {text}
      </div>
    </div>
  );
}

function LinearPlot({ pts, yMax = 80, yStep = 25 }: { pts:[number,number][]; yMax?:number; yStep?:number }) {
  const pad=44, W=400, H=250;
  const xMax = pts[pts.length-1][0];
  const xs = (x:number) => pad + (x/xMax)*(W-pad-20);
  const ys = (y:number) => H - pad - (y/yMax)*(H-pad-20);
  const gridYs = Array.from({ length: Math.floor(yMax/yStep)+1 }, (_,i) => i*yStep);
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)", maxWidth:700 }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {gridYs.map(y=><line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-20} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>)}
        {pts.map(([x])=><line key={`v${x}`} x1={xs(x)} y1={10} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>)}
        <line x1={pad} y1={H-pad} x2={W-20} y2={H-pad} stroke={INK} strokeWidth="2"/>
        <line x1={pad} y1={10} x2={pad} y2={H-pad} stroke={INK} strokeWidth="2"/>
        {gridYs.map(y=><text key={y} x={pad-8} y={ys(y)+5} fontFamily={MONO} fontSize="11" fill={SOFT} textAnchor="end">${y}</text>)}
        {pts.map(([x])=><text key={x} x={xs(x)} y={H-pad+16} fontFamily={MONO} fontSize="11" fill={SOFT} textAnchor="middle">wk{x}</text>)}
        <line x1={xs(pts[0][0])} y1={ys(pts[0][1])} x2={xs(pts[pts.length-1][0])} y2={ys(pts[pts.length-1][1])} stroke={ACCENT} strokeWidth="4" strokeLinecap="round"/>
        {pts.map(([x,y],i)=><circle key={i} cx={xs(x)} cy={ys(y)} r="8" fill={ACCENT} stroke="#fff" strokeWidth="3"/>)}
      </svg>
    </div>
  );
}

function LinearEquationCard({ slope, intercept, slopeLabel, interceptLabel, xLabel, yLabel }: { slope:number; intercept:number; slopeLabel?:string; interceptLabel?:string; xLabel?:string; yLabel?:string }) {
  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"28px 24px", textAlign:"center", boxShadow:"0 6px 0 rgba(31,37,68,0.08)", fontFamily:MONO, fontSize:52, fontWeight:500, color:INK, marginBottom:16 }}>
        <div style={{ fontSize:13, fontFamily:FONT, fontWeight:700, color:SOFT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>The equation</div>
        y = <span style={{ color:ORANGE, fontWeight:700 }}>{slope}</span>x + <span style={{ color:PURPLE, fontWeight:700 }}>{intercept}</span>
      </div>
      <div style={{ display:"flex", gap:14, marginBottom: xLabel || yLabel ? 14 : 0 }}>
        <div style={{ flex:1, background:ORANGE, color:"#fff", borderRadius:18, padding:"18px 20px" }}>
          <div style={{ fontFamily:MONO, fontSize:24, fontWeight:700 }}>m = {slope}</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, marginTop:4 }}>{slopeLabel || "rate of change"}</div>
        </div>
        <div style={{ flex:1, background:PURPLE, color:"#fff", borderRadius:18, padding:"18px 20px" }}>
          <div style={{ fontFamily:MONO, fontSize:24, fontWeight:700 }}>b = {intercept}</div>
          <div style={{ fontFamily:FONT, fontSize:14, fontWeight:700, marginTop:4 }}>{interceptLabel || "starting value"}</div>
        </div>
      </div>
      {(xLabel || yLabel) && (
        <div style={{ background:"#F0EDE6", borderRadius:18, padding:"14px 20px", display:"flex", gap:24, fontFamily:FONT, fontSize:14, color:SOFT }}>
          {xLabel && <span><strong style={{ color:INK }}>x</strong> = {xLabel}</span>}
          {yLabel && <span><strong style={{ color:INK }}>y</strong> = {yLabel}</span>}
        </div>
      )}
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
  | { kind:"teach"; tag:string; tagColor?:string; headline:React.ReactNode; visual?:React.ReactNode; body?:React.ReactNode; tutorNote?:string }
  | { kind:"ab"; tag:string; tagColor?:string; headline:React.ReactNode; body?:React.ReactNode; visual?:React.ReactNode; optionA:string; optionB:string; correct:"A"|"B"; explain:string; tutorNote?:string }
  | { kind:"transition" }
  | { kind:"recap" }
  | { kind:"results" }
  | { kind:"complete" };

const SLIDES: Slide[] = [
  { kind:"intro" },
  {
    kind:"teach", tag:"Why This Matters",
    headline: <>Linear functions make up <span style={{ color:ACCENT }}>8–12 of the 44</span> SAT math questions.</>,
    visual: <LinearPlot pts={[[0,0],[1,15],[2,30],[3,45],[4,60]]} yMax={75} yStep={15}/>,
    body: <>That&apos;s about 20–25% of your entire math score — from one topic. Master this, and you&apos;ve secured a big chunk of your result.</>,
  },
  {
    kind:"ab", tag:"Spot the Pattern",
    headline: <>Before we define it — can you <span style={{ color:ACCENT }}>spot it yourself</span>?</>,
    body: "You earn $15 for every hour you work. What do you notice about how your earnings change?",
    visual: <MiniTable headers={["Hours worked","Earnings ($)"]} rows={[["1","$15"],["2","$30"],["3","$45"]]} highlightCol={1} accentColor={ACCENT}/>,
    optionA:"The amount it increases by changes each time",
    optionB:"The amount it increases by stays the same each time",
    correct:"B",
    explain:"Every extra hour adds exactly $15 — not more, not less. When the change is always the same, that's a linear function.",
  },
  {
    kind:"teach", tag:"The Definition",
    headline: <>A linear function is a relationship where a value changes by the <span style={{ color:ACCENT }}>same amount every time</span>.</>,
    visual: <MiniTable headers={["Hours worked","Earnings ($)","Change"]} rows={[["1","$15","+$15"],["2","$30","+$15"],["3","$45","+$15"]]} highlightCol={2} accentColor={ACCENT}/>,
    body: <>The key word is <span style={{ fontWeight:700 }}>&ldquo;same.&rdquo;</span> Not growing. Not shrinking. The same amount, every single step.</>,
  },
  {
    kind:"ab", tag:"The Definition",
    headline: <>Which of these is a <span style={{ color:ACCENT }}>linear function</span>?</>,
    body: "Think about whether the change is the same every step.",
    optionA:"A plant grows 2cm one week, 4cm the next, 8cm the next — doubling each time",
    optionB:"A plant grows exactly 3cm every single week",
    correct:"B",
    explain:"Option B grows by exactly 3cm every week — same amount, every time. Option A doubles each week, so the change keeps getting bigger. That's not linear.",
  },
  { kind:"recap" },
  { kind:"transition" },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Is this a linear function?",
    body:"A pizza takes 10 minutes to cook. Each additional topping adds a different amount of time depending on how wet it is.",
    optionA:"Yes — linear",
    optionB:"No — not linear",
    correct:"B",
    explain:"The increase isn't the same each time — it varies by topping. Linear functions need the same change every step, no exceptions.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Is this a linear function?",
    body:"A gym charges $3 for every hour you stay.",
    optionA:"Yes — linear",
    optionB:"No — not linear",
    correct:"A",
    explain:"Every extra hour adds exactly $3. Same amount, every time — that's linear.",
  },
  {
    kind:"ab", tag:"SAT Question", tagColor:RED,
    headline:"Is this a linear function?",
    body:"A taxi charges a $4 base fare, plus $2 for every kilometre travelled.",
    optionA:"Yes — linear",
    optionB:"No — not linear",
    correct:"A",
    explain:"Every kilometre adds exactly $2. The $4 base fare just shifts the starting point — the rate of change is still constant. Linear.",
  },
  { kind:"results" },
  { kind:"complete" },
];

export default function InteractiveLessonExp({ onClose, onComplete }: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number,"A"|"B">>({});
  const [completeLevel, setCompleteLevel] = useState(1);
  const [completePct, setCompletePct] = useState(10);
  const [recapPicks, setRecapPicks] = useState<Record<number, boolean>>({});

  const slide      = SLIDES[slideIdx];
  const pickedHere = picks[slideIdx] ?? null;
  const submitted  = pickedHere !== null;
  const SEGS       = SLIDES.length - 1;
  const SAT_START  = SLIDES.findIndex(s => s.kind === "ab" && (s as Extract<Slide,{kind:"ab"}>).tag === "SAT Question");
  const SAT_COUNT  = 3;
  const inSAT      = slideIdx >= SAT_START && slideIdx < SAT_START + SAT_COUNT;
  const progress   = inSAT ? 100 : Math.min(100, (slideIdx / (SAT_START - 1)) * 100);

  const isIntro      = slide.kind === "intro";
  const isComplete   = slide.kind === "complete";
  const isTransition = slide.kind === "transition";
  const isResults    = slide.kind === "results";
  const showTopBar   = !isIntro && !isComplete && !isTransition && !isResults;
  // When submitted on an AB slide, the feedback banner replaces the action bar in normal flow
  const showFeedback = slide.kind === "ab" && submitted;

  useEffect(() => {
    if (slide.kind === "complete") {
      playCorrect();
      setCompleteLevel(1);
      setCompletePct(10);
      setTimeout(() => { setCompleteLevel(2); setCompletePct(20); }, 700);
    }
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
                {inSAT ? (
                  <div style={{ flex:1, display:"flex", gap:6, alignItems:"center" }}>
                    {Array.from({ length: SAT_COUNT }).map((_, i) => {
                      const done = slideIdx - SAT_START;
                      const filled = i < done;
                      const current = i === done;
                      return (
                        <div key={i} style={{ flex:1, height:8, borderRadius:99, background: filled ? RED : current ? `${RED}55` : "rgba(31,37,68,0.1)", transition:"background 0.3s ease" }}/>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ flex:1, height:7, borderRadius:99, background:"rgba(31,37,68,0.1)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${progress}%`, borderRadius:99, background:ACCENT, transition:"width 0.4s ease" }}/>
                  </div>
                )}
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
                  {Array.from({length:6}).map((_,i)=>(
                    <div key={i} style={{ width:40, height:40, borderRadius:12, background:RED, display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:FONT, fontSize:15, fontWeight:800, color:"#fff",
                      opacity:0, animation:"popIn 0.3s ease forwards", animationDelay:`${i*100}ms`
                    }}>{i+1}</div>
                  ))}
                </div>
                <button onClick={advance} style={{ padding:"14px 44px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>
                  START →
                </button>
                <style>{`
                  @keyframes bounceIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
                  @keyframes popIn { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
                `}</style>
              </div>
            )}

            {/* RESULTS */}
            {slide.kind === "results" && (() => {
              const SAT_CORRECTS: ("A"|"B")[] = ["B","A","A"];
              const score = SAT_CORRECTS.filter((ans, i) => picks[SAT_START + i] === ans).length;
              return (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:CREAM, borderRadius:"inherit" }}>
                  <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:SOFT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
                    SAT Questions
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:80, fontWeight:900, color:INK, lineHeight:1, marginBottom:8, textAlign:"center" }}>
                    {score}<span style={{ color:SOFT, fontSize:48 }}>/6</span>
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:20, fontWeight:700, color: score >= 5 ? GREEN : score >= 3 ? ORANGE : RED, marginBottom:40 }}>
                    {score === 6 ? "Perfect score!" : score >= 4 ? "Well done." : score >= 2 ? "Good effort." : "Keep practising."}
                  </div>
                  <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:48 }}>
                    {SAT_CORRECTS.map((ans, i) => {
                      const correct = picks[SAT_START + i] === ans;
                      return (
                        <div key={i} style={{
                          width:48, height:48, borderRadius:14,
                          background: correct ? GREEN : RED,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          opacity:0, animation:"popIn 0.3s ease forwards",
                          animationDelay:`${i * 80}ms`,
                          boxShadow: correct ? `0 4px 0 ${GREEN_DK}` : "0 4px 0 rgba(200,60,60,0.35)",
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            {correct
                              ? <path d="M4 12l5 5 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              : <path d="M5 5l14 14M19 5L5 19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                            }
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={advance} style={{ padding:"14px 44px", background:ACCENT, color:"#fff", border:"none", borderRadius:14, fontFamily:FONT, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)", letterSpacing:"0.04em" }}>
                    CONTINUE →
                  </button>
                  <style>{`@keyframes popIn { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }`}</style>
                </div>
              );
            })()}

            {/* INTRO */}
            {slide.kind === "intro" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:580, paddingBottom:40 }}>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
                  SAT Math · Today&apos;s lesson:
                </div>
                <div style={{ fontFamily:FONT, fontSize:72, fontWeight:900, color:INK, lineHeight:0.95, marginBottom:36 }}>
                  Linear<br/>Functions
                </div>
                {/* Progress card */}
                <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Your progress</div>
                    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                      {Array.from({ length:10 }).map((_,i) => (
                        <div key={i} style={{ height:10, flex:1, borderRadius:999, background: i < 1 ? ACCENT : "#E0DAD0" }}/>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:ACCENT }}>10%</div>
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
                  <div style={{ fontFamily:FONT, fontSize:34, fontWeight:900, color:INK, lineHeight:1.15, marginBottom: s.body ? 10 : 22, maxWidth:680 }}>
                    {s.headline}
                  </div>
                  {s.body && (
                    <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:SOFT, lineHeight:1.55, marginBottom:22, maxWidth:580 }}>
                      {s.body}
                    </div>
                  )}
                  {s.visual && <div style={{ maxWidth:740, marginBottom:22 }}>{s.visual}</div>}
                  <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:660 }}>
                    <OptionRow letter="A" label={s.optionA} state={submitted ? getOptionState("A") : "idle"} onClick={() => { if (!submitted) { if ("A" === s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"A"})); } }}/>
                    <OptionRow letter="B" label={s.optionB} state={submitted ? getOptionState("B") : "idle"} onClick={() => { if (!submitted) { if ("B" === s.correct) playCorrect(); setPicks(p=>({...p,[slideIdx]:"B"})); } }}/>
                  </div>
                </div>
              );
            })()}

            {/* RECAP */}
            {slide.kind === "recap" && (() => {
              const statements = [
                { text:"A linear function increases or decreases by the same amount every step.", answer:true },
                { text:"A linear function can grow by different amounts, as long as it keeps going up.", answer:false },
                { text:"A pizza with variable topping times is a linear function.", answer:false },
                { text:"A gym charging $3 per hour is a linear function.", answer:true },
              ];
              return (
                <div style={{ paddingBottom:28, maxWidth:640 }}>
                  <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:ACCENT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
                    Key concepts recap
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:40, fontWeight:900, color:INK, lineHeight:1.1, marginBottom:8 }}>
                    Let&apos;s check what you remember.
                  </div>
                  <div style={{ fontFamily:FONT, fontSize:16, color:SOFT, marginBottom:24 }}>
                    Is each statement true or false?
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {statements.map((s, i) => {
                      const picked = recapPicks[i];
                      const hasPicked = picked !== undefined;
                      const correct = hasPicked && picked === s.answer;
                      const wrong   = hasPicked && picked !== s.answer;
                      return (
                        <div key={i} style={{ background:"#fff", borderRadius:18, padding:"16px 20px", boxShadow:"0 4px 0 rgba(31,37,68,0.06)", border: correct ? `2px solid ${GREEN}` : wrong ? `2px solid ${RED}` : "2px solid transparent", display:"flex", alignItems:"center", gap:16 }}>
                          <div style={{ flex:1, fontFamily:FONT, fontSize:15, fontWeight:700, color:INK }}>{s.text}</div>
                          <div style={{ display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
                            {wrong && (
                              <span style={{ fontFamily:FONT, fontSize:12, color:RED, fontWeight:600 }}>
                                {s.answer ? "Always true!" : "Not always!"}
                              </span>
                            )}
                            {[true, false].map(opt => {
                              const isChosen = hasPicked && picked === opt;
                              const isCorrectOpt = opt === s.answer;
                              const bg = isChosen
                                ? (isCorrectOpt ? GREEN : RED)
                                : hasPicked && isCorrectOpt ? GREEN : "#F5F0E8";
                              const color = isChosen || (hasPicked && isCorrectOpt) ? "#fff" : SOFT;
                              return (
                                <button key={String(opt)} onClick={() => !hasPicked && setRecapPicks(p => ({...p, [i]: opt}))}
                                  style={{ padding:"8px 18px", borderRadius:10, border:"none", cursor: hasPicked ? "default" : "pointer",
                                    background:bg, color, fontFamily:FONT, fontSize:13, fontWeight:800, transition:"all 0.2s" }}>
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
              );
            })()}

            {/* COMPLETE */}
            {slide.kind === "complete" && (
              <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:580, paddingBottom:40 }}>
                <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, color:GREEN, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
                  Lesson complete
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:36 }}>
                  <div style={{ fontFamily:FONT, fontSize:64, fontWeight:900, color:INK, lineHeight:0.95 }}>
                    Linear<br/>Functions
                  </div>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:GREEN, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 0 ${GREEN_DK}`, flexShrink:0, marginTop:4 }}>
                    <svg width="20" height="20" viewBox="0 0 64 64">
                      <path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {/* Animated progress card */}
                <div style={{ background:"#fff", borderRadius:20, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 0 rgba(31,37,68,0.06)" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"#E7F8EC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="24" height="24" viewBox="0 0 64 64">
                      <path d="M14 33l12 12 24-24" stroke={GREEN} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, color:GREEN, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Your progress</div>
                    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                      {Array.from({ length:10 }).map((_,i) => (
                        <div key={i} style={{ height:10, flex:1, borderRadius:999, background: i < completeLevel ? GREEN : "#E0DAD0", transition:"background 0.4s ease" }}/>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0, transition:"all 0.6s ease" }}>
                    <div style={{ fontFamily:FONT, fontSize:22, fontWeight:800, color:GREEN, transition:"all 0.6s ease" }}>{completePct}%</div>
                    <div style={{ fontFamily:FONT, fontSize:12, color:SOFT }}>Mastery</div>
                  </div>
                </div>
              </div>
            )}

          </div>{/* scrollable inner */}
          </div>{/* row 2: scrollable shell */}

          {/* ── Row 3: bottom zone — separator is the hard visual boundary ── */}
          <div style={{ borderTop: showFeedback || isTransition || isResults ? "none" : "2px solid rgba(31,37,68,0.10)" }}>
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
                    CONTINUE
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
