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
  const locale = getUiLocale(language);
  const parts = key.split(".");
  let current: unknown = locale;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      current = undefined;
      break;
    }
  }
  if (typeof current === "string") return current;
  const fallback = uiTranslate("en", key);
  if (fallback !== key) return fallback;
  return key;
}

export { en, de };
