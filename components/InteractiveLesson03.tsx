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
type ABSlide       = { kind: "ab"; tag: string; tagColor?: string; headline: string; visual?: React.ReactNode; optionA: string; optionB: string; correct: "A" | "B"; explain: string };
type RecapSlide    = { kind: "recap" };
type CompleteSlide = { kind: "complete" };
type Slide = IntroSlide | TeachSlide | ABSlide | RecapSlide | CompleteSlide;

// ── Visuals ───────────────────────────────────────────────────────────────────

function SubstitutionCard({ lines, highlightLast = true }: {
  lines: React.ReactNode[];
  highlightLast?: boolean;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "18px 18px",
      boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {lines.map((ln, i) => {
        const last = i === lines.length - 1 && highlightLast;
        return (
          <div key={i} style={{
            fontFamily: MONO,
            fontSize: last ? 22 : 20,
            fontWeight: last ? 700 : 500,
            color: last ? PAL.green : PAL.ink,
            letterSpacing: "-0.01em", textAlign: "center",
            padding: last ? "10px 0 2px" : 0,
          }}>
            {ln}
          </div>
        );
      })}
    </div>
  );
}

function SingleCoordCard({ point, slope }: { point: [number, number]; slope: string | number }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "20px 16px",
      boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-around", gap: 10,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 800,
          color: PAL.blue, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
        }}>On the line</div>
        <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: PAL.ink, whiteSpace: "nowrap" }}>
          ({point[0]}, {point[1]})
        </div>
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "rgba(31,37,68,0.1)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 800,
          color: PAL.orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
        }}>Slope</div>
        <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: PAL.ink }}>m = {slope}</div>
      </div>
    </div>
  );
}

function TwoStepCard({ step1, step2, result }: {
  step1: React.ReactNode;
  step2: React.ReactNode;
  result: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[{ n: 1, label: "Find m", body: step1 }, { n: 2, label: "Find b", body: step2 }].map((s) => (
        <div key={s.n} style={{
          background: "#fff", borderRadius: 16, padding: "10px 12px",
          display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 3px 0 rgba(31,37,68,0.05)",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: PAL.ink, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT, fontSize: 15, fontWeight: 900, flexShrink: 0,
          }}>{s.n}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 800, color: PAL.inkSoft,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 1,
            }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 14.5, fontWeight: 500, color: PAL.ink, lineHeight: 1.35 }}>{s.body}</div>
          </div>
        </div>
      ))}
      <div style={{
        background: PAL.green, borderRadius: 16, padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 0 ${PAL.greenDk}`,
      }}>
        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Result</div>
        <div style={{ flex: 1, fontFamily: MONO, fontSize: 22, fontWeight: 700, color: "#fff", textAlign: "right", letterSpacing: "-0.01em" }}>{result}</div>
      </div>
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

function ParallelLinesVisual() {
  const W = 300, H = 220, pad = 22;
  const xMin = -4, xMax = 4, yMin = -4, yMax = 4;
  const xs = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - pad * 2);
  const ys = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - pad * 2);

  const drawLine = (b: number) => {
    const x1 = xMin, y1 = 2 * x1 + b;
    const x2 = xMax, y2 = 2 * x2 + b;
    return { x1: xs(x1), y1: ys(y1), x2: xs(x2), y2: ys(y2) };
  };
  const L1 = drawLine(1);
  const L2 = drawLine(-3);

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 14, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[-4,-3,-2,-1,0,1,2,3,4].map(x => (
          <line key={`v${x}`} x1={xs(x)} y1={pad} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        {[-4,-3,-2,-1,0,1,2,3,4].map(y => (
          <line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-pad} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        <line x1={xs(xMin)} y1={ys(0)} x2={xs(xMax)} y2={ys(0)} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={xs(0)} y1={ys(yMin)} x2={xs(0)} y2={ys(yMax)} stroke={PAL.ink} strokeWidth="1.5"/>
        <line {...L1} stroke={PAL.blue}  strokeWidth="4" strokeLinecap="round"/>
        <line {...L2} stroke={PAL.green} strokeWidth="4" strokeLinecap="round"/>
        <rect x={W - 96} y={20} width="82" height="22" rx="6" fill={PAL.blue}/>
        <text x={W - 55} y={36} textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill="#fff">m = 2</text>
        <rect x={14} y={H - 42} width="82" height="22" rx="6" fill={PAL.green}/>
        <text x={55} y={H - 26} textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill="#fff">m = 2</text>
      </svg>
      <div style={{
        marginTop: 8, padding: "8px 12px",
        background: PAL.cream, borderRadius: 12,
        fontFamily: FONT, fontSize: 13, fontWeight: 700, color: PAL.ink, textAlign: "center",
      }}>
        Same slope, different b → parallel.
      </div>
    </div>
  );
}

function EquationCard({ children, label = "The line" }: { children: React.ReactNode; label?: string }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "22px 18px",
      boxShadow: "0 4px 0 rgba(31,37,68,0.06)", textAlign: "center",
    }}>
      <div style={{
        fontFamily: FONT, fontSize: 11, fontWeight: 800,
        color: PAL.inkSoft, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
      }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 500, color: PAL.ink, letterSpacing: "-0.01em" }}>
        {children}
      </div>
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

// ── Slides ────────────────────────────────────────────────────────────────────

const TOTAL = 11;

const SLIDES: Slide[] = [
  { kind: "intro" },

  {
    kind: "teach", tag: "01 · The equation",
    headline: <>Every straight line has an equation: <span style={{ fontFamily: MONO }}>y = mx + b</span>.</>,
    visual: (
      <div>
        <div style={{
          background: "#fff", borderRadius: 24, padding: "28px 20px",
          textAlign: "center", boxShadow: "0 6px 0 rgba(31,37,68,0.08)",
          fontFamily: MONO, fontSize: 46, fontWeight: 500, color: PAL.ink,
          letterSpacing: "-0.01em", marginBottom: 14,
        }}>
          y = <span style={{ color: PAL.orange, fontWeight: 700 }}>m</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>b</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: PAL.orange, color: "#fff", borderRadius: 16, padding: "12px 14px" }}>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700 }}>m</div>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>slope — how steep</div>
          </div>
          <div style={{ flex: 1, background: PAL.purple, color: "#fff", borderRadius: 16, padding: "12px 14px" }}>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700 }}>b</div>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>where it crosses y-axis</div>
          </div>
        </div>
      </div>
    ),
    body: <BodyText><b style={{ color: PAL.orange }}>m</b> is the slope — how steep the line is. <b style={{ color: PAL.purple }}>b</b> is where the line crosses the y-axis. To write the equation of any line, you need both.</BodyText>,
  },

  {
    kind: "teach", tag: "01 · The equation",
    headline: "If a point is on the line, it fits the equation exactly.",
    visual: (
      <SubstitutionCard lines={[
        <>m = 2,&nbsp; point (1, 5)</>,
        <>y = mx + b</>,
        <>5 = <span style={{ color: PAL.orange, fontWeight: 700 }}>2</span>(1) + b</>,
        <>5 = 2 + b</>,
        <>b = <span style={{ color: PAL.purple, fontWeight: 700 }}>3</span></>,
        <>y = 2x + 3</>,
      ]} />
    ),
    body: <BodyText>Take any point the line passes through. Swap its x and y into the equation. The only thing left unknown is <b style={{ color: PAL.purple }}>b</b> — so you can solve for it.</BodyText>,
  },

  {
    kind: "ab", tag: "01 · The equation",
    headline: "A line has slope 4 and passes through (1, 6). What is b?",
    visual: <SingleCoordCard point={[1, 6]} slope="4" />,
    optionA: "2",
    optionB: "10",
    correct: "A",
    explain: "6 = 4 + b. Take 4 away from both sides: b = 2. Full equation: y = 4x + 2.",
  },

  {
    kind: "ab", tag: "01 · The equation",
    headline: "A line has slope 3 and passes through (2, 8). What is b?",
    visual: (
      <SubstitutionCard lines={[
        <>y = mx + b</>,
        <>8 = <span style={{ color: PAL.orange, fontWeight: 700 }}>3</span>(2) + b</>,
        <>8 = 6 + b</>,
      ]} highlightLast={false} />
    ),
    optionA: "2",
    optionB: "14",
    correct: "A",
    explain: "8 = 6 + b. Take 6 away from both sides: b = 2. Full equation: y = 3x + 2.",
  },

  {
    kind: "teach", tag: "02 · From two points",
    headline: "Two points are all you need. Here's the full process.",
    visual: (
      <TwoStepCard
        step1={<>m = (9 − 5) ÷ (3 − 1) = <b style={{ color: PAL.orange }}>2</b></>}
        step2={<>Swap in (1, 5): 5 = 2(1) + b → b = <b style={{ color: PAL.purple }}>3</b></>}
        result={<>y = 2x + 3</>}
      />
    ),
    body: <BodyText>First calculate the <b style={{ color: PAL.orange }}>slope</b> from the two points. Then swap one point into the equation to find <b style={{ color: PAL.purple }}>b</b>. Two steps, done.</BodyText>,
  },

  {
    kind: "ab", tag: "02 · From two points",
    headline: "Line through (1, 5) and (3, 9). What's the equation?",
    visual: <PointsCard p1={[1, 5]} p2={[3, 9]} />,
    optionA: "y = 2x + 3",
    optionB: "y = 2x + 5",
    correct: "A",
    explain: "Slope = (9 − 5) ÷ (3 − 1) = 2. Swap in (1, 5): 5 = 2 + b → b = 3.",
  },

  {
    kind: "ab", tag: "02 · From two points",
    headline: "Line through (2, 1) and (4, 7). What's the equation?",
    visual: <PointsCard p1={[2, 1]} p2={[4, 7]} />,
    optionA: "y = 3x − 5",
    optionB: "y = 3x + 1",
    correct: "A",
    explain: "Slope = (7 − 1) ÷ (4 − 2) = 3. Swap in (2, 1): 1 = 6 + b → b = −5.",
  },

  {
    kind: "teach", tag: "03 · Parallel lines",
    headline: <>Two lines can have the <span style={{ color: PAL.orange }}>same slope</span> but never meet.</>,
    visual: <ParallelLinesVisual />,
    body: <BodyText>If two lines have the same slope, they go in exactly the same direction. They never cross. These are called <b style={{ color: PAL.ink }}>parallel lines</b>.</BodyText>,
  },

  {
    kind: "ab", tag: "03 · Parallel lines",
    headline: "Which line is parallel to y = 3x + 1?",
    visual: (
      <EquationCard label="Given">
        y = <span style={{ color: PAL.orange, fontWeight: 700 }}>3</span>x + <span style={{ color: PAL.purple, fontWeight: 700 }}>1</span>
      </EquationCard>
    ),
    optionA: "y = 3x − 5",
    optionB: "y = −3x + 1",
    correct: "A",
    explain: "Parallel means same slope. The slope in y = 3x + 1 is 3. Option A also has slope 3. Option B has slope −3 — a completely different direction.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "A line passes through (2, 7) and (4, 11). What is its equation?",
    optionA: "y = 2x + 3",
    optionB: "y = 2x + 7",
    correct: "A",
    explain: "Slope = (11 − 7) ÷ (4 − 2) = 2. Swap in (2, 7): 7 = 4 + b → b = 3.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "Which line passes through (3, 4) and is parallel to y = 2x − 1?",
    optionA: "y = 2x − 2",
    optionB: "y = 2x + 4",
    correct: "A",
    explain: "Parallel means same slope, so slope = 2. Swap in (3, 4): 4 = 6 + b → b = −2.",
  },

  { kind: "recap" },
  { kind: "complete" },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function InteractiveLesson03({ onClose, onComplete }: { onClose: () => void; onComplete?: () => void }) {
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
            <Tag>SAT Math · Lesson 03</Tag>
            <Headline size={40}>Write the equation of any line.</Headline>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", right: 28, top: 52,  width: 156, height: 156, borderRadius: "50%", background: PAL.yellow }} />
            <div style={{ position: "absolute", left: 38, top: 130, width: 100, height: 100, borderRadius: "50%", background: "#BEE7F7" }} />
            <div style={{ position: "absolute", right: 150, top: 186, width: 66, height: 66, borderRadius: "50%", background: PAL.orange }} />
            <div style={{ marginTop: "auto", padding: "0 10% 22%", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.blue, color: "#fff", fontFamily: MONO, fontSize: "clamp(12px, 4vw, 18px)", fontWeight: 500, padding: "10px 18px", borderRadius: 9999 }}>y = mx + b</span>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.green, color: "#fff", fontFamily: FONT, fontSize: "clamp(14px, 4.5vw, 20px)", fontWeight: 800, padding: "10px 18px", borderRadius: 9999, alignSelf: "flex-end" }}>step by step</span>
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
            <Headline size={28}>The equation of a line.</Headline>
            <div style={{ marginTop: 14, background: PAL.green, borderRadius: 22, padding: "16px 18px", boxShadow: `0 6px 0 ${PAL.greenDk}`, color: "#fff", textAlign: "center" }}>
              <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>y = mx + b</div>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { c: PAL.orange, t: <>Every line is <span style={{ fontFamily: MONO }}>y = mx + b</span> — slope times x, plus starting point.</> },
                { c: PAL.purple, t: <>Swap any known point in to solve for the starting point.</> },
                { c: PAL.blue,   t: <>Same slope = parallel lines — they never cross.</> },
              ].map((row, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 16, padding: "12px 14px",
                  boxShadow: "0 3px 0 rgba(31,37,68,0.06)",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", background: row.c,
                    color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: PAL.ink, lineHeight: 1.4 }}>{row.t}</div>
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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 30px", textAlign: "center" }}>
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: PAL.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: `0 10px 0 ${PAL.greenDk}` }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Headline size={32}>Lesson complete.</Headline>
            <div style={{ marginTop: 18 }}>
              <BodyText size={17}>You can now write the equation of any line — from a slope and point, or from two points.</BodyText>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
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
