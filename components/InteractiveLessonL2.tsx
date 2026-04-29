"use client";
import ChatPanel, { CHAT_W } from "@/components/ChatPanel";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

function playCorrect() { new Audio("/sounds/correct.mp3").play().catch(() => {}); }

const FONT     = '"Inter", ui-sans-serif, system-ui, sans-serif';
const INK      = "#1E293B";
const GRAY     = "#94A3B8";
const ACCENT   = "#3B5BDB";
const GREEN    = "#38C76B";
const GREEN_DK = "#2CA555";
const RED      = "#EF5A5A";
const GREENBG  = "#DCFCE7";

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
        <marker id="l2ax" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1E293B"/>
        </marker>
        <clipPath id="l2clip"><circle cx={cx} cy={cy} r={r}/></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="rgba(59,91,219,0.07)"/>
      <g clipPath="url(#l2clip)">
        {[-4,-3,-2,-1,0,1,2,3,4].map(v=>(
          <g key={v}>
            <line x1={xp(-5.5)} y1={yp(v)} x2={xp(5.5)} y2={yp(v)} stroke="#CBD5E1" strokeWidth="0.8"/>
            <line x1={xp(v)} y1={yp(-5.5)} x2={xp(v)} y2={yp(5.5)} stroke="#CBD5E1" strokeWidth="0.8"/>
          </g>
        ))}
      </g>
      <line x1={xp(-5.5)} y1={yp(0)} x2={xp(5.5)} y2={yp(0)} stroke="#1E293B" strokeWidth="2.5" markerEnd="url(#l2ax)"/>
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

// ── Mini straight-line graph ──────────────────────────────────────────────────
function MiniLinear() {
  const W=190, H=170, pL=26, pR=10, pT=10, pB=26;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xp=(v:number)=>pL+v/6*pw;
  const yp=(v:number)=>pT+(6-v)/6*ph;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="l2mlx" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#334155"/>
        </marker>
      </defs>
      {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(v=>(
        <g key={v}>
          <line x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.7"/>
          <line x1={xp(v)} y1={pT} x2={xp(v)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.7"/>
        </g>
      ))}
      <line x1={pL} y1={yp(0)} x2={pL+pw+4} y2={yp(0)} stroke="#334155" strokeWidth="1.8" markerEnd="url(#l2mlx)"/>
      <line x1={xp(0)} y1={pT+ph} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="1.8"/>
      <polygon points={`${xp(0)},${pT-7} ${xp(0)-3.5},${pT} ${xp(0)+3.5},${pT}`} fill="#334155"/>
      <text x={pL+pw+8} y={yp(0)+4} fontFamily={FONT} fontSize="10" fill={INK} fontStyle="italic">x</text>
      <text x={xp(0)+4} y={pT-4} fontFamily={FONT} fontSize="10" fill={INK} fontStyle="italic">y</text>
      <line x1={xp(-5)} y1={yp(-5)} x2={xp(5)} y2={yp(5)} stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round"/>
      {[[-4,-4],[-2,-2],[0,0],[2,2],[4,4]].map(([x,y])=>(
        <circle key={x} cx={xp(x)} cy={yp(y)} r="4.5" fill={ACCENT}/>
      ))}
    </svg>
  );
}

// ── Mini curved (quadratic) graph ─────────────────────────────────────────────
function MiniCurved() {
  const W=190, H=170, pL=26, pR=10, pT=10, pB=26;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xp=(v:number)=>pL+(v+5)/10*pw;
  const yp=(v:number)=>pT+(5-v)/7*ph;
  const pts:[number,number][] = [[-4,4],[-3,1.5],[-2,0.5],[-1,0.1],[0,0],[1,0.1],[2,0.5],[3,1.5],[4,4]];
  const d = pts.map(([x,y],i)=>`${i===0?"M":"L"}${xp(x)},${yp(y)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="l2mcx" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#334155"/>
        </marker>
      </defs>
      {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(v=>(
        <g key={v}>
          <line x1={pL} y1={yp(v/1.4)} x2={pL+pw} y2={yp(v/1.4)} stroke="#E2E8F0" strokeWidth="0.7"/>
          <line x1={xp(-5+(v+5))} y1={pT} x2={xp(-5+(v+5))} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.7"/>
        </g>
      ))}
      <line x1={pL} y1={yp(0)} x2={pL+pw+4} y2={yp(0)} stroke="#334155" strokeWidth="1.8" markerEnd="url(#l2mcx)"/>
      <line x1={xp(0)} y1={pT+ph} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="1.8"/>
      <polygon points={`${xp(0)},${pT-7} ${xp(0)-3.5},${pT} ${xp(0)+3.5},${pT}`} fill="#334155"/>
      <text x={pL+pw+8} y={yp(0)+4} fontFamily={FONT} fontSize="10" fill={INK} fontStyle="italic">x</text>
      <text x={xp(0)+4} y={pT-4} fontFamily={FONT} fontSize="10" fill={INK} fontStyle="italic">y</text>
      <path d={d} stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y])=>(
        <circle key={x} cx={xp(x)} cy={yp(y)} r="4.5" fill={ACCENT}/>
      ))}
    </svg>
  );
}

// ── Coordinate graph — hours/earnings (correct axes) ─────────────────────────
function CoordGraphCorrect() {
  const W=200, H=180, pL=14, pR=14, pT=14, pB=28;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xs=[1,2,3], ys=[15,30,45];
  const xp=(i:number)=>pL+(i+0.5)/3.5*pw;
  const yp=(v:number)=>pT+(50-v)/40*ph;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="cgcx" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill="#334155"/>
        </marker>
        <marker id="cgcy" markerWidth="6" markerHeight="5" refX="3" refY="6" orient="auto">
          <polygon points="0 6,3 0,6 6" fill="#334155"/>
        </marker>
      </defs>
      {[0,1,2].map(i=>(
        <g key={i}>
          <line x1={xp(i)} y1={pT} x2={xp(i)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.9"/>
          <text x={xp(i)} y={pT+ph+12} textAnchor="middle" fontFamily={FONT} fontSize="9" fill={GRAY}>{xs[i]}</text>
        </g>
      ))}
      {[0,1,2].map(i=>(
        <g key={i}>
          <line x1={pL} y1={yp(ys[i])} x2={pL+pw} y2={yp(ys[i])} stroke="#E2E8F0" strokeWidth="0.9"/>
          <text x={pL-2} y={yp(ys[i])+3} textAnchor="end" fontFamily={FONT} fontSize="9" fill={GRAY}>{ys[i]}</text>
        </g>
      ))}
      <line x1={pL} y1={pT+ph} x2={pL+pw} y2={pT+ph} stroke="#334155" strokeWidth="1.6" markerEnd="url(#cgcx)"/>
      <line x1={pL} y1={pT+ph} x2={pL} y2={pT} stroke="#334155" strokeWidth="1.6" markerEnd="url(#cgcy)"/>
      <line x1={xp(0)} y1={yp(15)} x2={xp(2)} y2={yp(45)} stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
      {[0,1,2].map(i=>(
        <circle key={i} cx={xp(i)} cy={yp(ys[i])} r="5" fill={ACCENT}/>
      ))}
      <text x={pL+pw/2} y={H-2} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="600" fill={ACCENT}>Hours →</text>
      <text x={4} y={pT+ph/2} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="600" fill={ACCENT} transform={`rotate(-90,4,${pT+ph/2})`}>Earnings</text>
    </svg>
  );
}

// ── Wide rectangular graph (slide 2) ─────────────────────────────────────────
function GraphWide() {
  const W=500, H=200, pL=36, pR=36, pT=16, pB=32;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xp=(v:number)=>pL+(v+6)/12*pw;
  const yp=(v:number)=>pT+(6-v)/12*ph;
  const pts:number[] = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="gwx" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#334155"/>
        </marker>
        <marker id="gwy" markerWidth="7" markerHeight="5" refX="3.5" refY="7" orient="auto">
          <polygon points="0 7,3.5 0,7 7" fill="#334155"/>
        </marker>
      </defs>
      {/* Grid */}
      {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(v=>(
        <g key={v}>
          <line x1={xp(v)} y1={pT} x2={xp(v)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.8"/>
          <line x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>
        </g>
      ))}
      {/* Axes */}
      <line x1={pL} y1={yp(0)} x2={pL+pw+6} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#gwx)"/>
      <line x1={xp(0)} y1={pT+ph} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#gwy)"/>
      {/* Labels */}
      <text x={pL+pw+14} y={yp(0)+4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="600">x</text>
      <text x={xp(0)+6} y={pT-2} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="600">y</text>
      {/* Line y = x */}
      <line x1={xp(-5.5)} y1={yp(-5.5)} x2={xp(5.5)} y2={yp(5.5)} stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Dots */}
      {pts.map(v=>(
        <circle key={v} cx={xp(v)} cy={yp(v)} r="5.5" fill={ACCENT}/>
      ))}
    </svg>
  );
}

// ── Coordinate graph — flipped axes ──────────────────────────────────────────
function CoordGraphFlipped() {
  const W=200, H=180, pL=14, pR=14, pT=14, pB=28;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xs=[15,30,45], ys=[1,2,3];
  const xp=(i:number)=>pL+(i+0.5)/3.5*pw;
  const yp=(v:number)=>pT+(4-v)/3*ph;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="cgfx" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill="#334155"/>
        </marker>
        <marker id="cgfy" markerWidth="6" markerHeight="5" refX="3" refY="6" orient="auto">
          <polygon points="0 6,3 0,6 6" fill="#334155"/>
        </marker>
      </defs>
      {[0,1,2].map(i=>(
        <g key={i}>
          <line x1={xp(i)} y1={pT} x2={xp(i)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.9"/>
          <text x={xp(i)} y={pT+ph+12} textAnchor="middle" fontFamily={FONT} fontSize="9" fill={GRAY}>{xs[i]}</text>
        </g>
      ))}
      {[0,1,2].map(i=>(
        <g key={i}>
          <line x1={pL} y1={yp(ys[i])} x2={pL+pw} y2={yp(ys[i])} stroke="#E2E8F0" strokeWidth="0.9"/>
          <text x={pL-2} y={yp(ys[i])+3} textAnchor="end" fontFamily={FONT} fontSize="9" fill={GRAY}>{ys[i]}</text>
        </g>
      ))}
      <line x1={pL} y1={pT+ph} x2={pL+pw} y2={pT+ph} stroke="#334155" strokeWidth="1.6" markerEnd="url(#cgfx)"/>
      <line x1={pL} y1={pT+ph} x2={pL} y2={pT} stroke="#334155" strokeWidth="1.6" markerEnd="url(#cgfy)"/>
      <line x1={xp(0)} y1={yp(1)} x2={xp(2)} y2={yp(3)} stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
      {[0,1,2].map(i=>(
        <circle key={i} cx={xp(i)} cy={yp(ys[i])} r="5" fill={ACCENT}/>
      ))}
      <text x={pL+pw/2} y={H-2} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="600" fill={RED}>Earnings →</text>
      <text x={4} y={pT+ph/2} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="600" fill={RED} transform={`rotate(-90,4,${pT+ph/2})`}>Hours</text>
    </svg>
  );
}

// ── Single-point graph (positive y only, dot only) ────────────────────────────
function PointGraph({ px, py }: { px: number; py: number }) {
  // x: -6 to 6, y: -0.4 to 5.8 (x-axis near bottom, negative y cropped)
  const W=380, H=210, pL=44, pR=28, pT=18, pB=42;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xMin=-6, xMax=6, yMin=-0.4, yMax=5.8;
  const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
  const yp=(v:number)=>pT+(yMax-v)/(yMax-yMin)*ph;
  const xTicks=[-5,-4,-3,-2,-1,1,2,3,4,5];
  const yTicks=[1,2,3,4,5];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="pgx" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#334155"/>
        </marker>
        <marker id="pgy" markerWidth="5" markerHeight="7" refX="2.5" refY="7" orient="auto">
          <polygon points="0 7,2.5 0,5 7" fill="#334155"/>
        </marker>
      </defs>
      {/* Grid — positive y only */}
      {xTicks.map(v=>(
        <line key={`gx${v}`} x1={xp(v)} y1={pT} x2={xp(v)} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>
      ))}
      {yTicks.map(v=>(
        <line key={`gy${v}`} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>
      ))}
      {/* x-axis bottom line (y=0) */}
      <line x1={pL} y1={yp(0)} x2={pL+pw} y2={yp(0)} stroke="#E2E8F0" strokeWidth="0.8"/>
      {/* Axes */}
      <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2" markerEnd="url(#pgx)"/>
      <line x1={xp(0)} y1={yp(0)+4} x2={xp(0)} y2={pT-4} stroke="#334155" strokeWidth="2" markerEnd="url(#pgy)"/>
      {/* Tick labels */}
      {xTicks.map(v=>(
        <text key={`tx${v}`} x={xp(v)} y={yp(0)+16} textAnchor="middle" fontFamily={FONT} fontSize="11" fill={GRAY}>{v}</text>
      ))}
      {yTicks.map(v=>(
        <text key={`ty${v}`} x={xp(0)-8} y={yp(v)+4} textAnchor="end" fontFamily={FONT} fontSize="11" fill={GRAY}>{v}</text>
      ))}
      {/* Axis labels */}
      <text x={pL+pw+16} y={yp(0)+5} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">x</text>
      <text x={xp(0)+7} y={pT-4} fontFamily={FONT} fontSize="14" fill={INK} fontStyle="italic" fontWeight="700">y</text>
      {/* Guide lines to the point */}
      <line x1={xp(px)} y1={yp(0)} x2={xp(px)} y2={yp(py)} stroke={ACCENT} strokeWidth="1.4" strokeDasharray="5 4" opacity="0.5"/>
      <line x1={pL} y1={yp(py)} x2={xp(px)} y2={yp(py)} stroke={ACCENT} strokeWidth="1.4" strokeDasharray="5 4" opacity="0.5"/>
      {/* Dot only — no label */}
      <circle cx={xp(px)} cy={yp(py)} r="10" fill={ACCENT}/>
      <circle cx={xp(px)} cy={yp(py)} r="5.5" fill="#fff"/>
      <circle cx={xp(px)} cy={yp(py)} r="3.5" fill={ACCENT}/>
    </svg>
  );
}

// ── Plot picker ───────────────────────────────────────────────────────────────
function PlotPicker({ picked, onPick, submitted, correct }: { picked: number | null; onPick: (i: number) => void; submitted: boolean; correct: number }) {
  // Fixed domain: x 0–8, y 0–40
  const W=420, H=320, pL=50, pR=24, pT=20, pB=48;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xMin=0, xMax=8, yMin=0, yMax=40;
  const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
  const yp=(v:number)=>pT+(yMax-v)/(yMax-yMin)*ph;
  const xTicks=[0,1,2,3,4,5,6,7,8];
  const yTicks=[0,10,20,30,40];
  // Pre-plotted known points
  const known=[{x:2,y:10},{x:4,y:20}];
  // Candidate y values at x=6
  const candidates=[25,30,35]; // index 0,1,2 matches options
  const colors = submitted
    ? candidates.map((_, i) => i === 1 ? "#16A34A" : (picked === i ? "#DC2626" : "transparent"))
    : candidates.map((_, i) => picked === i ? ACCENT : "transparent");

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (submitted) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const svgX = (e.clientX - rect.left) / rect.width * W;
    const svgY = (e.clientY - rect.top) / rect.height * H;
    // Find closest candidate
    let best = -1, bestDist = 999;
    candidates.forEach((cy, i) => {
      const d = Math.hypot(svgX - xp(6), svgY - yp(cy));
      if (d < bestDist) { bestDist = d; best = i; }
    });
    if (bestDist < 36) { onPick(best); if (best === correct) playCorrect(); }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block", cursor: submitted ? "default" : "pointer" }} onClick={handleClick}>
      {/* Grid */}
      {xTicks.map(v=><line key={`gx${v}`} x1={xp(v)} y1={pT} x2={xp(v)} y2={pT+ph} stroke="#E2E8F0" strokeWidth={v===6?"0":"0.8"}/>)}
      {yTicks.map(v=><line key={`gy${v}`} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
      {/* x=6 highlight column */}
      <rect x={xp(6)-pw/(xMax-xMin)/2} y={pT} width={pw/(xMax-xMin)} height={ph} fill="rgba(59,91,219,0.05)"/>
      <line x1={xp(6)} y1={pT} x2={xp(6)} y2={pT+ph} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4"/>
      {/* Axes */}
      <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2"/>
      <line x1={pL} y1={yp(yMax)+4} x2={pL} y2={pT-4} stroke="#334155" strokeWidth="2"/>
      {/* Labels */}
      {xTicks.map(v=><text key={`tx${v}`} x={xp(v)} y={pT+ph+18} textAnchor="middle" fontFamily={FONT} fontSize="12" fill={v===6 ? ACCENT : GRAY} fontWeight={v===6 ? "700" : "400"}>{v}</text>)}
      {yTicks.map(v=><text key={`ty${v}`} x={pL-10} y={yp(v)+4} textAnchor="end" fontFamily={FONT} fontSize="12" fill={GRAY}>{v}</text>)}
      <text x={pL+pw+14} y={yp(0)+5} fontFamily={FONT} fontSize="13" fill={INK} fontStyle="italic" fontWeight="700">x</text>
      <text x={pL+7} y={pT-6} fontFamily={FONT} fontSize="13" fill={INK} fontStyle="italic" fontWeight="700">y</text>
      {/* x=6 label */}
      <text x={xp(6)} y={pT+ph+34} textAnchor="middle" fontFamily={FONT} fontSize="11" fill={ACCENT} fontWeight="700">x = 6</text>
      {/* Known points */}
      {known.map(({x,y})=>(
        <g key={`${x},${y}`}>
          <line x1={xp(x)} y1={yp(0)} x2={xp(x)} y2={yp(y)} stroke={ACCENT} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.4"/>
          <line x1={pL} y1={yp(y)} x2={xp(x)} y2={yp(y)} stroke={ACCENT} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.4"/>
          <circle cx={xp(x)} cy={yp(y)} r="9" fill={ACCENT}/>
          <circle cx={xp(x)} cy={yp(y)} r="4.5" fill="#fff"/>
          <circle cx={xp(x)} cy={yp(y)} r="3" fill={ACCENT}/>
          <text x={xp(x)+12} y={yp(y)-6} fontFamily={FONT} fontSize="11" fill={ACCENT} fontWeight="700">({x},{y})</text>
        </g>
      ))}
      {/* Candidate dots at x=6 */}
      {candidates.map((cy, i) => {
        const active = picked === i;
        const fill = colors[i];
        const strokeC = submitted ? (i===1 ? "#16A34A" : (picked===i ? "#DC2626" : "#CBD5E1")) : (active ? ACCENT : "#CBD5E1");
        return (
          <g key={cy}>
            <circle cx={xp(6)} cy={yp(cy)} r="18" fill="transparent"/>
            <circle cx={xp(6)} cy={yp(cy)} r="10" fill={fill==="transparent" ? "#fff" : fill} stroke={strokeC} strokeWidth="2"/>
            {active && <circle cx={xp(6)} cy={yp(cy)} r="5" fill={submitted ? (i===1 ? "#16A34A" : "#DC2626") : ACCENT}/>}
            {!active && !submitted && <circle cx={xp(6)} cy={yp(cy)} r="4" fill="#CBD5E1"/>}
            <text x={xp(6)+14} y={yp(cy)+4} fontFamily={FONT} fontSize="11" fill={strokeC} fontWeight="600">y = {cy}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Multi-plot picker ─────────────────────────────────────────────────────────
// candidates: all clickable spots; correctIndices: which 3 are correct
function MultiPlotPicker({ candidates, correctIndices, checked, onToggle, submitted }: {
  candidates: {x:number; y:number}[];
  correctIndices: number[];
  checked: boolean[];
  onToggle: (i: number) => void;
  submitted: boolean;
}) {
  const W=420, H=300, pL=50, pR=24, pT=20, pB=48;
  const xMin=0, xMax=4, yMin=0, yMax=12;
  const pw=W-pL-pR, ph=H-pT-pB;
  const xp=(v:number)=>pL+(v-xMin)/(xMax-xMin)*pw;
  const yp=(v:number)=>pT+(yMax-v)/(yMax-yMin)*ph;
  const xTicks=[0,1,2,3,4];
  const yTicks=[0,3,6,9,12];

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (submitted) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const svgX = (e.clientX - rect.left) / rect.width * W;
    const svgY = (e.clientY - rect.top) / rect.height * H;
    let best = -1, bestDist = 999;
    candidates.forEach(({x,y}, i) => {
      const d = Math.hypot(svgX - xp(x), svgY - yp(y));
      if (d < bestDist) { bestDist = d; best = i; }
    });
    if (bestDist < 36) onToggle(best);
  }

  const selectedCount = checked.filter(Boolean).length;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block", cursor: submitted ? "default" : "pointer" }} onClick={handleClick}>
        {/* Grid */}
        {xTicks.map(v=><line key={`gx${v}`} x1={xp(v)} y1={pT} x2={xp(v)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.8"/>)}
        {yTicks.map(v=><line key={`gy${v}`} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
        {/* Axes */}
        <line x1={pL} y1={yp(0)} x2={pL+pw+8} y2={yp(0)} stroke="#334155" strokeWidth="2"/>
        <line x1={pL} y1={yp(yMax)+4} x2={pL} y2={pT-4} stroke="#334155" strokeWidth="2"/>
        {/* Labels */}
        {xTicks.map(v=><text key={`tx${v}`} x={xp(v)} y={pT+ph+18} textAnchor="middle" fontFamily={FONT} fontSize="12" fill={GRAY}>{v}</text>)}
        {yTicks.map(v=><text key={`ty${v}`} x={pL-10} y={yp(v)+4} textAnchor="end" fontFamily={FONT} fontSize="12" fill={GRAY}>{v}</text>)}
        <text x={pL+pw+14} y={yp(0)+5} fontFamily={FONT} fontSize="13" fill={INK} fontStyle="italic" fontWeight="700">x</text>
        <text x={pL+7} y={pT-6} fontFamily={FONT} fontSize="13" fill={INK} fontStyle="italic" fontWeight="700">y</text>
        {/* All candidate dots */}
        {candidates.map(({x,y}, i) => {
          const isSelected = checked[i] ?? false;
          const isCorrect = correctIndices.includes(i);
          let dotColor = "#CBD5E1";
          if (submitted) {
            dotColor = isSelected ? (isCorrect ? "#16A34A" : "#DC2626") : (isCorrect ? "#16A34A" : "#CBD5E1");
          } else if (isSelected) {
            dotColor = ACCENT;
          }
          const showFill = isSelected || (submitted && isCorrect);
          return (
            <g key={i}>
              <circle cx={xp(x)} cy={yp(y)} r="22" fill="transparent"/>
              <circle cx={xp(x)} cy={yp(y)} r="10" fill={showFill ? dotColor : "#fff"} stroke={dotColor} strokeWidth="2"/>
              {showFill && <circle cx={xp(x)} cy={yp(y)} r="4.5" fill={submitted && isSelected ? (isCorrect ? "#fff" : "#fff") : "#fff"}/>}
              {showFill && <circle cx={xp(x)} cy={yp(y)} r="2.5" fill={dotColor}/>}
              <text x={xp(x)+13} y={yp(y)-7} fontFamily={FONT} fontSize="10" fill={isSelected || (submitted && isCorrect) ? dotColor : "#94A3B8"} fontWeight="600">({x},{y})</text>
            </g>
          );
        })}
      </svg>
      {!submitted && (
        <div style={{ fontFamily:FONT, fontSize:12, color:GRAY, textAlign:"center", marginTop:4 }}>
          {selectedCount}/3 selected
        </div>
      )}
    </div>
  );
}

// ── Multi-select list ─────────────────────────────────────────────────────────
function MultiSelectList({ options, correctSet, picked, onToggle, submitted }: {
  options: string[];
  correctSet: number[];
  picked: number[];
  onToggle: (i: number) => void;
  submitted: boolean;
}) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
      {options.map((label, i) => {
        const isSelected = picked.includes(i);
        const isCorrect  = correctSet.includes(i);
        let bg = "#fff", border = "rgba(31,37,68,0.14)", textColor = INK, badgeBg = "#F5F0E8", badgeColor = INK;
        let showCheck = false, showCross = false;
        if (submitted) {
          if (isCorrect)                             { bg="#E7F8EC"; border=GREEN; badgeBg=GREEN; badgeColor="#fff"; showCheck=true; }
          else if (isSelected && !isCorrect)         { bg="#FDECEC"; border=RED;   badgeBg=RED;   badgeColor="#fff"; showCross=true; textColor="#5A6088"; }
          else                                       { border="rgba(31,37,68,0.07)"; textColor="rgba(31,37,68,0.35)"; badgeBg="rgba(31,37,68,0.07)"; badgeColor="rgba(31,37,68,0.3)"; }
        } else if (isSelected) {
          bg="rgba(59,91,219,0.06)"; border=ACCENT; badgeBg=ACCENT; badgeColor="#fff";
        }
        return (
          <div key={i} onClick={() => { if (!submitted) onToggle(i); }}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14, background:bg, border:`2px solid ${border}`, cursor:submitted?"default":"pointer", transition:"all 0.15s" }}>
            <div style={{ width:32, height:32, borderRadius:8, background:badgeBg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:13, fontWeight:900, color:badgeColor, flexShrink:0 }}>
              {submitted ? (showCheck ? "✓" : showCross ? "✗" : String.fromCharCode(65+i)) : (isSelected ? "✓" : String.fromCharCode(65+i))}
            </div>
            <div style={{ fontFamily:FONT, fontSize:16, fontWeight:600, color:textColor, flex:1 }}>{label}</div>
            {showCheck && <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={GREEN}/><path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {showCross && <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={RED}/><path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
          </div>
        );
      })}
    </div>
  );
}

// ── Progress pills ────────────────────────────────────────────────────────────
function ProgressPills({ filled, total, color = ACCENT }: { filled:number; total:number; color?:string }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{ height:8, flex:1, borderRadius:99, background: i < filled ? color : "#CBD5E1", transition:"background 0.4s ease" }}/>
      ))}
    </div>
  );
}

// ── Option list ───────────────────────────────────────────────────────────────
function OptionList({ options, correct, picked, onPick }: { options:string[]; correct:number; picked:number|null; onPick:(i:number)=>void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {options.map((label, i) => {
        let bg="#fff", border="rgba(31,37,68,0.14)", badgeBg="#F5F0E8", badgeColor=INK, textColor=INK;
        let showCheck=false, showCross=false;
        if (picked !== null) {
          if (i === correct)      { bg="#E7F8EC"; border=GREEN; badgeBg=GREEN; badgeColor="#fff"; showCheck=true; }
          else if (i === picked)  { bg="#FDECEC"; border=RED;   badgeBg=RED;   badgeColor="#fff"; showCross=true; textColor="#5A6088"; }
          else                    { border="rgba(31,37,68,0.07)"; textColor="rgba(31,37,68,0.35)"; badgeBg="rgba(31,37,68,0.07)"; badgeColor="rgba(31,37,68,0.3)"; }
        }
        return (
          <div key={i} onClick={() => { if (picked===null) { onPick(i); if (i===correct) playCorrect(); } }}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px", borderRadius:16, background:bg, border:`2px solid ${border}`, cursor:picked===null?"pointer":"default", transition:"all 0.15s" }}>
            <div style={{ width:38, height:38, borderRadius:10, background:badgeBg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontSize:16, fontWeight:900, color:badgeColor, flexShrink:0 }}>
              {["A","B","C"][i]}
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

// ── EdAccelerator header (shared) ─────────────────────────────────────────────
function EdHeader({ onChatOpen, isMobile }: { onChatOpen?: () => void; isMobile?: boolean }) {
  return (
    <div style={{ borderBottom:"1px solid rgba(226,232,240,0.6)", padding:isMobile?"0 16px":"0 52px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <svg width="28" height="28" viewBox="264 271 552 537" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="l2-logo-grad" x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4e7efe"/><stop offset=".77" stopColor="#1c45f6"/>
            </linearGradient>
          </defs>
          <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill="url(#l2-logo-grad)"/>
          <path d="M523.2,510.9c-5.5-16.4-17.2-29.9-32.2-38.6-6.8-3.9-15.2-7.6-25.1-9.8-24.1-5.4-43.5.6-51.1,3.4-8.5,3.7-33.3,15.9-46.7,43.7-12.6,26.3-10.9,57.9,3.5,85.5,6.9,13.2,17.4,24.2,30.4,31.4,12.1,6.7,29.3,13.3,50.6,13,33.8-.5,57.2-18,66.9-26.8,2.5-2.2,2.7-6,.6-8.6l-18.2-21.9c-1.8-2.1-5-2.5-7.2-.8-21.1,16.4-46.7,19.6-64.3,8.8-9.6-5.9-14.8-14.9-17.6-21.3-.3-.8.2-1.7,1-1.8l101.1-14.8c6.5-.95,11.4-6.4,11.8-13,.4-7.6-.2-17.4-3.7-28.1Zm-48.4,14-63.7,9.5c-.7.1-1.3-.45-1.3-1.15.2-4.8,1.8-19.9,14.7-29.3,11-7.9,28.2-10.3,40.1-.9,8.5,6.7,10.6,16.6,11.2,20.6.1.6-.3,1.2-.94,1.25Z" fill="#fff"/>
          <path d="M714.8,627.5l-2.2-12c-.4-2.1-.6-4.2-.6-6.3V399.4c0-4.2-3.8-7.3-7.9-6.5l-36.8,7.3c-3.2.6-5.4,3.4-5.4,6.6v71.3c-8.1-9.1-20.6-17.4-47.1-17.4-13.9,0-26.4,4.4-37.7,11.1-11.3,6.7-20.2,16.7-26.9,29.8-6.6,13.1-9.9,29.2-9.9,48.2,0,18.8,3.3,34.8,9.8,47.95s15.4,23.2,26.6,30.1c11.2,6.9,23.9,10.4,38.1,10.4,10.3,0,18.9-1.6,25.7-4.9,6.8-3.3,13.9-7.4,18.1-12,2-2.2,4.5-4.8,6.9-7.4l.8,13.8c.3,3.7,3.4,6.6,7.1,6.6h35.9c3.6,0,6.4-3.3,5.7-6.9Zm-51.4-54.3c-1.2,2.3-9.7,13.8-18.4,17.9-3.7,1.7-8.4,3.3-14,3.3-7.7,0-14.6-.95-20.7-4.7-6.1-3.7-10.9-9.2-14.5-16.3s-5.3-15.8-5.3-25.97c0-10.3,1.8-19,5.4-26.1,3.6-7.1,7.1-11.5,13.2-15.1,6.1-3.6,13-5.5,20.5-5.5,18.8,0,30,10.7,33.8,16.9v55.7Z" fill="#fff"/>
        </svg>
        <span style={{ fontFamily:FONT, fontSize:14, fontWeight:600, color:"#0F172A", letterSpacing:"-0.01em" }}>EdAccelerator</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {onChatOpen && (
          <button onClick={onChatOpen} style={{ display:"flex", alignItems:"center", gap:5, background:"none", border:"1.5px solid #E2E8F0", borderRadius:10, padding:"6px 12px", cursor:"pointer", fontFamily:FONT, fontSize:13, fontWeight:600, color:ACCENT }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Chat
          </button>
        )}
        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#4e7efe 0%,#1c45f6 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:FONT, fontSize:13, fontWeight:600, color:"#fff" }}>C</span>
        </div>
      </div>
    </div>
  );
}

// ── Slide manifest ────────────────────────────────────────────────────────────
const SLIDES = [
  { id:"intro"             }, // 0
  { id:"understand"        }, // 1  how is it graphed?
  { id:"explore"           }, // 2  two pieces of info
  { id:"coord_intro"       }, // 3  what are x and y coordinates? (3,4)
  { id:"coord_try1"        }, // 4  now try this one (2,5)
  { id:"coord_try2"        }, // 5  now try this one (-2,3)
  { id:"apply"             }, // 6  coordinate points from table (multi-select)
  { id:"apply2"            }, // 7  which graph
  { id:"check1"            }, // 8  which set of coordinates
  { id:"practice_unlocked" }, // 9
  { id:"p1"                }, // 10 NEW Q1
  { id:"p2"                }, // 11 NEW Q2
  { id:"p3"                }, // 12 NEW Q3
  { id:"p4"                }, // 13 NEW Q4
  { id:"p5"                }, // 14 NEW Q5
  { id:"p6"                }, // 15 OLD Q1
  { id:"p7"                }, // 16 OLD Q2
  { id:"p8"                }, // 17 OLD Q3
  { id:"p9"                }, // 18 OLD Q4
  { id:"p10"               }, // 19 OLD Q5
  { id:"score"             }, // 20
  { id:"complete"          }, // 21
];

const PROGRESS = [0.06,0.12,0.18,0.24,0.30,0.36,0.42,0.48,0.56,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0];

// ── Component ─────────────────────────────────────────────────────────────────
export default function InteractiveLessonL2({ onClose, onComplete }: { onClose:()=>void; onComplete:()=>void }) {
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);
  const slidePad = isMobile ? "16px 16px 80px"  : "28px 52px 100px";
  const cols2    = isMobile ? "1fr"              : "1fr 1fr";
  const barPad   = isMobile ? "12px 16px"        : "20px 52px";
  const heroFs   = isMobile ? 32                 : 56;
  const [idx, setIdx]         = useState(0);
  const [picked, setPicked]   = useState<number|null>(null);
  const [multiPicked, setMultiPicked]   = useState<number[]>([]);
  const [multiSubmitted, setMultiSubmitted] = useState(false);
  const [completeFilled, setCompleteFilled] = useState(1);
  const [practiceResults, setPracticeResults] = useState<(boolean|null)[]>([null,null,null,null,null,null,null,null,null,null]);
  const [plotChecked, setPlotChecked] = useState<boolean[]>([]);

  useEffect(() => { setPlotChecked([]); }, [idx]);

  useEffect(() => {
    if (idx === SLIDES.length - 1) {
      setCompleteFilled(1);
      const t = setTimeout(() => setCompleteFilled(2), 600);
      return () => clearTimeout(t);
    }
  }, [idx]);

  const PRACTICE_CORRECT = [1, 0, 1, 1, 2, 1, 0, 0, 1, 1];
  const isPractice   = idx >= 10 && idx <= 19;
  const practiceStep = isPractice ? idx - 10 : 0;
  const practiceScore = practiceResults.filter(r => r === true).length;
  const isFirst = idx === 0;
  const isLast  = idx === SLIDES.length - 1;
  const isQuestionSlide = (idx >= 1 && idx <= 8 && idx !== 6) || (idx >= 10 && idx <= 19);

  const CORRECT_BY_IDX: Record<number,number> = {
    1:0, 2:0,
    3:1, 4:0, 5:1,
    7:0, 8:0,
    10:PRACTICE_CORRECT[0], 11:PRACTICE_CORRECT[1], 12:PRACTICE_CORRECT[2], 13:PRACTICE_CORRECT[3], 14:PRACTICE_CORRECT[4],
    15:PRACTICE_CORRECT[5], 16:PRACTICE_CORRECT[6], 17:PRACTICE_CORRECT[7], 18:PRACTICE_CORRECT[8], 19:PRACTICE_CORRECT[9],
  };

  const EXPLAIN_DATA: Record<number,[string,string]> = {
    1: ["Because the change is constant, the points line up perfectly — forming a straight line. That's actually where the word 'linear' comes from.", "Not quite. Because the change is constant, the points always line up into a straight line, not a curve."],
    2: ["Every point on a graph has an x coordinate (across) and a y coordinate (up). Those two numbers place a point exactly on the graph.", "While formulas and tables are useful, what actually plots a point is its x and y coordinates — one for across, one for up."],
    3: ["x is always across first, y is always up second. The point is 3 across and 4 up, so x = 3, y = 4.", "Remember: x is across first, y is up second. Count 3 across and 4 up — that gives x = 3, y = 4."],
    4: ["Across first, up second — x = 2, y = 5.", "Across first, up second — the point is 2 across and 5 up, so x = 2, y = 5. Not the other way round."],
    5: ["Across first, up second — x = -2, y = 3. Negative x means the point is to the left of centre.", "Across first, up second — the point is 2 to the left (so x = -2) and 3 up (so y = 3)."],
    6: ["Correct! x is input (hours), y is output (earnings) — so the points are (1,15), (2,30), (3,45).", "Remember: x is the input (hours worked) and y is the output (earnings). Each row gives you (x, y) — so row 1 is (1, 15), not (15, 1)."],
    7: ["Graph A places hours across and earnings up — the correct way. Graph B has the axes flipped the wrong way around.", "Graph B has the axes swapped. Hours (input/x) should go across; earnings (output/y) should go up."],
    8: ["In A, the y value increases by 2 every time — constant change, straight line. In B, the jumps are +3 then +6 — inconsistent, so it curves.", "In B, the gaps are +3 then +6 — they're different each time. Set A has a constant +2 increase, which makes it linear."],
    10: ["Across first, up second — x = 6, y = 2. So the point is (6, 2).", "Remember: x is always across first, y is always up second. 6 across, 2 up = (6, 2), not (2, 6)."],
    11: ["In A, y increases by 4 every time — constant change. In B the jumps are 5 then 7 — not constant.", "Check the gaps: A has +4, +4 — constant. B has +5 then +7 — different. Only A is linear."],
    12: ["The rate is +5 per step (10→20 is +10 over 2 x-steps, so +5 per step). At x = 6, y = 30.", "Find the rate: from x=2 to x=4, y goes from 10 to 20 — that's +5 per x-step. At x=6, y = 20 + 10 = 30."],
    13: ["The pattern adds 3 each time: (1,3)(2,6)(3,9)(4,12). (3,8) should be (3,9) — it breaks the pattern.", "Check: +3 each step. After (2,6) the next y should be 9, not 8. So (3,8) is the odd one out."],
    14: ["Across first, up second. x is −3 (three left), y is 5 (five up) — so (−3, 5).", "Left of centre means negative x. Count 3 left = x = −3, then 5 up = y = 5. The point is (−3, 5)."],
    15: ["The pattern adds 3 each time: (1,3)→(2,6)→(3,9). The y value at x=3 is 9.", "Check: +3 each step. After (2,6) the next y is 6+3=9, not 7 or 12."],
    16: ["The pattern adds 5 each time: 5, 10, 15. So (3,20) breaks it — it should be (3,15).", "(4,20) fits: 5, 10, 15, 20. It's (3,20) that's wrong — the correct point is (3,15)."],
    17: ["3 km every interval — a constant rate. The coordinates are (1,3) (2,6) (3,9).", "The runner adds exactly 3 km every 30 minutes. That constant rate gives (1,3)(2,6)(3,9)."],
    18: ["x is across, y is up. The point is 4 across and 2 up — so (4, 2).", "Remember: x first (across), y second (up). Count 4 right, 2 up — that's (4, 2), not (2, 4)."],
    19: ["x is across, y is up. The point is 3 to the left (x = -3) and 2 up (y = 2).", "Across first, up second. Left of centre means negative x, so x = -3. Up 2 means y = 2."],
  };

  const TAKEAWAY_DATA: Record<number, string> = {
    1:  "Constant change = straight line. This is literally what 'linear' means.",
    2:  "Every point needs exactly one x (across) and one y (up).",
    3:  "x is always across, y is always up — never swap them.",
    4:  "x first, y second — always.",
    5:  "Negative x means left of centre. The sign tells you the direction.",
    6:  "x is the input (first number), y is the output (second number) — always written (x, y).",
    7:  "Input (x) goes across; output (y) goes up.",
    8:  "Constant differences in y values = linear = straight line.",
    10: "x first (across), y second (up) — always, even with large numbers.",
    11: "Check the gaps between y-values. If any two gaps differ, it's not linear.",
    12: "Find the rate per step, then multiply to find the missing value.",
    13: "Find the pattern first, then check each point against it.",
    14: "Negative x means left of centre — the sign tells you the direction.",
    15: "Find the pattern, then verify the missing value fits.",
    16: "One point that doesn't fit breaks the pattern — check each one.",
    17: "Time typically goes across (x); distance typically goes up (y).",
    18: "x is across (first number), y is up (second number).",
    19: "Left of centre = negative x. Count up for y as normal.",
  };

  const TIP_DATA: Record<number, string> = {
    1:  "When the change is constant, points always form a straight line — that's literally the definition of linear.",
    2:  "To plot a point, you always need exactly two numbers: how far across (x) and how far up (y).",
    3:  "Use this: 'along the corridor, then up the stairs.' x first (across), y second (up).",
    4:  "Say it out loud before answering: 'x is across, y is up.' Then match the numbers.",
    5:  "Negative x means you move LEFT from the origin. Check the sign before you count.",
    6:  "x first, y second — that's (hours, earnings). Row 1 of the table gives (1, 15). Never swap them.",
    7:  "The input (what you control) always goes across. The output (what you measure) always goes up.",
    8:  "Before choosing a set of points, subtract each y from the next. Equal gaps = linear = straight line.",
    10: "Say it out loud: 'across first, up second.' x=6, y=2 → (6, 2).",
    11: "Calculate all gaps before choosing. Equal gaps = linear.",
    12: "Work out the rate first: (20−10)÷(4−2) = 5 per step. Then apply it.",
    13: "Write out what the pattern predicts for each x, then find the mismatch.",
    14: "Negative x is common on the SAT — always check the sign before choosing.",
    15: "Find the difference between y-values (+3 each step), then apply it to the missing value.",
    16: "Work through each point systematically: does it match the pattern? The one that breaks it is wrong.",
    17: "Time usually goes across (x), quantity or distance goes up (y). Think: what am I measuring?",
    18: "Read the pair left to right: first number is x (across), second is y (up).",
    19: "Left of centre means negative x. Count up normally for y.",
  };

  const tipMessage = TIP_DATA[idx];

  const MULTI_CORRECT_SET = [0, 3, 5];
  const multiAllCorrect = MULTI_CORRECT_SET.every(i => multiPicked.includes(i)) && multiPicked.every(i => MULTI_CORRECT_SET.includes(i));

  const autoMessage = idx === 6
    ? (multiSubmitted && EXPLAIN_DATA[6])
      ? multiAllCorrect
        ? `Well done! ${EXPLAIN_DATA[6][0]}\n\nKey takeaway: ${TAKEAWAY_DATA[6]}`
        : `Not quite. ${EXPLAIN_DATA[6][1]}\n\nKey takeaway: ${TAKEAWAY_DATA[6]}`
      : undefined
    : (picked !== null && EXPLAIN_DATA[idx])
      ? picked === CORRECT_BY_IDX[idx]
        ? `Well done! ${EXPLAIN_DATA[idx][0]}\n\nKey takeaway: ${TAKEAWAY_DATA[idx]}`
        : `Not quite. ${EXPLAIN_DATA[idx][1]}\n\nKey takeaway: ${TAKEAWAY_DATA[idx]}`
      : undefined;

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
      locked={!isQuestionSlide && idx !== 6}
      hintOnly={(isQuestionSlide && picked === null) || (idx === 6 && !multiSubmitted)}
      autoMessage={autoMessage}
      tipMessage={tipMessage}
      slideKey={idx}
      answeredLabel={idx === 6 ? (multiSubmitted ? "(1,15), (2,30), (3,45)" : undefined) : (picked !== null ? ["A","B","C","D"][picked] : undefined)}
      answeredCorrect={idx === 6 ? (multiSubmitted ? multiAllCorrect : undefined) : (picked !== null ? picked === CORRECT_BY_IDX[idx] : undefined)}
    />
<div style={{ position:"fixed", top:0, left:0, bottom:0, right:isMobile?0:CHAT_W, background:"#fff", fontFamily:FONT, zIndex:100, overflowY:"auto" }}>

      <EdHeader onChatOpen={isMobile ? () => setChatOpen(true) : undefined} isMobile={isMobile} />

      {/* ── Progress bar ── */}
      <div style={{ position:"relative", zIndex:1, padding:isMobile?"12px 16px 0":"20px 52px 0", display:"flex", alignItems:"center", gap:20 }}>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 22 22"><path d="M4 4l14 14M18 4L4 18" stroke={INK} strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        {isPractice ? (
          <div style={{ flex:1, display:"flex", gap:6 }}>
            {[0,1,2,3,4,5,6,7,8,9].map(i=>(
              <div key={i} style={{ flex:1, height:8, borderRadius:99, background: i<=practiceStep ? RED : "#E2E8F0", transition:"background 0.3s ease" }}/>
            ))}
          </div>
        ) : (
          <div style={{ flex:1, height:8, borderRadius:99, background:"#E2E8F0", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${PROGRESS[idx]*100}%`, borderRadius:99, background:isLast ? GREEN : ACCENT, transition:"width 0.6s ease, background 0.4s ease" }}/>
          </div>
        )}
      </div>

      {/* ── Slide 0: INTRO ── */}
      {idx === 0 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"center", maxWidth:1280, margin:"0 auto" }}>
          <div>
            <div style={{ fontFamily:FONT, fontWeight:600, fontSize:12, color:GRAY, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:10 }}>Today&apos;s lesson</div>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:heroFs, color:INK, lineHeight:0.95, marginBottom:14 }}>Graphing<br/>Linear<br/>Functions</div>
            <div style={{ fontFamily:FONT, fontWeight:500, fontSize:16, color:INK, lineHeight:1.6, marginBottom:24, maxWidth:400 }}>
              We&apos;ll learn how to <span style={{ color:ACCENT, fontWeight:600 }}>plot linear functions</span> on a graph: from coordinates to straight lines.
            </div>
            <div style={{ background:"#F8FAFC", borderRadius:16, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, maxWidth:400 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT, fontSize:10, fontWeight:800, color:ACCENT, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:6 }}>Your progress</div>
                <ProgressPills filled={1} total={8} />
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:FONT, fontSize:18, fontWeight:800, color:ACCENT }}>20%</div>
                <div style={{ fontFamily:FONT, fontSize:11, color:GRAY }}>Mastery</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"75%" }}><Graph2 /></div>
          </div>
        </div>
      )}

      {/* ── Slide 1: HOW IS A LINEAR FUNCTION GRAPHED? ── */}
      {idx === 1 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          {/* Header — capped at left half so headline never crosses centre */}
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:8 }}>
              How is a linear function <span style={{ color:ACCENT }}>graphed?</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            {/* Left */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontFamily:FONT, fontSize:16, color:INK, lineHeight:1.6 }}>
                Linear functions increase by the <span style={{ color:ACCENT, fontWeight:600 }}>same amount each time.</span>
              </div>
              <div style={{ fontFamily:FONT, fontSize:15, color:"#475569", lineHeight:1.5, marginBottom:4 }}>
                How do you think it would look on a graph?
              </div>
              <div style={{ background:"rgba(59,91,219,0.04)", borderRadius:16, padding:"20px", border:"1px solid rgba(59,91,219,0.10)" }}>
                <div style={{ display:"grid", gridTemplateColumns:cols2, gap:16 }}>
                  <div>
                    <div style={{ background:"#fff", borderRadius:10, padding:10, marginBottom:8, border:"1px solid #E2E8F0" }}>
                      <MiniLinear />
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:INK, textAlign:"center" }}>A: A straight line</div>
                  </div>
                  <div>
                    <div style={{ background:"#fff", borderRadius:10, padding:10, marginBottom:8, border:"1px solid #E2E8F0" }}>
                      <MiniCurved />
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:INK, textAlign:"center" }}>B: A curved line</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke={ACCENT} strokeWidth="1.8"/><path d="M14 14l3.5 3.5" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>Which graph represents a linear function?</div>
              </div>
              <OptionList options={["A straight line","A curved line"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 2: TWO PIECES OF INFORMATION ── */}
      {idx === 2 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:12 }}>
              Linear functions always create a <span style={{ color:ACCENT }}>straight line</span> when mapped on a graph.
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            {/* Left */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontFamily:FONT, fontSize:16, color:INK, lineHeight:1.6 }}>
                There are <span style={{ color:ACCENT, fontWeight:600 }}>two pieces of information</span> we need to plot one.
              </div>
              <div style={{ fontFamily:FONT, fontSize:15, color:"#475569", lineHeight:1.5 }}>
                Do you know what they are?
              </div>
              <div style={{ marginTop:8 }}><GraphWide /></div>
            </div>
            {/* Right */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>What two pieces of information do we need to plot a point?</div>
              </div>
              <OptionList options={["x and y coordinates","A formula and a table"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 3: WHAT ARE X AND Y COORDINATES? (point at 3,4) ── */}
      {idx === 3 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:8 }}>
              x and y coordinates tell us <span style={{ color:ACCENT }}>where a point sits</span> on a graph.
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            {/* Left */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ background:"rgba(59,91,219,0.06)", borderRadius:14, padding:"14px 18px" }}>
                <div style={{ fontFamily:FONT, fontSize:15, color:INK, lineHeight:1.7 }}>
                  <span style={{ color:ACCENT, fontWeight:700 }}>x</span> tells us how far <strong>across</strong><br/>
                  <span style={{ color:ACCENT, fontWeight:700 }}>y</span> tells us how far <strong>up</strong>
                </div>
              </div>
              <div style={{ marginTop:4 }}><PointGraph px={3} py={4} /></div>
            </div>
            {/* Right */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>What are the x and y coordinates of the point marked?</div>
              </div>
              <OptionList options={["x = 4,  y = 3","x = 3,  y = 4"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 4: NOW TRY THIS ONE (point at 2,5) ── */}
      {idx === 4 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:8 }}>
              Now try <span style={{ color:ACCENT }}>this one.</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            <div style={{ marginTop:4 }}><PointGraph px={2} py={5} /></div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>What are the coordinates of this point?</div>
              </div>
              <OptionList options={["x = 2,  y = 5","x = 5,  y = 2","x = 2,  y = 2"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 5: NOW TRY THIS ONE (negative x — point at -2,3) ── */}
      {idx === 5 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:8 }}>
              Now try <span style={{ color:ACCENT }}>this one.</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            <div style={{ marginTop:4 }}><PointGraph px={-2} py={3} /></div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>What are the coordinates of this point?</div>
              </div>
              <OptionList options={["x = 3,  y = -2","x = -2,  y = 3","x = -3,  y = 2"]} correct={1} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 6: COORDINATE POINTS FROM TABLE (multi-select) ── */}
      {idx === 6 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:12 }}>
              Can you guess the <span style={{ color:ACCENT }}>coordinates</span> for this linear function?
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            {/* Left */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ background:"rgba(59,91,219,0.06)", borderRadius:14, padding:"14px 18px", fontFamily:FONT, fontSize:15, color:INK, lineHeight:1.6 }}>
                The x coordinate is the input <span style={{ color:ACCENT, fontWeight:600 }}>(hours worked)</span>, the y coordinate is the output <span style={{ color:ACCENT, fontWeight:600 }}>(earnings)</span>. Together they create a coordinate point like <span style={{ fontWeight:700 }}>(1, 15)</span>.
              </div>
              <div style={{ borderRadius:14, overflow:"hidden", border:"1px solid rgba(59,91,219,0.10)" }}>
                <div style={{ display:"grid", gridTemplateColumns:cols2, background:"rgba(59,91,219,0.05)" }}>
                  {["Hours worked","Earnings"].map(c=>(
                    <div key={c} style={{ padding:"13px 24px", fontFamily:FONT, fontWeight:700, fontSize:14, color:INK }}>{c}</div>
                  ))}
                </div>
                {[["1","$15"],["2","$30"],["3","$45"]].map(([a,b],i)=>(
                  <div key={i} style={{ display:"grid", gridTemplateColumns:cols2, borderTop:"1px solid rgba(59,91,219,0.08)", background:"#fff" }}>
                    <div style={{ padding:"14px 24px", fontFamily:FONT, fontSize:16, color:INK, textAlign:"center" }}>{a}</div>
                    <div style={{ padding:"14px 24px", fontFamily:FONT, fontSize:16, color:INK, textAlign:"center" }}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div>
                  <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>What are the 3 coordinate points from this table?</div>
                  <div style={{ fontFamily:FONT, fontSize:13, color:GRAY, marginTop:3 }}>Select 3</div>
                </div>
              </div>
              <MultiSelectList
                options={["(1, 15)","(30, 2)","(15, 1)","(2, 30)","(45, 3)","(3, 45)"]}
                correctSet={[0,3,5]}
                picked={multiPicked}
                onToggle={i => setMultiPicked(p => p.includes(i) ? p.filter(x=>x!==i) : [...p, i])}
                submitted={multiSubmitted}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 7: WHICH GRAPH ── */}
      {idx === 7 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:12 }}>
              You&apos;ve got 3 coordinates:&nbsp;
              <span style={{ color:ACCENT }}>(1, 15)</span>&nbsp;&nbsp;
              <span style={{ color:ACCENT }}>(2, 30)</span>&nbsp;&nbsp;
              <span style={{ color:ACCENT }}>(3, 45)</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            {/* Left */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontFamily:FONT, fontSize:15, color:"#475569", lineHeight:1.5 }}>
                Which graph shows these points plotted correctly?
              </div>
              <div style={{ background:"rgba(59,91,219,0.04)", borderRadius:16, padding:"20px", border:"1px solid rgba(59,91,219,0.10)" }}>
                <div style={{ display:"grid", gridTemplateColumns:cols2, gap:16 }}>
                  <div>
                    <div style={{ background:"#fff", borderRadius:10, padding:10, marginBottom:8, border:"1px solid #E2E8F0" }}>
                      <CoordGraphCorrect />
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:INK, textAlign:"center" }}>A: Hours across, Earnings up</div>
                  </div>
                  <div>
                    <div style={{ background:"#fff", borderRadius:10, padding:10, marginBottom:8, border:"1px solid #E2E8F0" }}>
                      <CoordGraphFlipped />
                    </div>
                    <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, color:INK, textAlign:"center" }}>B: Earnings across, Hours up</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>Which graph shows these points plotted correctly?</div>
              </div>
              <OptionList options={["Graph A","Graph B"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 8: WHICH SET OF COORDINATES ── */}
      {idx === 8 && (
        <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:20, maxWidth:"50%" }}>
            <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, marginBottom:12 }}>
              A correctly drawn linear function always creates a <span style={{ color:ACCENT }}>straight line.</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"start" }}>
            {/* Left */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ marginTop:8 }}><GraphWide /></div>
            </div>
            {/* Right */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:22, color:ACCENT }}>?</div>
                <div style={{ fontFamily:FONT, fontSize:17, fontWeight:700, color:INK }}>Which set of coordinates forms a straight line on a graph?</div>
              </div>
              <OptionList options={["(1,2)  (2,4)  (3,6)","(1,2)  (2,5)  (3,11)"]} correct={0} picked={picked} onPick={setPicked} />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide 9: PRACTICE UNLOCKED ── */}
      {idx === 9 && (
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:isMobile?"16px 16px 60px":"24px 52px 80px", textAlign:"center", minHeight:"calc(100vh - 80px)" }}>
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
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
            {[[1,2,3,4,5],[6,7,8,9,10]].map((row, rowIdx) => (
              <div key={rowIdx} style={{ display:"flex", gap:12 }}>
                {row.map((n, i) => {
                  const gi = rowIdx * 5 + i;
                  return <div key={n} style={{ width:42, height:42, borderRadius:"50%", background: gi===0 ? ACCENT : "transparent", border: gi===0 ? "none" : "2px solid #CBD5E1", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, fontWeight:700, fontSize:15, color: gi===0 ? "#fff" : "#94A3B8" }}>{n}</div>;
                })}
              </div>
            ))}
          </div>
          <button onClick={() => { setPicked(null); setIdx(10); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 36px", background:ACCENT, border:"none", borderRadius:14, fontFamily:FONT, fontWeight:700, fontSize:15, color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>
            Start Practice
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}

      {/* ── Slides 10–14: PRACTICE QUESTIONS ── */}
      {isPractice && (() => {
        // Runner graph for Q3
        const RunnerGraph = () => {
          const W=300, H=190, pL=40, pR=16, pT=12, pB=36;
          const pw=W-pL-pR, ph=H-pT-pB;
          const xp=(v:number)=>pL+(v-0.5)/3.5*pw;
          const yp=(v:number)=>pT+(10-v)/10*ph;
          return (
            <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
              <defs>
                <marker id="rgx" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,6 2.5,0 5" fill="#334155"/></marker>
                <marker id="rgy" markerWidth="5" markerHeight="6" refX="2.5" refY="6" orient="auto"><polygon points="0 6,2.5 0,5 6" fill="#334155"/></marker>
                <clipPath id="rgclip"><rect x={pL} y={pT} width={pw} height={ph}/></clipPath>
              </defs>
              {[1,2,3,4].map(v=><line key={v} x1={xp(v)} y1={pT} x2={xp(v)} y2={pT+ph} stroke="#E2E8F0" strokeWidth="0.8"/>)}
              {[0,3,6,9].map(v=><line key={v} x1={pL} y1={yp(v)} x2={pL+pw} y2={yp(v)} stroke="#E2E8F0" strokeWidth="0.8"/>)}
              <line x1={pL} y1={pT+ph} x2={pL+pw+6} y2={pT+ph} stroke="#334155" strokeWidth="1.8" markerEnd="url(#rgx)"/>
              <line x1={pL} y1={pT+ph} x2={pL} y2={pT-4} stroke="#334155" strokeWidth="1.8" markerEnd="url(#rgy)"/>
              {[1,2,3].map(v=><text key={v} x={xp(v)} y={pT+ph+16} textAnchor="middle" fontFamily={FONT} fontSize="10" fill={GRAY}>{v}</text>)}
              {[3,6,9].map(v=><text key={v} x={pL-4} y={yp(v)+4} textAnchor="end" fontFamily={FONT} fontSize="10" fill={GRAY}>{v}</text>)}
              <text x={pL+pw/2} y={H-2} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="600" fill={ACCENT}>Intervals (30 min)</text>
              <text x={8} y={pT+ph/2} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="600" fill={ACCENT} transform={`rotate(-90,8,${pT+ph/2})`}>km</text>
              <line x1={xp(0)} y1={yp(0)} x2={xp(3)} y2={yp(9)} stroke={ACCENT} strokeWidth="2" strokeLinecap="round" clipPath="url(#rgclip)"/>
              {[[1,3],[2,6],[3,9]].map(([x,y])=><circle key={x} cx={xp(x)} cy={yp(y)} r="5" fill={ACCENT}/>)}
            </svg>
          );
        };

        const PSLIDES: { headline: React.ReactNode; emoji?: string; context?: React.ReactNode; visual?: React.ReactNode; cols: string[]; rows: string[][]; options: string[]; correct: number; kind?: "plot" | "plot3"; plotCandidates?: {x:number;y:number}[]; plotCorrectIndices?: number[] }[] = [
          {
            headline:<>Read the <span style={{ color:ACCENT }}>coordinates.</span></>,
            emoji:"📍",
            context:<>A point is marked on this graph. What are its coordinates?</>,
            visual:<PointGraph px={6} py={2} />,
            cols:[], rows:[],
            options:["(2, 6)","(6, 2)","(6, 6)"], correct:1,
          },
          {
            headline:<>Which is <span style={{ color:ACCENT }}>linear?</span></>,
            emoji:"📊",
            context:<>One of these sets of coordinates forms a <strong>linear function</strong>. Which one?</>,
            cols:["Set","Coordinates"], rows:[["A","(1,4)  (2,8)  (3,12)"],["B","(1,4)  (2,9)  (3,16)"]],
            options:["Set A","Set B"], correct:0,
          },
          {
            headline:<>Plot the <span style={{ color:ACCENT }}>missing point.</span></>,
            emoji:"📍",
            context:<>A linear function passes through the following points:</>,
            cols:["x","y"], rows:[["2","10"],["4","20"],["6","?"]],
            options:["25","30","35"], correct:1,
            kind:"plot",
          },
          {
            headline:<>Spot the <span style={{ color:ACCENT }}>odd one out.</span></>,
            emoji:"🔍",
            context:<>One of these coordinates doesn&apos;t belong. The pattern adds <strong>3 each time</strong>. Which point breaks it?</>,
            cols:["x","y"], rows:[["1","3"],["2","6"],["3","8"],["4","12"]],
            options:["(2, 6)","(3, 8)","(4, 12)"], correct:1,
          },
          {
            headline:<>Read the <span style={{ color:ACCENT }}>coordinates.</span></>,
            emoji:"📍",
            context:<>A point is marked on the graph. What are its coordinates?</>,
            visual:<PointGraph px={-3} py={5} />,
            cols:[], rows:[],
            options:["(3, 5)","(5, -3)","(-3, 5)"], correct:2,
          },
          {
            headline:<>Plot the <span style={{ color:ACCENT }}>3 coordinates.</span></>,
            emoji:"📍",
            context:<>A linear function passes through these points. Click each one on the graph.</>,
            cols:["x","y"], rows:[["1","3"],["2","6"],["3","9"]],
            options:["","",""], correct:1,
            kind:"plot3",
            plotCandidates:[{x:1,y:3},{x:1,y:6},{x:1,y:9},{x:2,y:3},{x:2,y:6},{x:2,y:9},{x:3,y:3},{x:3,y:6},{x:3,y:9}],
            plotCorrectIndices:[0,4,8],
          },
          {
            headline:<>Spot the <span style={{ color:ACCENT }}>odd one out.</span></>,
            emoji:"🔍",
            context:<>In a linear function, <strong>y increases by the same amount</strong> every step. One row below breaks that rule. Which one is it?</>,
            cols:["x","y"], rows:[["1","5"],["2","10"],["3","20"],["4","20"]],
            options:["(3, 20)","(4, 20)"], correct:0,
          },
          {
            headline:<>Read the <span style={{ color:ACCENT }}>coordinates.</span></>,
            emoji:"🏃",
            context:<>A runner completes <strong>3 km</strong> every 30 minutes. Which coordinates appear on this graph?</>,
            visual:<RunnerGraph />,
            cols:[], rows:[],
            options:["(1, 3)  (2, 6)  (3, 9)","(1, 3)  (2, 7)  (3, 12)","(1, 30)  (2, 30)  (3, 30)"], correct:0,
          },
          {
            headline:<>Read the <span style={{ color:ACCENT }}>coordinates.</span></>,
            emoji:"📍",
            context:<>A point is marked on the graph. What are its coordinates?</>,
            visual:<PointGraph px={4} py={2} />,
            cols:[], rows:[],
            options:["(2, 4)","(4, 2)","(4, 3)"], correct:1,
          },
          {
            headline:<>Read the <span style={{ color:ACCENT }}>coordinates.</span></>,
            emoji:"📍",
            context:<>A point is marked on the graph. What are its coordinates?</>,
            visual:<PointGraph px={-3} py={2} />,
            cols:[], rows:[],
            options:["(-2, 3)","(-3, 2)","(3, -2)"], correct:1,
          },
        ];
        const s = PSLIDES[practiceStep];
        return (
          <div style={{ position:"relative", zIndex:1, padding:slidePad, maxWidth:1280, margin:"0 auto" }}>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:FONT, fontWeight:900, fontSize:40, color:INK, lineHeight:1.1, whiteSpace:"nowrap" }}>
                {s.headline}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:cols2, gap:48, alignItems:"start" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {s.context && (
                  <div style={{ background:"rgba(59,91,219,0.06)", borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
                    {s.emoji && <div style={{ width:44, height:44, borderRadius:12, background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>{s.emoji}</div>}
                    <div style={{ fontFamily:FONT, fontWeight:500, fontSize:15, color:INK, lineHeight:1.55 }}>{s.context}</div>
                  </div>
                )}
                {s.visual && <div>{s.visual}</div>}
                {s.cols.length > 0 && (
                  <div style={{ borderRadius:14, overflow:"hidden", border:"1px solid rgba(59,91,219,0.10)" }}>
                    <div style={{ display:"grid", gridTemplateColumns:`repeat(${s.cols.length}, 1fr)`, background:"rgba(59,91,219,0.05)" }}>
                      {s.cols.map(c=>(
                        <div key={c} style={{ padding:"13px 24px", fontFamily:FONT, fontWeight:700, fontSize:14, color:INK }}>{c}</div>
                      ))}
                    </div>
                    {s.rows.map((row,i)=>(
                      <div key={i} style={{ display:"grid", gridTemplateColumns:`repeat(${s.cols.length}, 1fr)`, borderTop:"1px solid rgba(59,91,219,0.08)", background:"#fff" }}>
                        {row.map((cell,j)=>(
                          <div key={j} style={{ padding:"14px 24px", fontFamily:FONT, fontSize:16, color:INK, textAlign:"center" }}>{cell}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(59,91,219,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT, fontWeight:900, fontSize:18, color:ACCENT }}>?</div>
                  <div style={{ fontFamily:FONT, fontWeight:700, fontSize:16, color:INK }}>
                    {s.kind === "plot" ? "Tap where the point goes." : s.kind === "plot3" ? "Click all 3 points on the graph." : "Choose the best answer."}
                  </div>
                </div>
                {s.kind === "plot"
                  ? <PlotPicker picked={picked} onPick={setPicked} submitted={picked !== null} correct={s.correct} />
                  : s.kind === "plot3"
                  ? <MultiPlotPicker
                      candidates={s.plotCandidates ?? []}
                      correctIndices={s.plotCorrectIndices ?? []}
                      checked={(s.plotCandidates ?? []).map((_,j) => plotChecked[j] ?? false)}
                      onToggle={(i) => {
                        const len = (s.plotCandidates ?? []).length;
                        const cur = Array.from({length:len}, (_,j) => plotChecked[j] ?? false);
                        const next = cur.map((v,j) => j === i ? !v : v);
                        setPlotChecked(next);
                        const selectedIdxs = next.map((v,j) => v ? j : -1).filter(j => j >= 0);
                        if (selectedIdxs.length === 3) {
                          const correct = (s.plotCorrectIndices ?? []);
                          const allRight = selectedIdxs.every(j => correct.includes(j));
                          setPicked(allRight ? s.correct : (s.correct === 0 ? 1 : 0));
                          if (allRight) playCorrect();
                        }
                      }}
                      submitted={picked !== null}
                    />
                  : <OptionList options={s.options} correct={s.correct} picked={picked} onPick={setPicked} />
                }
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Slide 15: SCORE ── */}
      {idx === 20 && (() => {
        const msg = practiceScore === 10 ? { text:"Perfect!", color:GREEN }
          : practiceScore >= 8 ? { text:"Great work.", color:GREEN }
          : practiceScore >= 6 ? { text:"Good work.", color:ACCENT }
          : practiceScore >= 4 ? { text:"Good effort.", color:RED }
          : { text:"Keep practising.", color:RED };
        return (
          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:isMobile?"16px 16px 60px":"24px 52px 80px", textAlign:"center", minHeight:"calc(100vh - 80px)" }}>
            <div style={{ fontFamily:FONT, fontWeight:800, fontSize:11, color:ACCENT, letterSpacing:"0.12em", marginBottom:20 }}>SAT QUESTIONS</div>
            <div style={{ marginBottom:12, lineHeight:1 }}>
              <span style={{ fontFamily:FONT, fontWeight:900, fontSize:120, color:INK }}>{practiceScore}</span>
              <span style={{ fontFamily:FONT, fontWeight:700, fontSize:heroFs, color:GRAY }}>/10</span>
            </div>
            <div style={{ fontFamily:FONT, fontWeight:700, fontSize:28, color:msg.color, marginBottom:36 }}>{msg.text}</div>
            <div style={{ display:"flex", gap:12, marginBottom:44 }}>
              {practiceResults.map((r, i) => (
                <div key={i} style={{ width:60, height:60, borderRadius:14, background: r===true ? GREEN : r===false ? RED : "#E2E8F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {r===true  && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l7 7 11-11" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {r===false && <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 6l14 14M20 6L6 20" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/></svg>}
                </div>
              ))}
            </div>
            <button onClick={() => setIdx(i => i+1)} style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 48px", background:ACCENT, border:"none", borderRadius:14, fontFamily:FONT, fontWeight:700, fontSize:16, color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>
              Continue
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        );
      })()}

      {/* ── Slide 15: COMPLETE ── */}
      {isLast && (
        <div style={{ position:"relative", zIndex:1, padding:isMobile?"16px 16px 80px":"36px 52px 140px", display:"grid", gridTemplateColumns:cols2, gap:32, alignItems:"center", maxWidth:1280, margin:"0 auto" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:GREENBG, borderRadius:99, padding:"6px 16px", marginBottom:28 }}>
              <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={GREEN}/><path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily:FONT, fontWeight:800, fontSize:12, color:GREEN_DK, letterSpacing:"0.09em" }}>LESSON COMPLETE</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:28, marginBottom:18 }}>
              <div style={{ fontFamily:FONT, fontWeight:900, fontSize:heroFs, color:INK, lineHeight:0.92 }}>Graphing<br/>Linear<br/>Functions</div>
              <div style={{ position:"relative", width:76, height:76, flexShrink:0 }}>
                <svg width="76" height="76" viewBox="0 0 76 76" style={{ position:"absolute", inset:0 }}>
                  {[[38,4,38,14],[38,62,38,72],[4,38,14,38],[62,38,72,38],[11,11,18,18],[58,58,65,65],[11,65,18,58],[65,11,58,18]].map(([x1,y1,x2,y2],i)=>(
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
                <ProgressPills filled={completeFilled} total={8} color={GREEN} />
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:FONT, fontSize:26, fontWeight:800, color:GREEN }}>30%</div>
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
      {idx === 9 || idx === 20 ? null : isLast ? (
        <div style={{ position:"fixed", bottom:0, left:0, right:isMobile?0:CHAT_W, zIndex:10, background:"#fff", borderTop:"1px solid #E2E8F0", padding:barPad, display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(59,91,219,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19V7a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke={ACCENT} strokeWidth="1.8"/><path d="M8 7v12M8 11h8" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontFamily:FONT, fontWeight:700, fontSize:15, color:INK, marginBottom:3 }}>Great work!</div>
              <div style={{ fontFamily:FONT, fontWeight:400, fontSize:14, color:"#475569" }}>You can now read coordinates and plot linear functions on a graph.</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 24px", background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:12, fontFamily:FONT, fontWeight:700, fontSize:14, color:GRAY, cursor:"pointer" }}>
              Back to lessons
            </button>
            <button onClick={() => { onComplete(); onClose(); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background:GREEN, border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(44,165,85,0.35)" }}>
              Next lesson
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      ) : (() => {
        const isMultiSlide = idx === 6;

        // ── Multi-select slide (idx 6) special handling ──
        if (isMultiSlide) {
          const correctSet = [0,3,5];
          if (!multiSubmitted) {
            const readyToCheck = multiPicked.length === 3;
            return (
              <div style={{ position:"fixed", bottom:0, left:0, right:isMobile?0:CHAT_W, zIndex:10, background:"#fff", borderTop:"1px solid #E2E8F0", padding:barPad, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <button onClick={() => { setPicked(null); setMultiPicked([]); setMultiSubmitted(false); setIdx(i => i-1); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 22px", background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:12, fontFamily:FONT, fontWeight:700, fontSize:14, color:INK, cursor:"pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  BACK
                </button>
                {readyToCheck ? (
                  <button onClick={() => { if (multiAllCorrect) playCorrect(); setMultiSubmitted(true); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background:ACCENT, border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>
                    CHECK ANSWERS
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                ) : (
                  <div style={{ fontFamily:FONT, fontSize:14, fontWeight:600, color:GRAY }}>Select 3 answers to continue</div>
                )}
              </div>
            );
          }
          return (
            <div style={{ position:"fixed", bottom:0, left:0, right:isMobile?0:CHAT_W, zIndex:10, padding:"18px 52px", display:"flex", alignItems:"center", justifyContent:"flex-end", gap:24, background: multiAllCorrect ? GREENBG : "#FDECEC", borderTop:`2px solid ${multiAllCorrect ? GREEN : RED}` }}>
              <button onClick={() => { setMultiPicked([]); setMultiSubmitted(false); setPicked(null); setIdx(i => i+1); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background: multiAllCorrect ? GREEN_DK : RED, border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", color:"#fff", cursor:"pointer", boxShadow:`0 4px 0 ${multiAllCorrect ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink:0 }}>
                CONTINUE
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          );
        }

        if (!isQuestionSlide || picked === null) {
          return (
            <div style={{ position:"fixed", bottom:0, left:0, right:isMobile?0:CHAT_W, zIndex:10, background:"#fff", borderTop:"1px solid #E2E8F0", padding:barPad, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              {!isFirst ? (
                <button onClick={() => { setPicked(null); setMultiPicked([]); setMultiSubmitted(false); setIdx(i => i-1); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 22px", background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:12, fontFamily:FONT, fontWeight:700, fontSize:14, color:INK, cursor:"pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L6 8l4 5" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  BACK
                </button>
              ) : <div/>}
              {isQuestionSlide ? (
                <div style={{ fontFamily:FONT, fontSize:14, fontWeight:600, color:GRAY }}>Pick an answer to continue</div>
              ) : (
                <button onClick={() => { setPicked(null); setMultiPicked([]); setMultiSubmitted(false); setIdx(i => i+1); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background:ACCENT, border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", color:"#fff", cursor:"pointer", boxShadow:"0 4px 0 rgba(59,91,219,0.35)" }}>
                  CONTINUE
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>
          );
        }

        const isCorrect = picked === CORRECT_BY_IDX[idx];
        const [explainCorrect, explainWrong] = EXPLAIN_DATA[idx] ?? ["",""];
        const CORRECT_LABELS = ["That's right.", "Well done.", "Spot on.", "Correct!"];
        const correctLabel = CORRECT_LABELS[idx % CORRECT_LABELS.length];

        const handleContinue = () => {
          if (isPractice) {
            const step = practiceStep;
            setPracticeResults(r => { const n=[...r]; n[step]=isCorrect; return n; });
          }
          setPicked(null);
          setMultiPicked([]);
          setMultiSubmitted(false);
          setIdx(i => i+1);
        };

        return (
          <div style={{ position:"fixed", bottom:0, left:0, right:isMobile?0:CHAT_W, zIndex:10, padding:isMobile?"12px 16px":"14px 52px", display:"flex", alignItems:"center", justifyContent:"flex-end", background: isCorrect ? GREENBG : "#FDECEC", borderTop:`2px solid ${isCorrect ? GREEN : RED}` }}>
            <button onClick={handleContinue} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background: isCorrect ? GREEN_DK : RED, border:"none", borderRadius:12, fontFamily:FONT, fontWeight:800, fontSize:14, letterSpacing:"0.05em", color:"#fff", cursor:"pointer", boxShadow:`0 4px 0 ${isCorrect ? "rgba(44,165,85,0.35)" : "rgba(239,90,90,0.35)"}`, flexShrink:0 }}>
              CONTINUE
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l3 3-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        );
      })()}

    </div>
    </>
  );
}
