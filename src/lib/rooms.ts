import { doors, rooms, type Room, type RoomId } from "@/config/rooms";

export type Direction = "north" | "south" | "east" | "west";

export const directionLabel: Record<Direction, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
};

/** Transition types understood by <Room>'s ViewTransition. */
export const TRAVEL_TYPES = ["travel-north", "travel-south", "travel-east", "travel-west"] as const;

const byId = new Map(rooms.map((r) => [r.id, r]));

export const getRoom = (id: RoomId) => byId.get(id)!;

/** "the Record Room", but "The Lobby" stays as is (no "the The Lobby"). */
export const theRoom = (room: Room) => (room.name.startsWith("The ") ? room.name : `the ${room.name}`);

/** The room a URL belongs to. Nested pages (e.g. /museum/<case>) belong to their parent room. */
export function roomForPath(pathname: string): Room {
  const match = rooms
    .filter((r) => r.href !== "/" && (pathname === r.href || pathname.startsWith(`${r.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match ?? getRoom("lobby");
}

function center(room: Room) {
  return { x: room.plan.col - 1 + room.plan.w / 2, y: room.plan.row - 1 + room.plan.h / 2 };
}

/** Compass direction of travel from one room to another, by the dominant axis on the plan. */
export function travelDirection(from: Room, to: Room): Direction | null {
  if (from.id === to.id) return null;
  const a = center(from);
  const b = center(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "east" : "west";
  return dy > 0 ? "south" : "north";
}

/** `transitionTypes` for a <Link> moving between two rooms. */
export function travelTypes(from: Room, to: Room): string[] | undefined {
  const dir = travelDirection(from, to);
  return dir ? [`travel-${dir}`] : undefined;
}

/** Rooms that share a doorway with `id`, ordered west → north → east → south. */
export function getExits(id: RoomId) {
  const from = getRoom(id);
  const order: Direction[] = ["west", "north", "east", "south"];
  return doors
    .filter(([a, b]) => a === id || b === id)
    .map(([a, b]) => getRoom(a === id ? b : a))
    .map((to) => ({ room: to, direction: travelDirection(from, to)! }))
    .sort((x, y) => order.indexOf(x.direction) - order.indexOf(y.direction));
}
