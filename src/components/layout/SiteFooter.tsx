import Link from "next/link";
import { rooms } from "@/config/rooms";
import { site } from "@/config/site";
import { RoomLink } from "@/components/rooms/RoomLink";
import { getPublicResumes } from "@/lib/resumes";
import { getContactLinks } from "./contact";

export function SiteFooter() {
  const contact = getContactLinks();
  const resumes = getPublicResumes();
  const directory = [...rooms].sort((a, b) => a.index.localeCompare(b.index));

  return (
    <footer className="border-t border-line lamp">
      <div className="frame grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <p className="label text-accent">End of file · for now</p>
          <p className="mt-5 font-serif text-headline tracking-tight">
            Some things are built. Some things are questioned.{" "}
            <em className="text-accent-mark">Everything leaves a trail.</em>
          </p>
        </div>

        <nav aria-label="Correspondence" className="md:col-span-3 md:col-start-8">
          <p className="label text-fg-faint">Correspondence</p>
          <ul className="mt-4">
            {contact.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="group flex min-h-11 flex-col justify-center"
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="label text-fg-faint">{c.label}</span>
                  <span className="break-all text-fg decoration-accent underline-offset-4 group-hover:underline">
                    {c.display}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-1">
          <nav aria-label="Rooms">
            <p className="label text-fg-faint">Rooms</p>
            <ul className="mt-4">
              {directory.map((room) => (
                <li key={room.id}>
                  <RoomLink
                    to={room.id}
                    className="flex min-h-9 items-center text-[0.95rem] text-fg-muted hover:text-fg"
                  >
                    {room.short}
                  </RoomLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Résumé versions">
            <p className="label text-fg-faint">Résumé</p>
            <ul className="mt-4">
              {resumes.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    className="flex min-h-9 items-center text-[0.95rem] text-fg-muted hover:text-fg"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="frame flex flex-col gap-2 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] meta text-fg-faint sm:flex-row sm:justify-between">
          <span>
            {site.name} · {site.location}
          </span>
          <span>Set in Newsreader, Inter Tight &amp; IBM Plex Mono</span>
        </div>
      </div>
    </footer>
  );
}
