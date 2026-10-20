import type { Metadata } from "next";
import {
  awards,
  chaired,
  clubWork,
  conferencesAttended,
  debate,
  munSkills,
  munSummary,
  oratorRoles,
  organised,
} from "@content/mun";
import { Reveal } from "@/components/motion/Reveal";
import { Room } from "@/components/rooms/Room";
import { RoomHeader, RoomSection } from "@/components/rooms/RoomHeader";
import { StatusBadge } from "@/components/ui/Badges";
import { getLeadership } from "@/lib/content";
import { nestedHeadings, renderMdx } from "@/lib/content/mdx";

export const metadata: Metadata = {
  title: "Assembly Hall",
  description:
    "Model UN, debate and leading people: 20+ conferences, 11 committees chaired, four Best Delegate awards.",
};

const awardOrder = [
  "Best Delegate",
  "Best Overall Speaker",
  "High Commendation",
  "Special Mention",
  "Honourable Mention",
  "Verbal Mention",
];

/** Room 03 — Model UN, debate and the people side of leadership. */
export default function AssemblyHallPage() {
  const stories = getLeadership();
  const bestDelegate = awards.filter((a) => a.award === "Best Delegate").length;
  const debateWin = debate.find((d) => d.result === "Winner");

  const stats = [
    { value: conferencesAttended, label: "Conferences" },
    { value: String(chaired.length), label: "Committees chaired" },
    { value: String(bestDelegate), label: "Best Delegate awards" },
    { value: String(awards.length), label: "MUN awards in all" },
  ];

  const grouped = awardOrder
    .map((name) => ({ name, items: awards.filter((a) => a.award === name) }))
    .filter((g) => g.items.length > 0);

  return (
    <Room id="assembly">
      <RoomHeader
        room="assembly"
        title="Most problems are people problems first."
        scenery={<div aria-hidden className="hemicycle" />}
        intro={<p className="font-serif text-[1.2rem] leading-relaxed italic">“{munSummary}”</p>}
      >
        <dl className="mt-12 grid max-w-[56rem] grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-5">
              <dt className="label text-fg-faint">{s.label}</dt>
              <dd className="mt-2 font-serif text-[2.25rem] leading-none">{s.value}</dd>
            </div>
          ))}
        </dl>
        {debateWin ? (
          <p className="mt-5 meta text-fg-muted">
            Also: <span className="text-fg">{debateWin.result}</span>, {debateWin.event} {debateWin.year}.
          </p>
        ) : null}
      </RoomHeader>

      {/* ---- The honours board ---- */}
      <RoomSection
        id="honours"
        index="01"
        eyebrow="The honours board"
        title="Awards from the committee floor."
        intro="Every award as listed in my MUN record, with the committee and the country or character I represented."
      >
        <Reveal>
          <div className="honours-board">
            <p className="gilt-text text-center font-serif text-[1.5rem] tracking-[0.18em] uppercase">
              Honours
            </p>
            <div className="gilt-rule mx-auto mt-4 max-w-md" />
            <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-2">
              {grouped.map((g) => (
                <div key={g.name}>
                  <h3 className="gilt-text font-mono text-[0.75rem] tracking-[0.2em] uppercase">
                    {g.name}
                    {g.items.length > 1 ? ` · ${g.items.length}` : ""}
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {g.items.map((a) => (
                      <li
                        key={`${a.conference}-${a.committee}`}
                        className="border-b border-[#d6b26a]/15 pb-3"
                      >
                        <p className="gilt-text font-serif text-[1.15rem] leading-snug">
                          {a.conference}
                          {a.host ? `, ${a.host}` : ""}
                          {a.year ? ` · ${a.year}` : ""}
                        </p>
                        <p className="mt-0.5 text-[0.85rem] text-[#cdb98f]">
                          {a.committee} · as {a.representing}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </RoomSection>

      {/* ---- From the chair ---- */}
      <RoomSection
        id="chair"
        index="02"
        eyebrow="From the chair"
        title={`${chaired.length} committees chaired, mostly in crisis.`}
        intro="Running a committee is a different job from winning one: keeping debate moving, writing crises, and being fair to every delegate in the room."
      >
        <Reveal>
          <div className="surface-paper overflow-x-auto p-5 shadow-[0_24px_50px_-24px_rgb(0_0_0/0.9)] sm:p-8">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Committees chaired</caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-2 pr-4 label font-normal text-fg-faint">
                    Conference
                  </th>
                  <th scope="col" className="py-2 pr-4 label font-normal text-fg-faint">
                    Committee
                  </th>
                  <th scope="col" className="py-2 label font-normal text-fg-faint">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {chaired.map((c) => (
                  <tr key={`${c.conference}-${c.committee}`} className="border-b border-line align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-serif text-[1.05rem] font-normal">
                      {c.conference}
                      {c.year ? <span className="ml-2 meta text-fg-faint">{c.year}</span> : null}
                    </th>
                    <td className="py-3 pr-4 text-fg-muted">{c.committee}</td>
                    <td className="py-3 meta text-accent">{c.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </RoomSection>

      {/* ---- Organised & debate ---- */}
      <RoomSection
        id="organised"
        index="03"
        eyebrow="Behind the scenes, and at the lectern"
        title="Organising conferences, and debating outside them."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="h-full border border-line p-6 sm:p-8">
            <h3 className="label text-accent">Conferences organised</h3>
            <ul className="mt-5 space-y-5">
              {organised.map((o) => (
                <li key={o.conference}>
                  <p className="font-serif text-[1.3rem]">{o.role}</p>
                  <p className="meta text-fg-muted">
                    {o.conference}
                    {o.year ? ` · ${o.year}` : ""}
                    {o.note ? ` · ${o.note}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="h-full border border-line p-6 sm:p-8">
            <h3 className="label text-accent">Debate</h3>
            <ul className="mt-5 space-y-5">
              {debate.map((d) => (
                <li key={d.event}>
                  <p className="font-serif text-[1.3rem]">
                    {d.result}
                    <span className="text-fg-muted"> · {d.event}</span>
                  </p>
                  <p className="meta text-fg-muted">{[d.venue, d.year].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </RoomSection>

      {/* ---- Stories ---- */}
      <RoomSection
        id="stories"
        index="04"
        eyebrow="Stories from the floor"
        title="What the titles don't say."
        intro="Situations, decisions and what they taught me. The stories are still being written; each says so."
      >
        <ul className="grid gap-6 lg:grid-cols-2">
          {stories.map((s) => (
            <li key={s.slug} id={s.slug} className="scroll-mt-24">
              <article className="flex h-full flex-col border border-line p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label text-accent">{s.id}</span>
                  <span className="label text-fg-faint">{s.role}</span>
                  <StatusBadge status={s.status} />
                </div>
                <h3 className="mt-4 text-title">{s.title}</h3>
                <p className="mt-3 text-fg-muted">{s.summary}</p>
                {s.highlights.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.highlights.map((h) => (
                      <li key={h} className="border border-line px-2 py-0.5 meta text-fg-muted">
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {s.body.trim() ? (
                  <details className="group mt-auto border-t border-line pt-4">
                    <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 label text-fg hover:text-accent">
                      <span aria-hidden className="transition-transform group-open:rotate-90">
                        ▸
                      </span>
                      Read the story
                    </summary>
                    <div className="mt-4">{renderMdx(s.body, nestedHeadings)}</div>
                  </details>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </RoomSection>

      {/* ---- Club & skills ---- */}
      <RoomSection
        id="club"
        index="05"
        eyebrow="Orator, IIIT Nagpur"
        title="The club behind the conferences."
        intro="IIIT Nagpur's public speaking and MUN club."
      >
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h3 className="label text-fg-faint">Roles</h3>
            <ul className="mt-4 space-y-3">
              {oratorRoles.map((r) => (
                <li key={r} className="font-serif text-[1.2rem]">
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <h3 className="label text-fg-faint">What that involved</h3>
            <ul className="mt-4 space-y-3">
              {clubWork.map((w) => (
                <li key={w} className="border-l border-accent-mark pl-4 text-fg">
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
          {munSkills.map((s) => (
            <div key={s.name} className="bg-surface p-6">
              <p className="label text-accent">{s.name}</p>
              <p className="mt-2 text-fg-muted">{s.detail}</p>
            </div>
          ))}
        </div>
      </RoomSection>
    </Room>
  );
}
