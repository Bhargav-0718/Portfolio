import type { Metadata } from "next";
import { RoomLink } from "@/components/rooms/RoomLink";
import { Room } from "@/components/rooms/Room";
import { WingGallery, type HallExhibit } from "@/components/museum/WingGallery";
import { getCases } from "@/lib/content";
import { CaseCategory, categoryLabel, involvementLabel } from "@/lib/content/schema";
import { getRoom } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Museum of Unfinished Questions",
  description:
    "Projects filed as the questions they started from: AI, product thinking, enterprise transformation and leadership.",
};

/** Room 01 — the hall. Every project hangs here as the question it started from. */
export default function MuseumPage() {
  const room = getRoom("museum");
  const exhibits: HallExhibit[] = getCases().map((c) => ({
    slug: c.slug,
    id: c.id,
    question: c.question,
    title: c.title,
    wing: c.category,
    wingLabel: categoryLabel[c.category],
    involvementLabel: involvementLabel[c.involvement],
    statusLabel:
      c.status === "verified" ? null : c.status === "placeholder" ? "Placeholder" : "Details pending",
    recognition: c.recognition,
    evidenceCount: c.evidence.length,
  }));
  const wings = CaseCategory.options.map((id) => ({ id, label: categoryLabel[id] }));

  return (
    <Room id="museum" className="hall">
      <div aria-hidden className="hall-wall" />
      <div aria-hidden className="hall-track" />

      <div className="frame pt-20 pb-8 md:pt-28">
        <header className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label text-fg-faint">Room {room.index}</p>
            <h1 className="mt-3 text-headline">{room.name}</h1>
          </div>
          <p className="measure text-lede text-fg-muted lg:col-span-8">
            Every project here started as a question. Each one is hung as that question; open it to read the
            case file: what was suspected, what was tried, and what is still unresolved.
          </p>
        </header>

        <div className="mt-12">
          <WingGallery
            wings={wings}
            exhibits={exhibits}
            emptyNote={{
              leadership: (
                <>
                  Stories about leading people and negotiation are kept in the{" "}
                  <RoomLink
                    to="assembly"
                    className="text-fg underline decoration-accent underline-offset-4 hover:text-accent"
                  >
                    Assembly Hall
                  </RoomLink>{" "}
                  for now.
                </>
              ),
            }}
          />
        </div>
      </div>
    </Room>
  );
}
