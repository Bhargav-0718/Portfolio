/**
 * The lab's floor plan. Every page of the site is a room in this building.
 *
 *   ┌──────────┬─────────────────────┬──────────┐
 *   │ Reading  │ Museum of           │ Cabinet  │   row 1
 *   │ Room     │ Unfinished Questions│          │
 *   ├──────────┼──────────┬──────────┼──────────┤
 *   │ Record   │ Lobby    │ Office   │ Assembly │   row 2
 *   │ Room     │          │          │ Hall     │
 *   └──────────┴────┬─────┴──────────┴──────────┘
 *                entrance
 *
 * `plan` positions each room on a 4×2 grid (1-based). `doors` connect rooms
 * that share a wall. Directions for transitions are derived from the plan.
 */

export type RoomId = "lobby" | "museum" | "cabinet" | "assembly" | "reading" | "office" | "record";

export type Room = {
  id: RoomId;
  /** Room number on the plan and door signs. */
  index: string;
  name: string;
  /** Short label for the floor plan. */
  short: string;
  href: string;
  /** One line on what's kept in this room. */
  purpose: string;
  plan: { col: number; row: number; w: number; h: number };
};

export const rooms: Room[] = [
  {
    id: "lobby",
    index: "00",
    name: "The Lobby",
    short: "Lobby",
    href: "/",
    purpose: "Introductions and the building directory",
    plan: { col: 2, row: 2, w: 1, h: 1 },
  },
  {
    id: "museum",
    index: "01",
    name: "Museum of Unfinished Questions",
    short: "Museum",
    href: "/museum",
    purpose: "Projects, filed as the questions they started from",
    plan: { col: 2, row: 1, w: 2, h: 1 },
  },
  {
    id: "cabinet",
    index: "02",
    name: "Cabinet of Curiosity",
    short: "Cabinet",
    href: "/curiosity",
    purpose: "Questions, hypotheses and observations",
    plan: { col: 4, row: 1, w: 1, h: 1 },
  },
  {
    id: "assembly",
    index: "03",
    name: "Assembly Hall",
    short: "Assembly",
    href: "/human-element",
    purpose: "Model UN, negotiation and leading people",
    plan: { col: 4, row: 2, w: 1, h: 1 },
  },
  {
    id: "reading",
    index: "04",
    name: "Reading Room",
    short: "Reading",
    href: "/field-journal",
    purpose: "Essays I write, and notes on what I read",
    plan: { col: 1, row: 1, w: 1, h: 1 },
  },
  {
    id: "office",
    index: "05",
    name: "Investigator's Office",
    short: "Office",
    href: "/about",
    purpose: "Who keeps this archive, and how to get in touch",
    plan: { col: 3, row: 2, w: 1, h: 1 },
  },
  {
    id: "record",
    index: "06",
    name: "Record Room",
    short: "Records",
    href: "/resume",
    purpose: "The résumé, framed and hung",
    plan: { col: 1, row: 2, w: 1, h: 1 },
  },
];

/** Pairs of rooms joined by a doorway. */
export const doors: [RoomId, RoomId][] = [
  ["lobby", "museum"],
  ["lobby", "record"],
  ["lobby", "office"],
  ["museum", "reading"],
  ["museum", "cabinet"],
  ["museum", "office"],
  ["record", "reading"],
  ["office", "assembly"],
  ["cabinet", "assembly"],
];

export const PLAN_COLS = 4;
export const PLAN_ROWS = 2;
