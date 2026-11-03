/*
 * Checks a Cloudflare Turnstile token (from components/Turnstile) with
 * Cloudflare before a form is allowed to call the AI or send email.
 *
 * Needs TURNSTILE_SECRET_KEY in production; without it every check fails, so
 * the forms stay closed rather than open to bots. TURNSTILE_HOSTNAMES (comma
 * separated) lists the sites a token may come from, pradipta.online and
 * www.pradipta.online by default; never localhost in production.
 *
 * Outside production, Cloudflare's always-pass test secret pairs with the
 * widget's test key.
 */

const TEST_SECRET = "1x0000000000000000000000000000000AA";
const isProduction = process.env.NODE_ENV === "production";

// "unavailable": the check couldn't run (Cloudflare unreachable, or not set
// up), so the visitor should try again later rather than be told they failed.
export type TurnstileResult = "ok" | "failed" | "unavailable";

type Siteverify = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string | undefined,
  action: string,
  ip?: string,
): Promise<TurnstileResult> {
  if (!token || token.length > 2048) return "failed";

  const secret = isProduction ? process.env.TURNSTILE_SECRET_KEY : TEST_SECRET;
  const hostnames = (process.env.TURNSTILE_HOSTNAMES ?? "pradipta.online,www.pradipta.online")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  if (!secret || hostnames.length === 0) {
    console.error("Turnstile isn't set up: TURNSTILE_SECRET_KEY or TURNSTILE_HOSTNAMES is empty");
    return "unavailable";
  }

  let outcome: Siteverify;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, ...(ip && { remoteip: ip }) }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Siteverify returned ${response.status}`);
    outcome = (await response.json()) as Siteverify;
  } catch (error) {
    console.error("Checking the Turnstile token failed:", error);
    return "unavailable";
  }

  // Includes reused tokens (timeout-or-duplicate).
  if (!outcome.success) {
    console.warn("Turnstile rejected a submission:", outcome["error-codes"]);
    return "failed";
  }

  // The test keys don't report a real action or hostname.
  if (isProduction && (outcome.action !== action || !hostnames.includes(outcome.hostname ?? ""))) {
    console.warn("Turnstile token was for another form or site:", { action: outcome.action, hostname: outcome.hostname });
    return "failed";
  }

  return "ok";
}
