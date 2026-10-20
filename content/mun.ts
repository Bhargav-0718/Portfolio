/**
 * Model UN, debate and club leadership, transcribed from Bhargav's
 * "Model United Nations Career Summary" (Google Doc, Oct 2026).
 *
 * Not published from that doc: the personal email and phone number.
 * Where the doc gives no year, `year` is left out rather than guessed.
 */

export const munSummary =
  "A seasoned MUN delegate with over 20 conferences spanning diverse committees and roles. Skilled in research, diplomacy, and public speaking, with a strong track record of awards and leadership in high-stakes debate environments. Experienced in both General Assembly and specialized crisis committees, with a focus on international relations, policy-making, and conflict resolution.";

/** "over 20 conferences", as stated in the summary. */
export const conferencesAttended = "20+";

export type Chairing = { conference: string; year?: string; committee: string; role: string };

export const chaired: Chairing[] = [
  {
    conference: "BIZ-CON",
    year: "2025",
    committee: "Apple Boardroom Simulation (Crisis)",
    role: "Chairperson",
  },
  {
    conference: "IIITN-MUN 3.0",
    year: "2025",
    committee: "Historical Crisis Committee",
    role: "Vice-Chairperson",
  },
  {
    conference: "RJMUN 1.0",
    year: "2025",
    committee: "Continuous Crisis Committee (Mahabharat)",
    role: "Chairperson",
  },
  { conference: "LeoClub MUN", year: "2025", committee: "UNGA DISEC", role: "Co-Chairperson" },
  { conference: "Astra MUN", year: "2025", committee: "Historical Crisis Committee", role: "Co-Chairperson" },
  {
    conference: "HAPMUN",
    year: "2025",
    committee: "Joint Crisis Committee: Indo-Pak 2025",
    role: "Crisis Director",
  },
  { conference: "SCHOLARSMUN 5.0", year: "2025", committee: "Mahabharat", role: "Chairperson" },
  { conference: "LITU-MUN", year: "2025", committee: "Mahabharat", role: "Co-Chairperson" },
  { conference: "RJMUN 2.0", year: "2025", committee: "Historical Crisis Committee", role: "Chairperson" },
  { conference: "DELMUN 7.0", year: "2025", committee: "Mahabharat", role: "Co-Chairperson" },
  {
    conference: "Orion One",
    year: "2025",
    committee: "Historical All India Political Party Meet",
    role: "Chairperson",
  },
];

export type Award = {
  award: string;
  conference: string;
  host?: string;
  year?: string;
  committee: string;
  /** The country or character represented. */
  representing: string;
};

/** Ordered from the highest honour down, as in the doc. */
export const awards: Award[] = [
  {
    award: "Best Delegate",
    conference: "NSAMUN",
    year: "2025",
    committee: "UN Committee on Space Governance",
    representing: "United States of America",
  },
  {
    award: "Best Delegate",
    conference: "IITI-MUN",
    host: "IIT Indore",
    year: "2025",
    committee: "UN Human Rights Council",
    representing: "Islamic Republic of Pakistan",
  },
  {
    award: "Best Delegate",
    conference: "LITMUN",
    year: "2024",
    committee: "Mahabharat",
    representing: "Vasudev Shri Krishna",
  },
  {
    award: "Best Delegate",
    conference: "YFCMUN",
    year: "2024",
    committee: "Mahabharat",
    representing: "Karna",
  },
  {
    award: "Best Overall Speaker",
    conference: "FLS Zero Hour",
    year: "2025",
    committee: "Lok Sabha Zero Hour",
    representing: "Ordinary Citizen of India",
  },
  {
    award: "High Commendation",
    conference: "AbMUN",
    host: "IIIT Nagpur",
    year: "2026",
    committee: "Mahabharat",
    representing: "Shri Krishna",
  },
  {
    award: "High Commendation",
    conference: "GMC Conference",
    host: "Govt. Engg. College CSN",
    year: "2026",
    committee: "UN Security Council",
    representing: "United States of America",
  },
  {
    award: "High Commendation",
    conference: "G-MUN",
    host: "IIT Kharagpur",
    committee: "UN Security Council",
    representing: "United States of America",
  },
  {
    award: "High Commendation",
    conference: "IITH-MUN",
    host: "IIT Hyderabad",
    year: "2024",
    committee: "UN Security Council",
    representing: "The French Republic",
  },
  {
    award: "High Commendation",
    conference: "GAIA MUN",
    year: "2024",
    committee: "UN Security Council",
    representing: "United States of America",
  },
  {
    award: "Special Mention",
    conference: "IIT-BBS MUN",
    host: "IIT Bhubaneswar",
    year: "2025",
    committee: "UNGA DISEC",
    representing: "State of Israel",
  },
  {
    award: "Honourable Mention",
    conference: "BITSMUN",
    host: "BITS Hyderabad",
    year: "2024",
    committee: "Continuous Crisis Committee",
    representing: "United Kingdom",
  },
  {
    award: "Honourable Mention",
    conference: "IR-MUN",
    host: "IIT Roorkee",
    committee: "Continuous Crisis Committee",
    representing: "United Kingdom",
  },
  {
    award: "Verbal Mention",
    conference: "IIITN-MUN 2.0",
    year: "2024",
    committee: "All India Political Party Meet",
    representing: "Raj Thackeray",
  },
];

export type Organised = { conference: string; year?: string; role: string; note?: string };

export const organised: Organised[] = [
  { conference: "IIITN-MUN 3.0", year: "2025", role: "Deputy Secretary-General", note: "200+ delegates" },
  { conference: "RJMUN 1.0", role: "Director General" },
];

export type Debate = { result: string; event: string; venue?: string; year?: string };

export const debate: Debate[] = [
  {
    result: "Winner",
    event: "Vaktavya Oxford Style Debate",
    venue: "Yashwantrao Chavan College of Engineering, Nagpur",
    year: "2026",
  },
  {
    result: "Quarter-finalist",
    event: "Conceicao Rodriguez Memorial Debate",
    venue: "Fr. Conceicao Rodrigues College, Bandra",
    year: "2024",
  },
  { result: "Participant", event: "17th Annual International IIT Bombay Debate Competition" },
];

/** Roles at Orator, IIIT Nagpur's public speaking & MUN club. Order/dates to be confirmed. */
export const oratorRoles = [
  "Co-Lead, Orator, Public Speaking & MUN Wing",
  "President, MUN Affairs",
  "Content and Anchoring Lead",
];

export const clubWork = [
  "Organised the Infacto 3.0 and Cypher Chronicles events.",
  "Directed content strategy and served as lead anchor for club events.",
  "Mentored junior delegates on research and public speaking.",
  "Organised and ran the IPL Auction, as auctioneer, at the IIITN E-Summit hosted by E-Cell IIITN.",
];

export const munSkills = [
  { name: "Debate & Diplomacy", detail: "High-level debate, resolution drafting, and consensus-building." },
  {
    name: "Research & Analysis",
    detail: "Global policy analysis and contextual research for MUN committees.",
  },
  { name: "Public Speaking & Persuasion", detail: "A persuasive, structured, and diplomatic approach." },
];
