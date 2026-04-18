"use client";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "idle" | "correct" | "wrong";

type IntroScreen    = { kind: "intro"; title: string; sub: string; bullets?: string[] };
type InfoScreen     = { kind: "info"; paragraphs: string[]; visual: number };
type MCScreen       = { kind: "mc"; context?: string; question: string; options: [string, string, string, string]; correct: number; explanation: string; visual: number };
type CompleteScreen = { kind: "complete" };
type Screen = IntroScreen | InfoScreen | MCScreen | CompleteScreen;

// ── Lesson content ────────────────────────────────────────────────────────────

const SCREENS: Screen[] = [
  {
    kind: "intro",
    title: "Linear Functions on the SAT",
    sub: "One of the most tested topics. You'll see them in:",
    bullets: ["Interpreting graphs", "Writing equations", "Real-world problems (money, speed, growth)"],
  },
  {
    kind: "mc",
    visual: 1,
    context: "A linear function describes something that changes at a constant rate.",
    question: 'What does "constant rate" mean?',
    options: ["It increases randomly", "It increases by the same amount each time", "It doubles each time", "It sometimes decreases"],
    correct: 1,
    explanation: "Constant rate means the value increases by the exact same amount every step — not randomly, not doubling. That fixed gap is what makes something linear.",
  },
  {
    kind: "mc",
    visual: 2,
    context: "A tutoring business earns $50 per student.",
    question: "How much does revenue increase with each student?",
    options: ["$25", "$50", "$75", "$100"],
    correct: 1,
    explanation: "Each new student adds exactly $50 — the gap is always the same. That fixed increase is what makes this relationship linear.",
  },
  {
    kind: "mc",
    visual: 3,
    context: "The business earns $50 per student.",
    question: "What is the revenue for 5 students?",
    options: ["$200", "$250", "$300", "$350"],
    correct: 1,
    explanation: "5 × $50 = $250. Multiply the rate by the number of students.",
  },
  {
    kind: "mc",
    visual: 4,
    context: "The business now adds a $100 starting fee.",
    question: "What stays the same as more students are added?",
    options: ["The starting value", "The increase per student", "The total revenue", "The number of students"],
    correct: 1,
    explanation: "The total changes and the starting fee is fixed — but the $50 increase per student never changes. That constant rate is what makes it linear.",
  },
  {
    kind: "mc",
    visual: 5,
    question: "What is the increase per student?",
    options: ["$25", "$50", "$75", "$100"],
    correct: 1,
    explanation: "From 3→6 students: Δx = 3. Revenue 250→400: Δy = $150. Rate = $150 ÷ 3 = $50 per student.",
  },
  {
    kind: "info",
    visual: 6,
    paragraphs: [
      "The value increases at a constant rate.",
      "This is what makes it a linear function — and why its graph is always a straight line.",
    ],
  },
  {
    kind: "info",
    visual: 7,
    paragraphs: ["Plug in the rate and starting value to model any linear situation."],
  },
  {
    kind: "mc",
    visual: 8,
    context: "A business earns $80 per sale and starts with $200.",
    question: "Which equation models total revenue y?",
    options: ["y = 80x + 200", "y = 200x + 80", "y = 80x", "y = 200 + x"],
    correct: 0,
    explanation: "m = 80 (rate per sale), b = 200 (starting value). Plugging into y = mx + b gives y = 80x + 200.",
  },
  {
    kind: "mc",
    visual: 9,
    context: "A line passes through (2, 300) and (5, 450).",
    question: "What is the slope (rate of change)?",
    options: ["25", "50", "75", "100"],
    correct: 1,
    explanation: "Slope = (450 − 300) ÷ (5 − 2) = 150 ÷ 3 = 50. Rise over run.",
  },
  { kind: "complete" },
];

const CONTENT_COUNT = SCREENS.filter(s => s.kind !== "intro" && s.kind !== "complete").length;

// ── Table helper ──────────────────────────────────────────────────────────────

function TableVis({
  headers,
  rows,
}: {
  headers: string[];
  rows: { cells: string[]; isHighlight?: boolean }[];
}) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", fontSize: 13, minWidth: 190 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((h, i) => (
          <div
            key={i}
            style={{
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              borderRight: i < headers.length - 1 ? "1px solid #e2e8f0" : undefined,
              padding: "8px 16px",
              fontWeight: 600,
              color: "#64748b",
              textAlign: "center",
            }}
          >
            {h}
          </div>
        ))}
        {rows.map((row, ri) =>
          row.cells.map((cell, ci) => (
            <div
              key={`${ri}-${ci}`}
              style={{
                background: row.isHighlight ? "#f0fdf4" : "white",
                color: row.isHighlight ? "#15803d" : ci > 0 ? "#15803d" : "#334155",
                fontWeight: row.isHighlight ? 700 : ci > 0 ? 600 : 500,
                borderBottom: ri < rows.length - 1 ? "1px solid #f1f5f9" : undefined,
                borderRight: ci < row.cells.length - 1 ? "1px solid #f1f5f9" : undefined,
                padding: "9px 16px",
                textAlign: "center",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Illustrations ─────────────────────────────────────────────────────────────

// Visual 0: intro — rising line graph (used hardcoded in intro render)
function Visual0() {
  return (
    <svg width="220" height="120" viewBox="0 0 220 120" fill="none">
      {[20,55,90,125,160].map(x => <line key={x} x1={x} y1="8" x2={x} y2="100" stroke="#f1f5f9" strokeWidth="1"/>)}
      {[20,45,70,95].map(y => <line key={y} x1="15" y1={y} x2="185" y2={y} stroke="#f1f5f9" strokeWidth="1"/>)}
      <line x1="15" y1="100" x2="185" y2="100" stroke="#cbd5e1" strokeWidth="1.5"/>
      <line x1="15" y1="8" x2="15" y2="100" stroke="#cbd5e1" strokeWidth="1.5"/>
      <line x1="20" y1="95" x2="175" y2="18" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
      {([[20,95],[62,72],[105,50],[148,27]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="#22c55e" strokeWidth="2.5"/>
      ))}
    </svg>
  );
}

// Visual 1: constant (+2) vs non-constant (×2) sequences
function Visual1() {
  const bw = 34, gap = 14;
  const total = 4 * bw + 3 * gap;
  const sx = (220 - total) / 2;
  const gapCenters = [0,1,2].map(i => sx + i * (bw + gap) + bw + gap / 2);

  const rows = [
    { nums: [1,3,5,7], diffs: ["+2","+2","+2"], fill:"#dcfce7", stroke:"#22c55e", tc:"#166534", dc:"#22c55e", label:"Constant", baseY: 18 },
    { nums: [1,2,4,8], diffs: ["+1","+2","+4"], fill:"#fff7ed", stroke:"#f97316", tc:"#9a3412", dc:"#f97316", label:"Not constant", baseY: 72 },
  ];

  return (
    <svg width="220" height="108" viewBox="0 0 220 108" fill="none">
      {rows.map((row) => (
        <g key={row.label}>
          <text x="110" y={row.baseY - 6} fill={row.dc} fontSize="9" fontWeight="bold" textAnchor="middle">{row.label}</text>
          {row.nums.map((n, i) => {
            const x = sx + i * (bw + gap);
            return (
              <g key={i}>
                <rect x={x} y={row.baseY} width={bw} height={28} rx="7" fill={row.fill} stroke={row.stroke} strokeWidth="1.5"/>
                <text x={x + bw/2} y={row.baseY + 19} fill={row.tc} fontSize="12" fontWeight="bold" textAnchor="middle">{n}</text>
              </g>
            );
          })}
          {gapCenters.map((cx, i) => (
            <text key={i} x={cx} y={row.baseY + 19} fill={row.dc} fontSize="9" fontWeight="bold" textAnchor="middle">{row.diffs[i]}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

// Visual 2: revenue table for 1–3 students
function Visual2() {
  return (
    <TableVis
      headers={["Students", "Revenue"]}
      rows={[
        { cells: ["1", "$50"] },
        { cells: ["2", "$100"] },
        { cells: ["3", "$150"] },
      ]}
    />
  );
}

// Visual 3: revenue table with unknown row for 5 students
function Visual3() {
  return (
    <TableVis
      headers={["Students", "Revenue"]}
      rows={[
        { cells: ["1", "$50"] },
        { cells: ["2", "$100"] },
        { cells: ["3", "$150"] },
        { cells: ["5", "?"], isHighlight: true },
      ]}
    />
  );
}

// Visual 4: table with $100 starting fee
function Visual4() {
  return (
    <TableVis
      headers={["Students", "Revenue"]}
      rows={[
        { cells: ["0", "$100"] },
        { cells: ["1", "$150"] },
        { cells: ["2", "$200"] },
      ]}
    />
  );
}

// Visual 5: two data points — rate calculation
function Visual5() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <TableVis
        headers={["Students", "Revenue"]}
        rows={[
          { cells: ["3", "$250"] },
          { cells: ["6", "$400"] },
        ]}
      />
      <div style={{ display: "flex", gap: 24, fontSize: 11, fontWeight: 700 }}>
        <span style={{ color: "#4e7efe" }}>+3 students</span>
        <span style={{ color: "#22c55e" }}>+$150 revenue</span>
      </div>
    </div>
  );
}

// Visual 6: straight line graph
function Visual6() {
  return (
    <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
      {[0,1,2,3].map(i => <line key={i} x1="20" y1={15+i*25} x2="200" y2={15+i*25} stroke="#f1f5f9" strokeWidth="1"/>)}
      {[0,1,2,3].map(i => <line key={i} x1={30+i*45} y1="10" x2={30+i*45} y2="100" stroke="#f1f5f9" strokeWidth="1"/>)}
      <line x1="20" y1="100" x2="200" y2="100" stroke="#cbd5e1" strokeWidth="1.5"/>
      <line x1="20" y1="10" x2="20" y2="100" stroke="#cbd5e1" strokeWidth="1.5"/>
      <line x1="25" y1="92" x2="195" y2="18" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
      {([[25,92],[82,68],[138,44],[192,20]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="#22c55e" strokeWidth="2.5"/>
      ))}
    </svg>
  );
}

// Visual 7: y = mx + b breakdown
function Visual7() {
  const parts = [
    { sym: "m", label: "rate of change", color: "#4e7efe" },
    { sym: "b", label: "starting value",  color: "#22c55e" },
    { sym: "x", label: "input",           color: "#f97316" },
    { sym: "y", label: "output",          color: "#a855f7" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", width: "100%" }}>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "monospace", color: "#0f172a", letterSpacing: 2 }}>
        y = mx + b
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: 260 }}>
        {parts.map(({ sym, label, color }) => (
          <div
            key={sym}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 10,
              background: `${color}18`,
              border: `1px solid ${color}40`,
            }}
          >
            <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 18, color }}>{sym}</span>
            <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Visual 8: identify m and b from word problem
function Visual8() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "14px 18px",
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        minWidth: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 22, color: "#4e7efe" }}>m</span>
        <span style={{ color: "#64748b", fontSize: 13 }}>= $80 per sale</span>
      </div>
      <div style={{ height: 1, background: "#e2e8f0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 22, color: "#22c55e" }}>b</span>
        <span style={{ color: "#64748b", fontSize: 13 }}>= $200 starting value</span>
      </div>
    </div>
  );
}

// Visual 9: two coordinate points
function Visual9() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Points on the line</div>
      <TableVis
        headers={["x", "y"]}
        rows={[
          { cells: ["2", "300"] },
          { cells: ["5", "450"] },
        ]}
      />
    </div>
  );
}

const VISUALS = [Visual0, Visual1, Visual2, Visual3, Visual4, Visual5, Visual6, Visual7, Visual8, Visual9];

// ── Small icons ───────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SmallCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({ step, total, onClose }: { step: number; total: number; onClose: () => void }) {
  const pct = total > 0 ? Math.round((step / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 px-4 h-14 shrink-0">
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors shrink-0">
        <XIcon />
      </button>
      <div className="flex-1 h-[6px] rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#22c55e" }}
        />
      </div>
    </div>
  );
}

// ── Option button ─────────────────────────────────────────────────────────────

function OptionBtn({
  label,
  onClick,
  state,
}: {
  label: string;
  onClick: () => void;
  state: "idle" | "selected" | "correct" | "wrong";
}) {
  if (state === "correct") {
    return (
      <button
        disabled
        className="w-full min-h-[52px] rounded-xl flex items-center gap-3 px-4 text-sm font-medium text-left"
        style={{ background: "#f0fdf4", border: "2px solid #22c55e", color: "#166534" }}
      >
        <span className="flex-1">{label}</span>
        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#22c55e" }}>
          <SmallCheck />
        </span>
      </button>
    );
  }
  if (state === "wrong") {
    return (
      <button
        disabled
        className="w-full min-h-[52px] rounded-xl flex items-center px-4 text-sm font-medium text-left"
        style={{ background: "#fff1f2", border: "2px solid #ef4444", color: "#991b1b" }}
      >
        {label}
      </button>
    );
  }
  if (state === "selected") {
    return (
      <button
        onClick={onClick}
        className="w-full min-h-[52px] rounded-xl flex items-center px-4 text-sm font-medium text-left transition-all"
        style={{ background: "white", border: "2px solid #2563eb", color: "#1d4ed8" }}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="w-full min-h-[52px] rounded-xl flex items-center px-4 text-sm font-medium text-left transition-all active:scale-[0.99] hover:border-slate-300 hover:bg-slate-50"
      style={{ background: "white", border: "1px solid #e2e8f0", color: "#1e293b" }}
    >
      {label}
    </button>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

export default function AiTutorPanel({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [idx, setIdx]           = useState(0);
  const [phase, setPhase]       = useState<Phase>("idle");
  const [selected, setSelected] = useState<number | null>(null);
  const [showWhy, setShowWhy]   = useState(false);

  const screen = SCREENS[idx];
  const contentStep = SCREENS.slice(0, idx).filter(s => s.kind !== "intro").length;

  function advance() {
    setIdx(i => i + 1);
    setPhase("idle");
    setSelected(null);
    setShowWhy(false);
  }

  function handleCheck() {
    if (screen.kind !== "mc" || selected === null || phase !== "idle") return;
    setPhase(selected === screen.correct ? "correct" : "wrong");
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (screen.kind === "intro") {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col">
        <div className="flex items-center px-4 h-14 shrink-0">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
            <XIcon />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <Visual0 />
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-2">{screen.title}</h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-4">{screen.sub}</p>
            {screen.bullets && (
              <ul className="text-sm text-slate-600 text-left space-y-2 max-w-xs mx-auto">
                {screen.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#f0fdf4", border: "1.5px solid #22c55e" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="px-4 pb-6 shrink-0">
          <button
            onClick={advance}
            className="w-full h-[52px] rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all"
          >
            Start lesson
          </button>
        </div>
      </div>
    );
  }

  // ── Complete ─────────────────────────────────────────────────────────────
  if (screen.kind === "complete") {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col">
        <div className="flex items-center px-4 h-14 shrink-0">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
            <XIcon />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#f0fdf4" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 18l7 7 13-13" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-[22px] font-bold text-slate-900 mb-2">Lesson complete!</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              You can now identify, build, and apply linear functions on the SAT.
            </p>
          </div>
        </div>
        <div className="px-4 pb-6 shrink-0">
          <button
            onClick={() => { onComplete?.(); onClose(); }}
            className="w-full h-[52px] rounded-2xl text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all"
            style={{ background: "#22c55e" }}
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  // ── Info screen ──────────────────────────────────────────────────────────
  if (screen.kind === "info") {
    const Vis = VISUALS[screen.visual];
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col">
        <TopBar step={contentStep} total={CONTENT_COUNT} onClose={onClose} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="flex justify-center"><Vis /></div>
          <div className="space-y-3">
            {screen.paragraphs.map((p, i) => (
              <p key={i} className="text-[16px] text-slate-700 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
        <div className="px-4 pb-6 shrink-0">
          <button
            onClick={advance}
            className="w-full h-[52px] rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ── MC screen ────────────────────────────────────────────────────────────
  const canCheck = selected !== null && phase === "idle";
  const isCorrect = phase === "correct";
  const longOptions = screen.options.some(o => o.length > 18);
  const Vis = VISUALS[screen.visual];

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      <TopBar step={contentStep} total={CONTENT_COUNT} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-2 flex flex-col gap-3">
        <div className="flex justify-center py-2">
          <Vis />
        </div>

        {screen.context && (
          <p className="text-sm text-slate-400 leading-relaxed">{screen.context}</p>
        )}
        <p className="text-[17px] font-bold text-slate-900 leading-snug">{screen.question}</p>

        <div className={`grid gap-2.5 ${longOptions ? "grid-cols-1" : "grid-cols-2"}`}>
          {screen.options.map((opt, i) => {
            let state: "idle" | "selected" | "correct" | "wrong" = "idle";
            if (phase !== "idle") {
              if (i === screen.correct) state = "correct";
              else if (i === selected) state = "wrong";
            } else if (i === selected) {
              state = "selected";
            }
            return (
              <OptionBtn
                key={i}
                label={opt}
                onClick={() => { if (phase === "idle") setSelected(i); }}
                state={state}
              />
            );
          })}
        </div>
      </div>

      {phase === "idle" && (
        <div className="px-4 pb-6 pt-2 shrink-0">
          <button
            onClick={handleCheck}
            disabled={!canCheck}
            className="w-full h-[52px] rounded-2xl font-semibold text-sm transition-all active:scale-[0.99]"
            style={{
              background: canCheck ? "#1e293b" : "#f1f5f9",
              color: canCheck ? "#ffffff" : "#94a3b8",
            }}
          >
            Check
          </button>
        </div>
      )}

      {phase !== "idle" && (
        <div
          className="px-4 pb-6 pt-4 shrink-0"
          style={{ background: isCorrect ? "#f0fdf4" : "#fff1f2" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: isCorrect ? "#15803d" : "#b91c1c" }}>
              {isCorrect ? "Correct!" : "Not quite."}
            </span>
            <button
              onClick={() => setShowWhy(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                border: `1px solid ${isCorrect ? "#86efac" : "#fca5a5"}`,
                color: isCorrect ? "#15803d" : "#b91c1c",
                background: "transparent",
              }}
            >
              Why?
            </button>
          </div>
          <button
            onClick={advance}
            className="w-full h-[48px] rounded-2xl text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all"
            style={{ background: "#22c55e" }}
          >
            Continue
          </button>
        </div>
      )}

      {showWhy && (
        <div
          className="fixed inset-0 z-[210] flex items-end"
          style={{ background: "rgba(0,0,0,0.25)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowWhy(false); }}
        >
          <div className="w-full bg-white rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Explanation</h3>
              <button onClick={() => setShowWhy(false)} className="text-slate-400 hover:text-slate-600">
                <XIcon />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{screen.explanation}</p>
            <button
              onClick={advance}
              className="w-full mt-5 h-[48px] rounded-2xl text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all"
              style={{ background: "#22c55e" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
