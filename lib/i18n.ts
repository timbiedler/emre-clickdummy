import type { Language, LocalizedText } from "@/data/types";

export const uiLabels: Record<string, LocalizedText> = {
  search: {
    en: "Search products, RFQs, suppliers…",
    de: "Produkte, Anfragen, Lieferanten suchen…",
    fr: "Rechercher produits, RFQ, fournisseurs…",
    es: "Buscar productos, RFQ, proveedores…",
    it: "Cerca prodotti, RFQ, fornitori…",
    pl: "Szukaj produktów, RFQ, dostawców…",
    nl: "Zoek producten, RFQ's, leveranciers…",
    zh: "搜索产品、询价、供应商…",
  },
  commandCenter: {
    en: "Command Center",
    de: "Kommandozentrale",
    fr: "Centre de commande",
    es: "Centro de mando",
    it: "Centro di comando",
    pl: "Centrum dowodzenia",
    nl: "Commandocentrum",
    zh: "指挥中心",
  },
  marketplace: {
    en: "Marketplace",
    de: "Marktplatz",
    fr: "Marketplace",
    es: "Marketplace",
    it: "Marketplace",
    pl: "Rynek",
    nl: "Marktplaats",
    zh: "市场",
  },
  activeRfqs: {
    en: "Active RFQs",
    de: "Aktive Anfragen",
    fr: "RFQ actifs",
    es: "RFQ activos",
    it: "RFQ attivi",
    pl: "Aktywne RFQ",
    nl: "Actieve RFQ's",
    zh: "活跃询价",
  },
  requestRfq: {
    en: "Request RFQ",
    de: "Anfrage stellen",
    fr: "Demander un RFQ",
    es: "Solicitar RFQ",
    it: "Richiedi RFQ",
    pl: "Złóż RFQ",
    nl: "RFQ aanvragen",
    zh: "发起询价",
  },
  viewSupplier: {
    en: "View Supplier",
    de: "Lieferant anzeigen",
    fr: "Voir le fournisseur",
    es: "Ver proveedor",
    it: "Vedi fornitore",
    pl: "Zobacz dostawcę",
    nl: "Leverancier bekijken",
    zh: "查看供应商",
  },
  financing: {
    en: "Financing",
    de: "Finanzierung",
    fr: "Financement",
    es: "Financiación",
    it: "Finanziamento",
    pl: "Finansowanie",
    nl: "Financiering",
    zh: "融资",
  },
  compare: {
    en: "Compare",
    de: "Vergleichen",
    fr: "Comparer",
    es: "Comparar",
    it: "Confronta",
    pl: "Porównaj",
    nl: "Vergelijken",
    zh: "比较",
  },
  consultation: {
    en: "Request Consultation",
    de: "Beratung anfordern",
    fr: "Demander une consultation",
    es: "Solicitar consulta",
    it: "Richiedi consulenza",
    pl: "Poproś o konsultację",
    nl: "Consultatie aanvragen",
    zh: "请求咨询",
  },
};

export function t(text: LocalizedText | string, lang: Language): string {
  if (typeof text === "string") return text;
  return text[lang] || text.en;
}

export function label(key: string, lang: Language): string {
  return uiLabels[key]?.[lang] || uiLabels[key]?.en || key;
}
