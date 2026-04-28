"use client";
import { useState } from "react";
import InteractiveLessonL1 from "@/components/InteractiveLessonL1";
import InteractiveLessonL2 from "@/components/InteractiveLessonL2";
import InteractiveLessonL3 from "@/components/InteractiveLessonL3";
import InteractiveLessonL4 from "@/components/InteractiveLessonL4";
import InteractiveLessonL5 from "@/components/InteractiveLessonL5";
import InteractiveLessonL6 from "@/components/InteractiveLessonL6";
import InteractiveLessonL7 from "@/components/InteractiveLessonL7";

const INK    = "#1F2544";
const SOFT   = "#5A6088";
const ACCENT = "#3B5BDB";
const BORDER = "rgba(31,37,68,0.09)";
const FONT   = '"Inter", ui-sans-serif, system-ui, sans-serif';
const MONO   = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';
const GREEN    = "#38C76B";
const GREEN_DK = "#2CA555";
const GOLD     = "#F59E0B";
const SILVER   = "#94A3B8";
const BRONZE   = "#CD7C2E";

type LessonId = "l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7";

const LINEAR_LESSONS = [
  { id: "l1" as LessonId, num: "01", title: "Recognising Linear Functions",   count: 10, locked: false },
  { id: "l2" as LessonId, num: "02", title: "Graphing Linear Functions",      count: 10, locked: false },
  { id: "l3" as LessonId, num: "03", title: "Writing Linear Equations",       count: 10, locked: false },
  { id: "l4" as LessonId, num: "04", title: "The Slope of a Linear Function", count: 10, locked: false },
  { id: "l5" as LessonId, num: "05", title: "Reading Equations from Graphs",  count: 10, locked: false },
  { id: "l6" as LessonId, num: "06", title: "Systems of Equations",           count: 10, locked: false },
  { id: "l7" as LessonId, num: "07", title: "Linear Inequalities",            count: 10, locked: false },
];

const LEADERBOARD = [
  { rank: 1, name: "Ava",    score: 38, total: 40, time: "18m 42s", isYou: false },
  { rank: 2, name: "Jay",    score: 38, total: 40, time: "21m 10s", isYou: false },
  { rank: 3, name: "Charlie",score: 36, total: 40, time: "19m 05s", isYou: false },
  { rank: 4, name: "Mia",   score: 34, total: 40, time: "22m 31s", isYou: false },
  { rank: 5, name: "You",    score: 32, total: 40, time: "—",       isYou: true  },
  { rank: 6, name: "Leo",    score: 30, total: 40, time: "20m 44s", isYou: false },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div style={{ width: 28, height: 28, borderRadius: "50%", background: GOLD,   display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>1</div>;
  if (rank === 2) return <div style={{ width: 28, height: 28, borderRadius: "50%", background: SILVER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>2</div>;
  if (rank === 3) return <div style={{ width: 28, height: 28, borderRadius: "50%", background: BRONZE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>3</div>;
  return <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: SOFT, flexShrink: 0 }}>{rank}</div>;
}

function ProgressDots({ done }: { done: boolean }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: done ? ACCENT : "rgba(31,37,68,0.13)" }}/>
      ))}
    </div>
  );
}

function TopicSection({ title, icon, lessons, done, expanded, onToggle, onOpen }: {
  title: string; icon: string; lessons: typeof LINEAR_LESSONS;
  done: Record<string, boolean>; expanded: boolean; onToggle: () => void; onOpen: (id: LessonId) => void;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 12px rgba(31,37,68,0.06)", overflow: "hidden", border: `1px solid ${BORDER}` }}>
      <button onClick={onToggle} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 24px", display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between", borderBottom: expanded ? `1px solid ${BORDER}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 0 rgba(59,91,219,0.3)", flexShrink: 0 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "#fff" }}>{icon}</span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: INK, letterSpacing: "-0.01em" }}>{title}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke={SOFT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {expanded && lessons.map((lesson, i) => {
        const isDone = done[lesson.id] ?? false;
        return (
          <div key={lesson.num} onClick={() => !lesson.locked && onOpen(lesson.id)}
            style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 24px", borderTop: i === 0 ? "none" : `1px solid ${BORDER}`, cursor: "pointer", transition: "background 0.12s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,91,219,0.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
              <path d="M6 4l4 4-4 4" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: isDone ? 700 : 500, color: isDone ? INK : SOFT }}>
                Lesson {lesson.num} · {lesson.title}
              </span>
              <span style={{ background: isDone ? "#E7F8EC" : "rgba(59,91,219,0.08)", color: isDone ? GREEN_DK : ACCENT, fontFamily: MONO, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                {lesson.count}Q
              </span>
            </div>
            <ProgressDots done={isDone} />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M4 8h8M9 5l3 3-3 3" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

export default function MathematicsPage() {
  const [open, setOpen] = useState<LessonId | null>(null);
  const [done, setDone] = useState<Record<LessonId, boolean>>({ l1: false, l2: false, l3: false, l4: false, l5: false, l6: false, l7: false });
  const [expandLinear, setExpandLinear] = useState(true);

  const completedCount = Object.values(done).filter(Boolean).length;

  return (
    <>
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 48px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

        {/* ── Left: course content ── */}
        <div>
          {/* Page header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 0 rgba(59,91,219,0.3)" }}>
              <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: "#fff" }}>M</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 900, color: INK, letterSpacing: "-0.02em" }}>Selective Mathematics</div>
            {completedCount > 0 && (
              <div style={{ marginLeft: 4, background: "#E7F8EC", color: GREEN_DK, fontFamily: FONT, fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 9999 }}>
                {completedCount} / 6 done
              </div>
            )}
          </div>

          <TopicSection
            title="Linear Functions"
            icon="f(x)"
            lessons={LINEAR_LESSONS}
            done={done}
            expanded={expandLinear}
            onToggle={() => setExpandLinear(e => !e)}
            onOpen={setOpen}
          />
        </div>

        {/* ── Right: challenge + leaderboard ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Challenge countdown banner */}
          <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1c45f6 100%)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.08 }}>
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="#fff" strokeWidth="4"/>
                <circle cx="50" cy="50" r="32" stroke="#fff" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/></svg>
                Challenge ends in
              </div>
              <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>2d 14h 32m</div>
            </div>
            <div style={{ fontSize: 44 }}>🏆</div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, boxShadow: "0 1px 12px rgba(31,37,68,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🏆</span>
                <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: INK }}>3-Day Challenge Leaderboard</span>
              </div>
              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 80px 80px", gap: 8, padding: "0 4px" }}>
                {["RANK","NAME","SCORE","TIME"].map(h => (
                  <div key={h} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: SOFT, letterSpacing: "0.06em" }}>{h}</div>
                ))}
              </div>
            </div>

            {LEADERBOARD.map(row => (
              <div key={row.rank} style={{
                display: "grid", gridTemplateColumns: "40px 1fr 80px 80px", gap: 8,
                padding: "12px 20px", alignItems: "center",
                background: row.isYou ? "rgba(59,91,219,0.06)" : "transparent",
                borderTop: `1px solid ${BORDER}`,
              }}>
                <RankBadge rank={row.rank} />
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: row.isYou ? 800 : 500, color: row.isYou ? ACCENT : INK }}>{row.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: row.isYou ? ACCENT : INK }}>{row.score} / {row.total}</div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: SOFT }}>{row.time}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>

    {/* Lesson overlays */}
    {open === "l1" && <InteractiveLessonL1 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l1: true }))} />}
    {open === "l2" && <InteractiveLessonL2 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l2: true }))} />}
    {open === "l3" && <InteractiveLessonL3 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l3: true }))} />}
    {open === "l4" && <InteractiveLessonL4 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l4: true }))} />}
    {open === "l5" && <InteractiveLessonL5 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l5: true }))} />}
    {open === "l6" && <InteractiveLessonL6 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l6: true }))} />}
    {open === "l7" && <InteractiveLessonL7 onClose={() => setOpen(null)} onComplete={() => setDone(d => ({ ...d, l7: true }))} />}
    </>
  );
}
