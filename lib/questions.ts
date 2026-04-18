import fs from "fs";
import path from "path";
import { curriculum } from "./curriculum";

export interface Choice {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  section: "math" | "reading-writing";
  domain: string;
  subtopic: string;
  questionType: "multiple-choice" | "grid-in";
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  passage?: string;
  choices?: Choice[];
  correctAnswer: string;
  explanation: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "questions");

const DOMAIN_FILE_MAP: Record<string, string> = {
  algebra: "math/algebra.json",
  "advanced-math": "math/advanced-math.json",
  "problem-solving": "math/problem-solving.json",
  geometry: "math/geometry.json",
  "craft-and-structure": "reading-writing/craft-and-structure.json",
  "information-and-ideas": "reading-writing/information-and-ideas.json",
  conventions: "reading-writing/conventions.json",
  "expression-of-ideas": "reading-writing/expression-of-ideas.json",
};

// Subtopic label → slug map — derived from curriculum so it never drifts
const SUBTOPIC_LABEL_MAP: Record<string, string> = {};
for (const section of curriculum) {
  for (const domain of section.domains) {
    for (const sub of domain.subtopics) {
      SUBTOPIC_LABEL_MAP[sub.label.toLowerCase()] = sub.slug;
    }
  }
}

function loadDomain(domainSlug: string): Question[] {
  const filePath = DOMAIN_FILE_MAP[domainSlug];
  if (!filePath) return [];
  const fullPath = path.join(DATA_DIR, filePath);
  if (!fs.existsSync(fullPath)) return [];
  const raw = fs.readFileSync(fullPath, "utf-8");
  try {
    return JSON.parse(raw) as Question[];
  } catch {
    console.error(`Malformed JSON in ${fullPath}`);
    return [];
  }
}

export function getQuestionsBySubtopic(
  domainSlug: string,
  subtopicSlug: string
): Question[] {
  const questions = loadDomain(domainSlug);
  return questions.filter((q) => {
    const mapped = SUBTOPIC_LABEL_MAP[q.subtopic.toLowerCase()];
    return mapped === subtopicSlug;
  });
}

export function getQuestionsByDomain(domainSlug: string): Question[] {
  return loadDomain(domainSlug);
}

export function getAllQuestions(): Question[] {
  return Object.keys(DOMAIN_FILE_MAP).flatMap((slug) => loadDomain(slug));
}
