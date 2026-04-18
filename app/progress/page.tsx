import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

export default function ProgressPage() {
  return (
    <div className="min-h-screen px-10 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Progress</h1>
        <p className="text-slate-400 text-sm">
          Explore topics across both sections of the SAT.
        </p>
      </div>

      <div className="space-y-12">
        {curriculum.map((section) => {
          const sectionColor =
            section.slug === "math"
              ? { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" }
              : { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" };

          return (
            <div key={section.slug}>
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${sectionColor.dot}`} />
                  <h2 className="text-xl font-bold text-slate-900">{section.label}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${sectionColor.bg} ${sectionColor.text}`}>
                    {section.domains.length} domains · {section.domains.reduce((acc, d) => acc + d.subtopics.length, 0)} topics
                  </span>
                </div>
                <Link
                  href={`/${section.slug}`}
                  className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  View all →
                </Link>
              </div>

              {/* Domain cards */}
              <div className="space-y-3">
                {section.domains.map((domain) => (
                  <div
                    key={domain.slug}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    {/* Domain header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold ${domain.iconBg} ${domain.iconColor}`}
                        >
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

                    {/* Subtopics */}
                    <div>
                      {domain.subtopics.map((sub, i) => (
                        <Link
                          key={sub.slug}
                          href={`/${section.slug}/${domain.slug}/${sub.slug}`}
                          className={`flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group ${
                            i < domain.subtopics.length - 1 ? "border-b border-slate-50" : ""
                          }`}
                        >
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">
                            {sub.label}
                          </span>
                          <span className="text-green-500 group-hover:translate-x-0.5 transition-transform">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
