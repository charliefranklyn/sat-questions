"use client";
import { useState } from "react";

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

const FONT = '"Nunito", var(--font-nunito), system-ui, sans-serif';
const MONO = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';

type IntroSlide    = { kind: "intro" };
type TeachSlide    = { kind: "teach"; tag: string; tagColor?: string; headline: React.ReactNode; visual?: React.ReactNode; body?: React.ReactNode };
type ABSlide       = { kind: "ab"; tag: string; tagColor?: string; headline: React.ReactNode; visual?: React.ReactNode; optionA: string; optionB: string; correct: "A" | "B"; explain: string };
type RecapSlide    = { kind: "recap" };
type CompleteSlide = { kind: "complete" };
type Slide = IntroSlide | TeachSlide | ABSlide | RecapSlide | CompleteSlide;

// ── Visuals ───────────────────────────────────────────────────────────────────

function TwoRulesCard({ a, b }: {
  a: { label: string; color: string; name: string; detail: string; eq: string };
  b: { label: string; color: string; name: string; detail: string; eq: string };
}) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {[a, b].map((r, i) => (
        <div key={i} style={{
          flex: 1, background: "#fff", borderRadius: 20, padding: "16px 14px",
          boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
          borderTop: `6px solid ${r.color}`,
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: r.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.label}</div>
          <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: PAL.ink, lineHeight: 1.2 }}>{r.name}</div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: PAL.inkSoft, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.4 }}>{r.detail}</div>
          <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 17, fontWeight: 700, color: PAL.ink }}>{r.eq}</div>
        </div>
      ))}
    </div>
  );
}

function IntersectionGraph({
  line1, line2, intersect,
  xMax = 10, yMax = 160,
  xLabel = "month", yLabel = "$",
}: {
  line1: { m: number; b: number; color: string; label: string };
  line2: { m: number; b: number; color: string; label: string };
  intersect: [number, number];
  xMax?: number; yMax?: number;
  xLabel?: string; yLabel?: string;
}) {
  const width = 320, height = 220;
  const padL = 40, padR = 16, padT = 18, padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xToPx = (x: number) => padL + (x / xMax) * plotW;
  const yToPx = (y: number) => padT + plotH - (y / yMax) * plotH;

  const linePts = (m: number, b: number): [[number,number],[number,number]] => [
    [xToPx(0), yToPx(b)],
    [xToPx(xMax), yToPx(m * xMax + b)],
  ];

  const l1 = linePts(line1.m, line1.b);
  const l2 = linePts(line2.m, line2.b);
  const ix = xToPx(intersect[0]);
  const iy = yToPx(intersect[1]);

  // Label positions: 80% of xMax for line1, 30% for line2
  const l1Lm = 0.8 * xMax;
  const l1Lx = xToPx(l1Lm);
  const l1Ly = yToPx(line1.m * l1Lm + line1.b);
  const l2Lm = 0.3 * xMax;
  const l2Lx = xToPx(l2Lm);
  const l2Ly = yToPx(line2.m * l2Lm + line2.b);

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "14px 14px 10px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <text x={padL + plotW / 2} y={height - 8} fontFamily={MONO} fontSize="11" fill={PAL.inkSoft} textAnchor="middle">{xLabel}</text>
        <text x={12} y={padT + plotH / 2} fontFamily={MONO} fontSize="11" fill={PAL.inkSoft} textAnchor="middle" transform={`rotate(-90 12 ${padT + plotH / 2})`}>{yLabel}</text>
        <line x1={l1[0][0]} y1={l1[0][1]} x2={l1[1][0]} y2={l1[1][1]} stroke={line1.color} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1={l2[0][0]} y1={l2[0][1]} x2={l2[1][0]} y2={l2[1][1]} stroke={line2.color} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1={ix} y1={padT + plotH} x2={ix} y2={iy} stroke={PAL.ink} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
        <line x1={padL} y1={iy} x2={ix} y2={iy} stroke={PAL.ink} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
        <circle cx={ix} cy={iy} r={8} fill="#fff" stroke={PAL.ink} strokeWidth="3"/>
        <text x={l1Lx} y={l1Ly - 8} fontFamily={MONO} fontSize="12" fontWeight="700" fill={line1.color} textAnchor="end">{line1.label}</text>
        <text x={l2Lx} y={l2Ly + 16} fontFamily={MONO} fontSize="12" fontWeight="700" fill={line2.color} textAnchor="start">{line2.label}</text>
      </svg>
      <div style={{ marginTop: 6, textAlign: "center", fontFamily: FONT, fontSize: 13, fontWeight: 700, color: PAL.ink }}>
        They cross at <span style={{ fontFamily: MONO }}>({intersect[0]}, {intersect[1]})</span>
      </div>
    </div>
  );
}

function SolveCard({ lines }: { lines: React.ReactNode[] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "18px 18px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
      {lines.map((ln, i) => {
        const last = i === lines.length - 1;
        return (
          <div key={i} style={{
            fontFamily: MONO, fontSize: last ? 22 : 20,
            fontWeight: last ? 700 : 500,
            color: last ? PAL.green : PAL.ink,
            letterSpacing: "-0.01em", textAlign: "center",
            padding: last ? "10px 0 2px" : 0,
          }}>{ln}</div>
        );
      })}
    </div>
  );
}

function TwoEquationsCard({
  eq1, eq2,
  eq1Label = "Equation 1", eq2Label = "Equation 2",
}: {
  eq1: string; eq2: string;
  eq1Label?: string; eq2Label?: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "18px 18px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)", display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { label: eq1Label, eq: eq1, color: PAL.orange },
        { label: eq2Label, eq: eq2, color: PAL.purple },
      ].map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 36, borderRadius: 4, background: row.color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: row.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{row.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: PAL.ink, letterSpacing: "-0.01em" }}>{row.eq}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParallelNoAnswerGraph({ sameLine = false }: { sameLine?: boolean }) {
  const width = 320, height = 200;
  const padL = 30, padR = 16, padT = 16, padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "14px 14px 10px", boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#BFC3D8" strokeWidth="1.5"/>
        {sameLine ? (
          <>
            <line x1={padL + 6} y1={padT + plotH - 24} x2={padL + plotW - 6} y2={padT + 40} stroke={PAL.orange} strokeWidth="6" strokeLinecap="round"/>
            <line x1={padL + 6} y1={padT + plotH - 24} x2={padL + plotW - 6} y2={padT + 40} stroke={PAL.purple} strokeWidth="3" strokeLinecap="round" strokeDasharray="7 5"/>
            <text x={padL + plotW / 2} y={padT + plotH + 22} fontFamily={FONT} fontSize="13" fontWeight="700" fill={PAL.ink} textAnchor="middle">Same line — every point matches</text>
          </>
        ) : (
          <>
            <line x1={padL + 10} y1={padT + plotH - 30} x2={padL + plotW - 10} y2={padT + 40} stroke={PAL.orange} strokeWidth="4" strokeLinecap="round"/>
            <line x1={padL + 10} y1={padT + plotH - 70} x2={padL + plotW - 10} y2={padT} stroke={PAL.purple} strokeWidth="4" strokeLinecap="round"/>
            <text x={padL + plotW / 2} y={padT + plotH + 22} fontFamily={FONT} fontSize="13" fontWeight="700" fill={PAL.ink} textAnchor="middle">Parallel — they never meet</text>
          </>
        )}
      </svg>
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
    >{children}</div>
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
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < step ? PAL.ink : "rgba(31,37,68,0.12)", transition: "background 0.3s" }} />
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
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 18px", borderRadius: 20, background: s.bg, border: `2px solid ${s.border}`, cursor: state === "idle" || state === "selected" ? "pointer" : "default", transition: "all 0.2s" }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 12, background: s.letterBg, color: s.letterText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 18, fontWeight: 900, flexShrink: 0 }}>{letter}</div>
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
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: bg, padding: "20px 20px 34px", borderTopLeftRadius: 28, borderTopRightRadius: 28, boxShadow: "0 -8px 24px rgba(0,0,0,0.12)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, fontFamily: FONT, fontSize: 22, fontWeight: 900, color: "#fff" }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          {correct
            ? <path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M7 7l10 10M17 7l-10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>}
        </svg>
        {correct ? "Nice." : "Not quite."}
      </div>
      {!correct && correctLabel && (
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>Correct answer: {correctLabel}</div>
      )}
      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 18, opacity: 0.95 }}>{text}</div>
      <div onClick={onContinue} style={{ padding: "15px 0", borderRadius: 18, background: "#fff", color: bg, fontFamily: FONT, fontSize: 18, fontWeight: 900, textAlign: "center", cursor: "pointer", userSelect: "none" }}>Continue</div>
    </div>
  );
}

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,20,0.75)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ height: "min(880px, calc(100svh - 24px), calc((100vw - 24px) * 2.17))", width: "min(406px, calc((100svh - 24px) * 0.461), calc(100vw - 24px))", borderRadius: 48, overflow: "hidden", position: "relative", background: PAL.cream, boxShadow: "0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 126, height: 37, borderRadius: 24, background: "#000", zIndex: 50, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "21px 28px 0", pointerEvents: "none" }}>
          <span style={{ fontFamily: "-apple-system, system-ui", fontWeight: 600, fontSize: 15, color: PAL.ink }}>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill={PAL.ink}>
              <rect x="0" y="7" width="3" height="5" rx="0.7"/><rect x="4.7" y="4.5" width="3" height="7.5" rx="0.7"/>
              <rect x="9.4" y="2" width="3" height="10" rx="0.7"/><rect x="14.1" y="0" width="3" height="12" rx="0.7"/>
            </svg>
            <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
              <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke={PAL.ink} strokeOpacity="0.35"/>
              <rect x="2" y="2" width="18" height="9" rx="2" fill={PAL.ink}/>
              <path d="M24 4.5V8.5C24.8 8.2 25.5 7.2 25.5 6.5C25.5 5.8 24.8 4.8 24 4.5Z" fill={PAL.ink} fillOpacity="0.4"/>
            </svg>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{children}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 60, height: 34, display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 8, pointerEvents: "none" }}>
          <div style={{ width: 139, height: 5, borderRadius: 100, background: "rgba(0,0,0,0.25)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Slides ────────────────────────────────────────────────────────────────────

const TOTAL = 11;

const SLIDES: Slide[] = [
  { kind: "intro" },

  {
    kind: "teach", tag: "01 · The setup",
    headline: <>Sometimes two rules both need to be true at the <span style={{ color: PAL.orange }}>same time</span>.</>,
    visual: <TwoRulesCard
      a={{ label: "Gym", color: PAL.orange, name: "Iron & Co.", detail: "$50 to join + $10/month", eq: "C = 10m + 50" }}
      b={{ label: "Yoga", color: PAL.purple, name: "Zen Studio", detail: "$20/month, no fee", eq: "C = 20m" }}
    />,
    body: <BodyText>A gym charges <b style={{ color: PAL.orange }}>$50 to join + $10/month</b>. A yoga studio charges <b style={{ color: PAL.purple }}>$20/month, no fee</b>. Find when they cost the <b>same</b>.</BodyText>,
  },

  {
    kind: "teach", tag: "01 · The setup",
    headline: <>Each rule is a line. The answer is <span style={{ color: PAL.green }}>where they cross</span>.</>,
    visual: <IntersectionGraph
      line1={{ m: 10, b: 50, color: PAL.orange, label: "gym" }}
      line2={{ m: 20, b: 0, color: PAL.purple, label: "yoga" }}
      intersect={[5, 100]}
      xMax={10} yMax={160}
      xLabel="month" yLabel="$"
    />,
    body: <BodyText>The lines meet at <b style={{ color: PAL.green }}>month 5</b>, when both cost <b style={{ color: PAL.green }}>$100</b>.</BodyText>,
  },

  {
    kind: "ab", tag: "01 · The setup",
    headline: "At which month do they cost the same?",
    visual: <TwoEquationsCard eq1Label="Gym" eq1="C = 10m + 50" eq2Label="Yoga" eq2="C = 20m" />,
    optionA: "Month 5",
    optionB: "Month 10",
    correct: "A",
    explain: "At m = 5: gym = 10(5) + 50 = $100, yoga = 20(5) = $100. Both match.",
  },

  {
    kind: "teach", tag: "02 · Solve it",
    headline: <>Both equations equal the same <span style={{ fontFamily: MONO }}>C</span>. So set the right-hand sides <span style={{ color: PAL.orange }}>equal</span>.</>,
    visual: <SolveCard lines={[
      <>10m + 50 = 20m</>,
      <>50 = 10m</>,
      <>m = <span style={{ color: PAL.orange, fontWeight: 700 }}>5</span></>,
      <>C = 20(5) = 100</>,
    ]} />,
    body: <BodyText>If both sides equal <b style={{ fontFamily: MONO }}>C</b>, they equal each other. Solve for <b>m</b>, then plug it back in to get <b>C</b>.</BodyText>,
  },

  {
    kind: "ab", tag: "02 · Solve it",
    headline: <>What is <span style={{ fontFamily: MONO }}>x</span>?</>,
    visual: <TwoEquationsCard eq1="y = x + 3" eq2="y = 2x" />,
    optionA: "3",
    optionB: "6",
    correct: "A",
    explain: "Set equal: x + 3 = 2x. Subtract x from both sides: 3 = x. Then y = 2(3) = 6.",
  },

  {
    kind: "ab", tag: "02 · Solve it",
    headline: <>What is <span style={{ fontFamily: MONO }}>y</span>?</>,
    visual: <TwoEquationsCard eq1="y = 3x − 1" eq2="y = x + 3" />,
    optionA: "5",
    optionB: "2",
    correct: "A",
    explain: "3x − 1 = x + 3 → 2x = 4 → x = 2. Swap back: y = 2 + 3 = 5.",
  },

  {
    kind: "teach", tag: "03 · Special cases",
    headline: <>Same slope means the lines go the <span style={{ color: PAL.orange }}>same direction</span> — they never cross.</>,
    visual: <ParallelNoAnswerGraph />,
    body: <BodyText>No crossing point = no answer. This happens when two lines have the <b>same slope</b> but <b>different starting points</b>.</BodyText>,
  },

  {
    kind: "ab", tag: "03 · Special cases",
    headline: "How many answers?",
    visual: <TwoEquationsCard eq1="y = 2x + 1" eq2="y = 2x + 3" />,
    optionA: "No answers — they never cross",
    optionB: "One answer",
    correct: "A",
    explain: "Both have slope 2 but different starting points (1 vs 3). Same direction, never meet.",
  },

  {
    kind: "ab", tag: "03 · Special cases",
    headline: "How many answers?",
    visual: <TwoEquationsCard eq1="y = x + 4" eq2="y = x + 4" />,
    optionA: "Every point on the line works",
    optionB: "No answers",
    correct: "A",
    explain: "Same line — every point on it satisfies both equations. Infinite answers.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: <>What is <span style={{ fontFamily: MONO }}>x</span>?</>,
    visual: <TwoEquationsCard eq1="y = 2x + 5" eq2="y = −x + 2" />,
    optionA: "−1",
    optionB: "1",
    correct: "A",
    explain: "2x + 5 = −x + 2 → 3x = −3 → x = −1.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "How many solutions?",
    visual: <TwoEquationsCard eq1="y = 3x − 2" eq2="y = 3x + 5" />,
    optionA: "No solution",
    optionB: "One solution",
    correct: "A",
    explain: "Same slope (3), different starting points. Parallel — they never cross.",
  },

  { kind: "recap" },
  { kind: "complete" },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function InteractiveLesson04({ onClose, onComplete }: { onClose: () => void; onComplete?: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const slide = SLIDES[idx];
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

  if (slide.kind === "intro") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ padding: "20px 24px 0", position: "relative", zIndex: 2 }}>
            <Tag>SAT Math · Lesson 04</Tag>
            <Headline size={48}>Two equations.<br/>One answer.</Headline>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
            <div style={{ position: "absolute", right: 24, top: 48, width: 160, height: 160, borderRadius: "50%", background: PAL.yellow }} />
            <div style={{ position: "absolute", left: 30, top: 140, width: 106, height: 106, borderRadius: "50%", background: "#BEE7F7" }} />
            <div style={{ position: "absolute", right: 140, top: 180, width: 72, height: 72, borderRadius: "50%", background: PAL.orange }} />
            <svg viewBox="0 0 220 140" style={{ position: "absolute", left: 56, top: 210, width: 220, height: 140 }}>
              <line x1="10" y1="120" x2="210" y2="20" stroke={PAL.orange} strokeWidth="7" strokeLinecap="round"/>
              <line x1="10" y1="20" x2="210" y2="120" stroke={PAL.purple} strokeWidth="7" strokeLinecap="round"/>
              <circle cx="110" cy="70" r="11" fill="#fff" stroke={PAL.ink} strokeWidth="4"/>
            </svg>
          </div>
          <CTAButton onClick={advance}>Start lesson</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  if (slide.kind === "recap") {
    const rows = [
      { color: PAL.green,  badge: "1", title: "One answer",      detail: "Set the right-hand sides equal, solve for x, then find y." },
      { color: PAL.orange, badge: "0", title: "No answer",        detail: "Same slope, different starting point — lines never cross." },
      { color: PAL.purple, badge: "∞", title: "Infinite answers", detail: "Both equations are the same line." },
    ];
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "4px 24px 0" }}>
            <Tag color={PAL.blue}>Key concepts recap</Tag>
            <div style={{ marginTop: 14 }}><Headline size={28}>Systems of equations.</Headline></div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {rows.map((row, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "14px 14px", boxShadow: "0 3px 0 rgba(31,37,68,0.06)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: row.color, color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.badge}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: PAL.ink, lineHeight: 1.2 }}>{row.title}</div>
                    <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: PAL.inkSoft, lineHeight: 1.4 }}>{row.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CTAButton onClick={advance}>Finish lesson</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  if (slide.kind === "complete") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", gap: 18 }}>
            <div style={{ width: 112, height: 112, borderRadius: "50%", background: PAL.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 0 ${PAL.greenDk}` }}>
              <svg viewBox="0 0 40 40" width="60" height="60">
                <path d="M8 21 L17 30 L33 12" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Headline size={36}>Lesson complete.</Headline>
            <BodyText size={16}>You can solve any system of two linear equations.</BodyText>
            <div style={{ height: 8 }} />
            <div
              onClick={() => { setIdx(0); setPicked(null); setSubmitted(false); }}
              style={{ cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, color: PAL.inkSoft, textDecoration: "underline" }}
            >Restart lesson</div>
          </div>
          <CTAButton onClick={() => { onComplete?.(); onClose(); }}>Done</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

  if (slide.kind === "teach") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <TopBar step={step} total={TOTAL} onClose={onClose} />
          <div style={{ padding: "10px 24px 0" }}>
            <Tag color={slide.tagColor}>{slide.tag}</Tag>
            <Headline size={26}>{slide.headline}</Headline>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px 0", display: "flex", flexDirection: "column" }}>
            {slide.visual}
            {slide.body && <div style={{ marginTop: 20 }}>{slide.body}</div>}
          </div>
          <CTAButton onClick={advance}>Continue</CTAButton>
        </div>
      </DeviceFrame>
    );
  }

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
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px 0", display: "flex", flexDirection: "column" }}>
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
