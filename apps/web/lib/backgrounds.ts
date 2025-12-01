export type BackgroundId =
  | "socrates"
  | "creation_hands"
  | "roman_ritual"
  | "acropolis";

export const BACKGROUND_SOURCES: Record<BackgroundId, string> = {
  socrates: "/artwork/classical/SanctumSapientiae.png",
  creation_hands: "/artwork/classical/creation_hands.png",
  roman_ritual: "/artwork/classical/roman_ritual.png",
  acropolis: "/artwork/classical/acropolis_dither.png",
};

export const BACKGROUNDS = (Object.entries(BACKGROUND_SOURCES) as Array<
  [BackgroundId, string]
>).map(([key, src]) => ({ key, src }));

export const PAGE_BACKGROUNDS = {
  oikos: "acropolis",
  bibliotheca: "socrates",
  memoria: "creation_hands",
  archivvm: "roman_ritual",
  scholarivm: "acropolis",
  arsRationis: "socrates",
} as const satisfies Record<string, BackgroundId>;

export type PageBackgroundKey = keyof typeof PAGE_BACKGROUNDS;

export function getBackgroundForPage(page: PageBackgroundKey): string {
  const key = PAGE_BACKGROUNDS[page];
  return BACKGROUND_SOURCES[key];
}
