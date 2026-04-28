"use client";
import React from "react";
import { PAL, FONT } from "./shared";

export interface SlideTeachProps {
  tag: string;                         // "1. What is Linear?"
  tagColor?: string;                   // defaults to PAL.accent
  headline: React.ReactNode;           // supports <span> for colored words
  body?: React.ReactNode;              // 1–2 sentence explanation (optional)
  visual?: React.ReactNode;            // any visual component (optional)
}

export default function SlideTeach({ tag, tagColor, headline, body, visual }: SlideTeachProps) {
  return (
    <div>
      <div style={{
        fontFamily: FONT, fontSize: 12, fontWeight: 700,
        color: tagColor ?? PAL.accent,
        letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 8,
      }}>
        {tag}
      </div>

      <div style={{
        fontFamily: FONT, fontSize: 38, fontWeight: 900,
        color: PAL.ink, lineHeight: 1.1,
        marginBottom: body ? 10 : 20,
        maxWidth: 660,
      }}>
        {headline}
      </div>

      {body && (
        <div style={{
          fontFamily: FONT, fontSize: 16, fontWeight: 500,
          color: PAL.inkSoft, lineHeight: 1.5,
          marginBottom: 20, maxWidth: 600,
        }}>
          {body}
        </div>
      )}

      {visual && (
        <div style={{ maxWidth: 740 }}>
          {visual}
        </div>
      )}
    </div>
  );
}
