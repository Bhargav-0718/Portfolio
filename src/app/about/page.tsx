import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { achievements, education, experience, positions, skills, summary } from "@content/profile";
import { awards, chaired } from "@content/mun";
import { getContactLinks } from "@/components/layout/contact";
import { Reveal } from "@/components/motion/Reveal";
import { Room } from "@/components/rooms/Room";
import { RoomSection } from "@/components/rooms/RoomHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/config/site";
import { getCases } from "@/lib/content";
import { formatUpdated, getPrimaryResume } from "@/lib/resumes";
import { getRoom } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Investigator's Office",
  description: `About ${site.name}: ${site.descriptor}.`,
};

type Period = { start: string; end?: string | "present" } | null | undefined;

const formatPeriod = (p: Period) =>
  p
    ? [formatUpdated(p.start), p.end ? (p.end === "present" ? "present" : formatUpdated(p.end)) : null]
        .filter(Boolean)
        .join(" – ")
    : "";

type TimelineItem = { start: string; when: string; title: string; detail?: string; href?: string };

/** Room 05 — who keeps this archive. */
export default function OfficePage() {
  const room = getRoom("office");
  const current = experience.find((e) => e.current);
  const study = education[0];
  const contact = getContactLinks();
  const resume = getPrimaryResume();
  const closing = summary?.at(-1);
  const body = summary?.slice(0, -1) ?? [];

  // One timeline from every dated record: roles, projects, research, leadership, education.
  const cases = getCases();
  const timeline: TimelineItem[] = [
    ...experience
      .filter((e) => e.period)
      .map((e) => ({
        start: e.period!.start,
        when: formatPeriod(e.period),
        title: `${e.role}, ${e.organisation}`,
        detail: e.summary[0],
        href: e.caseSlug && cases.some((c) => c.slug === e.caseSlug) ? `/museum/${e.caseSlug}` : undefined,
      })),
    ...cases
      .filter((c) => c.period && !experience.some((e) => e.caseSlug === c.slug))
      .map((c) => ({
        start: c.period!.start,
        when: formatPeriod(c.period),
        title: c.title,
        detail: c.question,
        href: `/museum/${c.slug}`,
      })),
    ...achievements
      .filter((a) => a.date)
      .map((a) => ({
        start: a.date!,
        when: formatUpdated(a.date!),
        title: a.title,
        detail: a.work ? `“${a.work}”` : a.detail,
        href: a.caseSlug ? `/museum/${a.caseSlug}` : undefined,
      })),
    ...positions
      .filter((p) => p.source === "cv" && p.period)
      .map((p) => ({
        start: p.period!.start,
        when: formatPeriod(p.period),
        title: `${p.title}, ${p.organisation}`,
        detail: p.summary,
        href: "/human-element",
      })),
    ...education.map((e) => ({
      start: e.period.start,
      when: formatPeriod(e.period),
      title: e.degree,
      detail: `${e.institution}${e.grade ? ` · ${e.grade}` : ""}`,
    })),
  ].sort((a, b) => b.start.localeCompare(a.start));

  const file = [
    { label: "Based in", value: site.location },
    current ? { label: "Currently", value: `${current.role}, ${current.organisation}` } : null,
    study ? { label: "Studying", value: `${study.degree}, IIIT Nagpur` } : null,
    { label: "Focus", value: "Enterprise systems and AI products" },
    {
      label: "Off duty",
      value: `Model UN (${chaired.length} committees chaired, ${awards.length} awards), debate, thrillers`,
    },
  ].filter((f): f is { label: string; value: string } => f !== null);

  const skillGroups = [
    { name: "Product", items: skills.product },
    { name: "Technical", items: skills.technical },
    { name: "Tools", items: skills.tools },
    { name: "People", items: skills.people },
  ];

  return (
    <Room id="office">
      {/* ---- The door ---- */}
      <header className="room-head border-b border-line">
        <div aria-hidden className="reading-lamp" />
        <div className="frame grid gap-x-16 gap-y-12 pt-20 pb-16 md:pt-28 md:pb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-fg-faint">Room {room.index}</p>
            <div className="nameplate mt-5">
              <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase">{room.name}</span>
              <span className="mt-1 font-serif text-[1.6rem] leading-none">{site.name}</span>
            </div>
            <h1 className="mt-10 max-w-[18ch] text-headline">The person behind the files.</h1>
            <div className="mt-8 flex flex-col gap-5">
              {body.length > 0 ? (
                body.map((p) => (
                  <p key={p} className="measure text-[1.05rem] leading-relaxed text-fg">
                    {p}
                  </p>
                ))
              ) : (
                <Placeholder label="Summary">A personal summary, in my own words.</Placeholder>
              )}
            </div>
          </div>

          {/* Personnel file */}
          <aside className="lg:col-span-5 lg:pt-24">
            <div className="dossier surface-paper">
              <p className="dossier-tab label">Personnel file</p>
              <dl className="p-6 sm:p-8">
                {file.map((f) => (
                  <div key={f.label} className="border-b border-line py-3 first:pt-0">
                    <dt className="label text-fg-faint">{f.label}</dt>
                    <dd className="mt-1 font-serif text-[1.1rem] leading-snug">{f.value}</dd>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 pt-5">
                  <ButtonLink href={site.resume.page} variant="primary" size="sm">
                    View résumé
                  </ButtonLink>
                  <ButtonLink
                    href={resume.file}
                    download={resume.downloadName}
                    size="sm"
                    icon={<Download aria-hidden className="size-3.5" />}
                  >
                    PDF
                  </ButtonLink>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </header>

      {/* ---- The record ---- */}
      <RoomSection
        id="record"
        index="01"
        eyebrow="The record"
        title="How I got here, most recent first."
        intro="Each entry links to the room where it's filed in full."
      >
        <ol className="relative border-l border-line lg:ml-[calc(2/12*100%)]">
          {timeline.map((t) => (
            <li key={`${t.start}-${t.title}`} className="relative pb-10 pl-8 last:pb-0">
              <span
                aria-hidden
                className="absolute top-2 -left-[5px] size-[9px] rounded-full bg-accent-mark"
              />
              <Reveal>
                <p className="label text-fg-faint">{t.when}</p>
                <h3 className="mt-1 font-serif text-[1.3rem] leading-snug">
                  {t.href ? (
                    <Link href={t.href} className="hover:text-accent">
                      {t.title}
                      <ArrowUpRight aria-hidden className="ml-1 inline size-4 align-baseline text-fg-faint" />
                    </Link>
                  ) : (
                    t.title
                  )}
                </h3>
                {t.detail ? <p className="mt-1 measure text-fg-muted">{t.detail}</p> : null}
              </Reveal>
            </li>
          ))}
        </ol>
      </RoomSection>

      {/* ---- Toolkit ---- */}
      <RoomSection id="toolkit" index="02" eyebrow="The toolkit" title="What I work with.">
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g) => (
            <div key={g.name} className="bg-surface p-6">
              <h3 className="label text-accent">{g.name}</h3>
              <ul className="mt-4 space-y-1.5">
                {g.items.map((s) => (
                  <li key={s} className="text-[0.95rem] text-fg-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RoomSection>

      {/* ---- Contact ---- */}
      <RoomSection id="contact" index="03" eyebrow="Correspondence" title={closing ?? "Let's talk."}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contact.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="group flex h-full flex-col gap-2 border border-line p-6 transition-colors hover:border-accent"
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="label text-fg-faint">{c.label}</span>
                <span className="font-serif text-[1.2rem] break-all text-fg group-hover:text-accent">
                  {c.display}
                </span>
                {c.href.startsWith("http") ? <span className="sr-only">(opens in a new tab)</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </RoomSection>
    </Room>
  );
}
