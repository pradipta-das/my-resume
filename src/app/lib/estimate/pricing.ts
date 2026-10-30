/*
 * The pricing the cost estimator works from. Claude estimates the effort in
 * hours; these figures turn hours into money, so every estimate is priced at
 * my own rates, consistently, rather than at what the AI thinks the market
 * charges. Edit this file to change what estimates come out at.
 */

export type Currency = "INR" | "USD" | "GBP" | "CAD" | "AUD";

// My hourly rate in each client's currency.
export const HOURLY_RATE: Record<Currency, number> = {
  INR: 300,
  USD: 8,
  GBP: 8,
  CAD: 12,
  AUD: 15,
};

// What experienced freelance web developers in the client's market charge an
// hour (low, high), taken from the lower end so the comparison stays modest,
// for the "typical freelance price". Applied to the same hours. (Agency rates
// made the gap so wide it read as too good to be true.)
export const FREELANCE_RATE: Record<Currency, [number, number]> = {
  INR: [600, 1_200],
  USD: [30, 50],
  GBP: [25, 45],
  CAD: [40, 65],
  AUD: [45, 70],
};

// Added to the price when the client needs it urgently (see isRush).
export const RUSH_PREMIUM = 0.2;

const CURRENCY_BY_COUNTRY: Record<string, Currency> = {
  India: "INR",
  "United States": "USD",
  "United Kingdom": "GBP",
  Canada: "CAD",
  Australia: "AUD",
};

// The client's currency, from the business country they chose; USD otherwise.
export const currencyFor = (country: string | string[] | undefined): Currency =>
  (typeof country === "string" && CURRENCY_BY_COUNTRY[country]) || "USD";

// The budget brackets the estimator offers, in the client's currency. Sized
// around what projects come out at with the rates above.
export const BUDGET_OPTIONS: Record<Currency, string[]> = {
  INR: ["Under ₹15K", "₹15K–₹30K", "₹30K–₹60K", "₹60K–₹1L", "₹1L+"],
  USD: ["Under $300", "$300–$600", "$600–$1,200", "$1,200–$2,500", "$2,500+"],
  GBP: ["Under £300", "£300–£600", "£600–£1,200", "£1,200–£2,500", "£2,500+"],
  CAD: ["Under CA$450", "CA$450–CA$900", "CA$900–CA$1,800", "CA$1,800–CA$3,500", "CA$3,500+"],
  AUD: ["Under A$500", "A$500–A$1,000", "A$1,000–A$2,000", "A$2,000–A$4,000", "A$4,000+"],
};

// Rounds to figures a person would quote, in steps that grow with the amount
// so small projects aren't rounded out of shape: rupees to the nearest 500
// (1,000 from ₹25K, 5,000 from a lakh), other currencies to the nearest 25 (50
// from 1,000, 100 from 2,000). Line items ("fine") round more finely, so small
// parts don't all look alike.
export function roundPrice(amount: number, currency: Currency, fine = false): number {
  let step: number;
  if (currency === "INR") step = fine ? 100 : amount < 25_000 ? 500 : amount < 100_000 ? 1_000 : 5_000;
  else step = fine ? 5 : amount < 1_000 ? 25 : amount < 2_000 ? 50 : 100;

  return Math.max(step, Math.round(amount / step) * step);
}

/*
 * How long typical projects take me, sent to Claude so its hours match how I
 * actually work: one experienced developer using modern tooling, AI
 * assistance, proven starters, and existing themes, plugins and apps where
 * they fit. Whole-project totals, design through launch.
 */
export const EFFORT_GUIDE = `
- Portfolio or personal website, 1–5 pages: 15–35 hours
- Business website, 6–15 pages, WordPress or Webflow, starting from a template: 30–60 hours
- Business website, 6–15 pages, with a custom design: 50–90 hours
- Content or blog site: 30–70 hours
- E-commerce store on Shopify or WooCommerce with standard features: 50–110 hours
- Membership or community site on WordPress: 70–140 hours
- SaaS or web application MVP in Next.js: 150–350 hours
- Marketplace MVP: 220–450 hours

Typical additions:
- Each third-party integration: 4–15 hours
- Multi-language support: 10–25 hours
- Premium or extraordinary design: add 25–40% to design and front-end work
- Rich scroll animation: 10–25 hours; WebGL or 3D: 30–60 hours
- AI features: 15–40 hours
- Moving content from another platform: 8–30 hours, depending on volume
`.trim();
