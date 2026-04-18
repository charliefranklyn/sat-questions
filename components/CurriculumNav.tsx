import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

const SECTION_HREF: Record<string, string> = {
  math: "/math",
  reading: "/reading",
};

export default function CurriculumNav() {
  return (
    <nav className="w-64 shrink-0 bg-white border-r border-slate-100 min-h-screen p-8 text-slate-800 sticky top-0 overflow-y-auto">
      <Link href="/" className="block text-2xl font-extrabold tracking-tight text-slate-900 mb-10 hover:text-green-600 transition-colors">
        SAT Practice
      </Link>
      {curriculum.map((section) => (
        <div key={section.slug} className="mb-10">
          <Link
            href={SECTION_HREF[section.slug]}
            className="text-[13px] uppercase tracking-widest text-[#94a3b8] font-bold mb-5 block hover:text-green-600 transition-colors"
          >
            {section.label}
          </Link>
          <ul className="space-y-5">
            {section.domains.map((domain) => (
              <li key={domain.slug}>
                <a
                  href={`${SECTION_HREF[section.slug]}#${domain.slug}`}
                  className="block text-[#475569] hover:text-[#0f172a] font-semibold text-base transition-colors"
                >
                  {domain.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
