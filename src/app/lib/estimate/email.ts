import { siteConfig } from "../seo";
import { sendMail } from "../mail";
import { formatRange } from "./format";
import { ESTIMATE_PDF_FILENAME, type Estimate } from "./schema";

// AI-written text for the email: no links, and not too long. The estimate is
// written from the visitor's answers and anyone can type any address into
// the form, so the email mustn't carry links a stranger could plant.
function safeText(text: string, limit = 600): string {
  const clean = text
    .replace(/(?:https?:\/\/|www\.)\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1).trimEnd()}…` : clean;
}

export function estimateEmail(estimate: Estimate, withPdf: boolean): { subject: string; text: string } {
  const range = (value: { low: number; high: number }) => formatRange(value, estimate.currency);
  const total = range(estimate);

  const lines = [
    "Hi there,",
    "",
    withPdf
      ? "Thanks for trying the cost estimator. Your estimate is attached as a PDF, with a summary below."
      : "Thanks for trying the cost estimator. Here's a copy of your estimate to keep.",
    "",
    "YOUR ESTIMATE",
    total,
    `Timeline: ${estimate.timeline.minWeeks}–${estimate.timeline.maxWeeks} weeks`,
  ];

  if (estimate.summary) lines.push("", safeText(estimate.summary));

  if (estimate.phaseOne) {
    lines.push("", "START SMALLER", range(estimate.phaseOne));
    if (estimate.phaseOne.scope) lines.push(safeText(estimate.phaseOne.scope, 300));
  }

  if (estimate.freelance) {
    lines.push(
      "",
      "TYPICAL FREELANCE PRICE",
      range(estimate.freelance),
      "The same hours at typical rates for experienced freelancers in your market.",
    );
  }

  if (estimate.breakdown.length) {
    lines.push("", "BREAKDOWN");
    for (const row of estimate.breakdown.slice(0, 12)) lines.push(`- ${safeText(row.item, 80)}: ${range(row)}`);
  }

  for (const [items, label] of [
    [estimate.costDrivers, "WHAT DRIVES THE COST"],
    [estimate.assumptions, "ASSUMPTIONS"],
  ] as const) {
    if (!items.length) continue;
    lines.push("", label);
    for (const item of items.slice(0, 8)) lines.push(`- ${safeText(item, 200)}`);
  }

  lines.push(
    "",
    "This is a ballpark for planning, not a quote. Every project has details a questionnaire can't capture, and the real number depends on them.",
    "",
    "If you'd like to talk it through, just reply to this email, or book a free consultation call:",
    `${siteConfig.url}/free-consultation`,
    "",
    "Pradipta Das",
    siteConfig.url,
  );

  return { subject: `Your website estimate: ${total}`, text: lines.join("\n") };
}

/** Emails the visitor a copy of their estimate, with the PDF attached when there is one. */
export async function sendEstimateEmail(to: string, estimate: Estimate, pdf?: Buffer): Promise<void> {
  const { subject, text } = estimateEmail(estimate, Boolean(pdf));
  await sendMail({
    to,
    subject,
    text,
    attachments: pdf ? [{ filename: ESTIMATE_PDF_FILENAME, content: pdf, contentType: "application/pdf" }] : undefined,
  });
}
