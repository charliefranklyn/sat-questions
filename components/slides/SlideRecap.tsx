"use client";
import React from "react";
import { PAL, FONT, MONO } from "./shared";

export interface RecapBullet {
  icon: string;           // emoji or short mono string e.g. "ΔΔ"
  color: string;          // hex color for icon bg
  title: string;          // "In a table:"
  detail: string;         // one sentence
}

export interface SlideRecapProps {
  heading: string;                     // "A linear function in one sentence."
  definition: string;                  // the green definition box text
  bullets: RecapBullet[];              // 3 bullets: table / graph / exam
  formulaLabel: string;                // "The formula"
  formulaVisual: React.ReactNode;      // the formula card component
}

export default function SlideRecap({ heading, definition, bullets, formulaLabel, formulaVisual }: SlideRecapProps) {
  return (
    <div>
      <div style={{
        fontFamily: FONT, fontSize: 12, fontWeight: 700,
        color: PAL.accent, letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: 10,
      }}>
        Key concepts recap
      </div>

      <div style={{
        fontFamily: FONT, fontSize: 36, fontWeight: 900,
        color: PAL.ink, lineHeight: 1.1, marginBottom: 24,
      }}>
        {heading}
      </div>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* Left column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Definition box */}
          <div style={{
            background: PAL.green, borderRadius: 18,
            padding: "18px 20px",
          }}>
            <div style={{
              fontFamily: FONT, fontSize: 15, fontWeight: 700,
              color: "#fff", lineHeight: 1.5,
            }}>
              {definition}
            </div>
          </div>

          {/* "How to spot" label */}
          <div style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            color: PAL.orange, letterSpacing: "0.08em",
            textTransform: "uppercase", marginTop: 4,
          }}>
            How to spot one on the selective exam
          </div>

          {/* Bullets */}
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: b.color, flexShrink: 0, marginTop: 5,
              }} />
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: PAL.ink, lineHeight: 1.5 }}>
                <b>{b.title}</b> {b.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: FONT, fontSize: 13, fontWeight: 700,
            color: PAL.inkSoft, marginBottom: 14,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {formulaLabel}
          </div>
          {formulaVisual}
        </div>
      </div>
    </div>
  );
}
