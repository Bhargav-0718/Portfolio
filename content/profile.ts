/**
 * Verified profile data, transcribed from Bhargav_Bidkar_CV.pdf.
 * `source` records where each fact came from:
 *   "cv"    – stated on the current CV
 *   "brief" – stated by Bhargav in the project brief, not yet on the CV
 *   "owner" – confirmed by Bhargav directly while building the site
 * Items without dates or details still need them before full display.
 */

export type Source = "cv" | "brief" | "owner";

/**
 * Bhargav's own summary, in his words (LinkedIn "About", supplied Oct 2026).
 * Paragraph 0 is the short introduction used in the Lobby; the full text is
 * for the About room. null = not supplied; the UI shows a placeholder.
 *
 * The Tata CLiQ paragraph's second sentence replaces a template note in the
 * original, using Bhargav's own description of his role (Oct 2026).
 */
export const summary: string[] | null = [
  "I'm a Computer Science (AI-ML) undergraduate at IIIT Nagpur and an aspiring product manager focused on enterprise systems and AI. I work where business processes, engineering, and AI meet, building products that are technically sound and genuinely useful.",
  "Currently, I'm a Product Management Intern at Tata CLiQ, working on the company's migration from SAP ECC to S/4HANA. I'm part of the team that owns the migration end to end; the migration itself is carried out by a third-party partner, and my job is to work with that partner throughout.",
  "Over the past year, I've led and contributed to:",
  "Kalpit Ltd (Product & AI Consultant Intern): Owned discovery to delivery in an Agile setup, from PRDs and acceptance criteria to Jira sprints and launch. Defined evaluation criteria for a hybrid RAG search product on a 15,000-page corpus, and championed a serverless re-architecture that cut infra cost by ~85% ($71 → $8/month) without hurting performance.",
  "AI Contract-Review Decision-Support Product: Fine-tuned Legal-BERT on 13,000+ annotated clauses to flag which contract clauses need human review, reaching 78% accuracy across 41 clause types. The research behind it was accepted at ICCIS 2026.",
  "My product toolkit includes PRD writing, roadmapping, RICE prioritization, product metrics, and user research, using Jira, Figma, Notion, Mixpanel, and SQL. On the technical side, I work with Python, LangChain, RAG, and FastAPI.",
  "Beyond product, I co-led Orator, IIIT Nagpur's Public Speaking & MUN wing, where I owned IIITN-MUN 3.0 (200+ delegates) and led delegations to national MUNs, winning multiple national-level awards. I also led a 200-student Web3 track at Elevate, the development club.",
  "I thrive at the intersection of business, technology, and impact. Always learning, always shipping.",
  "Let's connect if you work in enterprise product, SAP/ERP transformation, or AI products. I'd love to learn and collaborate.",
];

export type Achievement = {
  title: string;
  detail: string;
  /** Title of the paper or work, when there is one. */
  work?: string;
  /**
   * Path under public/ to a certificate (PDF or image), or null if not supplied.
   * Check it for personal details (address, ID numbers) before adding.
   */
  certificate?: string | null;
  /** "YYYY-MM", for the timeline. */
  date?: string;
  caseSlug?: string;
  source: Source;
};

/** Recognition worth naming. */
export const achievements: Achievement[] = [
  {
    title: "Paper presented at ICCIS 2026",
    detail: "Co-authored · 8th ICCIS, BITS Pilani K K Birla Goa Campus · Sept 2026",
    work: "NLP-Driven Clause Classification and Summarization for Contract Documents",
    certificate: "/certificates/iccis-2026-presentation.pdf",
    date: "2026-09",
    caseSlug: "contract-review-decision-support",
    source: "owner",
  },
  {
    title: "Multiple national-level MUN awards",
    detail: "Leading IIIT Nagpur delegations to MUNs across India",
    source: "cv",
  },
];

/** Interests outside work, as stated in the project brief. */
export const interests = {
  reading: ["Thriller novels", "Detective stories", "Investigative podcasts", "Thought-provoking essays"],
  source: "brief" as Source,
};

export type Education = {
  institution: string;
  degree: string;
  location: string;
  period: { start: string; end: string | "present" };
  grade?: string;
  coursework: string[];
  source: Source;
};

export type Experience = {
  organisation: string;
  role: string;
  location: string;
  period: { start: string; end: string | "present" } | null;
  summary: string[];
  /** Slug of the related case file in content/cases, if any. */
  caseSlug?: string;
  /** The role shown as "Currently" in the Lobby. */
  current?: boolean;
  source: Source;
};

export type Position = {
  title: string;
  organisation: string;
  period: { start: string; end: string | "present" } | null;
  summary: string;
  source: Source;
};

export const education: Education[] = [
  {
    institution: "Indian Institute of Information Technology Nagpur",
    degree: "B.Tech, Computer Science (AI-ML specialisation)",
    location: "Nagpur, India",
    period: { start: "2023-08", end: "present" },
    grade: "CGPA 7.53",
    coursework: [
      "Databases",
      "Data Structures",
      "Analysis of Algorithms",
      "Artificial Intelligence",
      "Machine Learning",
      "Operating Systems",
    ],
    source: "cv",
  },
];

export const experience: Experience[] = [
  {
    organisation: "Tata CLiQ",
    role: "Product Management Intern",
    location: "To be confirmed",
    period: { start: "2026-10", end: "present" },
    summary: [
      "Working on the company's migration from SAP ECC to S/4HANA.",
      "Part of the team that owns the migration end to end; working with the third-party partner carrying it out.",
    ],
    caseSlug: "enterprise-s4hana-transformation",
    current: true,
    source: "owner",
  },
  {
    organisation: "Kalpit Ltd",
    role: "Product & AI Consultant Intern",
    location: "Remote",
    // CV says "present"; Bhargav confirmed it ended in September 2026.
    period: { start: "2026-01", end: "2026-09" },
    summary: [
      "Contributed to product decisions in an Agile team: PRDs, acceptance criteria, backlog grooming and Jira sprints.",
      "Set relevance and grounding evaluation criteria for a hybrid RAG search product over a 15,000-page corpus.",
      "Argued for a serverless re-architecture that cut infrastructure cost by about 85% ($71 to $8 a month).",
    ],
    caseSlug: "kalpit-hybrid-rag-search",
    source: "cv",
  },
];

export const positions: Position[] = [
  {
    title: "Co-Lead, Orator, Public Speaking & MUN Wing",
    organisation: "IIIT Nagpur",
    period: { start: "2024-08", end: "2025-08" },
    summary:
      "Led the organisation of IIITN-MUN 3.0 (200+ delegates) and IIIT Nagpur delegations to MUNs across India.",
    source: "cv",
  },
  {
    title: "Web3 Lead, Elevate (Development Wing)",
    organisation: "IIIT Nagpur",
    period: { start: "2024-08", end: "2025-08" },
    summary: "Led a team of 200 students; ran workshops and technical sessions.",
    source: "cv",
  },
  {
    title: "Secretary General, RJMUN 2.0",
    organisation: "To be confirmed",
    period: null,
    summary: "",
    source: "brief",
  },
  {
    title: "Best Delegate, LITMUN",
    organisation: "To be confirmed",
    period: null,
    summary: "",
    source: "brief",
  },
];

export const skills = {
  product: [
    "Product Discovery",
    "MVP Definition",
    "PRD Writing",
    "Roadmapping",
    "Prioritisation (RICE / Impact-Effort)",
    "North Star & Product Metrics",
    "User Research",
    "GTM Strategy",
    "Regulated-Domain AI",
  ],
  tools: [
    "Figma",
    "Jira",
    "Notion",
    "Agile / Sprints",
    "Git",
    "Excel",
    "SQL",
    "Mixpanel",
    "Google Analytics",
    "Claude",
  ],
  technical: [
    "Python",
    "JavaScript",
    "C/C++",
    "Java",
    "AI/ML",
    "LangChain",
    "RAG",
    "Prompt Engineering",
    "FastAPI",
  ],
  people: [
    "Stakeholder Management",
    "Cross-functional Collaboration",
    "Communication",
    "Public Speaking",
    "Leadership",
    "Ownership",
  ],
} as const;
