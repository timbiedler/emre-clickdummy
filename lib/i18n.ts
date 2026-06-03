import type { Language, LocalizedText } from "@/data/types";
import { uiTranslate } from "@/locales";
import { LANGUAGES } from "@/data/constants";

const FALLBACK_CHAIN: Language[] = ["en", "de"];

export function t(text: LocalizedText | string, lang: Language): string {
  if (typeof text === "string") return text;
  if (text[lang]) return text[lang]!;
  for (const fb of FALLBACK_CHAIN) {
    if (text[fb]) return text[fb];
  }
  return text.en;
}

export function label(key: string, lang: Language): string {
  return uiTranslate(lang, key);
}

export function getLanguageLabel(code: Language): string {
  return LANGUAGES.find((l) => l.code === code)?.nativeLabel ?? code;
}
