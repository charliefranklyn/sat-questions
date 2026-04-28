"use client";
import { useState, useEffect } from "react";
import ChatPanel, { CHAT_W } from "@/components/ChatPanel";
import { Inter } from "next/font/google";

function playCorrect() {
  const audio = new Audio("/sounds/correct.mp3");
  audio.play().catch(() => {});
}

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700","800","900"] });

const PAL = {
  cream:    "#FFF7E4",
  ink:      "#1F2544",
  inkSoft:  "#5A6088",
  green:    "#38C76B",
  greenDk:  "#2CA555",
  blue:     "#2DADE8",
  orange:   "#FF8A3D",
  orangeDk: "#DB6D22",
  red:      "#EF5A5A",
  yellow:   "#FFD23F",
  purple:   "#A86CE4",
  accent:   "#3B5BDB",
};

const FONT = '"Inter", ui-sans-serif, system-ui, sans-serif';

function BgCircles() {
  return (
    <>
      <div style={{ position:"absolute", right:"-5%", top:"-13%", width:"36vw", height:"36vw", maxWidth:520, maxHeight:520, borderRadius:"50%", background:PAL.yellow,  opacity:0.52, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:"19%",  top:"6%",   width:"20vw", height:"20vw", maxWidth:290, maxHeight:290, borderRadius:"50%", background:"#F4A088", opacity:0.58, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:"7%",   top:"44%",  width:"25vw", height:"25vw", maxWidth:360, maxHeight:360, borderRadius:"50%", background:"#8ECFA0", opacity:0.52, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:"-4%",  bottom:"-9%", width:"28vw", height:"28vw", maxWidth:400, maxHeight:400, borderRadius:"50%", background:"#A8C4E0", opacity:0.50, pointerEvents:"none" }}/>
    </>
  );
}

export type SlideData =
  | { kind: "intro" }
  | { kind: "teach"; tag: string; tagColor?: string; headline: React.ReactNode; visual?: React.ReactNode; body?: React.ReactNode }
  | { kind: "ab"; tag: string; tagColor?: string; headline: React.ReactNode; visual?: React.ReactNode; optionA: string; optionB: string; correct: "A" | "B"; explain: string }
  | { kind: "recap" }
  | { kind: "complete" };

type OptionState = "idle" | "correct" | "wrong" | "dim";

function OptionRow({ letter, label, state, onClick }: {
  letter: string; label: string; state: OptionState; onClick?: () => void;
}) {
  const styles: Record<OptionState, { bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
    idle:    { bg: "#fff",    border: "rgba(31,37,68,0.12)", text: PAL.ink,     badgeBg: "#FFEAB8",  badgeText: PAL.ink },
    correct: { bg: "#E7F8EC", border: PAL.green,             text: PAL.ink,     badgeBg: PAL.green,  badgeText: "#fff" },
    wrong:   { bg: "#FDECEC", border: PAL.red,               text: PAL.inkSoft, badgeBg: PAL.red,    badgeText: "#fff" },
    dim:     { bg: "#fff",    border: "rgba(31,37,68,0.07)", text: "rgba(31,37,68,0.35)", badgeBg: "rgba(31,37,68,0.07)", badgeText: "rgba(31,37,68,0.3)" },
  };
  const s = styles[state];
  return (
    <div
      onClick={state === "idle" ? onClick : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 18px", borderRadius: 16,
        background: s.bg, border: `2px solid ${s.border}`,
        cursor: state === "idle" ? "pointer" : "default",
        transition: "all 0.15s",
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 10, background: s.badgeBg, color: s.badgeText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 15, fontWeight: 900, flexShrink: 0 }}>
        {letter}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: s.text, flex: 1, lineHeight: 1.3 }}>{label}</div>
      {state === "correct" && (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill={PAL.green}/>
          <path d="M6 11l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {state === "wrong" && (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill={PAL.red}/>
          <path d="M7 7l8 8M15 7l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

type Props = {
  slides: SlideData[];
  onClose: () => void;
  onComplete?: () => void;
  introContent: React.ReactNode;
  recapContent: React.ReactNode;
  completeBody: string;
  completeScore: string;
};

export default function LessonShellExp3({ slides, onClose, onComplete, introContent, recapContent, completeBody, completeScore }: Props) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number, "A" | "B">>({});

  const slide = slides[slideIdx];
  const pickedHere = picks[slideIdx] ?? null;
  const submitted = pickedHere !== null;
  const SEGS = slides.length - 1;

  const isIntro    = slide.kind === "intro";
  const isComplete = slide.kind === "complete";
  const showTopBar = !isIntro && !isComplete;
  const showFeedback = slide.kind === "ab" && submitted;

  function getOptionState(letter: "A" | "B"): OptionState {
    if (!submitted) return "idle";
    const s = slide as Extract<SlideData, { kind: "ab" }>;
    if (letter === s.correct) return "correct";
    if (letter === pickedHere) return "wrong";
    return "dim";
  }

  useEffect(() => {
    if (slide.kind === "complete") playCorrect();
  }, [slideIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    if (slideIdx + 1 >= slides.length) { onComplete?.(); onClose(); return; }
    setSlideIdx(i => i + 1);
  }

  function goBack() { setSlideIdx(i => i - 1); }

  return (
    <>
    <ChatPanel />
    <div
      className={inter.className}
      style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: CHAT_W, background: "#E8E3DA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, zIndex: 100 }}
    >
      <div style={{
        width: "min(1448px, 97vw)",
        height: "min(1086px, calc(100vh - 32px))",
        background: PAL.cream,
        borderRadius: 20,
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}>
        <BgCircles />

        {/* 3-row grid: top (auto) | content (1fr, clipped) | bottom (auto)
            Separator line on bottom zone is the hard visual boundary */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0, display: "grid", gridTemplateRows: "auto 1fr auto", overflow: "hidden" }}>

          {/* ── Row 1: top zone ── */}
          <div>
            {showTopBar && (
              <div style={{ padding: "22px 60px 0", display: "flex", alignItems: "center", gap: 20 }}>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M4 4l12 12M16 4L4 16" stroke={PAL.ink} strokeWidth="2.4" strokeLinecap="round"/>
                  </svg>
                </button>
                <div style={{ flex: 1, height: 7, borderRadius: 99, background: "rgba(31,37,68,0.1)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(slideIdx / SEGS) * 100}%`, borderRadius: 99, background: PAL.accent, transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}
            {isIntro && (
              <div style={{ padding: "22px 60px 0" }}>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M4 4l12 12M16 4L4 16" stroke={PAL.ink} strokeWidth="2.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* ── Row 2: content (1fr, overflow:hidden — hard clip at separator) ── */}
          <div style={{ overflow: "hidden", padding: "24px 60px 0" }}>

            {/* INTRO */}
            {isIntro && (
              <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                {introContent}
              </div>
            )}

            {/* TEACH — single column matching lesson 1 */}
            {slide.kind === "teach" && (() => {
              const s = slide as Extract<SlideData, { kind: "teach" }>;
              return (
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: s.tagColor || PAL.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    {s.tag}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 900, color: PAL.ink, lineHeight: 1.1, marginBottom: 12, maxWidth: 660 }}>
                    {s.headline}
                  </div>
                  {s.body && (
                    <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 500, color: PAL.inkSoft, lineHeight: 1.55, marginBottom: 20, maxWidth: 580 }}>
                      {s.body}
                    </div>
                  )}
                  {s.visual && <div style={{ maxWidth: 740 }}>{s.visual}</div>}
                </div>
              );
            })()}

            {/* AB — single column matching lesson 1 */}
            {slide.kind === "ab" && (() => {
              const s = slide as Extract<SlideData, { kind: "ab" }>;
              return (
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: s.tagColor || PAL.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    {s.tag}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 900, color: PAL.ink, lineHeight: 1.15, marginBottom: 18, maxWidth: 680 }}>
                    {s.headline}
                  </div>
                  {s.visual && <div style={{ maxWidth: 740, marginBottom: 18 }}>{s.visual}</div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 660 }}>
                    <OptionRow letter="A" label={s.optionA} state={submitted ? getOptionState("A") : "idle"} onClick={() => { if (!submitted) { if ("A" === s.correct) playCorrect(); setPicks(p => ({ ...p, [slideIdx]: "A" })); } }} />
                    <OptionRow letter="B" label={s.optionB} state={submitted ? getOptionState("B") : "idle"} onClick={() => { if (!submitted) { if ("B" === s.correct) playCorrect(); setPicks(p => ({ ...p, [slideIdx]: "B" })); } }} />
                  </div>
                </div>
              );
            })()}

            {/* RECAP */}
            {slide.kind === "recap" && (
              <div style={{ height: "100%", overflow: "hidden" }}>
                {recapContent}
              </div>
            )}

            {/* COMPLETE */}
            {isComplete && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 500 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: PAL.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 7px 0 ${PAL.greenDk}` }}>
                    <svg width="40" height="40" viewBox="0 0 64 64">
                      <path d="M14 33l12 12 24-24" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 900, color: PAL.ink, lineHeight: 1.05 }}>Lesson complete.</div>
                  <div style={{ fontFamily: FONT, fontSize: 16, color: PAL.inkSoft, lineHeight: 1.6 }}>{completeBody}</div>
                  <span style={{ background: PAL.green, color: "#fff", fontFamily: FONT, fontSize: 16, fontWeight: 800, padding: "12px 24px", borderRadius: 9999, display: "inline-block", boxShadow: `0 5px 0 ${PAL.greenDk}` }}>{completeScore}</span>
                </div>
              </div>
            )}

          </div>{/* content row */}

          {/* ── Row 3: bottom zone — separator is the hard boundary ── */}
          <div style={{ borderTop: showFeedback ? "none" : "2px solid rgba(31,37,68,0.10)" }}>

            {/* Feedback banner — fills bottom zone, colour replaces separator */}
            {showFeedback && (() => {
              const s = slide as Extract<SlideData, { kind: "ab" }>;
              const isCorrect = pickedHere === s.correct;
              return (
                <div style={{ background: isCorrect ? PAL.green : PAL.red, padding: "18px 60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        {isCorrect
                          ? <path d="M2 8l4 4 8-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          : <path d="M3 3l10 10M13 3L3 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                        }
                      </svg>
                      {isCorrect ? "Nice." : "Not quite."}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.92)", lineHeight: 1.5, maxWidth: 620 }}>
                      {s.explain}
                    </div>
                  </div>
                  <button onClick={advance} style={{ padding: "12px 30px", background: "#fff", color: isCorrect ? PAL.greenDk : PAL.red, border: "none", borderRadius: 12, fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                    Continue
                  </button>
                </div>
              );
            })()}

            {/* Intro: START LESSON */}
            {isIntro && (
              <div style={{ padding: "14px 60px 22px", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={advance} style={{ padding: "14px 48px", background: PAL.ink, color: "#fff", border: "none", borderRadius: 14, fontFamily: FONT, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 5px 0 rgba(0,0,0,0.18)" }}>
                  Start lesson
                </button>
              </div>
            )}

            {/* Complete: review + back */}
            {isComplete && (
              <div style={{ padding: "14px 60px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => setSlideIdx(0)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, color: PAL.inkSoft }}>
                  Review from the start
                </button>
                <button onClick={() => { onComplete?.(); onClose(); }} style={{ padding: "12px 32px", background: PAL.ink, color: "#fff", border: "none", borderRadius: 14, fontFamily: FONT, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 0 rgba(0,0,0,0.18)" }}>
                  Back to lessons
                </button>
              </div>
            )}

            {/* Teach / recap / AB-before-pick: BACK + CONTINUE */}
            {showTopBar && !showFeedback && (
              <div style={{ padding: "14px 60px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {slideIdx > 0 ? (
                  <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 12, border: "2px solid rgba(31,37,68,0.18)", background: "#fff", cursor: "pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke={PAL.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: PAL.ink }}>Back</span>
                  </button>
                ) : <div />}
                {slide.kind === "ab" ? (
                  <button disabled style={{ padding: "12px 38px", background: "rgba(31,37,68,0.1)", color: "rgba(31,37,68,0.35)", border: "none", borderRadius: 14, fontFamily: FONT, fontSize: 14, fontWeight: 800, cursor: "not-allowed" }}>
                    Pick an answer
                  </button>
                ) : (
                  <button onClick={advance} style={{ padding: "12px 38px", background: PAL.ink, color: "#fff", border: "none", borderRadius: 14, fontFamily: FONT, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 5px 0 rgba(0,0,0,0.18)" }}>
                    {slide.kind === "recap" ? "Finish lesson" : "Continue"}
                  </button>
                )}
              </div>
            )}

          </div>{/* bottom zone */}

        </div>{/* inner grid */}
      </div>{/* card */}
    </div>
    </>
  );
}
