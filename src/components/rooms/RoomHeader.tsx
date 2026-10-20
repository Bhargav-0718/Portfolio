import type { ReactNode } from "react";
import type { RoomId } from "@/config/rooms";
import { cx } from "@/lib/cx";
import { getRoom } from "@/lib/rooms";

/**
 * The top of a room: number, name as wall lettering, and an introduction.
 * `scenery` is drawn behind it (aria-hidden by the caller).
 */
export function RoomHeader({
  room: roomId,
  title,
  intro,
  scenery,
  children,
  className,
}: {
  room: RoomId;
  /** Defaults to the room's name. */
  title?: ReactNode;
  intro?: ReactNode;
  scenery?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const room = getRoom(roomId);
  return (
    <header className={cx("room-head border-b border-line", className)}>
      {scenery}
      <div className="frame pt-20 pb-14 md:pt-28 md:pb-20">
        <p className="label text-fg-faint">
          Room {room.index}
          {title ? ` · ${room.name}` : ""}
        </p>
        <h1 className="mt-3 max-w-[20ch] text-headline">{title ?? room.name}</h1>
        {intro ? <div className="mt-6 measure text-lede text-fg-muted">{intro}</div> : null}
        {children}
      </div>
    </header>
  );
}

/** A numbered section inside a room. */
export function RoomSection({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cx("frame scroll-mt-24 py-16 md:py-24", className)}
    >
      <div className="grid gap-x-12 gap-y-4 lg:grid-cols-12">
        <p className="label text-fg-faint lg:col-span-2 lg:pt-2">{index}</p>
        <div className="lg:col-span-10">
          <p className="label text-accent">{eyebrow}</p>
          <h2 id={`${id}-title`} className="mt-3 max-w-[28ch] text-title md:text-[2.25rem]">
            {title}
          </h2>
          {intro ? <div className="mt-4 measure text-fg-muted">{intro}</div> : null}
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
