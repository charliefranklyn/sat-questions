"use client";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export const CHAT_W = 378;

const FONT   = '"Inter", ui-sans-serif, system-ui, sans-serif';
const INK    = "#1E293B";
const ACCENT = "#3B5BDB";
const GRAY   = "#94A3B8";

type LabelType = "correct" | "wrong" | "hint";
type Feedback = "up" | "down" | null;
type Msg = { role: "user" | "assistant"; content: string; label?: string; labelType?: LabelType };

const LABEL_COLORS: Record<LabelType, { bg: string; color: string }> = {
  correct: { bg: "#DCFCE7", color: "#16A34A" },
  wrong:   { bg: "#FEE2E2", color: "#DC2626" },
  hint:    { bg: "#EEF2FF", color: ACCENT },
};

function Pill({ label, labelType }: { label: string; labelType: LabelType }) {
  const { bg, color } = LABEL_COLORS[labelType];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5, alignSelf: "flex-start",
      padding: "4px 12px", borderRadius: 99,
      background: bg, color, fontSize: 12, fontWeight: 700, fontFamily: FONT,
    }}>
      {labelType === "hint" && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="2.5"/>
          <path d="M12 8v5M12 16v1" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )}
      {labelType === "correct" && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {labelType === "wrong" && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )}
      {label}
    </div>
  );
}

function CurlyArrow() {
  return (
    <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
      <path d="M30 4 C10 4 8 30 20 44 C32 58 28 68 24 76" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M18 70 L24 78 L30 70" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// Icon for "I still don't get it"
function ConfusedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="2"/>
      <path d="M9 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.5" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5"/>
    </svg>
  );
}

// Icon for "I have a question"
function QuestionBubbleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ChatPanel({
  top = 0, locked = false, hintOnly = false,
  autoMessage, tipMessage, slideKey = 0,
  answeredLabel, answeredCorrect, slideContext,
  mobileOpen = false, onMobileClose,
  side = "right",
}: {
  top?: number; locked?: boolean; hintOnly?: boolean;
  autoMessage?: string; tipMessage?: string; slideKey?: number;
  answeredLabel?: string; answeredCorrect?: boolean; slideContext?: string;
  mobileOpen?: boolean; onMobileClose?: () => void;
  side?: "left" | "right";
}) {
  const isMobile = useIsMobile();
  const [messages, setMessages]             = useState<Msg[]>([]);
  const [feedback, setFeedback]             = useState<Feedback[]>([]);
  const [chipsDismissed, setChipsDismissed] = useState(false);
  const [feedbackShown, setFeedbackShown]   = useState(false);
  const [inputText, setInputText]           = useState("");
  const [loading, setLoading]               = useState(false);
  const lastAutoRef = useRef<string | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages([]);
    setFeedback([]);
    setChipsDismissed(false);
    setFeedbackShown(false);
    setInputText("");
    lastAutoRef.current = null;
  }, [slideKey]);

  useEffect(() => {
    if (autoMessage && autoMessage !== lastAutoRef.current) {
      lastAutoRef.current = autoMessage;
      setFeedbackShown(true);
      const labelType: LabelType = answeredCorrect ? "correct" : "wrong";
      const label = answeredLabel
        ? `You submitted answer ${answeredLabel}`
        : answeredCorrect ? "Correct" : "Incorrect";
      setMessages(m => [...m, { role: "assistant", content: autoMessage, label, labelType }]);
      setFeedback(f => [...f, null]);
    }
  }, [autoMessage, answeredCorrect, answeredLabel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addMsg = (msgs: Msg[]) => {
    setMessages(m => [...m, ...msgs]);
    setFeedback(f => [...f, ...msgs.map(() => null as Feedback)]);
  };

  const sendHint = () => {
    const content = tipMessage
      ? `Here's a hint:\n\n${tipMessage}`
      : "Re-read the question carefully and think about what each value in the table or graph is telling you.";
    addMsg([
      { role: "user", content: "I need a hint!" },
      { role: "assistant", content, label: "You requested a hint", labelType: "hint" },
    ]);
  };

  const injectStillConfused = () => {
    const restate = tipMessage
      ? `Let's break this down. ${tipMessage}\n\nWhich part confused you most — the setup, the calculation, or why the correct answer works?`
      : "Let me try explaining that differently. Which part confused you most — the setup, the calculation, or why the correct answer works?";
    addMsg([
      { role: "user", content: "I still don't get it" },
      { role: "assistant", content: restate, label: "Let me help", labelType: "hint" },
    ]);
    setChipsDismissed(true);
  };

  const injectQuestion = () => {
    addMsg([
      { role: "user", content: "I have a question" },
      { role: "assistant", content: "What are you wondering? I can help with anything about this question.", label: "Ask away", labelType: "hint" },
    ]);
    setChipsDismissed(true);
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || loading) return;
    setInputText("");

    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setFeedback(f => [...f, null]);
    setLoading(true);

    try {
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, context: slideContext }),
      });
      const { content } = await res.json() as { content: string };
      setMessages(m => [...m, { role: "assistant", content, labelType: "hint" }]);
      setFeedback(f => [...f, null]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, couldn't connect. Try again!", labelType: "hint" }]);
      setFeedback(f => [...f, null]);
    } finally {
      setLoading(false);
    }
  };

  const hasMsgs     = messages.length > 0;
  const showChips   = feedbackShown && !chipsDismissed;
  const showHint    = hintOnly && !feedbackShown;
  const showInput   = chipsDismissed && !locked;

  const chipDefs = [
    { label: "I still don't get it", icon: <ConfusedIcon />, fn: injectStillConfused },
    { label: "I have a question",    icon: <QuestionBubbleIcon />, fn: injectQuestion },
  ];

  if (isMobile && !mobileOpen) return null;

  return (
    <div style={{
      position: "fixed",
      ...(isMobile
        ? { top: 0, left: 0, right: 0, bottom: 0, width: "100%" }
        : side === "left"
          ? { top, left: 0, bottom: 0, width: CHAT_W }
          : { top, right: 0, bottom: 0, width: CHAT_W }),
      background: "#fff", borderLeft: (!isMobile && side === "right") ? "1px solid #E2E8F0" : "none", borderRight: (!isMobile && side === "left") ? "1px solid #E2E8F0" : "none",
      display: "flex", flexDirection: "column", zIndex: 200, fontFamily: FONT,
    }}>
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid #E2E8F0" }}>
          <button onClick={onMobileClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 14, fontWeight: 600, color: ACCENT }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: INK }}>AI Tutor</span>
        </div>
      )}

      {/* Message area */}
      <div style={{
        flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column",
        alignItems: hasMsgs ? "stretch" : "center",
        justifyContent: hasMsgs ? "flex-start" : "center",
        padding: hasMsgs ? "16px" : "32px 20px",
        gap: hasMsgs ? 8 : 0,
      }}>
        {!hasMsgs ? (
          <>
            <img src="/acely-tutor.png" alt="Acely" style={{ width: 200, height: "auto" }} />
            <div style={{ textAlign: "center", fontSize: 14, color: "#64748B", lineHeight: 1.6, maxWidth: 220, marginTop: 12 }}>
              {locked
                ? <><strong style={{ display: "block", color: INK }}>Chat is locked.</strong>Unlocks on question slides.</>
                : hintOnly
                  ? <><strong style={{ display: "block", color: INK }}>Feeling stuck?</strong>Hit Hint for a nudge, or answer the question to get full feedback.</>
                  : <><strong style={{ display: "block", color: INK }}>Answer the question</strong>and I'll give you feedback here.</>
              }
            </div>
            <CurlyArrow />
          </>
        ) : (
          <>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} style={{
                  alignSelf: "flex-end", maxWidth: "80%",
                  background: "#E2E8F0", color: INK,
                  borderRadius: "16px 16px 4px 16px",
                  padding: "10px 14px", fontSize: 13, lineHeight: 1.5,
                  fontWeight: 500,
                }}>
                  {m.content}
                </div>
              ) : (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {m.label && m.labelType && <Pill label={m.label} labelType={m.labelType} />}
                  <div style={{
                    maxWidth: "90%", background: "#F1F5F9", color: INK,
                    borderRadius: "4px 16px 16px 16px",
                    padding: "12px 16px", fontSize: 13, lineHeight: 1.6,
                    whiteSpace: "pre-wrap", fontWeight: 400,
                  }}>
                    {m.content}
                  </div>
                  <div style={{ display: "flex", gap: 4, paddingLeft: 2 }}>
                    {(["up", "down"] as const).map(dir => {
                      const active = feedback[i] === dir;
                      return (
                        <button
                          key={dir}
                          onClick={() => setFeedback(f => f.map((v, j) => j === i ? (v === dir ? null : dir) : v))}
                          title={dir === "up" ? "Helpful" : "Not helpful"}
                          style={{
                            border: "none", background: "none", cursor: "pointer",
                            padding: 4, borderRadius: 6, lineHeight: 0,
                            opacity: active ? 1 : 0.35,
                            transition: "opacity 0.15s",
                          }}
                        >
                          {dir === "up" ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? ACCENT : "none"} stroke={active ? ACCENT : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? "#DC2626" : "none"} stroke={active ? "#DC2626" : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div style={{
                alignSelf: "flex-start", background: "#F1F5F9", color: GRAY,
                borderRadius: "4px 16px 16px 16px",
                padding: "12px 16px", fontSize: 13,
              }}>
                ...
              </div>
            )}

            {showChips && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                {chipDefs.map(({ label, icon, fn }) => (
                  <button
                    key={label}
                    onClick={fn}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      alignSelf: "flex-start",
                      padding: "9px 16px", border: `1.5px solid ${ACCENT}`, borderRadius: 99,
                      background: "#fff", color: ACCENT, fontFamily: FONT, fontSize: 13,
                      fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Hint button — only before answering */}
      {showHint && (
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #F1F5F9" }}>
          <button
            onClick={sendHint}
            title="Click here if you need extra help - just note you'll earn half a mark instead of a full mark."
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 99,
              border: "1px solid #E2E8F0", background: "#F8FAFC",
              fontSize: 13, fontWeight: 600, color: "#475569",
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={GRAY} strokeWidth="2"/>
              <path d="M12 8v5M12 16v1" stroke={GRAY} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Hint
          </button>
        </div>
      )}

      {/* Text input — appears after chip selection */}
      {showInput && (
        <div style={{ padding: "10px 12px 12px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            background: "#F8FAFC", borderRadius: 14,
            border: "1px solid #E2E8F0", padding: "8px 10px",
          }}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your message…"
              rows={1}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontFamily: FONT, fontSize: 13, color: INK, resize: "none",
                lineHeight: 1.5, maxHeight: 100, overflowY: "auto",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || loading}
              style={{
                width: 30, height: 30, borderRadius: "50%", border: "none",
                background: inputText.trim() && !loading ? ACCENT : "#E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: inputText.trim() && !loading ? "pointer" : "default",
                flexShrink: 0, transition: "background 0.15s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
