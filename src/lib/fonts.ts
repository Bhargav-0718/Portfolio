import { IBM_Plex_Mono, Inter_Tight, Newsreader } from "next/font/google";

/**
 * Three typographic roles:
 *  - Newsreader   → serif. Headlines, questions, narrative statements.
 *  - Inter Tight  → sans. Body copy, navigation, interface.
 *  - IBM Plex Mono → mono. Case IDs, timestamps, exhibit labels, metadata.
 */

export const fontSerif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

export const fontSans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = [fontSerif.variable, fontSans.variable, fontMono.variable].join(" ");
