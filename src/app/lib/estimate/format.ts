/*
 * Money formatting shared by the results screen and the PDF, so both show
 * amounts the same way, and by the estimate email (lib/estimate/email.ts).
 */

// Whole amounts in the estimate's currency; Indian digit grouping for rupees.
export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

export const formatRange = (range: { low: number; high: number }, currency: string) =>
  `${formatMoney(range.low, currency)} – ${formatMoney(range.high, currency)}`;
