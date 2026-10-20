import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { EvidenceGallery } from "@/components/evidence/EvidenceGallery";
import { InvolvementBadge, StatusBadge } from "@/components/ui/Badges";
import { getCases, type CaseEntry } from "@/lib/content";
import { categoryLabel } from "@/lib/content/schema";
import { renderMdx, splitSections } from "@/lib/content/mdx";
import { CaseCover } from "./CaseCover";
import { CaseIndex } from "./CaseIndex";

/** Display names for the standard case-file sections. */
const sectionLabel: Record<string, string> = {
  brief: "The Brief",
  evidence: "The Evidence",
  hypotheses: "The Hypotheses",
  investigation: "The Investigation",
  finding: "The Finding",
  "open-questions": "The Open Questions",
  related: "Related Files",
};

/**
 * The reusable case-file template. Sections come from the case's MDX body
 * (## headings), evidence from its frontmatter. Anything a case doesn't have
 * is simply left out, so every project uses the same template.
 */
export function CaseFile({ entry }: { entry: CaseEntry }) {
  const sections = splitSections(entry.body);
  const related = relatedCases(entry);

  // Evidence sits right after the brief (or first, if there's no brief).
  const blocks: { id: string; label: string; content: ReactNode }[] = [];
  const evidenceBlock =
    entry.evidence.length > 0
      ? {
          id: "evidence",
          label: sectionLabel.evidence,
          content: (
            <>
              <p className="mb-8 measure text-fg-muted">
                {entry.evidence.length} {entry.evidence.length === 1 ? "artifact" : "artifacts"} on file. Open
                one to inspect it, with notes on where it came from and why it matters.
              </p>
              <EvidenceGallery evidence={entry.evidence} caseId={entry.id} />
            </>
          ),
        }
      : null;

  for (const s of sections) {
    if (s.id === "intro") {
      blocks.push({ id: "intro", label: "Introduction", content: renderMdx(s.body) });
      continue;
    }
    blocks.push({ id: s.id, label: sectionLabel[s.id] ?? s.title, content: renderMdx(s.body) });
    if (s.id === "brief" && evidenceBlock) blocks.push(evidenceBlock);
  }
  if (evidenceBlock && !blocks.includes(evidenceBlock)) blocks.unshift(evidenceBlock);
  if (related.length > 0) {
    blocks.push({
      id: "related",
      label: sectionLabel.related,
      content: <RelatedFiles entries={related} />,
    });
  }

  return (
    <div className="frame pt-10 pb-8 md:pt-14">
      <Link
        href="/museum"
        transitionTypes={["travel-out"]}
        className="inline-flex min-h-10 items-center gap-2 label text-fg-muted hover:text-fg"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Back to the hall
      </Link>

      <div className="mt-4">
        <CaseCover entry={entry} />
      </div>

      <div className="mt-20 grid gap-x-16 lg:grid-cols-[13rem_1fr]">
        <div className="hidden lg:block">
          <CaseIndex caseId={entry.id} items={blocks.map(({ id, label }) => ({ id, label }))} />
        </div>
        <div className="flex flex-col gap-20">
          {blocks.map((block, i) => (
            <section
              key={block.id}
              id={block.id}
              aria-labelledby={`${block.id}-title`}
              className="scroll-mt-24"
            >
              <header className="mb-6 flex items-baseline gap-4 border-b border-line pb-4">
                <span className="label text-accent">§ {String(i + 1).padStart(2, "0")}</span>
                <h2 id={`${block.id}-title`} className="text-title">
                  {block.label}
                </h2>
              </header>
              {block.content}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Explicitly related cases first, then others from the same wing. */
function relatedCases(entry: CaseEntry) {
  const all = getCases().filter((c) => c.slug !== entry.slug);
  const explicit = all.filter((c) => entry.related.includes(c.slug));
  const sameWing = all.filter((c) => c.category === entry.category && !entry.related.includes(c.slug));
  const rest = all.filter((c) => c.category !== entry.category && !entry.related.includes(c.slug));
  return [...explicit, ...sameWing, ...rest].slice(0, 3);
}

function RelatedFiles({ entries }: { entries: CaseEntry[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {entries.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/museum/${c.slug}`}
            className="group flex h-full flex-col gap-3 border border-line p-5 transition-colors hover:border-line-strong"
          >
            <span className="flex flex-wrap items-center gap-3">
              <span className="label text-accent">{c.id}</span>
              <span className="label text-fg-faint">{categoryLabel[c.category]}</span>
            </span>
            <span className="font-serif text-[1.15rem] leading-snug text-fg group-hover:text-accent">
              {c.question}
            </span>
            <span className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <InvolvementBadge involvement={c.involvement} />
              <StatusBadge status={c.status} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
