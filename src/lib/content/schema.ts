import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Shared vocabularies                                                 */
/* ------------------------------------------------------------------ */

/** How Bhargav was involved. Shown on every case so claims stay honest. */
export const Involvement = z.enum(["built", "contributed", "studied", "explored"]);
export type Involvement = z.infer<typeof Involvement>;

export const involvementLabel: Record<Involvement, string> = {
  built: "Built",
  contributed: "Contributed",
  studied: "Studied",
  explored: "Exploration",
};

/** Editorial state of an entry. Anything other than "verified" is flagged in the UI. */
export const Status = z.enum(["verified", "needs-review", "placeholder"]);
export type Status = z.infer<typeof Status>;

export const CaseCategory = z.enum(["ai-engineering", "product", "enterprise", "leadership"]);
export type CaseCategory = z.infer<typeof CaseCategory>;

export const categoryLabel: Record<CaseCategory, string> = {
  "ai-engineering": "AI & Engineering",
  product: "Product Thinking",
  enterprise: "Enterprise Transformation",
  leadership: "Leadership & Communication",
};

/** Dates are stored as strings ("2025-08", "2026") so YAML never turns them into Date objects. */
const DateLike = z
  .union([z.string(), z.number(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v)));

export const Period = z.object({
  start: DateLike,
  end: DateLike.optional(),
});
export type Period = z.infer<typeof Period>;

/** An absolute URL, or a path to a file served by this site (e.g. "/certificates/x.pdf"). */
const Href = z.union([z.url(), z.string().regex(/^\/[^/]/, "must be a URL or a site path starting with /")]);

/** `href: null` = link exists but URL not supplied yet. Rendered as a labelled placeholder, never a dead link. */
export const ExternalLink = z.object({
  label: z.string(),
  href: Href.nullable(),
});
export type ExternalLink = z.infer<typeof ExternalLink>;

const base = {
  id: z.string(),
  title: z.string(),
  status: Status.default("verified"),
  /** Drafts are loaded in development but excluded from production builds. */
  draft: z.boolean().default(false),
  /** Missing information. Collected into CONTENT-TODO.md by `npm run content:todo`. */
  todo: z.array(z.string()).default([]),
};

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

/**
 * actual       – a real artifact from the work (screenshot, real diagram, real figures)
 * illustrative – drawn for this site to explain something; not an original artifact
 * placeholder  – stand-in awaiting the real thing
 */
export const Provenance = z.enum(["actual", "illustrative", "placeholder"]);
export type Provenance = z.infer<typeof Provenance>;

const evidenceBase = {
  id: z.string(),
  title: z.string(),
  caption: z.string(),
  /** Why this artifact matters to the investigation. */
  relevance: z.string().optional(),
  provenance: Provenance,
  annotations: z.array(z.string()).default([]),
  /** The original, e.g. the PDF a preview image was rendered from. */
  source: ExternalLink.optional(),
};

const ComparisonSide = z.object({
  label: z.string(),
  body: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
});

export const Evidence = z.discriminatedUnion("type", [
  z.object({
    ...evidenceBase,
    type: z.literal("image"),
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  z.object({
    ...evidenceBase,
    type: z.literal("svg"),
    src: z.string(),
    alt: z.string(),
    /** Intrinsic size (from the viewBox), used to reserve space. */
    width: z.number().default(960),
    height: z.number().default(540),
  }),
  z.object({ ...evidenceBase, type: z.literal("note"), body: z.string() }),
  z.object({
    ...evidenceBase,
    type: z.literal("table"),
    columns: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.object({ ...evidenceBase, type: z.literal("code"), language: z.string(), code: z.string() }),
  z.object({ ...evidenceBase, type: z.literal("link"), href: Href.nullable(), label: z.string() }),
  z.object({ ...evidenceBase, type: z.literal("comparison"), before: ComparisonSide, after: ComparisonSide }),
]);
export type Evidence = z.infer<typeof Evidence>;
export type EvidenceType = Evidence["type"];

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export const CaseFrontmatter = z.object({
  ...base,
  /** The exhibit title — phrased as the question the work investigated. */
  question: z.string(),
  category: CaseCategory,
  premise: z.string(),
  role: z.string(),
  organisation: z.string().optional(),
  involvement: Involvement,
  period: Period.optional(),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  tags: z.array(z.string()).default([]),
  /** Evidence id used as the exhibit cover. */
  cover: z.string().optional(),
  evidence: z.array(Evidence).default([]),
  /** Slugs of related entries in any collection. */
  related: z.array(z.string()).default([]),
  links: z.array(ExternalLink).default([]),
  /** Verified recognition, e.g. "Paper presented at ICCIS 2026". */
  recognition: z.array(z.string()).default([]),
  /** Credit to collaborators, e.g. "Paper co-authored with …". */
  credits: z.array(z.string()).default([]),
});
export type CaseFrontmatter = z.infer<typeof CaseFrontmatter>;

export const CuriosityKind = z.enum(["opinion", "hypothesis", "fact", "open-question"]);
export type CuriosityKind = z.infer<typeof CuriosityKind>;

export const curiosityKindLabel: Record<CuriosityKind, string> = {
  opinion: "Opinion",
  hypothesis: "Hypothesis",
  fact: "Researched fact",
  "open-question": "Open question",
};

export const CuriosityFrontmatter = z.object({
  ...base,
  kind: CuriosityKind,
  date: DateLike.optional(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  sources: z.array(ExternalLink).default([]),
});
export type CuriosityFrontmatter = z.infer<typeof CuriosityFrontmatter>;

export const LeadershipFrontmatter = z.object({
  ...base,
  role: z.string(),
  organisation: z.string(),
  period: Period.optional(),
  kind: z.enum(["organising", "competition", "club", "speaking"]),
  summary: z.string(),
  /** Short factual highlights, e.g. "200+ delegates". Verified only. */
  highlights: z.array(z.string()).default([]),
  order: z.number().default(99),
});
export type LeadershipFrontmatter = z.infer<typeof LeadershipFrontmatter>;

export const FieldNoteType = z.enum(["reading", "listening", "essay", "experiment", "reflection"]);
export type FieldNoteType = z.infer<typeof FieldNoteType>;

export const FieldNoteFrontmatter = z.object({
  ...base,
  type: FieldNoteType,
  date: DateLike.optional(),
  /** The book, podcast or essay the note is about, if any. */
  subject: z.object({ title: z.string(), creator: z.string().optional() }).optional(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
});
export type FieldNoteFrontmatter = z.infer<typeof FieldNoteFrontmatter>;
