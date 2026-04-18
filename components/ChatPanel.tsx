"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 8a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="14" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 5.5h2.5L8 2.5v10L4.5 9.5H2v-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M10 5a3 3 0 010 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="3" y="3" width="9" height="9" rx="2" fill="currentColor"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: "#94a3b8",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  );
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingIdx(null);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }

  function toggleMic() {
    if (listening) {
      stopListening();
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input isn't supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      recognitionRef.current = null;
      // Auto-send the spoken message
      sendText(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }

  async function speak(text: string, idx: number) {
    if (playingIdx === idx) {
      stopAudio();
      return;
    }
    stopAudio();
    setPlayingIdx(idx);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => {
        setPlayingIdx(null);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };
    } catch {
      setPlayingIdx(null);
    }
  }

  async function sendText(text: string) {
    if (!text.trim() || streaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    stopAudio();

    const newUserMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return copy;
      });
    }

    setStreaming(false);
  }

  async function send() {
    await sendText(input);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }

  const lastIsStreaming = streaming && messages[messages.length - 1]?.content === "";

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4e7efe, #1c45f6)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2a6 6 0 110 12A6 6 0 018 2zm0 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 018 5.5zm0 5.25a.875.875 0 110 1.75.875.875 0 010-1.75z" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">AI Tutor</div>
            <div className="text-[10px] text-slate-400">SAT · Ask anything</div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
          <XIcon />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4e7efe, #1c45f6)" }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M4 20L8 16H22V4H4V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9 10h8M9 13h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900 mb-1">Ask your SAT tutor anything</p>
              <p className="text-sm text-slate-400 max-w-[220px]">
                Type or tap the mic to speak your question.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
              {["Explain slope-intercept form", "How do I find the main idea?", "What's the difference between affect and effect?"].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                  className="text-left text-sm px-4 py-2.5 rounded-xl border transition-colors hover:bg-slate-50"
                  style={{ border: "1px solid #e2e8f0", color: "#334155" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isLast = i === messages.length - 1;
          const showDots = isLast && lastIsStreaming;
          const isPlaying = playingIdx === i;
          const canSpeak = !isUser && !showDots && !!msg.content && !streaming;

          return (
            <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              {showDots ? (
                <div className="rounded-2xl max-w-[85%]" style={{ background: "#f1f5f9" }}>
                  <TypingDots />
                </div>
              ) : (
                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap"
                  style={
                    isUser
                      ? { background: "linear-gradient(135deg, #4e7efe, #1c45f6)", color: "white" }
                      : { background: "#f1f5f9", color: "#1e293b" }
                  }
                >
                  {msg.content}
                </div>
              )}

              {canSpeak && (
                <button
                  onClick={() => speak(msg.content, i)}
                  className="mt-1 px-2 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-medium transition-all"
                  style={{
                    color: isPlaying ? "#4e7efe" : "#94a3b8",
                    background: isPlaying ? "#eff6ff" : "transparent",
                    animation: isPlaying ? "pulse-ring 1.5s ease-in-out infinite" : undefined,
                  }}
                >
                  {isPlaying ? <StopIcon /> : <SpeakerIcon />}
                  {isPlaying ? "Stop" : "Listen"}
                </button>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 pb-6 pt-2 border-t border-slate-100">
        {listening && (
          <div className="flex items-center justify-center gap-2 mb-3 text-sm font-medium" style={{ color: "#ef4444" }}>
            <span className="w-2 h-2 rounded-full bg-red-500" style={{ animation: "pulse-ring 1s ease-in-out infinite" }} />
            Listening… speak now
          </div>
        )}
        <div
          className="flex items-end gap-2 rounded-2xl px-4 py-3"
          style={{ background: "#f8fafc", border: `1.5px solid ${listening ? "#fca5a5" : "#e2e8f0"}` }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={onInput}
            onKeyDown={onKeyDown}
            placeholder={listening ? "Listening…" : "Ask a question…"}
            disabled={streaming || listening}
            className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none leading-relaxed"
            style={{ maxHeight: 96, overflowY: "auto" }}
          />
          {/* Mic button */}
          <button
            onClick={toggleMic}
            disabled={streaming}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{
              background: listening ? "#ef4444" : "#e2e8f0",
              color: listening ? "white" : "#94a3b8",
              animation: listening ? "mic-pulse 1s ease-in-out infinite" : undefined,
            }}
            aria-label={listening ? "Stop recording" : "Speak your question"}
          >
            <MicIcon />
          </button>
          {/* Send button */}
          <button
            onClick={send}
            disabled={!input.trim() || streaming || listening}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{
              background: input.trim() && !streaming && !listening ? "linear-gradient(135deg, #4e7efe, #1c45f6)" : "#e2e8f0",
              color: input.trim() && !streaming && !listening ? "white" : "#94a3b8",
            }}
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 text-center mt-2">Tap mic to speak · Shift + Enter for new line</p>
      </div>
    </div>
  );
}
