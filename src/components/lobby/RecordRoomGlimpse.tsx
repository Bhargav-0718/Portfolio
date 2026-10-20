import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { site } from "@/config/site";
import { GiltFrame } from "@/components/resume/GiltFrame";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { directionLabel, getRoom, travelDirection, travelTypes } from "@/lib/rooms";
import { getPrimaryResume, getPublicResumes } from "@/lib/resumes";

/** The résumé, seen through a doorway in the lobby wall. Walking through opens the Record Room. */
export function RecordRoomGlimpse() {
  const lobby = getRoom("lobby");
  const record = getRoom("record");
  const types = travelTypes(lobby, record);
  const dir = travelDirection(lobby, record)!;
  const primary = getPrimaryResume();
  const count = getPublicResumes().length;

  return (
    <section aria-labelledby="glimpse-title" className="frame py-section">
      <div className="grid items-center gap-x-16 gap-y-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Link
            href={record.href}
            transitionTypes={types}
            className="glimpse mx-auto md:mx-0"
            aria-label={`Walk into the ${record.name}`}
          >
            <span aria-hidden className="glimpse-casing">
              <span className="glimpse-room">
                <span className="glimpse-scene">
                  <span className="glimpse-cone" />
                  <span className="glimpse-lamp" />
                  <span className="glimpse-floor" />
                </span>
                <span className="glimpse-art">
                  <GiltFrame page={primary.pages[0]} ownerName={site.name} sizes="10rem" />
                </span>
              </span>
            </span>
            <span aria-hidden className="glimpse-threshold" />
          </Link>
        </Reveal>

        <Reveal delay={100} className="md:col-span-6 md:col-start-7">
          <p className="label text-accent">
            Through the {dir} door · Room {record.index}
          </p>
          <h2 id="glimpse-title" className="mt-4 text-title md:text-[2.5rem]">
            The {record.name}
          </h2>
          <p className="mt-5 measure text-lede text-fg-muted">
            The résumé hangs in the next room, framed under a single lamp.{" "}
            {count > 1
              ? `${count} versions are on display; choose the one written for you.`
              : "Inspect it full size, or take a copy with you."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={record.href}
              variant="primary"
              transitionTypes={types}
              icon={<ArrowLeft aria-hidden className="size-3.5" />}
            >
              Walk in · {directionLabel[dir]}
            </ButtonLink>
            <ButtonLink
              href={site.resume.pdf}
              download={primary.downloadName}
              icon={<Download aria-hidden className="size-3.5" />}
            >
              Download PDF
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
