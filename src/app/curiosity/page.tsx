import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Room } from "@/components/rooms/Room";
import { RoomHeader, RoomSection } from "@/components/rooms/RoomHeader";
import { StatusBadge } from "@/components/ui/Badges";
import { ExternalLinkOrPending } from "@/components/ui/ExternalLinkOrPending";
import { getCuriosities } from "@/lib/content";
import { renderMdx } from "@/lib/content/mdx";
import { CuriosityKind, curiosityKindLabel } from "@/lib/content/schema";

export const metadata: Metadata = {
  title: "Cabinet of Curiosity",
  description: "Questions, hypotheses and observations about AI, products and people.",
};

/** What each drawer label promises the reader. */
const kindMeaning: Record<CuriosityKind, string> = {
  opinion: "What I think. Argue with it.",
  hypothesis: "A testable guess, and what would break it.",
  fact: "Something I checked, with sources.",
  "open-question": "Something I don't know yet.",
};

/** Room 02 — short entries, each labelled for how much weight it can bear. */
export default function CabinetPage() {
  const entries = getCuriosities();

  return (
    <Room id="cabinet">
      <RoomHeader
        room="cabinet"
        title="Questions I haven't finished asking."
        scenery={<div aria-hidden className="drawer-wall" />}
        intro="Short entries on AI, products and human behaviour. Every drawer is labelled with what kind of thing is inside, so you know how much weight it can bear."
      >
        <dl className="mt-10 grid max-w-[56rem] gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CuriosityKind.options.map((k) => (
            <div key={k} className="bg-surface p-4">
              <dt className="label text-accent">{curiosityKindLabel[k]}</dt>
              <dd className="mt-1.5 meta text-fg-muted">{kindMeaning[k]}</dd>
            </div>
          ))}
        </dl>
      </RoomHeader>

      <RoomSection
        id="drawers"
        index="01"
        eyebrow={`${entries.length} ${entries.length === 1 ? "drawer" : "drawers"} filled so far`}
        title="Open a drawer."
      >
        {entries.length === 0 ? (
          <p className="border border-dashed border-line-strong p-8 text-fg-muted">
            The cabinet is empty for now. The first drawers are being filled.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {entries.map((e, i) => (
              <li key={e.slug} id={e.slug} className="scroll-mt-24">
                <Reveal delay={i * 80} className="specimen h-full">
                  <div className="specimen-front">
                    <span className="label text-[#e4c98a]">
                      {e.id} · {curiosityKindLabel[e.kind]}
                    </span>
                    <span aria-hidden className="specimen-pull" />
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={e.status} />
                      {e.date ? <span className="meta text-fg-faint">{e.date}</span> : null}
                    </div>
                    <h3 className="text-title">{e.title}</h3>
                    <p className="text-fg-muted">{e.summary}</p>
                    {e.tags.length > 0 ? (
                      <ul className="flex flex-wrap gap-2">
                        {e.tags.map((t) => (
                          <li key={t} className="border border-line px-2 py-0.5 meta text-fg-muted">
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {e.body.trim() ? (
                      <details className="group border-t border-line pt-4">
                        <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 label text-fg hover:text-accent">
                          <span aria-hidden className="transition-transform group-open:rotate-90">
                            ▸
                          </span>
                          Open the drawer
                        </summary>
                        <div className="mt-2">{renderMdx(e.body)}</div>
                      </details>
                    ) : null}
                    {e.sources.length > 0 ? (
                      <div>
                        <p className="label text-fg-faint">Sources</p>
                        <ul className="mt-2 space-y-1">
                          {e.sources.map((s) => (
                            <li key={s.label}>
                              <ExternalLinkOrPending link={s} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </RoomSection>
    </Room>
  );
}
