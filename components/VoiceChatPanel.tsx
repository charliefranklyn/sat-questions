"use client";
import { useState, useEffect, useRef } from "react";
import { CHAT_W } from "@/components/ChatPanel";

const FONT = '"Inter", ui-sans-serif, system-ui, sans-serif';
const INK  = "#1E293B";
const GRAY = "#94A3B8";

// Scripts for every lesson slide (idx) and practice slides (idx 8–17)
const SCRIPTS: Record<number, { intro?: string; correct?: string; wrong?: string }> = {
  0: {
    intro: "Hi Charlie! Today we're diving into linear functions — one of the most tested topics on the SAT. Let's get started.",
  },
  1: {
    intro: "Linear functions make up about 20 to 25 percent of the SAT math section — that's 8 to 12 questions. Master this and you'll have a serious advantage.",
  },
  2: {
    intro: "Before I explain linear functions, see if you can spot the pattern yourself. Look at the earnings table — how is the amount changing each hour?",
    correct: "Great stuff! The earnings go up by exactly fifteen dollars every hour — the same amount each time. That constant change is what makes it a linear function.",
    wrong:   "Almost! Look at the change column — it's plus fifteen every single hour, not different amounts. That constant change is the key to a linear function.",
  },
  3: {
    intro: "A linear function has a constant rate of change — it goes up or down by the same amount every step. Look at both options and find which one has equal gaps.",
    correct: "Exactly! Ten, thirty, fifty, seventy — the gap is always plus twenty. Equal gaps mean constant change, which means linear.",
    wrong:   "Not quite. The first option has gaps of ten, fifteen, then twenty — all different. You need the gaps to be equal. The second option goes up by twenty every time.",
  },
  4: {
    intro: "Each pizza topping adds a different amount of time — two minutes, four minutes, three minutes. Is the change constant? Is this a linear function?",
    correct: "Well done! Because each topping adds a different amount of time, the change isn't constant — so it's not linear.",
    wrong:   "Almost! Look at the time added for each topping — two minutes, four minutes, three minutes. Those are all different amounts, so the change isn't constant. Not linear.",
  },
  5: {
    intro: "The gym charges three dollars for every hour — no matter how long you stay. Same amount every time. Is this a linear function?",
    correct: "Spot on! Three dollars every single hour — equal gaps, constant change. That's exactly what linear means.",
    wrong:   "Take another look. Three dollars added every hour means the change is always the same. That constant rate of change is the definition of linear.",
  },
  6: {
    intro: "A four dollar base fare plus two dollars per kilometre. The base fare is a fixed starting point, but the change per kilometre is constant. What do you think?",
    correct: "Perfect! Even with the four dollar base fare, every kilometre adds exactly two dollars. Constant rate of change — linear.",
    wrong:   "Look again. Yes there's a base fare of four dollars, but every kilometre still adds exactly two dollars. The change is constant, so it's linear.",
  },
  7: {
    intro: "Great work on the lesson, Charlie! Now it's time to put it into practice with ten SAT-style questions. Let's go!",
  },
  // Practice questions
  8: {
    intro:   "A phone loses twenty percent of its remaining battery each hour. Watch the change column carefully — is this linear?",
    correct: "Nice! The drop gets smaller each hour — not constant. That's exponential decay, not linear.",
    wrong:   "Look at the change column — minus twenty percent, then minus sixteen, then minus twelve point eight. The gaps are shrinking, so it's not linear.",
  },
  9: {
    intro:   "A candle burns down two centimetres every hour. That's the same amount every hour. Linear or not?",
    correct: "Exactly! Minus two centimetres every hour — constant change. Linear.",
    wrong:   "Check the change column — it's minus two every single hour. That constant rate means it is linear.",
  },
  10: {
    intro:   "A delivery driver charges five dollars per package plus a ten dollar fuel fee. Does the total go up by the same amount each time?",
    correct: "Well done! Five dollars every extra package — constant change. The ten dollar fee just shifts the starting point. Linear.",
    wrong:   "Look at the change column — plus five dollars every package, every time. That ten dollar fee is a fixed starting cost and doesn't affect the rate. It's linear.",
  },
  11: {
    intro:   "A personal trainer charges forty dollars per session plus a one-off registration fee. Same idea — does the total change by the same amount each session?",
    correct: "Correct! Forty dollars every session — constant change. The registration fee is just the starting point. Linear.",
    wrong:   "Look at the changes — plus forty every session. The registration fee only affects where you start, not the rate. Linear.",
  },
  12: {
    intro:   "Bacteria that triple every hour — and then fifty die off at the end. Is the overall change constant?",
    correct: "Great! The population triples each hour — that's exponential growth. The fifty that die off don't make it linear. Not linear.",
    wrong:   "Look at the change column — plus one fifty, then plus four fifty, then plus one thousand three fifty. Those gaps are huge and growing. Not linear — it's exponential.",
  },
  13: {
    intro:   "A plant grows two centimetres on day one, four on day two, six on day three. Is the height going up by the same amount each day?",
    correct: "Nice one! Two centimetres added every day — constant change. Linear.",
    wrong:   "Look at the height each day — two, four, six. That's plus two every single day. Constant change — it is linear.",
  },
  14: {
    intro:   "A savings account that doubles every year. Does the balance go up by the same amount each year?",
    correct: "Correct! Doubling means the increase gets bigger every year — one hundred, then two hundred, then four hundred. Not a constant change. Not linear.",
    wrong:   "Check the balance — one hundred, two hundred, four hundred. The increase is one hundred, then two hundred. Those are different — it's not linear, it's exponential.",
  },
  15: {
    intro:   "Five dollars for the first item, eight for the second, eleven for the third. Is there a constant change here?",
    correct: "Spot on! Five, eight, eleven — that's plus three every time. Constant change. Linear.",
    wrong:   "Look again — five, eight, eleven. The gap between each is three dollars. That's constant. It is linear.",
  },
  16: {
    intro:   "Two hundred megabytes pre-loaded, then one fifty per minute after that. Does the total go up by the same amount each minute?",
    correct: "Correct! One hundred and fifty megabytes every minute — constant rate. The two hundred is just the starting point. Linear.",
    wrong:   "Check the totals — two hundred, three fifty, five hundred, six fifty. The gap is always one fifty. Constant change — linear.",
  },
  17: {
    intro:   "Three dollars for the first hour, two for the second, then three for every hour after. Watch the gaps carefully here.",
    correct: "Well spotted! The gap goes three, two, three, three — that's not constant. Not linear.",
    wrong:   "Look at the totals — three, five, eight, eleven. The gaps are two, three, three. They're not all the same, so it's not linear.",
  },
};

async function speakElevenLabs(
  text: string,
  onStart: () => void,
  onEnd: () => void,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  cacheRef: React.MutableRefObject<Record<string, string>>,
  abortRef: React.MutableRefObject<AbortController | null>,
  cacheKey: string,
) {
  // Cancel any in-flight fetch and stop any playing audio
  if (abortRef.current) abortRef.current.abort();
  if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

  const controller = new AbortController();
  abortRef.current = controller;

  try {
    let url = cacheRef.current[cacheKey];
    if (!url) {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      if (!res.ok) { onEnd(); return; }
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      cacheRef.current[cacheKey] = url;
    }

    if (controller.signal.aborted) return;

    onStart();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => onEnd();
    audio.onerror = () => onEnd();
    await audio.play();
  } catch {
    onEnd();
  }
}

function VoiceCircle({ name, gradient, pulseColor, speaking, initial }: {
  name: string; gradient: string; pulseColor: string; speaking: boolean; initial: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {speaking && (
          <>
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: pulseColor, opacity: 0, animation: "voicePulse 1.8s ease-out infinite" }} />
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: pulseColor, opacity: 0, animation: "voicePulse 1.8s ease-out infinite 0.6s" }} />
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: pulseColor, opacity: 0, animation: "voicePulse 1.8s ease-out infinite 1.2s" }} />
          </>
        )}
        {!speaking && (
          <div style={{ position: "absolute", width: 96, height: 96, borderRadius: "50%", background: pulseColor, opacity: 0.12 }} />
        )}
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: speaking ? `0 0 0 5px ${pulseColor}` : "none",
          transition: "box-shadow 0.4s ease", zIndex: 1,
        }}>
          <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: "#fff" }}>{initial}</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK }}>{name}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY, marginTop: 3 }}>
          {speaking ? "Speaking…" : "Listening"}
        </div>
      </div>
    </div>
  );
}

export default function VoiceChatPanel({
  top = 56, slideIdx, answered, isCorrect, onFeedbackDone,
}: {
  top?: number; slideIdx: number; answered: boolean;
  isCorrect?: boolean; onFeedbackDone?: () => void;
}) {
  const [teacherSpeaking, setTeacherSpeaking] = useState(false);
  const [studentSpeaking, setStudentSpeaking] = useState(false);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const abortRef    = useRef<AbortController | null>(null);
  const answeredRef = useRef(false);
  const cacheRef    = useRef<Record<string, string>>({});

  useEffect(() => {
    const script = SCRIPTS[slideIdx];
    answeredRef.current = false;
    setTeacherSpeaking(false);
    setStudentSpeaking(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    if (!script?.intro) return;

    speakElevenLabs(
      script.intro,
      () => setTeacherSpeaking(true),
      () => setTeacherSpeaking(false),
      audioRef, cacheRef, abortRef, `intro-${slideIdx}`,
    );

    return () => {
      if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setTeacherSpeaking(false);
    };
  }, [slideIdx]);

  useEffect(() => {
    if (!answered || answeredRef.current) return;
    answeredRef.current = true;
    const script = SCRIPTS[slideIdx];
    const feedback = isCorrect ? script?.correct : script?.wrong;
    if (!feedback) return;

    setStudentSpeaking(true);
    const t = setTimeout(() => {
      setStudentSpeaking(false);
      const key = isCorrect ? `correct-${slideIdx}` : `wrong-${slideIdx}`;
      speakElevenLabs(
        feedback,
        () => setTeacherSpeaking(true),
        () => { setTeacherSpeaking(false); setTimeout(() => onFeedbackDone?.(), 600); },
        audioRef, cacheRef, abortRef, key,
      );
    }, 700);
    return () => clearTimeout(t);
  }, [answered, isCorrect, slideIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        @keyframes voicePulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.1); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: "fixed", top, left: 0, bottom: 0, width: CHAT_W,
        background: "#fff", borderRight: "1px solid #E2E8F0",
        zIndex: 300, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 52, fontFamily: FONT,
      }}>
        <VoiceCircle
          name="Teacher"
          gradient="linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)"
          pulseColor="rgba(245,158,11,0.28)"
          speaking={teacherSpeaking}
          initial="T"
        />
        <VoiceCircle
          name="Charlie"
          gradient="linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)"
          pulseColor="rgba(78,126,254,0.28)"
          speaking={studentSpeaking}
          initial="C"
        />
      </div>
    </>
  );
}
