import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

const readingSection = curriculum.find((s) => s.slug === "reading")!;

export default function ReadingPage() {
  return (
    <div className="px-10 py-8 max-w-3xl">
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">Reading & Writing</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 mb-1">Reading & Writing</h1>
      <p className="text-slate-400 text-sm mb-10">
        {readingSection.domains.length} domains · {readingSection.domains.reduce((n, d) => n + d.subtopics.length, 0)} topics
      </p>

      <div className="space-y-4">
        {readingSection.domains.map((domain) => (
          <div id={domain.slug} key={domain.slug} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold ${domain.iconBg} ${domain.iconColor}`}>
                  {domain.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{domain.label}</h3>
                  <p className="text-xs text-slate-400">{domain.description}</p>
                </div>
              </div>
              <span className="text-sm text-slate-400">
                <span className="font-semibold text-slate-700">{domain.subtopics.length}</span> topics
              </span>
            </div>
            <div>
              {domain.subtopics.map((sub, i) => (
                <Link
                  key={sub.slug}
                  href={`/reading/${domain.slug}/${sub.slug}`}
                  className={`flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group ${i < domain.subtopics.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{sub.label}</span>
                  <span className="text-green-500 group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
