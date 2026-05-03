"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import InteractiveLessonL1, { LessonL1Handle } from "@/components/InteractiveLessonL1";
import VoiceChatPanel from "@/components/VoiceChatPanel";

const FONT = '"Inter", ui-sans-serif, system-ui, sans-serif';

function TopNav() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 56,
      background: "#fff", borderBottom: "1px solid rgba(226,232,240,0.6)",
      zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingLeft: 24, paddingRight: 24,
      pointerEvents: "none",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span style={{
          fontFamily: FONT, fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em",
          background: "linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>awaken</span>
        <span style={{
          fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em",
          color: "#1e3a8a", textTransform: "uppercase", marginTop: 1,
        }}>learning</span>
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg,#4e7efe 0%,#1c45f6 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>C</span>
      </div>
    </div>
  );
}

export default function Experiment1Page() {
  const router    = useRouter();
  const lessonRef = useRef<LessonL1Handle>(null);

  const [slideIdx, setSlideIdx]   = useState(2);
  const [answered, setAnswered]   = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);

  const handleSlideChange = useCallback((idx: number) => {
    setSlideIdx(idx);
    setAnswered(false);
    setIsCorrect(undefined);
  }, []);

  const handleAnswer = useCallback((_picked: number, correct: boolean) => {
    setIsCorrect(correct);
    setAnswered(true);
  }, []);

  const handleFeedbackDone = useCallback(() => {
    lessonRef.current?.next();
  }, []);

  return (
    <>
      <InteractiveLessonL1
        ref={lessonRef}
        onClose={() => router.push("/mathematics")}
        onComplete={() => {}}
        chatSide="left"
        startIdx={2}
        onSlideChange={handleSlideChange}
        onAnswer={handleAnswer}
      />
      <VoiceChatPanel
        top={56}
        slideIdx={slideIdx}
        answered={answered}
        isCorrect={isCorrect}
        onFeedbackDone={handleFeedbackDone}
      />
      <TopNav />
    </>
  );
}
