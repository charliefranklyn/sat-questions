import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const BRIEF_REVIEWS = [
  {
    name: "Sarah K.",
    stars: 5,
    text: "Went from 1120 to 1480 in 10 weeks. The personalized plan knew exactly what I needed.",
    score: "+360",
    avatar: "SK",
    color: "#4e7efe",
  },
  {
    name: "Marcus T.",
    stars: 5,
    text: "The AI tutor is better than my $200/hr private tutor. Available at 2am when I need it.",
    score: "+290",
    avatar: "MT",
    color: "#7c3aed",
  },
  {
    name: "Priya N.",
    stars: 5,
    text: "Got a 1510. My family couldn't believe it. The daily lessons fit perfectly into my schedule.",
    score: "+420",
    avatar: "PN",
    color: "#10b981",
  },
  {
    name: "Jordan L.",
    stars: 5,
    text: "Practice questions feel exactly like the real test. I wasn't surprised on test day at all.",
    score: "+310",
    avatar: "JL",
    color: "#f59e0b",
  },
];

const TESTIMONIALS = [
  { name: "Alex Kim",        score: "+420", text: "I tried three other SAT prep courses before this one. Nothing came close. The AI knew exactly what I needed to work on.", avatar: "AK", color: "#4e7efe" },
  { name: "Maya Rodriguez",  score: "+310", text: "The AI tutor is incredible. It's like having a private tutor available at 2am when I'm cramming for my exam.", avatar: "MR", color: "#7c3aed" },
  { name: "Jordan Lee",      score: "+280", text: "Went from 1120 to a 1400. My parents couldn't believe it. The daily study plan kept me consistent.", avatar: "JL", color: "#10b981" },
  { name: "Sophie Park",     score: "+350", text: "The practice questions feel exactly like the real SAT. I wasn't surprised at all on test day — I was ready.", avatar: "SP", color: "#f59e0b" },
  { name: "Tyler Nguyen",    score: "+290", text: "Got a 1490! My target was 1400. EdAccelerator helped me blow past my goal in just 8 weeks.", avatar: "TN", color: "#ef4444" },
  { name: "Emma Chen",       score: "+380", text: "As a student-athlete, the flexible schedule was everything. I studied 30 min a day and hit 1480.", avatar: "EC", color: "#06b6d4" },
  { name: "Ryan Martinez",   score: "+260", text: "The score tracking kept me motivated. Seeing my projected score go up every week was addictive.", avatar: "RM", color: "#8b5cf6" },
  { name: "Aisha Johnson",   score: "+410", text: "My parents were skeptical but now recommend it to everyone. Went from 1080 to 1490 in 12 weeks.", avatar: "AJ", color: "#ec4899" },
  { name: "Chris Wang",      score: "+320", text: "Better than the $200/hr tutor I had before. Seriously. And it's available whenever I need help.", avatar: "CW", color: "#14b8a6" },
];

const STEPS = [
  {
    n: "01",
    title: "Take a diagnostic test",
    desc: "Our AI analyzes your strengths and gaps across all SAT sections in under 30 minutes.",
  },
  {
    n: "02",
    title: "Get your personalized plan",
    desc: "A custom week-by-week study plan built around your schedule, target score, and exam date.",
  },
  {
    n: "03",
    title: "Learn, practice, improve",
    desc: "Daily AI-tutored lessons, targeted practice sets, and weekly score projections to keep you on track.",
  },
];

const AVATAR_COLORS = ["#4e7efe", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"];
const AVATAR_INITIALS = ["AK", "MR", "JL", "SP", "TN"];

// ─── Logo SVG ────────────────────────────────────────────────────────────────

function EdLogo({ size = 28, gradId = "logo-g" }: { size?: number; gradId?: string }) {
  return (
    <svg width={size} height={size} viewBox="264 271 552 537" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="433" y1="242" x2="649" y2="834" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4e7efe" />
          <stop offset=".77" stopColor="#1c45f6" />
        </linearGradient>
      </defs>
      <path d="M370.6,271.9h338.8c58.6,0,106.2,47.6,106.2,106.2v313.4c0,64.4-52.3,116.6-116.6,116.6H381c-64.4,0-116.6-52.3-116.6-116.6V378.1C264.4,319.5,312,271.9,370.6,271.9Z" fill={`url(#${gradId})`} />
      <path d="M523.2,510.9c-5.5-16.4-17.2-29.9-32.2-38.6-6.8-3.9-15.2-7.6-25.1-9.8-24.1-5.4-43.5.6-51.1,3.4-8.5,3.7-33.3,15.9-46.7,43.7-12.6,26.3-10.9,57.9,3.5,85.5,6.9,13.2,17.4,24.2,30.4,31.4,12.1,6.7,29.3,13.3,50.6,13,33.8-.5,57.2-18,66.9-26.8,2.5-2.2,2.7-6,.6-8.6l-18.2-21.9c-1.8-2.1-5-2.5-7.2-.8-21.1,16.4-46.7,19.6-64.3,8.8-9.6-5.9-14.8-14.9-17.6-21.3-.3-.8.2-1.7,1-1.8l101.1-14.8c6.5-.95,11.4-6.4,11.8-13,.4-7.6-.2-17.4-3.7-28.1Zm-48.4,14-63.7,9.5c-.7.1-1.3-.45-1.3-1.15.2-4.8,1.8-19.9,14.7-29.3,11-7.9,28.2-10.3,40.1-.9,8.5,6.7,10.6,16.6,11.2,20.6.1.6-.3,1.2-.94,1.25Z" fill="#fff" />
      <path d="M714.8,627.5l-2.2-12c-.4-2.1-.6-4.2-.6-6.3V399.4c0-4.2-3.8-7.3-7.9-6.5l-36.8,7.3c-3.2.6-5.4,3.4-5.4,6.6v71.3c-8.1-9.1-20.6-17.4-47.1-17.4-13.9,0-26.4,4.4-37.7,11.1-11.3,6.7-20.2,16.7-26.9,29.8-6.6,13.1-9.9,29.2-9.9,48.2,0,18.8,3.3,34.8,9.8,47.95s15.4,23.2,26.6,30.1c11.2,6.9,23.9,10.4,38.1,10.4,10.3,0,18.9-1.6,25.7-4.9,6.8-3.3,13.9-7.4,18.1-12,2-2.2,4.5-4.8,6.9-7.4l.8,13.8c.3,3.7,3.4,6.6,7.1,6.6h35.9c3.6,0,6.4-3.3,5.7-6.9Zm-51.4-54.3c-1.2,2.3-9.7,13.8-18.4,17.9-3.7,1.7-8.4,3.3-14,3.3-7.7,0-14.6-.95-20.7-4.7-6.1-3.7-10.9-9.2-14.5-16.3s-5.3-15.8-5.3-25.97c0-10.3,1.8-19,5.4-26.1,3.6-7.1,7.1-11.5,13.2-15.1,6.1-3.6,13-5.5,20.5-5.5,18.8,0,30,10.7,33.8,16.9v55.7Z" fill="#fff" />
    </svg>
  );
}

// ─── Score chart (small — How It Works card) ──────────────────────────────────

function ScoreChartSmall() {
  // 8 weeks of data, scores normalised to 0–100 for the 120px tall chart
  const weeks  = [0, 1, 2, 3, 4, 5, 6, 7];
  const scores = [1050, 1090, 1130, 1165, 1210, 1260, 1350, 1490];
  const W = 300, H = 110;
  const minS = 1020, maxS = 1510;
  const pts = weeks.map((w) => [
    8 + (w / 7) * (W - 16),
    H - 8 - ((scores[w] - minS) / (maxS - minS)) * (H - 16),
  ] as [number, number]);

  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const mx = (px + cx) / 2;
    d += ` C ${mx.toFixed(1)},${py.toFixed(1)} ${mx.toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`;
  }
  const area = d + ` L ${pts[pts.length - 1][0].toFixed(1)},${H} L ${pts[0][0].toFixed(1)},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sc-sm-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e7efe" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4e7efe" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sc-sm-grad)" />
      <path d={d} fill="none" stroke="#1c45f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[0][0]} cy={pts[0][1]} r="3.5" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4.5" fill="#1c45f6" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Score chart (large — Guarantee section) ─────────────────────────────────

function ScoreChartLarge() {
  const W = 560, H = 180;
  const weeks  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const actual = [1050, 1068, 1092, 1108, 1133, 1158, 1180];
  const minS = 980, maxS = 1480;
  const PL = 10, PR = 10, PT = 20, PB = 30;
  const cW = W - PL - PR, cH = H - PT - PB;

  function sx(w: number) { return PL + (w / 14) * cW; }
  function sy(s: number) { return PT + cH - ((s - minS) / (maxS - minS)) * cH; }

  const actPts = actual.map((s, i) => [sx(i), sy(s)] as [number, number]);
  let dAct = `M ${actPts[0][0].toFixed(1)},${actPts[0][1].toFixed(1)}`;
  for (let i = 1; i < actPts.length; i++) {
    const [px, py] = actPts[i - 1];
    const [cx, cy] = actPts[i];
    const mx = (px + cx) / 2;
    dAct += ` C ${mx.toFixed(1)},${py.toFixed(1)} ${mx.toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`;
  }
  const areaAct = dAct + ` L ${actPts[actPts.length - 1][0].toFixed(1)},${PT + cH} L ${actPts[0][0].toFixed(1)},${PT + cH} Z`;

  // projected line: current → target at week 14
  const projX0 = sx(6), projY0 = sy(1180);
  const projX1 = sx(14), projY1 = sy(1490);

  // goal line
  const goalX0 = sx(0), goalY0 = sy(1050);
  const goalX1 = sx(14), goalY1 = sy(1400);

  // y-axis labels
  const yLabels = [1050, 1150, 1250, 1350, 1400, 1490];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sc-lg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c45f6" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#1c45f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLabels.map((s) => (
        <line key={s} x1={PL} y1={sy(s)} x2={W - PR} y2={sy(s)} stroke="#f1f5f9" strokeWidth="1" />
      ))}

      {/* Score labels */}
      {[1050, 1200, 1400].map((s, i) => (
        <text key={s} x={PL - 4} y={sy(s) + 3.5} textAnchor="end" fontSize="9" fill={i === 2 ? "#10b981" : "#94a3b8"}>
          {s}
        </text>
      ))}

      {/* Week labels */}
      {weeks.filter((w) => w % 2 === 0).map((w) => (
        <text key={w} x={sx(w)} y={H - 4} textAnchor="middle" fontSize="9" fill="#cbd5e1">
          W{w}
        </text>
      ))}

      {/* Today line */}
      <line x1={sx(6)} y1={PT - 6} x2={sx(6)} y2={PT + cH} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
      <text x={sx(6)} y={PT - 9} textAnchor="middle" fontSize="8" fill="#94a3b8">today</text>

      {/* Goal dashed */}
      <line x1={goalX0} y1={goalY0} x2={goalX1} y2={goalY1} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.45" />

      {/* Projected */}
      <line x1={projX0} y1={projY0} x2={projX1} y2={projY1} stroke="#1c45f6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.55" />

      {/* Area */}
      <path d={areaAct} fill="url(#sc-lg-grad)" />

      {/* Actual line */}
      <path d={dAct} fill="none" stroke="#1c45f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      <circle cx={actPts[0][0]} cy={actPts[0][1]} r="3" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx={actPts[actPts.length - 1][0]} cy={actPts[actPts.length - 1][1]} r="4.5" fill="#1c45f6" stroke="white" strokeWidth="1.5" />

      {/* Target dot */}
      <circle cx={sx(14)} cy={sy(1400)} r="3.5" fill="white" stroke="#10b981" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ n = 5, size = 13 }: { n?: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ color: "#f59e0b", fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

// ─── Gradient text helper ─────────────────────────────────────────────────────

const gradText: React.CSSProperties = {
  background: "linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <EdLogo size={28} gradId="nav-logo-g" />
            <span className="text-sm font-semibold text-slate-900 tracking-tight">EdAccelerator</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "Pricing", href: "#pricing" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <Link
            href="/study-plan"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Dot patterns */}
        <div
          className="absolute top-0 left-0 w-72 h-72 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #c7d2fe 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            opacity: 0.45,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #c7d2fe 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            opacity: 0.3,
          }}
        />

        <div className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center relative">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-8"
            style={{ background: "#eff6ff", color: "#1c45f6", border: "1px solid #bfdbfe" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1c45f6", display: "inline-block" }} />
            AI-Powered SAT Preparation
          </div>

          {/* Headline */}
          <h1 className="text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Get a 1500+ SAT,{" "}
            <span style={gradText}>Guaranteed.</span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who&apos;ve boosted their SAT scores by 200+ points with our
            AI-powered personalized learning platform.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
            <Link
              href="/study-plan"
              className="px-8 py-3.5 rounded-full text-base font-semibold text-white transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)",
                boxShadow: "0 8px 24px rgba(28, 69, 246, 0.35)",
              }}
            >
              Start for Free
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-full text-base font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center">
              {AVATAR_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: color, marginLeft: i > 0 ? -10 : 0, position: "relative", zIndex: 5 - i }}
                >
                  {AVATAR_INITIALS[i]}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-0.5">
                <Stars size={14} />
                <span className="text-sm font-semibold text-slate-900 ml-1">5.0</span>
              </div>
              <p className="text-xs text-slate-500">Trusted by 5,000+ students</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brief review cards ────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-4 gap-4">
          {BRIEF_REVIEWS.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl p-5 border border-slate-100 bg-white hover:shadow-md transition-shadow"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <Stars size={12} />
              <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-4">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: r.color }}
                  >
                    {r.avatar}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{r.name}</span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f0fdf4", color: "#16a34a" }}
                >
                  {r.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24" style={{ background: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1c45f6" }}>
              Process
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              From sign-up to score improvement in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Steps */}
            <div className="space-y-10">
              {STEPS.map((step) => (
                <div key={step.n} className="flex gap-5">
                  <div
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base"
                    style={{
                      background: "linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)",
                      color: "white",
                    }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart card */}
            <div
              className="rounded-3xl p-7 bg-white border border-slate-100"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Score Trajectory
              </p>
              <div className="flex items-baseline gap-2 mb-5">
                <p className="text-2xl font-bold text-slate-900">1050 → 1490</p>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f0fdf4", color: "#16a34a" }}
                >
                  +440
                </span>
              </div>
              <ScoreChartSmall />
              <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 text-center">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Start</p>
                  <p className="text-base font-bold text-slate-400">1050</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Week 14</p>
                  <p className="text-base font-bold" style={{ color: "#1c45f6" }}>1490</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Duration</p>
                  <p className="text-base font-bold text-slate-900">14 wks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guarantee / Stats ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Improve Your SAT By 200+ Points,{" "}
              <span style={gradText}>Guaranteed.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Our students consistently outperform national averages. The data speaks for itself.
            </p>
          </div>

          {/* Chart */}
          <div
            className="rounded-3xl p-8 bg-white border border-slate-100 mb-8"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div style={{ width: 24, height: 3, background: "#1c45f6", borderRadius: 2 }} />
                <span className="text-xs text-slate-500">Your progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: 24, height: 2, borderTop: "2px dashed #1c45f6", opacity: 0.55 }} />
                <span className="text-xs text-slate-500">Projected</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: 24, height: 2, borderTop: "2px dashed #10b981" }} />
                <span className="text-xs text-slate-500">Goal</span>
              </div>
            </div>
            <ScoreChartLarge />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            {[
              { value: "+410", label: "Average score increase", sub: "across all students" },
              { value: "9.4×", label: "More effective", sub: "than traditional tutoring" },
              { value: "20 hrs", label: "Average time to results", sub: "with daily practice" },
            ].map((stat) => (
              <div
                key={stat.value}
                className="rounded-2xl p-6 border border-slate-100 bg-white text-center"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <p className="text-4xl font-bold mb-1.5" style={gradText}>
                  {stat.value}
                </p>
                <p className="font-semibold text-slate-900 text-sm mb-0.5">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24" style={{ background: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Thousands of Student Testimonials
            </h2>
            <p className="text-lg text-slate-500">Real results from real students.</p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-6 bg-white border border-slate-100 hover:shadow-md transition-shadow"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <Stars size={13} />
                <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-slate-500">Start free. Upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="rounded-3xl p-8 border border-slate-200 bg-white">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Plan</p>
              <p className="text-5xl font-bold text-slate-900 mb-1">
                $0
              </p>
              <p className="text-sm text-slate-400 mb-8">Free forever</p>
              <ul className="space-y-3 mb-8">
                {["Full curriculum access", "10 practice questions/day", "Basic progress tracking", "Community support"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/study-plan"
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Standard */}
            <div
              className="rounded-3xl p-8 text-white relative"
              style={{
                background: "linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)",
                boxShadow: "0 20px 60px rgba(28, 69, 246, 0.38)",
              }}
            >
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#fbbf24", color: "#78350f" }}
              >
                Most Popular
              </div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Standard</p>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-5xl font-bold">$49</p>
                <span className="text-sm opacity-60">/mo</span>
              </div>
              <p className="text-sm opacity-60 mb-8">Billed monthly</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Unlimited practice questions",
                  "AI Tutor — unlimited sessions",
                  "Personalized study plan",
                  "Score guarantee",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm opacity-90">
                    <span style={{ fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/study-plan"
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 bg-white"
                style={{ color: "#1c45f6" }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Platform */}
            <div className="rounded-3xl p-8 border border-slate-200 bg-white">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Platform</p>
              <p className="text-5xl font-bold text-slate-900 mb-1">Custom</p>
              <p className="text-sm text-slate-400 mb-8">For schools &amp; orgs</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Standard",
                  "Bulk student licenses",
                  "Admin dashboard",
                  "LMS integrations",
                  "Dedicated account manager",
                  "Custom reporting",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#0f172a" }}
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#f8fafc" }}>
        <div className="max-w-2xl mx-auto px-8 text-center">
          <div className="flex justify-center mb-8">
            <EdLogo size={52} gradId="footer-logo-g" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-5">
            Ready to Get Your 1500+ SAT?
          </h2>
          <p className="text-lg text-slate-500 mb-10">
            Join 5,000+ students already on their way to their target score.
          </p>
          <Link
            href="/study-plan"
            className="inline-flex items-center px-10 py-4 rounded-full text-base font-semibold text-white transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4e7efe 0%, #1c45f6 100%)",
              boxShadow: "0 8px 30px rgba(28, 69, 246, 0.38)",
            }}
          >
            Start for Free Today
          </Link>
        </div>
      </section>

      {/* ── Footer bar ───────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EdLogo size={20} gradId="foot-bar-g" />
            <span className="text-sm font-semibold text-slate-600">EdAccelerator</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 EdAccelerator. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
