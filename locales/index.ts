import type { Language } from "@/data/types";
import en from "./en";
import de from "./de";

type NestedStringMap = { readonly [key: string]: string | NestedStringMap };

export type UiStrings = NestedStringMap;

const locales: Partial<Record<Language, UiStrings>> = {
  en: en as UiStrings,
  de: de as UiStrings,
};

export function getUiLocale(language: Language): UiStrings {
  return locales[language] ?? locales.en ?? (en as UiStrings);
}

export function uiTranslate(language: Language, key: string): string {
  const resolve = (lang: Language): string | undefined => {
    const locale = getUiLocale(lang);
    const parts = key.split(".");
    let current: unknown = locale;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return typeof current === "string" ? current : undefined;
  };

  const value = resolve(language);
  if (value) return value;
  if (language !== "en") {
    const fallback = resolve("en");
    if (fallback) return fallback;
  }
  return key;
}

export { en, de };
