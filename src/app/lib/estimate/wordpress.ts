import { WORDPRESS_API_URL } from "../wordpress";
import { labelAnswers, type Estimate, type EstimateAnswers } from "./schema";

/*
 * Saves an estimate to WordPress through the pradipta/v1/estimates endpoint
 * added by wordpress/pradipta-estimates. The endpoint only accepts requests
 * carrying the shared secret, which must match PRADIPTA_ESTIMATE_SECRET in
 * the site's wp-config.php.
 */
export async function saveEstimate(entry: {
  email: string;
  marketingConsent: boolean;
  answers: EstimateAnswers;
  estimate: Estimate;
  // The estimate as a PDF (base64), attached to the visitor's email.
  pdf?: string;
}): Promise<number> {
  const secret = process.env.WORDPRESS_ESTIMATE_SECRET;
  if (!secret) throw new Error("WORDPRESS_ESTIMATE_SECRET is not set");

  const response = await fetch(`${WORDPRESS_API_URL}/pradipta/v1/estimates`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Estimate-Secret": secret },
    body: JSON.stringify({
      email: entry.email,
      marketing_consent: entry.marketingConsent,
      answers: labelAnswers(entry.answers),
      estimate: entry.estimate,
      pdf: entry.pdf,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`WordPress rejected the estimate: ${response.status} ${await response.text()}`);
  }

  const { id } = (await response.json()) as { id: number };
  return id;
}
