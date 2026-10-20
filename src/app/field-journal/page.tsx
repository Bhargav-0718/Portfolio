import type { Metadata } from "next";
import { interests } from "@content/profile";
import { Reveal } from "@/components/motion/Reveal";
import { Room } from "@/components/rooms/Room";
import { WritingDesk } from "@/components/reading/WritingDesk";
import { RoomHeader, RoomSection } from "@/components/rooms/RoomHeader";
import { site } from "@/config/site";
import { StatusBadge } from "@/components/ui/Badges";
import { getFieldNotes } from "@/lib/content";
import { renderMdx } from "@/lib/content/mdx";
import type { FieldNoteType } from "@/lib/content/schema";

export const metadata: Metadata = {
  title: "Reading Room",
  description:
    "Essays from Through My Mind's Eye, and notes on thrillers, detective stories and investigative podcasts.",
};

const typeLabel: Record<FieldNoteType, string> = {
  reading: "Reading",
  listening: "Listening",
  essay: "Essay",
  experiment: "Experiment",
  reflection: "Reflection",
};

/** Spine colours, muted to sit in the palette. */
const spineColours = ["#5b3a29", "#3f4a44", "#4a3b2a", "#2f3a45", "#5a4a2f", "#3d2f36"];
const spineHeights = ["h-40", "h-44", "h-36", "h-42", "h-38", "h-44"];

/** Room 04 — the personal side: what I read and listen to, and notes on it. */
export default function ReadingRoomPage() {
  const notes = getFieldNotes();

  return (
    <Room id="reading">
      <RoomHeader
        room="reading"
        title="Notes from outside the office."
        scenery={<div aria-hidden className="reading-lamp" />}
        intro="What I write, and what I read: essays from my blog, thrillers, detective stories and investigative podcasts. The same habit as the rest of the archive: follow the evidence and notice where the reasoning gets thin."
      >
        <div className="mt-12">
          <p className="label text-fg-faint">On the shelf</p>
          <div className="mt-4 inline-block max-w-full overflow-hidden">
            <ul className="shelf" aria-label="Reading interests">
              {interests.reading.map((genre, i) => (
                <li
                  key={genre}
                  className={`spine ${spineHeights[i % spineHeights.length]}`}
                  style={{ backgroundColor: spineColours[i % spineColours.length] }}
                >
                  {genre}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RoomHeader>

      <RoomSection
        id="essays"
        index="01"
        eyebrow={`The writing desk · ${site.blog.name}`}
        title="Essays, written when a thought won't leave."
        intro="On language, nationalism, war and freedom: questions that started with a headline or a notification and kept going. Each essay opens in full on my blog."
      >
        <WritingDesk />
      </RoomSection>

      <RoomSection
        id="journal"
        index="02"
        eyebrow="The journal"
        title="Field notes."
        intro="Short notes, written when something is worth writing down. The first entries below are samples and say so."
      >
        <ul className="grid gap-6 lg:grid-cols-3">
          {notes.map((n, i) => (
            <li key={n.slug} id={n.slug} className="scroll-mt-24">
              <Reveal delay={i * 80} className="h-full">
                <article className="surface-paper notebook flex h-full flex-col gap-3 p-6 pl-16 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="label text-accent">
                      {n.id} · {typeLabel[n.type]}
                    </span>
                    <StatusBadge status={n.status} />
                  </div>
                  <h3 className="text-[1.35rem] leading-snug">{n.title}</h3>
                  {n.subject ? (
                    <p className="meta text-fg-muted">
                      {n.subject.title}
                      {n.subject.creator ? ` · ${n.subject.creator}` : ""}
                    </p>
                  ) : null}
                  <p className="text-fg-muted">{n.summary}</p>
                  {n.body.trim() ? (
                    <details className="group mt-auto border-t border-line pt-3">
                      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 label text-fg hover:text-accent">
                        <span aria-hidden className="transition-transform group-open:rotate-90">
                          ▸
                        </span>
                        Read the note
                      </summary>
                      <div className="mt-2">{renderMdx(n.body)}</div>
                    </details>
                  ) : null}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </RoomSection>
    </Room>
  );
}
