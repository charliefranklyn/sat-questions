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

const FONT = '"Nunito", var(--font-nunito), system-ui, sans-serif';
const MONO = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';

// ── Types ─────────────────────────────────────────────────────────────────────

type IntroSlide    = { kind: "intro" };
type TeachSlide    = { kind: "teach"; tag: string; tagColor?: string; headline: React.ReactNode; visual?: React.ReactNode; body?: React.ReactNode };
type ABSlide       = { kind: "ab"; tag: string; tagColor?: string; headline: string; visual?: React.ReactNode; optionA: string; optionB: string; correct: "A" | "B"; explain: string };
type RecapSlide    = { kind: "recap" };
type CompleteSlide = { kind: "complete" };
type Slide = IntroSlide | TeachSlide | ABSlide | RecapSlide | CompleteSlide;

// ── Visuals ───────────────────────────────────────────────────────────────────

function SteepnessVisual() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {[
        { label: "Steep",   sub: "big change in y",   color: PAL.orange, path: "M 14 120 L 140 18" },
        { label: "Shallow", sub: "small change in y",  color: PAL.blue,   path: "M 14 100 L 140 70" },
      ].map((g, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 12, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
          <svg width="100%" height={130} viewBox="0 0 150 130">
            {[30, 60, 90].map((v, k) => <line key={`h${k}`} x1={10} y1={v} x2={140} y2={v} stroke="#F0E9D1" strokeWidth="1"/>)}
            {[40, 70, 100].map((v, k) => <line key={`v${k}`} x1={v} y1={10} x2={v} y2={120} stroke="#F0E9D1" strokeWidth="1"/>)}
            <line x1={10} y1={120} x2={140} y2={120} stroke={PAL.ink} strokeWidth="1.5"/>
            <line x1={10} y1={10}  x2={10}  y2={120} stroke={PAL.ink} strokeWidth="1.5"/>
            <path d={g.path} stroke={g.color} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 900, color: PAL.ink, textAlign: "center", marginTop: 4 }}>{g.label}</div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: PAL.inkSoft, textAlign: "center", marginTop: 1 }}>{g.sub}</div>
        </div>
      ))}
    </div>
  );
}

function GradientFormulaCard({ compact = false }: { compact?: boolean }) {
  const pad = compact ? "22px 16px" : "32px 20px";
  const numSize = compact ? 34 : 44;
  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: pad,
      boxShadow: "0 6px 0 rgba(31,37,68,0.08)",
      fontFamily: MONO, color: PAL.ink,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 14,
    }}>
      <div style={{ fontSize: numSize, fontWeight: 500 }}>m&nbsp;=&nbsp;</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ color: PAL.orange, fontSize: numSize * 0.8, fontWeight: 700, padding: "0 10px 4px" }}>
          y<sub style={{ fontSize: numSize * 0.5 }}>2</sub>&nbsp;−&nbsp;y<sub style={{ fontSize: numSize * 0.5 }}>1</sub>
        </div>
        <div style={{ width: "100%", height: 3, background: PAL.ink, borderRadius: 2 }}/>
        <div style={{ color: PAL.purple, fontSize: numSize * 0.8, fontWeight: 700, padding: "4px 10px 0" }}>
          x<sub style={{ fontSize: numSize * 0.5 }}>2</sub>&nbsp;−&nbsp;x<sub style={{ fontSize: numSize * 0.5 }}>1</sub>
        </div>
      </div>
    </div>
  );
}

function WorkedStepsCard() {
  const steps: { n: number; label: string; body: React.ReactNode }[] = [
    {
      n: 1,
      label: "Label the points",
      body: <>(x<sub>1</sub>, y<sub>1</sub>) = (0, 3) &nbsp;·&nbsp; (x<sub>2</sub>, y<sub>2</sub>) = (1, 7)</>,
    },
    {
      n: 2,
      label: "Substitute",
      body: <>m = <span style={{ color: PAL.orange, fontWeight: 700 }}>(7 − 3)</span> ÷ <span style={{ color: PAL.purple, fontWeight: 700 }}>(1 − 0)</span></>,
    },
    {
      n: 3,
      label: "Simplify",
      body: <>m = <span style={{ color: PAL.orange, fontWeight: 700 }}>4</span> ÷ <span style={{ color: PAL.purple, fontWeight: 700 }}>1</span></>,
    },
    {
      n: 4,
      label: "Result",
      body: <span style={{ color: PAL.green, fontWeight: 700 }}>m = 4</span>,
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s) => (
        <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#fff", borderRadius: 16, padding: "12px 14px", boxShadow: "0 3px 0 rgba(31,37,68,0.05)" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: PAL.paper, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT, fontSize: 15, fontWeight: 900,
          }}>{s.n}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: PAL.inkSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 1 }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 500, color: PAL.ink }}>{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PointsCard({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const fmt = ([x, y]: [number, number]) => `(${x}, ${y})`;
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "18px 16px",
      boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-around",
    }}>
      {[{ label: "Point 1", pt: p1, color: PAL.blue }, { label: "Point 2", pt: p2, color: PAL.green }].map((item, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: item.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: PAL.ink }}>{fmt(item.pt)}</div>
        </div>
      ))}
    </div>
  );
}

function TwoPointPlot({
  p1, p2,
  showWorking = false,
  working,
  xMin = -5, xMax = 5,
  yMin = -5, yMax = 5,
}: {
  p1: [number, number];
  p2: [number, number];
  showWorking?: boolean;
  working?: React.ReactNode;
  xMin?: number; xMax?: number;
  yMin?: number; yMax?: number;
}) {
  const W = 310, H = 210;
  const pad = 22;
  const xs = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - pad * 2);
  const ys = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - pad * 2);

  const xTicks: number[] = [];
  for (let i = xMin; i <= xMax; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = yMin; i <= yMax; i++) yTicks.push(i);

  const slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  const intercept = p1[1] - slope * p1[0];
  const xA = xMin, yA = slope * xA + intercept;
  const xB = xMax, yB = slope * xB + intercept;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 14, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {xTicks.map((x) => (
          <line key={`v${x}`} x1={xs(x)} y1={pad} x2={xs(x)} y2={H - pad} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        {yTicks.map((y) => (
          <line key={`h${y}`} x1={pad} y1={ys(y)} x2={W - pad} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        <line x1={xs(xMin)} y1={ys(0)} x2={xs(xMax)} y2={ys(0)} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={xs(0)} y1={ys(yMin)} x2={xs(0)} y2={ys(yMax)} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={xs(xA)} y1={ys(yA)} x2={xs(xB)} y2={ys(yB)} stroke={PAL.green} strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx={xs(p1[0])} cy={ys(p1[1])} r="7" fill={PAL.blue}   stroke="#fff" strokeWidth="3"/>
        <circle cx={xs(p2[0])} cy={ys(p2[1])} r="7" fill={PAL.orange} stroke="#fff" strokeWidth="3"/>
        <text x={xs(p1[0]) + 10} y={ys(p1[1]) - 10} fontFamily={MONO} fontSize="12" fontWeight="700" fill={PAL.blue}>
          ({p1[0]}, {p1[1]})
        </text>
        <text x={xs(p2[0]) + 10} y={ys(p2[1]) - 10} fontFamily={MONO} fontSize="12" fontWeight="700" fill={PAL.orange}>
          ({p2[0]}, {p2[1]})
        </text>
      </svg>
      {showWorking && working && (
        <div style={{
          marginTop: 8, padding: "10px 12px",
          background: PAL.cream, borderRadius: 12,
          fontFamily: MONO, fontSize: 14, fontWeight: 500, color: PAL.ink,
          textAlign: "center",
        }}>
          {working}
        </div>
      )}
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
        height: "min(880px, calc(100svh - 24px), calc((100vw - 24px) * 2.17))",
        width: "min(406px, calc((100svh - 24px) * 0.461), calc(100vw - 24px))",
        borderRadius: 48, overflow: "hidden",
        position: "relative", background: PAL.cream,
        boxShadow: "0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 126, height: 37, borderRadius: 24, background: "#000", zIndex: 50, pointerEvents: "none" }} />
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
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 60, height: 34, display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 8, pointerEvents: "none" }}>
          <div style={{ width: 139, height: 5, borderRadius: 100, background: "rgba(0,0,0,0.25)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Slide content ─────────────────────────────────────────────────────────────

const TOTAL = 10;

const SLIDES: Slide[] = [
  { kind: "intro" },

  {
    kind: "teach", tag: "01 · The formula",
    headline: <>Gradient measures <span style={{ color: PAL.orange }}>steepness</span>.</>,
    visual: <SteepnessVisual />,
    body: <BodyText>A steeper line has a <b style={{ color: PAL.ink }}>larger</b> gradient. A flatter line has a smaller one. We measure it with a formula.</BodyText>,
  },

  {
    kind: "teach", tag: "01 · The formula",
    headline: "The gradient formula.",
    visual: (
      <div>
        <GradientFormulaCard />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <div style={{ flex: 1, background: PAL.orange, color: "#fff", borderRadius: 16, padding: "12px 14px" }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.9 }}>Top</div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, marginTop: 2, lineHeight: 1.25 }}>Change in y</div>
          </div>
          <div style={{ flex: 1, background: PAL.purple, color: "#fff", borderRadius: 16, padding: "12px 14px" }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.9 }}>Bottom</div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, marginTop: 2, lineHeight: 1.25 }}>Change in x</div>
          </div>
        </div>
      </div>
    ),
    body: <BodyText>Pick any two points. Subtract the <b style={{ color: PAL.orange }}>y-values</b>. Divide by the difference in <b style={{ color: PAL.purple }}>x-values</b>.</BodyText>,
  },

  {
    kind: "teach", tag: "01 · The formula",
    headline: <>Let&apos;s use it. Points: <span style={{ fontFamily: MONO, color: PAL.ink }}>(0, 3)</span> and <span style={{ fontFamily: MONO, color: PAL.ink }}>(1, 7)</span>.</>,
    visual: <WorkedStepsCard />,
    body: <BodyText>The y-values differ by <b style={{ color: PAL.orange }}>4</b>. The x-values differ by <b style={{ color: PAL.purple }}>1</b>. So the gradient is <b style={{ color: PAL.green }}>4</b>.</BodyText>,
  },

  {
    kind: "ab", tag: "01 · The formula",
    headline: "What is the gradient of the line through (0, 3) and (1, 7)?",
    visual: <PointsCard p1={[0, 3]} p2={[1, 7]} />,
    optionA: "3",
    optionB: "4",
    correct: "B",
    explain: "(7 − 3) ÷ (1 − 0) = 4 ÷ 1 = 4. Always y on top, x on the bottom.",
  },

  {
    kind: "ab", tag: "01 · The formula",
    headline: "What is the gradient of the line through (−1, 4) and (1, 0)?",
    visual: <PointsCard p1={[-1, 4]} p2={[1, 0]} />,
    optionA: "−2",
    optionB: "2",
    correct: "A",
    explain: "(0 − 4) ÷ (1 − (−1)) = −4 ÷ 2 = −2. Negative because the line slopes downward.",
  },

  {
    kind: "teach", tag: "02 · From a graph",
    headline: <>You can read gradient <span style={{ color: PAL.green }}>off a graph</span>.</>,
    visual: (
      <TwoPointPlot
        p1={[1, 2]} p2={[4, 4]}
        xMin={-1} xMax={5} yMin={-1} yMax={5}
        showWorking
        working={<>m = (4 − 2) ÷ (4 − 1) = <b style={{ color: PAL.green }}>2/3</b></>}
      />
    ),
    body: <BodyText>Find two points that land cleanly on grid intersections. Label them. Then use the same formula.</BodyText>,
  },

  {
    kind: "ab", tag: "02 · From a graph",
    headline: "What is the gradient of this line?",
    visual: (
      <TwoPointPlot
        p1={[-3, 2]} p2={[1, -1]}
        xMin={-5} xMax={3} yMin={-3} yMax={4}
      />
    ),
    optionA: "3/4",
    optionB: "−3/4",
    correct: "B",
    explain: "(−1 − 2) ÷ (1 − (−3)) = −3/4. The line slopes down left to right, so the gradient must be negative.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A line passes through (2, 5) and (6, 9). What is the slope?",
    optionA: "1",
    optionB: "2",
    correct: "A",
    explain: "(9 − 5) ÷ (6 − 2) = 4 ÷ 4 = 1.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A line passes through (−2, 7) and (4, −5). What is the slope?",
    optionA: "−2",
    optionB: "2",
    correct: "A",
    explain: "(−5 − 7) ÷ (4 − (−2)) = −12 ÷ 6 = −2. Negative because y decreases as x increases.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A line passes through (0, −3) and (4, 5). What is the slope?",
    optionA: "2",
    optionB: "1/2",
    correct: "A",
    explain: "(5 − (−3)) ÷ (4 − 0) = 8 ÷ 4 = 2.",
  },

  { kind: "recap" },
  { kind: "complete" },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function InteractiveLesson02({ onClose, onComplete }: { onClose: () => void; onComplete?: () => void }) {
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

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (slide.kind === "intro") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ padding: "20px 24px 0", position: "relative", zIndex: 2 }}>
            <Tag>SAT Math · Lesson 02</Tag>
            <Headline size={40}>Gradient &amp; Slope, from scratch.</Headline>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", right: "8%",  top: "12%",  width: "40%", aspectRatio: "1", borderRadius: "50%", background: PAL.orange }} />
            <div style={{ position: "absolute", left: "8%",  top: "32%",  width: "25%", aspectRatio: "1", borderRadius: "50%", background: PAL.yellow }} />
            <div style={{ position: "absolute", right: "34%",top: "55%",  width: "16%", aspectRatio: "1", borderRadius: "50%", background: PAL.purple }} />
            <div style={{ marginTop: "auto", padding: "0 10% 22%", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.blue, color: "#fff", fontFamily: MONO, fontSize: "clamp(12px, 4vw, 18px)", fontWeight: 500, padding: "10px 18px", borderRadius: 9999 }}>m = (y₂−y₁)/(x₂−x₁)</span>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.orange, color: "#fff", fontFamily: FONT, fontSize: "clamp(14px, 4.5vw, 20px)", fontWeight: 800, padding: "10px 18px", borderRadius: 9999, alignSelf: "flex-end" }}>step by step</span>
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
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "4px 24px 0" }}>
            <Tag color={PAL.blue}>Key concepts recap</Tag>
            <Headline size={28}>Gradient in one formula.</Headline>
            <div style={{ marginTop: 14, background: PAL.green, borderRadius: 22, padding: "16px 18px", boxShadow: `0 6px 0 ${PAL.greenDk}`, color: "#fff" }}>
              <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                Gradient is how much y changes for each unit of x. Pick any two points and divide the change in y by the change in x.
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <GradientFormulaCard compact />
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: PAL.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Tips</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  <>Label <span style={{ fontFamily: MONO }}>(x₁, y₁)</span> first — either point can be point 1.</>,
                  <>Negative result = the line slopes <b>downward</b>.</>,
                  <>On the SAT: spot two coordinate pairs and plug in.</>,
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: PAL.orange, flexShrink: 0, marginTop: 6 }}/>
                    <div style={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: PAL.ink, lineHeight: 1.45 }}>{t}</div>
                  </div>
                ))}
              </div>
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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 30px", textAlign: "center" }}>
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: PAL.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: `0 10px 0 ${PAL.greenDk}` }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Headline size={36}>Lesson complete.</Headline>
            <div style={{ marginTop: 14 }}>
              <BodyText size={18}>You can now calculate the gradient from two points or read it off a graph.</BodyText>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.green, color: "#fff", fontFamily: FONT, fontSize: 18, fontWeight: 800, padding: "9px 18px", borderRadius: 9999 }}>5 / 5 correct</span>
            </div>
          </div>
          <div
            onClick={() => { setIdx(0); setPicked(null); setSubmitted(false); }}
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
