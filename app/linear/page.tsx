"use client";
import { useState } from "react";
import InteractiveLesson from "@/components/InteractiveLesson";

export default function LinearPage() {
  const [open, setOpen] = useState(true);
  const [done, setDone] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFF7E4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: '"Nunito", var(--font-nunito), system-ui, sans-serif',
    }}>
      {!open && (
        <div style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: done ? "#38C76B" : "#1F2544",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: `0 8px 0 ${done ? "#2CA555" : "rgba(31,37,68,0.3)"}`,
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {done
                ? <path d="M7 16l6 6 12-12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M11 8l10 8-10 8V8z" fill="#fff"/>}
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1F2544", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            {done ? "Lesson complete." : "Linear Functions"}
          </h1>
          <p style={{ fontSize: 16, color: "#5A6088", margin: "0 0 32px", lineHeight: 1.5, maxWidth: 280 }}>
            {done
              ? "You can identify, graph, and apply linear functions — including the SAT traps."
              : "A 10-minute interactive lesson. No experience needed."}
          </p>
          <div
            onClick={() => { setOpen(true); if (done) setDone(false); }}
            style={{
              display: "inline-block",
              padding: "18px 40px", borderRadius: 20,
              background: "#1F2544", color: "#fff",
              fontSize: 18, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
              userSelect: "none",
            }}
          >
            {done ? "Restart lesson" : "Start lesson"}
          </div>
        </div>
      )}

      {open && (
        <InteractiveLesson
          onClose={() => setOpen(false)}
          onComplete={() => setDone(true)}
        />
      )}
    </div>
  );
}
