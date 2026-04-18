"use client";
import { useState } from "react";

export default function Explanation({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1"
      >
        <span>{open ? "▲" : "▼"}</span>
        {open ? "Hide explanation" : "Show explanation"}
      </button>
      {open && (
        <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-slate-700 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}
