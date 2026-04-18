"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Greeting from "@/components/Greeting";
import InteractiveLesson from "@/components/InteractiveLesson";

// ── Chart config ────────────────────────────────────────────────────────────

const CHART = {
  startScore: 1050,
  currentScore: 1180,
  targetScore: 1400,
  daysToTarget: 56,         // 8 weeks left on a 14-week plan
  currentWeek: 6,
  totalWeeks: 14,
  actual: [
    { week: 0, score: 1050 },
    { week: 1, score: 1068 },
    { week: 2, score: 1092 },
    { week: 3, score: 1108 },
    { week: 4, score: 1133 },
    { week: 5, score: 1158 },
    { week: 6, score: 1180 },
  ],
};

// SVG helpers
const VW = 260;
const VH = 160;
const PL = 6; const PR = 6; const PT = 16; const PB = 24;
const cW = VW - PL - PR;
const cH = VH - PT - PB;
const SCORE_MIN = 980;
const SCORE_MAX = 1460;

function sx(week: number) { return PL + (week / CHART.totalWeeks) * cW; }
function sy(score: number) { return PT + cH - ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * cH; }

// Smooth cubic bezier path through points
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const mx = (px + cx) / 2;
    d += ` C ${mx.toFixed(1)},${py.toFixed(1)} ${mx.toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`;
  }
  return d;
}

// Actual progress path
const actualPts: [number, number][] = CHART.actual.map((p) => [sx(p.week), sy(p.score)]);

// Goal line: start → target
const goalPts: [number, number][] = [
  [sx(0), sy(CHART.startScore)],
  [sx(CHART.totalWeeks), sy(CHART.targetScore)],
];

// Projected: extend current rate from present to target week
const WINDOW = 3;
const last = CHART.actual.length - 1;
const recentRate = (CHART.actual[last].score - CHART.actual[last - WINDOW].score) / WINDOW; // pts/week
const projectedEnd = Math.min(CHART.currentScore + recentRate * (CHART.totalWeeks - CHART.currentWeek), CHART.targetScore + 40);
const projPts: [number, number][] = [
  [sx(CHART.currentWeek), sy(CHART.currentScore)],
  [sx(CHART.totalWeeks), sy(projectedEnd)],
];

// Area fill under actual line (close path to bottom)
const areaPath =
  smoothPath(actualPts) +
  ` L ${actualPts[actualPts.length - 1][0].toFixed(1)},${(PT + cH).toFixed(1)}` +
  ` L ${actualPts[0][0].toFixed(1)},${(PT + cH).toFixed(1)} Z`;

const AVG_MINS_PER_DAY = 47; // hardcoded study-session average

// ── Week plan ─────────────────────────────────────────────────────────────────

type DayPlan = {
  day: string;
  topic: string;
  lessonReason: string;
  practiceHref: string;
  isToday?: boolean;
};

const WEEK_PLAN: DayPlan[] = [
  { day: "Monday",    topic: "Linear Relationships",   lessonReason: "Low accuracy in recent practice sets",  practiceHref: "/math/algebra/linear-equations-1",                    isToday: true },
  { day: "Tuesday",   topic: "Systems of Equations",   lessonReason: "Builds on today's linear foundation",   practiceHref: "/math/algebra/systems-linear"                                       },
  { day: "Wednesday", topic: "Quadratic Expressions",  lessonReason: "High-frequency Advanced Math topic",    practiceHref: "/math/advanced-math/equivalent-expressions"                         },
  { day: "Thursday",  topic: "Ratios & Proportions",   lessonReason: "Appears often in Problem-Solving",      practiceHref: "/math/problem-solving/ratios-rates"                                 },
  { day: "Friday",    topic: "Command of Evidence",    lessonReason: "Key Reading & Writing skill",           practiceHref: "/reading/information-and-ideas/command-of-evidence"                 },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function StudyPlanPage() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [lessonOpen, setLessonOpen] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("study-plan-done");
      if (saved) setDone(new Set(JSON.parse(saved) as string[]));
    } catch { /* ignore */ }
    try {
      if (localStorage.getItem("lesson-done") === "true") setLessonDone(true);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("study-plan-done", JSON.stringify([...done])); } catch { /* ignore */ }
  }, [done, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("lesson-done", String(lessonDone)); } catch { /* ignore */ }
  }, [lessonDone, hydrated]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // count lesson+practice pairs done across the week (2 per day)
  const completed = WEEK_PLAN.reduce((acc, d) => {
    return acc + (done.has(`${d.day}-lesson`) ? 1 : 0) + (done.has(`${d.day}-practice`) ? 1 : 0);
  }, 0) + (lessonDone ? 1 : 0); // Monday lesson tracked separately via lessonDone

  return (
    <>
    <div className="min-h-screen px-10 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Charlie&apos;s SAT Study Plan</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          <Greeting />, Charlie!
        </h1>
        <p className="text-slate-500 text-base">
          {!lessonDone ? "Start with today's lesson, then practice." : "Lesson done — now tackle the practice set."}
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* ── Left: progress chart + streak ── */}
        <div className="w-72 shrink-0 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Journey to a 1400</p>
          <ProgressChart />
          <StreakWidget />
        </div>

        {/* ── Right: task list ── */}
        <div className="flex-1 min-w-0">

          {/* Plan header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-900">
                {view === "daily" ? "Today" : "This week"}
              </h2>
              {view === "weekly" && <span className="text-sm text-slate-400">{completed}/{WEEK_PLAN.length * 2} done</span>}
              <span className="relative flex h-2 w-2">
                <span className="glow-pulse animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
              {(["daily", "weekly"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                    view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks */}
          {view === "daily" ? (
            <div className="space-y-2">
              {/* Lesson activity card */}
              <button className="w-full text-left" onClick={() => setLessonOpen(true)}>
                <div className={`flex items-center gap-4 rounded-xl px-5 py-4 border-2 transition-all relative overflow-hidden ${
                  lessonDone ? "border-slate-100 bg-slate-50" : "border-indigo-100 bg-white hover:border-indigo-200 hover:shadow-sm"
                }`}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                  <span className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Lesson</span>
                      <span className="text-xs text-slate-400">~10 min</span>
                    </div>
                    <p className={`font-semibold text-sm ${lessonDone ? "text-slate-400 line-through" : "text-slate-900"}`}>
                      Linear Relationships
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Low accuracy in recent practice sets</p>
                  </div>
                  {lessonDone ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </div>
              </button>

              {/* Practice activity card */}
              <Link href={lessonDone ? "/math/algebra/linear-equations-1" : "#"} onClick={e => !lessonDone && e.preventDefault()}>
                <div className={`flex items-center gap-4 rounded-xl px-5 py-4 border-2 transition-all relative overflow-hidden ${
                  lessonDone ? "border-emerald-100 bg-white hover:border-emerald-200 hover:shadow-sm" : "border-slate-100 bg-slate-50"
                }`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${lessonDone ? "bg-emerald-500" : "bg-slate-200"}`} />
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${lessonDone ? "bg-emerald-50" : "bg-slate-100"}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={lessonDone ? "#10b981" : "#cbd5e1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${lessonDone ? "text-emerald-500" : "text-slate-300"}`}>Practice</span>
                      <span className={`text-xs ${lessonDone ? "text-slate-400" : "text-slate-300"}`}>~10 min</span>
                    </div>
                    <p className={`font-semibold text-sm ${lessonDone ? "text-slate-900" : "text-slate-300"}`}>
                      Linear Relationships
                    </p>
                    <p className={`text-xs mt-0.5 ${lessonDone ? "text-slate-400" : "text-slate-300"}`}>Apply and reinforce the lesson</p>
                  </div>
                  {!lessonDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </div>
              </Link>

            </div>
          ) : (
            <div className="space-y-7">
              {WEEK_PLAN.map((d) => {
                const isToday = !!d.isToday;
                const lessonId = `${d.day}-lesson`;
                const practiceId = `${d.day}-practice`;
                const lDone = isToday ? lessonDone : done.has(lessonId);
                const pDone = done.has(practiceId);
                return (
                  <div key={d.day}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                      {d.day}{isToday && <span className="ml-2 normal-case font-medium text-indigo-400">Today</span>}
                    </p>
                    <div className="space-y-2">
                      {/* Lesson card */}
                      <button className="w-full text-left" onClick={() => isToday ? setLessonOpen(true) : toggle(lessonId)}>
                        <div className={`flex items-center gap-4 rounded-xl px-5 py-4 border-2 transition-all relative overflow-hidden ${lDone ? "border-slate-100 bg-slate-50" : "border-indigo-100 bg-white hover:border-indigo-200 hover:shadow-sm"}`}>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                          <span className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Lesson</span>
                              <span className="text-xs text-slate-400">~10 min</span>
                            </div>
                            <p className={`font-semibold text-sm ${lDone ? "text-slate-400 line-through" : "text-slate-900"}`}>{d.topic}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{d.lessonReason}</p>
                          </div>
                          {lDone ? (
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          )}
                        </div>
                      </button>
                      {/* Practice card */}
                      <Link href={lDone ? d.practiceHref : "#"} onClick={e => !lDone && e.preventDefault()}>
                        <div className={`flex items-center gap-4 rounded-xl px-5 py-4 border-2 transition-all relative overflow-hidden ${pDone ? "border-slate-100 bg-slate-50" : lDone ? "border-emerald-100 bg-white hover:border-emerald-200 hover:shadow-sm" : "border-slate-100 bg-slate-50"}`}>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${lDone ? "bg-emerald-500" : "bg-slate-200"}`} />
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${lDone ? "bg-emerald-50" : "bg-slate-100"}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={lDone ? "#10b981" : "#cbd5e1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${lDone ? "text-emerald-500" : "text-slate-300"}`}>Practice</span>
                              <span className={`text-xs ${lDone ? "text-slate-400" : "text-slate-300"}`}>~10 min</span>
                            </div>
                            <p className={`font-semibold text-sm ${pDone ? "text-slate-400 line-through" : lDone ? "text-slate-900" : "text-slate-300"}`}>{d.topic}</p>
                            <p className={`text-xs mt-0.5 ${lDone ? "text-slate-400" : "text-slate-300"}`}>Apply and reinforce the lesson</p>
                          </div>
                          {pDone ? (
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          ) : !lDone ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

    {lessonOpen && (
      <InteractiveLesson
        onClose={() => setLessonOpen(false)}
        onComplete={() => { setLessonDone(true); setLessonOpen(false); }}
      />
    )}
    </>
  );
}

// ── Streak Widget ─────────────────────────────────────────────────────────────

// Today is Wednesday April 15, 2026. Streak = 3 days (Mon, Tue, Wed done).
const WEEK_DAYS = [
  { label: "M", done: true },
  { label: "T", done: true },
  { label: "W", done: true, today: true },
  { label: "T", done: false },
  { label: "F", done: false },
];
const STREAK_COUNT = 3;

function StreakWidget() {
  return (
    <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: "#fffbf2", border: "1.5px solid #fde9aa" }}>
      {/* Flame + count */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xl leading-none">🔥</span>
        <span className="text-lg font-bold text-slate-900">{STREAK_COUNT}</span>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-amber-100 shrink-0" />

      {/* Day circles */}
      <div className="flex items-center gap-1.5">
        {WEEK_DAYS.map((d, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={
              d.done && !d.today
                ? { background: "#f59e0b", color: "#fff" }
                : d.today
                ? { background: "#fff", color: "#f59e0b", border: "2.5px solid #f59e0b" }
                : { background: "#f1f5f9", color: "#94a3b8" }
            }
          >
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Progress Chart ────────────────────────────────────────────────────────────

function ProgressChart() {
  const todayX = sx(CHART.currentWeek);
  const targetX = sx(CHART.totalWeeks);
  const aheadOfGoal = projectedEnd >= CHART.targetScore;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      {/* Score stats */}
      <div className="flex justify-between mb-4">
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Start</p>
          <p className="text-lg font-semibold text-slate-400">{CHART.startScore}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Current</p>
          <p className="text-lg font-bold text-slate-900">{CHART.currentScore}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Target</p>
          <p className="text-lg font-semibold text-emerald-600">{CHART.targetScore}</p>
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal score guides */}
        {[CHART.startScore, CHART.currentScore, CHART.targetScore].map((score) => (
          <line
            key={score}
            x1={PL} y1={sy(score)} x2={VW - PR} y2={sy(score)}
            stroke="#f1f5f9" strokeWidth="1"
          />
        ))}

        {/* Score labels on y-axis */}
        {[CHART.startScore, CHART.currentScore, CHART.targetScore].map((score, i) => (
          <text
            key={score}
            x={PL - 2} y={sy(score) + 3.5}
            textAnchor="end"
            fontSize="8"
            fill={i === 2 ? "#10b981" : i === 1 ? "#475569" : "#94a3b8"}
            fontWeight={i === 1 ? "600" : "400"}
          >
            {score}
          </text>
        ))}

        {/* Today vertical line */}
        <line
          x1={todayX} y1={PT - 6} x2={todayX} y2={PT + cH}
          stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3"
        />
        <text x={todayX} y={PT - 9} textAnchor="middle" fontSize="7.5" fill="#94a3b8">
          today
        </text>

        {/* Target vertical line */}
        <line
          x1={targetX} y1={PT - 6} x2={targetX} y2={PT + cH}
          stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3"
        />
        <text x={targetX} y={PT - 9} textAnchor="middle" fontSize="7.5" fill="#10b981">
          goal
        </text>

        {/* Goal line */}
        <line
          x1={goalPts[0][0]} y1={goalPts[0][1]}
          x2={goalPts[1][0]} y2={goalPts[1][1]}
          stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4"
        />

        {/* Projected line */}
        <line
          x1={projPts[0][0]} y1={projPts[0][1]}
          x2={projPts[1][0]} y2={projPts[1][1]}
          stroke={aheadOfGoal ? "#10b981" : "#f59e0b"}
          strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6"
        />

        {/* Area fill under actual */}
        <path d={areaPath} fill="url(#actualGrad)" />

        {/* Actual line */}
        <path
          d={smoothPath(actualPts)}
          fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Start dot */}
        <circle cx={actualPts[0][0]} cy={actualPts[0][1]} r="3" fill="white" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Current dot */}
        <circle cx={actualPts[actualPts.length - 1][0]} cy={actualPts[actualPts.length - 1][1]} r="4" fill="#10b981" stroke="white" strokeWidth="1.5" />

        {/* Target dot (open) */}
        <circle cx={sx(CHART.totalWeeks)} cy={sy(CHART.targetScore)} r="3.5" fill="white" stroke="#10b981" strokeWidth="1.5" />
      </svg>

      {/* Bottom stats */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Days left</p>
          <p className="text-base font-bold text-slate-900">{CHART.daysToTarget}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Needed/day</p>
          <p className="text-base font-bold text-slate-900">{AVG_MINS_PER_DAY} min</p>
        </div>
      </div>
    </div>
  );
}


// ── Task Row ──────────────────────────────────────────────────────────────────

