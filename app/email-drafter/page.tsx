"use client";

import { useState } from "react";

type DraftResult = {
  id: number;
  number: number;
  subject: string;
  status: "drafted" | "skipped" | "error";
  reason?: string;
};

type RunSummary = {
  total: number;
  drafted: number;
  skipped: number;
  errors: number;
  results: DraftResult[];
};

export default function EmailDrafterPage() {
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runDrafter() {
    setRunning(true);
    setSummary(null);
    setError(null);
    try {
      const res = await fetch("/api/helpscout/auto-draft", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setSummary(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 680, width: "100%" }}>
        {/* Header */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#f1f5f9",
            margin: "0 0 8px",
          }}
        >
          Email Drafter
        </h1>
        <p style={{ color: "#94a3b8", margin: "0 0 40px", fontSize: 15 }}>
          Drafts replies in your voice for all customer-waiting conversations in
          HelpScout. Review and send from HelpScout — nothing is sent
          automatically.
        </p>

        {/* Run button */}
        <button
          onClick={runDrafter}
          disabled={running}
          style={{
            background: running
              ? "#334155"
              : "linear-gradient(135deg, #4e7efe, #1c45f6)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 32px",
            fontSize: 16,
            fontWeight: 600,
            cursor: running ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "opacity 0.15s",
            opacity: running ? 0.7 : 1,
            marginBottom: 40,
          }}
        >
          {running ? (
            <>
              <Spinner /> Drafting replies...
            </>
          ) : (
            "Draft all waiting emails"
          )}
        </button>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#450a0a",
              border: "1px solid #991b1b",
              borderRadius: 10,
              padding: 16,
              color: "#fca5a5",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <StatCard label="Drafted" value={summary.drafted} color="#22c55e" />
              <StatCard label="Skipped" value={summary.skipped} color="#94a3b8" />
              <StatCard label="Errors" value={summary.errors} color="#f87171" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {summary.results.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "#1e293b",
                    border: `1px solid ${
                      r.status === "drafted"
                        ? "#166534"
                        : r.status === "error"
                        ? "#991b1b"
                        : "#334155"
                    }`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div>
                    <span style={{ color: "#94a3b8", fontSize: 12, marginRight: 8 }}>
                      #{r.number}
                    </span>
                    <span style={{ color: "#e2e8f0", fontSize: 14 }}>
                      {r.subject || "(no subject)"}
                    </span>
                    {r.reason && (
                      <span style={{ color: "#64748b", fontSize: 12, marginLeft: 8 }}>
                        — {r.reason}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 12,
        padding: "20px 16px",
        textAlign: "center",
        border: "1px solid #334155",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "drafted" | "skipped" | "error" }) {
  const config = {
    drafted: { bg: "#14532d", color: "#86efac", label: "Drafted" },
    skipped: { bg: "#1e293b", color: "#64748b", label: "Skipped" },
    error: { bg: "#450a0a", color: "#f87171", label: "Error" },
  };
  const { bg, color, label } = config[status];
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />
      <path
        d="M8 2 a6 6 0 0 1 6 6"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
