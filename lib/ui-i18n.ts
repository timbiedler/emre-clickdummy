"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import { uiTranslate } from "@/locales";
import type { Country } from "@/data/types";

export function useUi() {
  const { language } = useApp();

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  const t = (key: string) => uiTranslate(language, key);

  const countryName = (country: Country) =>
    uiTranslate(language, `countries.${country}`) !== `countries.${country}`
      ? uiTranslate(language, `countries.${country}`)
      : country;

  return { t, language, countryName };
}
