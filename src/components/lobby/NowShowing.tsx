import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { EvidenceTable } from "@/components/evidence/EvidenceTable";
import { Reveal } from "@/components/motion/Reveal";
import { InvolvementBadge, StatusBadge } from "@/components/ui/Badges";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedCases, type CaseEntry } from "@/lib/content";
import { categoryLabel } from "@/lib/content/schema";
import { getRoom, travelTypes } from "@/lib/rooms";

const museumTypes = () => travelTypes(getRoom("lobby"), getRoom("museum"));

/** Featured exhibits from the Museum: one lead piece with real evidence, two beside it. */
export function NowShowing() {
  const cases = getFeaturedCases().slice(0, 3);
  if (cases.length === 0) return null;
  const [lead, ...rest] = cases;
  const leadEvidence = lead.evidence.find((e) => e.id === lead.cover) ?? lead.evidence[0];
  const museum = getRoom("museum");

  return (
    <section aria-labelledby="now-showing" className="border-y border-line bg-surface-sunken">
      <div className="frame py-section">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-accent">Now showing · Room {museum.index}</p>
            <h2 id="now-showing" className="mt-4 max-w-[22ch] text-title md:text-[2.5rem]">
              Three questions, currently on display in the Museum.
            </h2>
          </div>
          <ButtonLink href={museum.href} variant="text" transitionTypes={museumTypes()}>
            Enter the Museum ↑
          </ButtonLink>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ExhibitCard entry={lead} size="lead">
              {leadEvidence?.type === "table" ? (
                <div className="mt-8 max-w-[26rem]">
                  <EvidenceTable evidence={leadEvidence} label={`Evidence A · ${lead.id}`} />
                </div>
              ) : null}
            </ExhibitCard>
          </Reveal>
          <div className="grid gap-6 lg:col-span-5">
            {rest.map((entry, i) => (
              <Reveal key={entry.slug} delay={(i + 1) * 100}>
                <ExhibitCard entry={entry} size="side" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExhibitCard({
  entry,
  size,
  children,
}: {
  entry: CaseEntry;
  size: "lead" | "side";
  children?: ReactNode;
}) {
  return (
    <article className="group relative h-full border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-8">
      {/* A small spotlight above each exhibit. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_50%_0,rgb(255_232_196/0.07),transparent_75%)]"
      />
      <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="label text-accent">{entry.id}</span>
        <span className="label text-fg-faint">{categoryLabel[entry.category]} wing</span>
        <InvolvementBadge involvement={entry.involvement} />
        <StatusBadge status={entry.status} />
      </div>
      <h3
        className={size === "lead" ? "relative mt-6 max-w-[22ch] text-headline" : "relative mt-5 text-title"}
      >
        <Link
          href={`/museum/${entry.slug}`}
          transitionTypes={museumTypes()}
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--focus)]"
        >
          {entry.question}
        </Link>
      </h3>
      <p className="relative mt-4 measure text-fg-muted">{entry.premise}</p>
      <p className="relative mt-4 meta text-fg-faint">
        {entry.title}
        {entry.organisation ? ` · ${entry.organisation}` : ""} · {entry.role}
      </p>
      {entry.recognition.length > 0 ? (
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {entry.recognition.map((r) => (
            <li
              key={r}
              className="inline-flex items-center gap-1.5 border border-finding/50 px-2 py-0.5 label text-finding"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-finding" />
              {r}
            </li>
          ))}
        </ul>
      ) : null}
      {children}
      <p className="relative mt-6 inline-flex items-center gap-1 label text-fg group-hover:text-accent">
        Open case file {entry.id}
        <ArrowUpRight aria-hidden className="size-3.5" />
      </p>
    </article>
  );
}
