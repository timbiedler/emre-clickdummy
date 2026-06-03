import { COUNTRIES } from "./constants";
import type { Country, LocalizedText } from "./types";

export function pick<T>(arr: readonly T[] | T[], index: number): T {
  return arr[index % arr.length];
}

export function localize(en: string): LocalizedText {
  return {
    en,
    de: en.replace(/robot/gi, "Roboter").replace(/medical/gi, "Medizin"),
    fr: `[FR] ${en}`,
    es: `[ES] ${en}`,
    it: `[IT] ${en}`,
    pl: `[PL] ${en}`,
    nl: `[NL] ${en}`,
    zh: `[中文] ${en}`,
  };
}

export function randomCountries(index: number, count = 4): Country[] {
  const start = index % COUNTRIES.length;
  return Array.from({ length: count }, (_, i) => pick(COUNTRIES, start + i));
}
