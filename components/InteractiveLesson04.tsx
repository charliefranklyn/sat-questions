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

function ScenarioCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[
        { emoji: "🏋️", name: "Gym", detail: "$50 to join\n+ $10/month", eq: "C = 10m + 50", color: PAL.blue },
        { emoji: "🧘", name: "Yoga studio", detail: "No joining fee\n$20/month", eq: "C = 20m", color: PAL.orange },
      ].map((item, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 18, padding: "14px 12px",
          boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ fontFamily: FONT, fontSize: 22, textAlign: "center" }}>{item.emoji}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 900, color: item.color, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.name}</div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: PAL.inkSoft, textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line" }}>{item.detail}</div>
          <div style={{
            background: item.color, borderRadius: 10, padding: "6px 10px",
            fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center",
          }}>{item.eq}</div>
        </div>
      ))}
    </div>
  );
}

function TwoLinesPlot() {
  const W = 310, H = 200, pad = 28;
  // Gym: C = 10m + 50, Yoga: C = 20m, cross at m=5, C=100
  const maxM = 10, maxC = 200;
  const xs = (m: number) => pad + (m / maxM) * (W - pad * 2);
  const ys = (c: number) => H - pad - (c / maxC) * (H - pad * 2);

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 14, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0,2,4,6,8,10].map(m => (
          <line key={`v${m}`} x1={xs(m)} y1={pad} x2={xs(m)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        {[0,50,100,150,200].map(c => (
          <line key={`h${c}`} x1={pad} y1={ys(c)} x2={W-pad} y2={ys(c)} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        <line x1={pad} y1={H-pad} x2={W-pad} y2={H-pad} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={pad} y1={pad} x2={pad} y2={H-pad} stroke={PAL.ink} strokeWidth="1.5"/>
        {/* Gym line: C = 10m + 50 */}
        <line x1={xs(0)} y1={ys(50)} x2={xs(10)} y2={ys(150)} stroke={PAL.blue} strokeWidth="3" strokeLinecap="round"/>
        {/* Yoga line: C = 20m */}
        <line x1={xs(0)} y1={ys(0)} x2={xs(10)} y2={ys(200)} stroke={PAL.orange} strokeWidth="3" strokeLinecap="round"/>
        {/* Intersection dot */}
        <circle cx={xs(5)} cy={ys(100)} r="8" fill={PAL.green} stroke="#fff" strokeWidth="3"/>
        {/* Labels */}
        <text x={xs(6.5)} y={ys(130)} fontFamily={MONO} fontSize="11" fontWeight="700" fill={PAL.blue}>Gym</text>
        <text x={xs(6.5)} y={ys(160)} fontFamily={MONO} fontSize="11" fontWeight="700" fill={PAL.orange}>Yoga</text>
        <text x={xs(5)+10} y={ys(100)-8} fontFamily={MONO} fontSize="11" fontWeight="700" fill={PAL.green}>month 5, $100</text>
        {/* Axis labels */}
        <text x={xs(10)-10} y={H-10} fontFamily={FONT} fontSize="10" fontWeight="600" fill={PAL.inkSoft}>months</text>
        <text x={pad+4} y={pad+4} fontFamily={FONT} fontSize="10" fontWeight="600" fill={PAL.inkSoft}>cost ($)</text>
      </svg>
    </div>
  );
}

function SolveStepsCard() {
  const steps: { label: string; body: React.ReactNode; highlight?: string }[] = [
    { label: "Both equal C — set them equal", body: <>10m + 50 = 20m</> },
    { label: "Subtract 10m from both sides",  body: <>50 = 10m</> },
    { label: "Divide both sides by 10",       body: <>m = <span style={{ color: PAL.orange, fontWeight: 700 }}>5</span></> },
    { label: "Swap m=5 back in to find C",    body: <>C = 20 × 5 = <span style={{ color: PAL.green, fontWeight: 700 }}>100</span></> },
    { label: "Answer",                         body: <span style={{ color: PAL.green, fontWeight: 700 }}>Month 5 — both cost $100</span> },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: "#fff", borderRadius: 14, padding: "10px 14px",
          boxShadow: "0 3px 0 rgba(31,37,68,0.05)",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: PAL.paper, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT, fontSize: 13, fontWeight: 900, color: PAL.ink,
          }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: PAL.inkSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 500, color: PAL.ink }}>{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TwoEquationCard({ eq1, eq2 }: { eq1: React.ReactNode; eq2: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 4px 0 rgba(31,37,68,0.06)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "16px 20px", fontFamily: MONO, fontSize: 22, fontWeight: 500, color: PAL.ink, textAlign: "center" }}>{eq1}</div>
      <div style={{ height: 1, background: "#F2ECD5" }} />
      <div style={{ padding: "16px 20px", fontFamily: MONO, fontSize: 22, fontWeight: 500, color: PAL.ink, textAlign: "center" }}>{eq2}</div>
    </div>
  );
}

function CheckCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[
        { eq: "C = 10m + 50", check: "100 = 10×5 + 50", color: PAL.blue },
        { eq: "C = 20m",      check: "100 = 20×5",      color: PAL.orange },
      ].map((row, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 14, padding: "12px 14px",
          boxShadow: "0 3px 0 rgba(31,37,68,0.05)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: row.color, minWidth: 80 }}>{row.eq}</div>
          <div style={{ flex: 1, fontFamily: MONO, fontSize: 14, fontWeight: 500, color: PAL.ink }}>{row.check}</div>
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="9" fill={PAL.green}/>
            <path d="M5.5 10.5l3 3 6-6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

function ParallelLinesVisual() {
  const W = 310, H = 150, pad = 20;
  const xs = (x: number) => pad + ((x + 1) / 8) * (W - pad * 2);
  const ys = (y: number) => H - pad - ((y + 1) / 9) * (H - pad * 2);

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 14, boxShadow: "0 4px 0 rgba(31,37,68,0.06)" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[-1,0,1,2,3,4,5,6].map(x => (
          <line key={`v${x}`} x1={xs(x)} y1={pad} x2={xs(x)} y2={H-pad} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        {[-1,1,3,5,7].map(y => (
          <line key={`h${y}`} x1={pad} y1={ys(y)} x2={W-pad} y2={ys(y)} stroke="#F0E9D1" strokeWidth="1"/>
        ))}
        <line x1={pad} y1={ys(0)} x2={W-pad} y2={ys(0)} stroke={PAL.ink} strokeWidth="1.5"/>
        <line x1={xs(0)} y1={pad} x2={xs(0)} y2={H-pad} stroke={PAL.ink} strokeWidth="1.5"/>
        {/* y = 2x + 3 */}
        <line x1={xs(-1)} y1={ys(1)} x2={xs(3)} y2={ys(9)} stroke={PAL.blue} strokeWidth="3.5" strokeLinecap="round"/>
        {/* y = 2x + 1 */}
        <line x1={xs(-1)} y1={ys(-1)} x2={xs(3)} y2={ys(7)} stroke={PAL.orange} strokeWidth="3.5" strokeLinecap="round"/>
        <text x={xs(2.8)} y={ys(8)-6} fontFamily={MONO} fontSize="11" fontWeight="700" fill={PAL.blue}>slope = 2</text>
        <text x={xs(2.8)} y={ys(6)-6} fontFamily={MONO} fontSize="11" fontWeight="700" fill={PAL.orange}>slope = 2</text>
      </svg>
      <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: PAL.inkSoft, textAlign: "center", marginTop: 4 }}>
        Same slope — they never cross
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
    kind: "teach", tag: "01 · Two conditions, one answer",
    headline: "Sometimes two rules both need to be true at the same time.",
    visual: <ScenarioCards />,
    body: <BodyText>A gym and a yoga studio have different pricing. At some point they cost exactly the same amount. Finding <b style={{ color: PAL.ink }}>that month</b> means satisfying both rules at once.</BodyText>,
  },

  {
    kind: "teach", tag: "01 · Two conditions, one answer",
    headline: <>Each rule is a line. The answer is <span style={{ color: PAL.green }}>where they cross</span>.</>,
    visual: <TwoLinesPlot />,
    body: <BodyText>The lines meet at month 5, cost $100. That's the one point where both rules are true at the same time.</BodyText>,
  },

  {
    kind: "ab", tag: "01 · Two conditions, one answer",
    headline: "Gym: C = 10m + 50. Yoga: C = 20m. At which month do they cost the same?",
    visual: <CheckCard />,
    optionA: "Month 5",
    optionB: "Month 10",
    correct: "A",
    explain: "At m=5: gym costs 10×5+50 = $100. Yoga costs 20×5 = $100. Same price — month 5 is the answer.",
  },

  {
    kind: "teach", tag: "02 · How to find it",
    headline: "Both equations equal the same thing. So set them equal to each other.",
    visual: <SolveStepsCard />,
    body: <BodyText>You end up with one equation and one unknown. Solve for that unknown, then swap it back in to get the full answer.</BodyText>,
  },

  {
    kind: "ab", tag: "02 · How to find it",
    headline: "y = x + 3 and y = 2x. What is x?",
    visual: <TwoEquationCard eq1={<>y = x + 3</>} eq2={<>y = 2x</>} />,
    optionA: "3",
    optionB: "6",
    correct: "A",
    explain: "Set equal: x+3 = 2x. Subtract x from both sides: 3 = x. Then y = 2×3 = 6. Answer: (3, 6).",
  },

  {
    kind: "ab", tag: "02 · How to find it",
    headline: "y = 3x − 1 and y = x + 3. What is y?",
    visual: <TwoEquationCard eq1={<>y = 3x − 1</>} eq2={<>y = x + 3</>} />,
    optionA: "5",
    optionB: "2",
    correct: "A",
    explain: "Set equal: 3x−1 = x+3 → 2x = 4 → x = 2. Swap back: y = 2+3 = 5. Answer: (2, 5).",
  },

  {
    kind: "teach", tag: "03 · When there's no answer",
    headline: "Same slope means the lines go the same direction — they never cross.",
    visual: <ParallelLinesVisual />,
    body: <BodyText>No crossing point means <b style={{ color: PAL.ink }}>no answer</b>. This happens when both lines have the same slope but different starting points — they run parallel forever.</BodyText>,
  },

  {
    kind: "ab", tag: "03 · When there's no answer",
    headline: "y = 2x + 1 and y = 2x + 3. How many answers are there?",
    visual: <TwoEquationCard eq1={<>y = 2x + 1</>} eq2={<>y = 2x + 3</>} />,
    optionA: "No answers — they never cross",
    optionB: "One answer",
    correct: "A",
    explain: "Both lines have slope 2 but different starting points (1 vs 3). They go in the same direction and never meet.",
  },

  {
    kind: "ab", tag: "03 · When there's no answer",
    headline: "y = x + 4 and y = x + 4. How many answers are there?",
    visual: <TwoEquationCard eq1={<>y = x + 4</>} eq2={<>y = x + 4</>} />,
    optionA: "Every point on the line works",
    optionB: "No answers",
    correct: "A",
    explain: "They're the same line. Every single point satisfies both equations — there are infinite answers.",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "y = 2x + 5 and y = −x + 2. What is x?",
    optionA: "−1",
    optionB: "1",
    correct: "A",
    explain: "Set equal: 2x+5 = −x+2 → 3x = −3 → x = −1. Then y = 2(−1)+5 = 3. Answer: (−1, 3).",
  },

  {
    kind: "ab", tag: "SAT Question", tagColor: PAL.red,
    headline: "y = 3x − 2 and y = 3x + 5. How many solutions does this system have?",
    optionA: "No solution",
    optionB: "One solution",
    correct: "A",
    explain: "Same slope (3), different starting points (−2 and 5). Parallel lines — they never cross.",
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

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (slide.kind === "intro") {
    return (
      <DeviceFrame>
        <div style={{ width: "100%", height: "100%", background: PAL.cream, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ padding: "74px 20px 8px" }}><CloseX onClick={onClose} /></div>
          <div style={{ padding: "20px 24px 0", position: "relative", zIndex: 2 }}>
            <Tag>SAT Math · Lesson 04</Tag>
            <Headline size={40}>Two equations. One answer.</Headline>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", right: "6%",  top: "8%",  width: "38%", aspectRatio: "1", borderRadius: "50%", background: PAL.blue,   opacity: 0.7 }} />
            <div style={{ position: "absolute", left: "8%",  top: "30%", width: "26%", aspectRatio: "1", borderRadius: "50%", background: PAL.orange, opacity: 0.7 }} />
            <div style={{ position: "absolute", right: "32%",top: "52%", width: "18%", aspectRatio: "1", borderRadius: "50%", background: PAL.green }} />
            <div style={{ marginTop: "auto", padding: "0 10% 22%", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", background: PAL.blue, color: "#fff", fontFamily: MONO, fontSize: "clamp(12px, 4vw, 17px)", fontWeight: 500, padding: "10px 18px", borderRadius: 9999 }}>two lines, one point</span>
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
            <Headline size={28}>Two equations, three possible outcomes.</Headline>
            <div style={{ marginTop: 14, background: PAL.green, borderRadius: 22, padding: "16px 18px", boxShadow: `0 6px 0 ${PAL.greenDk}`, color: "#fff" }}>
              <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, lineHeight: 1.35 }}>
                Two equations share one answer when their lines cross. Set them equal, solve for x, then find y.
              </div>
            </div>
            <div style={{ marginTop: 14, fontFamily: FONT, fontSize: 12, fontWeight: 800, color: PAL.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Three possible outcomes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { dot: PAL.green,  text: "One answer: set equal, solve for x, swap back to find y." },
                { dot: PAL.red,    text: "No answer: same slope, different starting point — lines never cross." },
                { dot: PAL.orange, text: "Infinite answers: both equations are the same line." },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.dot, flexShrink: 0, marginTop: 6 }} />
                  <div style={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: PAL.ink, lineHeight: 1.45 }}>{t.text}</div>
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
            <Headline size={36}>Lesson complete.</Headline>
            <div style={{ marginTop: 14 }}>
              <BodyText size={18}>You can now find where two lines meet — and spot when they don&apos;t.</BodyText>
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
