"use client";

import { usePathname } from "next/navigation";
import { roomForPath } from "@/lib/rooms";

/** "You are in · 06 Record Room" in the header. */
export function CurrentRoom() {
  const room = roomForPath(usePathname());
  return (
    <p className="hidden items-baseline gap-3 md:flex">
      <span className="label text-fg-faint">You are in</span>
      <span className="label text-accent">{room.index}</span>
      <span className="font-serif text-[1.05rem] leading-none text-fg">{room.name}</span>
    </p>
  );
}
