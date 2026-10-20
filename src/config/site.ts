/**
 * Single source of truth for identity, links and navigation.
 *
 * Rules:
 *  - `null` means "not supplied yet". UI must render nothing (or a clearly
 *    labelled placeholder) for null values — never a dead link.
 *  - Do not add contact details or URLs that have not been confirmed.
 */

export const site = {
  name: "Bhargav Bidkar",
  shortName: "B. Bidkar",
  archiveName: "The Unfinished Archive",
  tagline: "Some things are built. Some things are questioned. Everything leaves a trail.",
  descriptor: "Aspiring product manager · Enterprise systems & AI · CSE (AI/ML) at IIIT Nagpur",
  location: "Mumbai, India",
  /** Canonical URL once deployed, e.g. "https://bhargavbidkar.com". Used for metadata. */
  url: null as string | null,

  contact: {
    email: "bhargav.07.bidkar@gmail.com",
    /** Present on the CV but deliberately not published on the site. */
    phone: null as string | null,
  },

  links: {
    linkedin: "https://www.linkedin.com/in/bhargav-bidkar",
    github: "https://github.com/Bhargav-0718",
    huggingface: null as string | null,
  },

  /** Bhargav's blog. Posts are fetched from its public feed (src/lib/blog.ts). */
  blog: {
    name: "Through My Mind's Eye",
    url: "https://through-my-minds-eye.blogspot.com/",
    /** How each essay is signed. */
    signature: "~ Bhargav, Cult of Personality",
  },

  /** Résumé versions live in content/resumes.ts. These are the stable public URLs. */
  resume: {
    /** Exhibit page for the primary version. */
    page: "/resume",
    /** Always redirects to the primary version's PDF. Safe to share. */
    pdf: "/resume.pdf",
  },

  hero: {
    eyebrow: "Bhargav Bidkar / Personal Archive",
    headline: "I investigate the space between how things work and how they could work.",
    /** The closing phrase of the headline, set in oxide italic. Must be the end of `headline`. */
    headlineEmphasis: "how they could work.",
    supporting:
      "An ongoing exploration of technology, products, business systems, and the people behind them.",
  },
} as const;

// Navigation is the building itself: see src/config/rooms.ts.
