import { WORDPRESS_API_URL } from "../wordpress";
import { labelAnswers, type ConsultationRequest } from "./schema";

/*
 * Saves a consultation request to WordPress through the
 * pradipta/v1/consultations endpoint added by wordpress/pradipta-consultations.
 * Authenticated with the same API key the site reads WordPress with
 * (WORDPRESS_API_SECRET, matching PRADIPTA_API_SECRET in wp-config.php), which
 * also lets the request through the REST lock.
 */
export async function saveConsultation(
  entry: Omit<ConsultationRequest, "honeypot">,
): Promise<number> {
  const secret = process.env.WORDPRESS_API_SECRET;
  if (!secret) throw new Error("WORDPRESS_API_SECRET is not set");

  const response = await fetch(`${WORDPRESS_API_URL}/pradipta/v1/consultations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Pradipta-Api-Key": secret },
    body: JSON.stringify({
      audience: entry.audience,
      name: entry.name,
      email: entry.email,
      phone: entry.phone ?? "",
      marketing_consent: entry.marketingConsent,
      answers: labelAnswers(entry.answers),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`WordPress rejected the consultation request: ${response.status} ${await response.text()}`);
  }

  const { id } = (await response.json()) as { id: number };
  return id;
}
