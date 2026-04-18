"use client";
import { useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────

const PAL = {
  cream:    "#FFF7E4",
  paper:    "#FFEAB8",
  ink:      "#1F2544",
  inkSoft:  "#5A6088",
  green:    "#38C76B",
  greenDk:  "#2CA555",
  blue:     "#2DADE8",
  orange:   "#FF8A3D",
  orangeDk: "#DB6D22",
  purple:   "#A86CE4",
  red:      "#EF5A5A",
  yellow:   "#FFD23F",
};

const FONT  = '"Nunito", var(--font-nunito), system-ui, sans-serif';
const MONO  = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';

// ── Types ─────────────────────────────────────────────────────────────────────

type IntroSlide    = { kind: "intro" };
type TeachSlide    = { kind: "teach"; tag: string; tagColor?: string; headline: React.ReactNode; visual?: React.ReactNode; body?: React.ReactNode };
type ABSlide       = { kind: "ab"; tag: string; tagColor?: string; headline: string; visual?: React.ReactNode; optionA: string; optionB: string; correct: "A" | "B"; explain: string };
type RecapSlide    = { kind: "recap" };
type CompleteSlide = { kind: "complete" };
type Slide = IntroSlide | TeachSlide | ABSlide | RecapSlide | CompleteSlide;

// ── Visuals ───────────────────────────────────────────────────────────────────

function MiniTable({ headers, rows, highlightCol, highlightColor = PAL.green }: {
  headers: string[];
  rows: string[][];
  highlightCol?: number;
  highlightColor?: string;
}) {
  const cols = headers.length;
  return (
    <div style={{
      background: "#fff", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 4px 0 rgba(31,37,68,0.06), 0 1px 3px rgba(31,37,68,0.05)",
      fontFamily: MONO, fontSize: 15,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, background: PAL.ink }}>
        {headers.map((h, i) => (
          <div key={i} style={{ padding: "10px 10px", fontWeight: 700, color: i === highlightCol ? highlightColor : "#fff" }}>{h}</div>
        ))}
      </div>
      {rows.map((row, r) => (
        <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, borderTop: r === 0 ? "none" : `1px solid #F2ECD5` }}>
          {row.map((cell, c) => (
            <div key={c} style={{ padding: "10px 10px", fontWeight: c === highlightCol ? 700 : 500, color: c === highlightCol ? highlightColor : PAL.ink }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PlotVisual() {
  const pts: [number, number][] = [[0,0],[1,20],[2,40],[3,60],[4,80]];
  const pad = 28, W = 300, H = 180;
  const xs = (x: number) => pad + (x / 4) * (W - pad - 14);
  const ys = (y: number) => H - pad - (y / 80) * (H - pad - 14);
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 14, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0,1,2,3,4].map(x => <line key={`v${x}`} x1={xs(x)} y1={10} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>)}
        {[0,20,40,60,80].map(y => <line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-14} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>)}
        <line x1={pad} y1={H-pad} x2={W-14} y2={H-pad} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={pad} y1={10} x2={pad} y2={H-pad} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={xs(0)} y1={ys(0)} x2={xs(4)} y2={ys(80)} stroke={PAL.green} strokeWidth="4" strokeLinecap="round"/>
        {pts.map(([x,y], i) => (
          <circle key={i} cx={xs(x)} cy={ys(y)} r="6" fill={PAL.green} stroke="#fff" strokeWidth="2.5"/>
        ))}
      </svg>
    </div>
  );
}

function LineVsCurveSVG() {
  const graphs = [
    { label: "A", color: PAL.blue,   path: "M 10 110 L 140 20" },
    { label: "B", color: PAL.purple, path: "M 10 110 Q 75 110 75 65 T 140 20" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {graphs.map((g) => (
        <div key={g.label} style={{ background: "#fff", borderRadius: 18, padding: 12, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
          <svg width="100%" height={130} viewBox="0 0 150 130">
            {[30,60,90].map((v, k) => <line key={`h${k}`} x1={10} y1={v} x2={140} y2={v} stroke="#F0E9D1" strokeWidth="1"/>)}
            {[40,70,100].map((v, k) => <line key={`v${k}`} x1={v} y1={10} x2={v} y2={120} stroke="#F0E9D1" strokeWidth="1"/>)}
            <line x1={10} y1={120} x2={140} y2={120} stroke={PAL.ink} strokeWidth="1.5"/>
            <line x1={10} y1={10} x2={10} y2={120} stroke={PAL.ink} strokeWidth="1.5"/>
            <path d={g.path} stroke={g.color} strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 900, color: PAL.ink, textAlign: "center", marginTop: 4 }}>{g.label}</div>
        </div>
      ))}
    </div>
  );
}

function FormulaCard() {
  return (
    <div>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "32px 20px",
        textAlign: "center", boxShadow: "0 6px 0 rgba(31,37,68,0.08)",
        fontFamily: MONO, fontSize: 48, fontWeight: 500, color: PAL.ink,
        letterSpacing: "-0.01em", marginBottom: 20,
      }}>
        y = <span style={{ color: PAL.orange, fontWeight: 700 }}>m</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>b</span>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, background: PAL.orange, color: "#fff", borderRadius: 18, padding: "14px 16px" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700 }}>m</div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>rate of change</div>
        </div>
        <div style={{ flex: 1, background: PAL.purple, color: "#fff", borderRadius: 18, padding: "14px 16px" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700 }}>b</div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>starting value</div>
        </div>
      </div>
    </div>
  );
}

function TaxiCard() {
  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "18px 18px 16px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)", marginBottom: 14 }}>
        <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: PAL.inkSoft, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>The ride</div>
        <div style={{ fontFamily: FONT, fontSize: 15, color: PAL.ink, lineHeight: 1.5 }}>
          Taxi charges <b>$5</b> the second you sit down, then <b>$2</b> for every mile.
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "18px 18px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)", fontFamily: MONO, fontSize: 30, fontWeight: 500, color: PAL.ink, textAlign: "center", letterSpacing: "-0.01em", marginBottom: 12 }}>
        Cost = <span style={{ color: PAL.orange, fontWeight: 700 }}>2</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>5</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: PAL.orange, color: "#fff", borderRadius: 16, padding: "12px 14px" }}>
          <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700 }}>m = 2</div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, marginTop: 2, lineHeight: 1.25 }}>$2 added each mile</div>
        </div>
        <div style={{ flex: 1, background: PAL.purple, color: "#fff", borderRadius: 16, padding: "12px 14px" }}>
          <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700 }}>b = 5</div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, marginTop: 2, lineHeight: 1.25 }}>$5 before moving</div>
        </div>
      </div>
    </div>
  );
}

function EquationCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "24px 20px", textAlign: "center",
      boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
      fontFamily: MONO, fontSize: 40, fontWeight: 500, color: PAL.ink,
    }}>
      {children}
    </div>
  );
}

// ── Primitive UI ──────────────────────────────────────────────────────────────

function Tag({ children, color = PAL.orangeDk }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Headline({ children, size = 34 }: { children: React.ReactNode; size?: number }) {
  return (
    <h1 style={{ fontFamily: FONT, fontSize: size, fontWeight: 900, color: PAL.ink, lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0 }}>
      {children}
    </h1>
  );
}

function BodyText({ children, size = 17 }: { children: React.ReactNode; size?: number }) {
  return (
    <p style={{ fontFamily: FONT, fontSize: size, fontWeight: 500, color: PAL.inkSoft, lineHeight: 1.45, margin: 0 }}>
      {children}
    </p>
  );
}

function CTAButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        margin: "0 20px 28px", padding: "20px 0", borderRadius: 22,
        background: disabled ? "rgba(31,37,68,0.25)" : PAL.ink,
        color: "#fff", fontFamily: FONT, fontSize: 19, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.01em",
        cursor: disabled ? "default" : "pointer",
        boxShadow: disabled ? "none" : "0 6px 0 rgba(0,0,0,0.18)",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
}

function CloseX({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path d="M4 4l12 12M16 4L4 16" stroke={PAL.inkSoft} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function SegmentedProgress({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, flex: 1, marginLeft: 12 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 6, borderRadius: 3,
          background: i < step ? PAL.ink : "rgba(31,37,68,0.12)",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

function TopBar({ step, total, onClose }: { step: number; total: number; onClose: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "68px 20px 6px" }}>
      <CloseX onClick={onClose} />
      <SegmentedProgress step={step} total={total} />
    </div>
  );
}

type OptionState = "idle" | "selected" | "correct" | "wrong" | "dim";

function OptionRow({ letter, label, state, onClick }: {
  letter: string; label: string; state: OptionState; onClick?: () => void;
}) {
  const styles: Record<OptionState, { bg: string; border: string; text: string; letterBg: string; letterText: string }> = {
    idle:     { bg: "#fff",    border: "rgba(31,37,68,0.15)", text: PAL.ink,      letterBg: PAL.paper,  letterText: PAL.ink },
    selected: { bg: "#fff",    border: PAL.ink,               text: PAL.ink,      letterBg: PAL.ink,    letterText: "#fff"  },
    correct:  { bg: "#E7F8EC", border: PAL.green,             text: PAL.greenDk,  letterBg: PAL.green,  letterText: "#fff"  },
    wrong:    { bg: "#FDECEC", border: PAL.red,               text: "#B8342E",    letterBg: PAL.red,    letterText: "#fff"  },
    dim:      { bg: "#fff",    border: "rgba(31,37,68,0.1)",  text: "rgba(31,37,68,0.35)", letterBg: "rgba(31,37,68,0.06)", letterText: "rgba(31,37,68,0.4)" },
  };
  const s = styles[state];
  return (
    <div
      onClick={state === "idle" || state === "selected" ? onClick : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "18px 18px", borderRadius: 20,
        background: s.bg, border: `2px solid ${s.border}`,
        cursor: state === "idle" || state === "selected" ? "pointer" : "default",
        transition: "all 0.2s",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 12,
        background: s.letterBg, color: s.letterText,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, fontSize: 18, fontWeight: 900, flexShrink: 0,
      }}>{letter}</div>
      <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: s.text, lineHeight: 1.3, flex: 1 }}>{label}</div>
      {state === "correct" && (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill={PAL.green}/>
          <path d="M6.5 12.5l3.5 3.5 7.5-7.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {state === "wrong" && (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill={PAL.red}/>
          <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

function FeedbackBanner({ correct, text, correctLabel, onContinue }: {
  correct: boolean; text: string; correctLabel?: string; onContinue: () => void;
}) {
  const bg = correct ? PAL.green : PAL.red;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      background: bg, padding: "20px 20px 34px",
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, fontFamily: FONT, fontSize: 22, fontWeight: 900, color: "#fff" }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          {correct
            ? <path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M7 7l10 10M17 7l-10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>}
        </svg>
        {correct ? "Nice." : "Not quite."}
      </div>
      {!correct && correctLabel && (
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>
          Correct answer: {correctLabel}
        </div>
      )}
      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 18, opacity: 0.95 }}>{text}</div>
      <div onClick={onContinue} style={{
        padding: "15px 0", borderRadius: 18, background: "#fff", color: bg,
        fontFamily: FONT, fontSize: 18, fontWeight: 900,
        textAlign: "center", cursor: "pointer", userSelect: "none",
      }}>Continue</div>
    </div>
  );
}

// ── Device frame ──────────────────────────────────────────────────────────────

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,20,0.75)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: "min(360px, 86vw, calc(78svh * 0.46))",
        height: "min(780px, 78svh, calc(86vw * 2.175))",
        borderRadius: 48, overflow: "hidden",
        position: "relative", background: PAL.cream,
        boxShadow: "0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Dynamic Island */}
        <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 126, height: 37, borderRadius: 24, background: "#000", zIndex: 50, pointerEvents: "none" }} />
        {/* Status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "21px 28px 0", pointerEvents: "none" }}>
          <span style={{ fontFamily: "-apple-system, system-ui", fontWeight: 600, fontSize: 15, color: PAL.ink }}>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill={PAL.ink}>
              <rect x="0" y="7" width="3" height="5" rx="0.7"/>
              <rect x="4.7" y="4.5" width="3" height="7.5" rx="0.7"/>
              <rect x="9.4" y="2" width="3" height="10" rx="0.7"/>
              <rect x="14.1" y="0" width="3" height="12" rx="0.7"/>
            </svg>
            <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
              <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke={PAL.ink} strokeOpacity="0.35"/>
              <rect x="2" y="2" width="18" height="9" rx="2" fill={PAL.ink}/>
              <path d="M24 4.5V8.5C24.8 8.2 25.5 7.2 25.5 6.5C25.5 5.8 24.8 4.8 24 4.5Z" fill={PAL.ink} fillOpacity="0.4"/>
            </svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 60, height: 34, display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 8, pointerEvents: "none" }}>
          <div style={{ width: 139, height: 5, borderRadius: 100, background: "rgba(0,0,0,0.25)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Slide content ─────────────────────────────────────────────────────────────

const TOTAL = 13; // progress steps (slides 1–13, intro + done excluded)

const SLIDES: Slide[] = [
  { kind: "intro" },

  {
    kind: "teach", tag: "01 · What is linear?",
    headline: <>Linear functions show a <span style={{ color: PAL.green }}>constant rate of change</span>.</>,
    visual: <MiniTable headers={["Week","Savings","Gap"]} rows={[["0","$0","—"],["1","$20","+$20"],["2","$40","+$20"],["3","$60","+$20"],["4","$80","+$20"]]} highlightCol={2} highlightColor={PAL.green}/>,
    body: <BodyText>In this table, savings increase by $20 each week. Because <b style={{ color: PAL.ink }}>the change is the same each time</b>, this is linear.</BodyText>,
  },

  {
    kind: "ab", tag: "01 · What is linear?",
    headline: "Is this table linear?",
    visual: <MiniTable headers={["x","y","Gap"]} rows={[["0","5","—"],["1","15","+10"],["2","30","+15"],["3","50","+20"]]} highlightCol={2} highlightColor={PAL.red}/>,
    optionA: "Yes — the change is the same each step",
    optionB: "No — the change is different each step",
    correct: "B",
    explain: "Values going up isn't enough. The gap has to be the same every row.",
  },

  {
    kind: "teach", tag: "02 · On the number plane",
    headline: <>Linear functions make a <span style={{ color: PAL.green }}>straight line</span>.</>,
    visual: <PlotVisual />,
    body: <BodyText>When the rate of change is constant (e.g. +20 each step), the graph forms a straight line — this is a linear function.</BodyText>,
  },

  {
    kind: "ab", tag: "02 · On the number plane",
    headline: "Which graph is linear?",
    visual: <LineVsCurveSVG />,
    optionA: "A — the straight line",
    optionB: "B — the curved line",
    correct: "A",
    explain: "Linear always means straight. Curves and bends mean something else is going on.",
  },

  {
    kind: "teach", tag: "03 · The formula",
    headline: "That straight line has an equation.",
    visual: <FormulaCard />,
    body: <BodyText><b style={{ color: PAL.orange }}>m</b> shows the rate of change. <b style={{ color: PAL.purple }}>b</b> shows the starting value.</BodyText>,
  },

  {
    kind: "teach", tag: "03 · The formula",
    headline: <>Real life: a <span style={{ color: PAL.orange }}>taxi ride</span>.</>,
    visual: <TaxiCard />,
    body: <BodyText>Upfront fee = <b style={{ color: PAL.purple }}>b</b>. Price per mile = <b style={{ color: PAL.orange }}>m</b>. That&apos;s it.</BodyText>,
  },

  {
    kind: "ab", tag: "03 · The formula",
    headline: "In y = 3x + 7, which number is the rate of change?",
    visual: <EquationCard>y = <span style={{ color: PAL.orange, fontWeight: 700 }}>3</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>7</span></EquationCard>,
    optionA: "3",
    optionB: "7",
    correct: "A",
    explain: "m is always the number next to x. It's the rate of change — how much y changes per step.",
  },

  {
    kind: "ab", tag: "03 · The formula",
    headline: "In y = 3x + 7, which number is the starting value?",
    visual: <EquationCard>y = <span style={{ color: PAL.orange, fontWeight: 700 }}>3</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>7</span></EquationCard>,
    optionA: "3",
    optionB: "7",
    correct: "B",
    explain: "b is the number on its own — no x attached. It's where y starts when x = 0.",
  },

  {
    kind: "ab", tag: "03 · The formula",
    headline: "A plumber charges $75 to show up, then $40/hr. What's b in C = 40h + 75?",
    visual: (
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", textAlign: "center", boxShadow: "0 4px 0 rgba(31,37,68,0.06)", fontFamily: MONO, fontSize: 34, fontWeight: 500, color: PAL.ink }}>
        C = <span style={{ color: PAL.orange, fontWeight: 700 }}>40</span>h + <span style={{ color: PAL.purple, fontWeight: 700 }}>75</span>
        <div style={{ fontSize: 13, color: PAL.inkSoft, marginTop: 10, fontFamily: FONT, fontWeight: 600 }}>
          <span style={{ color: PAL.orange }}>m = 40</span> &nbsp;·&nbsp; <span style={{ color: PAL.purple }}>b = ?</span>
        </div>
      </div>
    ),
    optionA: "$40",
    optionB: "$75",
    correct: "B",
    explain: "b is what you owe before any hours pass. At h = 0, cost = $75.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A gym charges $60 to join, then $25/month. Which equation is correct?",
    optionA: "C = 60m + 25",
    optionB: "C = 25m + 60",
    correct: "B",
    explain: "m = $25 (changes every month). b = $60 (what you pay upfront). Don't flip them.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A phone plan costs $30/month plus a $50 activation fee. Which equation shows total cost C after m months?",
    optionA: "C = 50m + 30",
    optionB: "C = 30m + 50",
    correct: "B",
    explain: "The rate of change is $30 per month → sits next to m. The starting value is $50 (paid before any month passes) → that's b.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A pool is being filled: W = 4t + 12. Which statement is true?",
    visual: <EquationCard>W = <span style={{ color: PAL.orange, fontWeight: 700 }}>4</span>t + <span style={{ color: PAL.purple, fontWeight: 700 }}>12</span></EquationCard>,
    optionA: "Pool starts at 4 inches, rises 12 in/min",
    optionB: "Pool starts at 12 inches, rises 4 in/min",
    correct: "B",
    explain: "b = 12 is the starting value (water at t = 0). m = 4 is the rate — water rises 4 inches every minute.",
  },

  { kind: "recap" },
  { kind: "complete" },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function InteractiveLesson({ onClose, onComplete }: { onClose: () => void; onComplete?: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const slide = SLIDES[idx];
  // Progress step: intro=0, teach/ab slides 1–11 = their 1-based index
  const step = idx === 0 ? 0 : Math.min(idx, TOTAL);

  function advance() {
    setIdx(i => i + 1);
    setPicked(null);
    setSubmitted(false);
  }

  function handlePick(choice: "A" | "B") {
    if (submitted) return;
    setPicked(choice);
    setSubmitted(true);
  }

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (slide.kind === "intro") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ padding: "20px 24px 0", position: "relative", zIndex: 2 }}>
            <Tag>SAT Math · Lesson 01</Tag>
            <Headline size={42}>Linear Functions, from zero.</Headline>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, display: "flex", flexDirection: "column" }}>
            {/* Background circles */}
            <div style={{ position: "absolute", right: "6%",  top: "8%",  width: "40%", aspectRatio: "1", borderRadius: "50%", background: PAL.yellow }} />
            <div style={{ position: "absolute", left: "8%",  top: "28%", width: "27%", aspectRatio: "1", borderRadius: "50%", background: "#BEE7F7" }} />
            <div style={{ position: "absolute", left: "38%", top: "50%", width: "17%", aspectRatio: "1", borderRadius: "50%", background: PAL.green }} />
            {/* Pills — in normal flow so overflow:hidden always clips them */}
            <div style={{ marginTop: "auto", padding: "0 12% 24%", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.blue, color: "#fff", fontFamily: MONO, fontSize: "clamp(14px, 4.5vw, 20px)", fontWeight: 500, padding: "10px 18px", borderRadius: 9999 }}>y = mx + b</span>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.purple, color: "#fff", fontFamily: FONT, fontSize: "clamp(14px, 4.5vw, 20px)", fontWeight: 800, padding: "10px 18px", borderRadius: 9999, alignSelf: "flex-end" }}>made easy</span>
            </div>
          </div>
          <CTAButton onClick={advance}>Start lesson</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  // ── Recap ───────────────────────────────────────────────────────────────────
  if (slide.kind === "recap") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 0" }}>
            <Tag color={PAL.blue}>Key concepts recap</Tag>
            <Headline size={28}>A linear function in one sentence.</Headline>
            <div style={{ marginTop: 16, background: PAL.green, borderRadius: 24, padding: "20px 20px", boxShadow: `0 6px 0 ${PAL.greenDk}`, color: "#fff", fontFamily: FONT, fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
              A function is linear when it changes by the same amount each step — that&apos;s <b>m</b>. Its equation is y = mx + b, where <b>b</b> is the starting value.
            </div>
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 20, padding: "18px 20px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)", textAlign: "center" }}>
              <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 500, color: PAL.ink }}>
                y = <span style={{ color: PAL.orange, fontWeight: 700 }}>m</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>b</span>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
                <span style={{ background: `${PAL.orange}22`, color: PAL.orange, fontFamily: FONT, fontSize: 13, fontWeight: 800, padding: "5px 14px", borderRadius: 9999 }}>m = rate of change</span>
                <span style={{ background: `${PAL.purple}22`, color: PAL.purple, fontFamily: FONT, fontSize: 13, fontWeight: 800, padding: "5px 14px", borderRadius: 9999 }}>b = starting value</span>
              </div>
            </div>
            <div style={{ marginTop: 20, fontFamily: FONT, fontSize: 15, fontWeight: 800, color: PAL.ink }}>How to spot one on the SAT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {[
                "In a table: the gap between values is constant.",
                "On a graph: the points form a straight line.",
                "In a word problem: a fixed starting value + a fixed rate per unit.",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 0 rgba(31,37,68,0.05)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: PAL.orange, flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: PAL.ink, lineHeight: 1.5 }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
          <CTAButton onClick={advance}>Finish lesson</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  // ── Complete ────────────────────────────────────────────────────────────────
  if (slide.kind === "complete") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 30px", textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: PAL.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, boxShadow: `0 10px 0 ${PAL.greenDk}` }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Headline size={36}>Lesson complete.</Headline>
            <div style={{ marginTop: 14 }}>
              <BodyText size={18}>You can now spot a linear function, graph one, and pick the right equation from a word problem.</BodyText>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.green, color: "#fff", fontFamily: FONT, fontSize: 18, fontWeight: 800, padding: "9px 18px", borderRadius: 9999 }}>8 / 8 correct</span>
            </div>
          </div>
          <div
            onClick={() => { onComplete?.(); onClose(); }}
            style={{ margin: "0 20px 12px", padding: "14px 0", fontFamily: FONT, fontSize: 16, fontWeight: 700, color: PAL.inkSoft, textAlign: "center", cursor: "pointer" }}
          >
            Review from the start
          </div>
          <CTAButton onClick={() => { onComplete?.(); onClose(); }}>Back to lessons</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  // ── Teach ───────────────────────────────────────────────────────────────────
  if (slide.kind === "teach") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <TopBar step={step} total={TOTAL} onClose={onClose} />
          <div style={{ padding: "10px 24px 0", position: "relative", zIndex: 2 }}>
            <Tag color={slide.tagColor}>{slide.tag}</Tag>
            <Headline size={26}>{slide.headline}</Headline>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px 0", display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
            {slide.visual}
            {slide.body && <div style={{ marginTop: 20 }}>{slide.body}</div>}
          </div>
          <CTAButton onClick={advance}>Continue</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  // ── A/B ─────────────────────────────────────────────────────────────────────
  const isCorrect = picked === slide.correct;
  const correctLabel = slide.correct === "A" ? slide.optionA : slide.optionB;

  const getState = (letter: "A" | "B"): OptionState => {
    if (!submitted) return picked === letter ? "selected" : "idle";
    if (letter === slide.correct) return "correct";
    if (letter === picked) return "wrong";
    return "dim";
  };

  return (
    <DeviceFrame>
      <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <TopBar step={step} total={TOTAL} onClose={onClose} />
        <div style={{ padding: "16px 24px 0" }}>
          <Tag color={slide.tagColor}>{slide.tag}</Tag>
          <Headline size={26}>{slide.headline}</Headline>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 0", display: "flex", flexDirection: "column" }}>
          {slide.visual && <div style={{ marginBottom: 22 }}>{slide.visual}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <OptionRow letter="A" label={slide.optionA} state={getState("A")} onClick={() => handlePick("A")} />
            <OptionRow letter="B" label={slide.optionB} state={getState("B")} onClick={() => handlePick("B")} />
          </div>
        </div>
        {!submitted && <CTAButton disabled>Pick an answer</CTAButton>}
        {submitted && <div style={{ height: 110, flexShrink: 0 }} />}
        {submitted && (
          <FeedbackBanner
            correct={isCorrect}
            correctLabel={correctLabel}
            text={slide.explain}
            onContinue={advance}
          />
        )}
      </div>
    </DeviceFrame>
  );
}
