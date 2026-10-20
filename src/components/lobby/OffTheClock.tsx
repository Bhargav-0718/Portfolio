import Link from "next/link";
import { awards, chaired, conferencesAttended, debate, organised } from "@content/mun";
import { interests } from "@content/profile";
import { Reveal } from "@/components/motion/Reveal";
import type { RoomId } from "@/config/rooms";
import { site } from "@/config/site";
import { getBlogPosts } from "@/lib/blog";
import { directionLabel, getRoom, travelDirection, travelTypes } from "@/lib/rooms";

type Card = { room: RoomId; title: string; lines: string[] };

/** The personal side: two rooms worth visiting that aren't about work. */
export async function OffTheClock() {
  const lobby = getRoom("lobby");
  const latestEssay = (await getBlogPosts())?.[0];
  const bestDelegate = awards.filter((a) => a.award === "Best Delegate").length;
  const win = debate.find((d) => d.result === "Winner");
  const dsg = organised.find((o) => o.conference === "IIITN-MUN 3.0");

  const cards: Card[] = [
    {
      room: "assembly",
      title: "Model UN, debate and public speaking.",
      lines: [
        `${conferencesAttended} conferences · ${chaired.length} committees chaired · ${bestDelegate} × Best Delegate`,
        dsg ? `${dsg.role}, ${dsg.conference}${dsg.note ? ` (${dsg.note})` : ""}` : "",
        win ? `${win.result}, ${win.event} ${win.year ?? ""}`.trim() : "",
      ].filter(Boolean),
    },
    {
      room: "reading",
      title: "Essays I write, and the investigations I read.",
      lines: [
        latestEssay
          ? `Latest essay on ${site.blog.name}: “${latestEssay.title}”`
          : `Essays on ${site.blog.name}`,
        interests.reading.join(" · "),
      ],
    },
  ];

  return (
    <section aria-labelledby="off-the-clock" className="border-t border-line">
      <div className="frame py-section">
        <Reveal>
          <p className="label text-accent">Off the clock</p>
          <h2 id="off-the-clock" className="mt-4 max-w-[24ch] text-title md:text-[2.5rem]">
            Not everything in the building is work.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => {
            const room = getRoom(card.room);
            const dir = travelDirection(lobby, room)!;
            return (
              <Reveal key={card.room} delay={i * 100}>
                <article className="group relative h-full border border-line p-6 transition-colors hover:border-line-strong sm:p-8">
                  <p className="label text-fg-faint">
                    Room {room.index} · {directionLabel[dir]} of the Lobby
                  </p>
                  <h3 className="mt-4 text-title">
                    <Link
                      href={room.href}
                      transitionTypes={travelTypes(lobby, room)}
                      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--focus)]"
                    >
                      {room.name}
                    </Link>
                  </h3>
                  <p className="mt-2 font-serif text-[1.2rem] text-fg-muted italic">{card.title}</p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5">
                    {card.lines.map((line) => (
                      <li key={line} className="meta text-fg-muted">
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 label text-fg group-hover:text-accent">Go to the {room.name} →</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
