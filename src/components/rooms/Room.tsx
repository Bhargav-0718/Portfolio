import { ViewTransition, type ReactNode } from "react";
import type { RoomId } from "@/config/rooms";
import { cx } from "@/lib/cx";
import { Doorways } from "./Doorways";

/** Maps each travel direction to the CSS class that animates it (see rooms.css). */
const travel = {
  "travel-north": "travel-north",
  "travel-south": "travel-south",
  "travel-east": "travel-east",
  "travel-west": "travel-west",
  // Moving deeper within a room (hall → case file) and back out.
  "travel-in": "travel-in",
  "travel-out": "travel-out",
  default: "none",
};

/**
 * Every page is a room. <Room> gives it a landmark, a doorway transition
 * on entry and exit, and the doorways out at the bottom.
 * Must be used inside page.tsx (not a layout) so enter/exit fire.
 */
export function Room({ id, children, className }: { id: RoomId; children: ReactNode; className?: string }) {
  return (
    <ViewTransition enter={travel} exit={travel} default="none">
      <main id="main" data-room={id} className={cx("room", className)}>
        {children}
        <Doorways from={id} />
      </main>
    </ViewTransition>
  );
}
