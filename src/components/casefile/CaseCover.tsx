import { InvolvementBadge } from "@/components/ui/Badges";
import { ExternalLinkOrPending } from "@/components/ui/ExternalLinkOrPending";
import type { CaseEntry } from "@/lib/content";
import { categoryLabel } from "@/lib/content/schema";
import { formatUpdated } from "@/lib/resumes";

const formatPeriod = (p: CaseEntry["period"]) =>
  p
    ? [formatUpdated(p.start), p.end ? (p.end === "present" ? "present" : formatUpdated(p.end)) : null]
        .filter(Boolean)
        .join(" – ")
    : null;

/** The front of the folder: case number, the question, and the facts of the case. */
export function CaseCover({ entry }: { entry: CaseEntry }) {
  const period = formatPeriod(entry.period);
  const facts = [
    { label: "Project", value: entry.title },
    { label: "Role", value: entry.role },
    entry.organisation ? { label: "Organisation", value: entry.organisation } : null,
    period ? { label: "Period", value: period } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <header className="dossier surface-paper">
      <p className="dossier-tab label">Case file · {entry.id}</p>
      <div className="p-6 sm:p-10 lg:p-14">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label text-accent">{categoryLabel[entry.category]} wing</span>
            <InvolvementBadge involvement={entry.involvement} />
          </div>
          {entry.status !== "verified" ? (
            <span className="stamp">
              {entry.status === "placeholder" ? "Placeholder" : "Details pending"}
            </span>
          ) : null}
        </div>

        <h1 className="mt-8 max-w-[22ch] text-headline">{entry.question}</h1>
        <p className="mt-6 measure text-lede text-fg-muted">{entry.premise}</p>

        <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="label text-fg-faint">{f.label}</dt>
              <dd className="mt-1 font-serif text-[1.1rem] leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>

        {entry.recognition.length > 0 || entry.credits.length > 0 ? (
          <div className="mt-8 flex flex-col gap-3">
            {entry.recognition.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {entry.recognition.map((r) => (
                  <li
                    key={r}
                    className="inline-flex items-center gap-1.5 border border-finding px-2 py-0.5 label text-finding"
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-finding" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : null}
            {entry.credits.map((c) => (
              <p key={c} className="measure meta text-fg-muted">
                {c}
              </p>
            ))}
          </div>
        ) : null}

        {entry.links.length > 0 || entry.tags.length > 0 ? (
          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 lg:flex-row lg:items-start lg:justify-between">
            {entry.links.length > 0 ? (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {entry.links.map((l) => (
                  <li key={l.label}>
                    <ExternalLinkOrPending link={l} />
                  </li>
                ))}
              </ul>
            ) : null}
            {entry.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {entry.tags.map((t) => (
                  <li key={t} className="border border-line px-2 py-0.5 meta text-fg-muted">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
