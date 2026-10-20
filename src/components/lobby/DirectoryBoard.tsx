import Link from "next/link";
import { rooms } from "@/config/rooms";
import { getRoom, travelDirection, travelTypes } from "@/lib/rooms";

const compass = { north: "N", south: "S", east: "E", west: "W" } as const;

/**
 * The building directory: a black felt letter board, as in an office-tower
 * lobby. Every line is a real link to its room; the last column says which
 * way to walk from the Lobby.
 */
export function DirectoryBoard() {
  const lobby = getRoom("lobby");
  const directory = [...rooms].sort((a, b) => a.index.localeCompare(b.index));

  return (
    <nav aria-label="Building directory" className="directory-board">
      <div className="db-letters text-center">
        <p className="text-[0.95rem] tracking-[0.3em]">Directory</p>
        <p className="mt-1 text-[0.6rem] tracking-[0.22em] text-[#ecebe4]/70">The Unfinished Archive</p>
      </div>

      <ul className="mt-5 border-t border-[#ecebe4]/15 pt-3">
        {directory.map((room) => {
          const here = room.id === lobby.id;
          const dir = travelDirection(lobby, room);
          return (
            <li key={room.id}>
              <Link
                href={room.href}
                aria-current={here ? "page" : undefined}
                transitionTypes={travelTypes(lobby, room)}
                className="group db-letters grid min-h-9 grid-cols-[2rem_1fr] items-baseline gap-x-2 py-1.5 text-[0.72rem] transition-colors hover:bg-white/[0.04] sm:text-[0.78rem]"
              >
                <span className="text-[#ecebe4]/60">{room.index}</span>
                <span className="flex items-baseline gap-2">
                  <span>{room.name}</span>
                  <span aria-hidden className="db-leader" />
                  <span className="text-[#ecebe4]/80 group-hover:text-oxide-light">
                    {here ? (
                      "Here"
                    ) : (
                      <>
                        <span aria-hidden>{compass[dir!]}</span>
                        <span className="sr-only">, to the {dir}</span>
                      </>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
