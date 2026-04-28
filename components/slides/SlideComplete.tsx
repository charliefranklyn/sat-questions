"use client";
import React from "react";
import { PAL, FONT } from "./shared";

export interface SlideCompleteProps {
  body: string;              // "You can now spot a linear function, graph one, and..."
  correctCount: number;      // 8
  totalCount: number;        // 8
  onReview: () => void;      // "Review from the start"
  onClose: () => void;       // "Back to lessons"
}

export default function SlideComplete({ body, correctCount, totalCount, onReview, onClose }: SlideCompleteProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 520 }}>
      {/* Checkmark */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: PAL.green,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l6 6 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 900, color: PAL.ink, lineHeight: 1.05 }}>
        Lesson complete.
      </div>

      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 500, color: PAL.inkSoft, lineHeight: 1.5 }}>
        {body}
      </div>

      {/* Score pill */}
      <div style={{
        display: "inline-flex", alignItems: "center",
        background: PAL.green, borderRadius: 9999,
        padding: "12px 28px", alignSelf: "flex-start",
      }}>
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, color: "#fff" }}>
          {correctCount} / {totalCount} correct
        </span>
      </div>

      {/* Review link */}
      <button
        onClick={onReview}
        style={{
          background: "none", border: "none", cursor: "pointer", padding: 0, alignSelf: "flex-start",
          fontFamily: FONT, fontSize: 14, fontWeight: 700, color: PAL.inkSoft,
          textDecoration: "underline",
        }}
      >
        Review from the start
      </button>
    </div>
  );
}
