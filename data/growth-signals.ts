import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { GrowthSignal, GrowthVertical, SignalType } from "./growth-types";

const signalTypes: SignalType[] = [
  "new_facility",
  "expansion",
  "tender",
  "procurement",
  "hiring",
  "website_tech",
  "service_need",
  "cleaning_demand",
  "security_demand",
  "medical_demand",
  "financing",
  "competitor",
  "category_trend",
];

const titles: Record<SignalType, string> = {
  new_facility: "New facility opening announced",
  expansion: "Regional expansion footprint",
  tender: "Public tender published",
  procurement: "Procurement framework renewal",
  hiring: "Facility / ops hiring spike",
  website_tech: "Website technology refresh detected",
  service_need: "Service contract renewal window",
  cleaning_demand: "Cleaning automation RFP signal",
  security_demand: "Security robotics pilot interest",
  medical_demand: "Medical equipment modernization",
  financing: "Leasing / financing search activity",
  competitor: "Competitor displacement opportunity",
  category_trend: "Category demand uptick in territory",
};

const aiRecs = [
  "Prioritize partner-led discovery call within 5 business days.",
  "Attach leasing-first bundle and localized landingpage draft.",
  "Route to territory sales partner with showroom option.",
  "Launch compliant email sequence — legitimate interest basis documented.",
  "Create RFQ draft from signal context for faster supplier matching.",
];

export const growthSignals: GrowthSignal[] = Array.from({ length: 40 }, (_, i) => {
  const type = pick(signalTypes, i);
  const vertical: GrowthVertical = i % 2 === 0 ? "medical" : "robotics";
  const date = new Date(2026, 4, 28 - (i % 20));
  return {
    id: `sig-${String(i + 1).padStart(3, "0")}`,
    title: titles[type],
    type,
    company: `Account ${1200 + i} Group`,
    country: pick(COUNTRIES, i),
    vertical,
    confidence: 68 + (i % 28),
    detectedAt: date.toISOString().slice(0, 10),
    products:
      vertical === "medical"
        ? ["Imaging suite", "Patient transport", "Sterilization line"]
        : ["AMR fleet", "Cleaning robot", "Patrol unit"],
    outreachAngle: "Compliant B2B outreach — value-led equipment modernization with service coverage proof.",
    suggestedOffer: vertical === "medical" ? "Care bundle + 36mo leasing" : "FM robotics bundle + warranty",
    partner: pick(["MedEquip Partners DACH", "RoboServe Benelux", "Nordic Distribution Partners"], i),
    aiRecommendation: pick(aiRecs, i + 1),
  };
});
