import { site } from "@/config/site";
import { CurrentRoom } from "@/components/rooms/CurrentRoom";
import { FloorPlanMenu } from "@/components/rooms/FloorPlanMenu";
import { RoomLink } from "@/components/rooms/RoomLink";
import { getPublicResumes } from "@/lib/resumes";
import { getContactLinks } from "./contact";

/**
 * Name (back to the Lobby) · where you are · quick access + floor plan.
 * Named for view transitions so it stays still while rooms change.
 */
export function SiteHeader() {
  const resumes = getPublicResumes().map(({ id, label, href }) => ({ id, label, href }));

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-surface pt-[env(safe-area-inset-top)]"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="frame flex h-16 items-center justify-between gap-6">
        <RoomLink to="lobby" className="flex items-baseline gap-3" aria-label={`${site.name}, to the Lobby`}>
          <span className="font-serif text-[1.3rem] leading-none tracking-tight">{site.name}</span>
        </RoomLink>

        <CurrentRoom />

        <div className="flex items-center gap-1 sm:gap-3">
          <nav aria-label="Quick access" className="hidden items-center sm:flex">
            <RoomLink
              to="record"
              className="flex min-h-10 items-center px-3 label text-fg-muted transition-colors hover:text-fg"
            >
              Résumé
            </RoomLink>
            <RoomLink
              to="office"
              hash="contact"
              className="flex min-h-10 items-center px-3 label text-fg-muted transition-colors hover:text-fg"
            >
              Contact
            </RoomLink>
          </nav>
          <FloorPlanMenu
            resumes={resumes}
            contact={getContactLinks().map(({ label, href }) => ({ label, href }))}
          />
        </div>
      </div>
    </header>
  );
}
