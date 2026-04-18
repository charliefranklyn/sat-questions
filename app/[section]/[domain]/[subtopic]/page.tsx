import { notFound } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
import { getQuestionsBySubtopic } from "@/lib/questions";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";

interface Props {
  params: Promise<{ section: string; domain: string; subtopic: string }>;
}

export async function generateStaticParams() {
  const params: { section: string; domain: string; subtopic: string }[] = [];
  for (const section of curriculum) {
    for (const domain of section.domains) {
      for (const sub of domain.subtopics) {
        params.push({ section: section.slug, domain: domain.slug, subtopic: sub.slug });
      }
    }
  }
  return params;
}

export default async function SubtopicPage({ params }: Props) {
  const { section: sectionSlug, domain: domainSlug, subtopic: subtopicSlug } = await params;

  const section = curriculum.find((s) => s.slug === sectionSlug);
  const domain = section?.domains.find((d) => d.slug === domainSlug);
  const subtopic = domain?.subtopics.find((sub) => sub.slug === subtopicSlug);

  if (!section || !domain || !subtopic) notFound();

  const questions = getQuestionsBySubtopic(domainSlug, subtopicSlug);
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const q of questions) counts[q.difficulty]++;
  const { easy, medium, hard } = counts;

  return (
    <div className="px-10 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
        <span>/</span>
        <span>{section.label}</span>
        <span>/</span>
        <span>{domain.label}</span>
        <span>/</span>
        <span className="text-slate-700 font-medium">{subtopic.label}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${domain.iconBg} ${domain.iconColor}`}>
          {domain.icon}
        </span>
        <h1 className="text-2xl font-bold text-slate-900">{subtopic.label}</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6 ml-13">{domain.label} · {section.label}</p>

      {/* Difficulty pills */}
      {questions.length > 0 && (
        <div className="flex gap-2 mb-8">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{easy} Easy</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">{medium} Medium</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-700">{hard} Hard</span>
        </div>
      )}

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-slate-500 font-medium">No questions yet for this subtopic.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} number={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
