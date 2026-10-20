"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import type { RoomId } from "@/config/rooms";
import { getRoom, roomForPath, travelTypes } from "@/lib/rooms";

/**
 * A link to another room that knows which way you're walking, so the
 * doorway transition slides in the right direction.
 */
export function RoomLink({
  to,
  hash,
  ...rest
}: {
  to: RoomId;
  /** A section inside the room, e.g. "contact". */
  hash?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "transitionTypes">) {
  const pathname = usePathname();
  const target = getRoom(to);
  return (
    <Link
      href={hash ? `${target.href}#${hash}` : target.href}
      transitionTypes={travelTypes(roomForPath(pathname), target)}
      {...rest}
    />
  );
}
