import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import type { RoomId } from "@/config/rooms";
import { directionLabel, getExits, getRoom, theRoom, type Direction } from "@/lib/rooms";

const arrows: Record<Direction, typeof ArrowLeft> = {
  north: ArrowUp,
  south: ArrowDown,
  east: ArrowRight,
  west: ArrowLeft,
};

/** The doors out of a room, drawn as doors. Hovering or focusing one swings it open. */
export function Doorways({ from }: { from: RoomId }) {
  const room = getRoom(from);
  const exits = getExits(from);

  return (
    <nav aria-label={`Doorways out of ${theRoom(room)}`} className="relative mt-16">
      {/* Skirting board: where the room's wall meets the floor. */}
      <div aria-hidden className="h-3 border-y border-line bg-surface-sunken" />
      <div className="frame py-14 md:py-20">
        <p className="label text-fg-faint">
          Doorways · {exits.length} {exits.length === 1 ? "exit" : "exits"} from {theRoom(room)}
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {exits.map(({ room: to, direction }) => {
            const Arrow = arrows[direction];
            return (
              <li key={to.id}>
                <Link
                  href={to.href}
                  transitionTypes={[`travel-${direction}`]}
                  className="door group flex h-full items-stretch gap-5 border border-line p-4 transition-colors hover:border-line-strong"
                >
                  <span aria-hidden className="door-frame">
                    <span className="door-glow" />
                    <span className="door-panel">
                      <span className="door-knob" />
                    </span>
                  </span>
                  <span className="flex flex-col justify-center gap-1.5 py-1">
                    <span className="flex items-center gap-1.5 label text-accent">
                      <Arrow aria-hidden className="size-3" />
                      {directionLabel[direction]} · Room {to.index}
                    </span>
                    <span className="font-serif text-[1.2rem] leading-snug text-fg">{to.name}</span>
                    <span className="meta text-fg-muted">{to.purpose}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
