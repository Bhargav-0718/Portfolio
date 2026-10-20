import { doors, PLAN_COLS, PLAN_ROWS, rooms, type Room, type RoomId } from "@/config/rooms";

/**
 * The architectural drawing of the lab: walls, doorways and the entrance.
 * Pure SVG, stretched to its container (strokes don't scale), so the same
 * drawing works as a 40px header icon and a full-width map.
 */

const W = 100;
const H = 100;
const DOOR = 22; // doorway width in plan units

const rect = (r: Room) => ({
  x: (r.plan.col - 1) * W,
  y: (r.plan.row - 1) * H,
  w: r.plan.w * W,
  h: r.plan.h * H,
});

/** The gap a doorway cuts into the wall two rooms share. */
function doorway(a: Room, b: Room) {
  const A = rect(a);
  const B = rect(b);
  // Shared vertical wall
  for (const [L, R] of [
    [A, B],
    [B, A],
  ]) {
    if (L.x + L.w === R.x) {
      const top = Math.max(L.y, R.y);
      const bottom = Math.min(L.y + L.h, R.y + R.h);
      const mid = (top + bottom) / 2;
      return { x1: R.x, y1: mid - DOOR / 2, x2: R.x, y2: mid + DOOR / 2 };
    }
  }
  // Shared horizontal wall
  for (const [T, B2] of [
    [A, B],
    [B, A],
  ]) {
    if (T.y + T.h === B2.y) {
      const left = Math.max(T.x, B2.x);
      const right = Math.min(T.x + T.w, B2.x + B2.w);
      const mid = (left + right) / 2;
      return { x1: mid - DOOR / 2, y1: B2.y, x2: mid + DOOR / 2, y2: B2.y };
    }
  }
  return null;
}

export function FloorPlanDrawing({
  current,
  strokeWidth = 1.5,
  className,
}: {
  current?: RoomId;
  strokeWidth?: number;
  className?: string;
}) {
  const byId = new Map(rooms.map((r) => [r.id, r]));
  const lobby = rect(byId.get("lobby")!);
  const here = current ? byId.get(current) : undefined;

  return (
    <svg
      viewBox={`0 0 ${PLAN_COLS * W} ${PLAN_ROWS * H}`}
      preserveAspectRatio="none"
      aria-hidden
      className={className}
      overflow="visible"
    >
      {here ? (
        <rect {...xywh(rect(here))} fill="var(--accent-mark)" fillOpacity={0.16} stroke="none" />
      ) : null}

      {rooms.map((r) => (
        <rect
          key={r.id}
          {...xywh(rect(r))}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Doorways: cut the wall with the background colour. */}
      {doors.map(([a, b]) => {
        const d = doorway(byId.get(a)!, byId.get(b)!);
        return d ? (
          <line
            key={`${a}-${b}`}
            {...d}
            stroke="var(--surface)"
            strokeWidth={strokeWidth + 2}
            vectorEffect="non-scaling-stroke"
          />
        ) : null;
      })}

      {/* Entrance: a gap in the lobby's outer wall. */}
      <line
        x1={lobby.x + lobby.w / 2 - DOOR / 2}
        y1={lobby.y + lobby.h}
        x2={lobby.x + lobby.w / 2 + DOOR / 2}
        y2={lobby.y + lobby.h}
        stroke="var(--surface)"
        strokeWidth={strokeWidth + 2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const xywh = (r: { x: number; y: number; w: number; h: number }) => ({
  x: r.x,
  y: r.y,
  width: r.w,
  height: r.h,
});
