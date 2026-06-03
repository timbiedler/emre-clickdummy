import type { Language } from "@/data/types";

export interface TranslationExample {
  id: string;
  type: "supplier_message" | "rfq" | "offer";
  sourceLang: Language;
  targetLang: Language;
  sourceText: string;
  translatedText: string;
  status: "verified" | "auto";
}

export const translationExamples: TranslationExample[] = [
  {
    id: "ex-1",
    type: "supplier_message",
    sourceLang: "zh",
    targetLang: "de",
    sourceText: "我们可以为德国护理集团提供500,000双丁腈手套，交货期10天，含MDR文件。",
    translatedText:
      "Wir können 500.000 Nitrilhandschuhe für eine Pflegegruppe in Deutschland liefern, Lieferzeit 10 Tage, inkl. MDR-Dokumentation.",
    status: "verified",
  },
  {
    id: "ex-2",
    type: "supplier_message",
    sourceLang: "de",
    targetLang: "en",
    sourceText:
      "Wir bestätigen die Verfügbarkeit von 120 Reinigungsrobotern für ein Hotelnetzwerk in DACH mit Service-SLA.",
    translatedText:
      "We confirm availability of 120 cleaning robots for a hotel network in DACH with service SLA.",
    status: "verified",
  },
  {
    id: "ex-3",
    type: "rfq",
    sourceLang: "de",
    targetLang: "en",
    sourceText:
      "Anfrage: Vergleich von Patientenmonitoring-Geräten mit Finanzierung und Installation für 3 Standorte in Bayern.",
    translatedText:
      "RFQ: Compare patient monitoring devices with financing and installation for 3 sites in Bavaria.",
    status: "verified",
  },
  {
    id: "ex-4",
    type: "offer",
    sourceLang: "en",
    targetLang: "de",
    sourceText:
      "Offer ORD-2847: 24 autonomous cleaning units, €348,000 purchase or €4,820/month leasing (48 months), includes spare parts pool.",
    translatedText:
      "Angebot ORD-2847: 24 autonome Reinigungseinheiten, 348.000 € Kauf oder 4.820 €/Monat Leasing (48 Monate), inkl. Ersatzteilpuffer.",
    status: "auto",
  },
];
