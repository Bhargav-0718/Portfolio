/**
 * Motion tokens. Mirrors the --duration-* and --ease-* variables in
 * src/styles/tokens.css so JS-driven animation (Framer Motion, later) and
 * CSS transitions share one rhythm.
 *
 * Principle: motion explains spatial change (a drawer arriving, a filter
 * re-sorting). It never decorates, and it always yields to reduced-motion.
 */

export const duration = {
  instant: 0.12,
  quick: 0.2,
  base: 0.36,
  slow: 0.64,
  reveal: 0.9,
} as const;

/** "Archive" ease: a fast start that settles slowly, like a drawer sliding shut. */
export const ease = {
  archive: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
} as const;
