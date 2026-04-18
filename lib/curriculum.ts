export interface Subtopic {
  slug: string;
  label: string;
}

export interface Domain {
  slug: string;
  label: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  subtopics: Subtopic[];
}

export interface Section {
  slug: string;
  label: string;
  domains: Domain[];
}

export const curriculum: Section[] = [
  {
    slug: "math",
    label: "Math",
    domains: [
      {
        slug: "algebra",
        label: "Algebra",
        description: "This domain is ~35% of the Math section.",
        icon: "𝑥",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        subtopics: [
          { slug: "linear-equations-1", label: "Linear equations (1 variable)" },
          { slug: "linear-equations-2", label: "Linear equations (2 variables)" },
          { slug: "linear-functions", label: "Linear functions" },
          { slug: "systems-linear", label: "Systems of linear equations" },
          { slug: "linear-inequalities", label: "Linear inequalities" },
        ],
      },
      {
        slug: "advanced-math",
        label: "Advanced Math",
        description: "This domain is ~35% of the Math section.",
        icon: "∑",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        subtopics: [
          { slug: "equivalent-expressions", label: "Equivalent expressions" },
          { slug: "nonlinear-equations", label: "Nonlinear equations" },
          { slug: "systems-nonlinear", label: "Systems of nonlinear equations" },
          { slug: "nonlinear-functions", label: "Nonlinear functions" },
        ],
      },
      {
        slug: "problem-solving",
        label: "Problem-Solving & Data Analysis",
        description: "This domain is ~15% of the Math section.",
        icon: "%",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        subtopics: [
          { slug: "ratios-rates", label: "Ratios/rates/proportional reasoning" },
          { slug: "percentages", label: "Percentages" },
          { slug: "units", label: "Units" },
          { slug: "table-data", label: "Table data" },
          { slug: "counts-probabilities", label: "Counts & probabilities" },
          { slug: "scatterplots", label: "Two-variable data (scatterplots)" },
        ],
      },
      {
        slug: "geometry",
        label: "Geometry & Trigonometry",
        description: "This domain is ~15% of the Math section.",
        icon: "△",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        subtopics: [
          { slug: "area-volume", label: "Area & volume" },
          { slug: "lines-angles-triangles", label: "Lines/angles/triangles" },
          { slug: "right-triangles-trig", label: "Right triangles & trigonometry" },
          { slug: "circles", label: "Circles" },
        ],
      },
    ],
  },
  {
    slug: "reading",
    label: "Reading & Writing",
    domains: [
      {
        slug: "craft-and-structure",
        label: "Craft and Structure",
        description: "This domain is ~28% of the R&W section.",
        icon: "✦",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        subtopics: [
          { slug: "words-in-context", label: "Words in Context" },
          { slug: "text-structure-purpose", label: "Text Structure and Purpose" },
          { slug: "cross-text-connections", label: "Cross-Text Connections" },
        ],
      },
      {
        slug: "information-and-ideas",
        label: "Information and Ideas",
        description: "This domain is ~26% of the R&W section.",
        icon: "◈",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        subtopics: [
          { slug: "central-ideas", label: "Central Ideas and Details" },
          { slug: "command-evidence-textual", label: "Command of Evidence (Textual)" },
          { slug: "command-evidence-quantitative", label: "Command of Evidence (Quantitative)" },
          { slug: "inferences", label: "Inferences" },
        ],
      },
      {
        slug: "conventions",
        label: "Standard English Conventions",
        description: "This domain is ~26% of the R&W section.",
        icon: "✓",
        iconBg: "bg-sky-100",
        iconColor: "text-sky-600",
        subtopics: [
          { slug: "boundaries", label: "Boundaries" },
          { slug: "form-structure-sense", label: "Form/Structure/Sense" },
        ],
      },
      {
        slug: "expression-of-ideas",
        label: "Expression of Ideas",
        description: "This domain is ~20% of the R&W section.",
        icon: "✎",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        subtopics: [
          { slug: "rhetorical-synthesis", label: "Rhetorical Synthesis" },
          { slug: "transitions", label: "Transitions" },
        ],
      },
    ],
  },
];
