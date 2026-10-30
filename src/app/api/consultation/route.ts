import { ConsultationRequestSchema } from "../../lib/consultation/schema";
import { saveConsultation } from "../../lib/consultation/wordpress";
import { sendConsultationAcknowledgement, sendConsultationNotification } from "../../lib/consultation/email";

/*
 * POST /api/consultation
 * Body: ConsultationRequest (who they are, contact details, answers).
 * Returns { ok: true } once the request is saved in WordPress, { error } with
 * a visitor-facing message otherwise.
 */

// A speed bump against floods of requests from one address. In memory, so
// it's per server instance, not a guarantee.
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const recent = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (hits.length >= LIMIT) return true;

  hits.push(now);
  recent.set(ip, hits);
  return false;
}

const fail = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Something went wrong sending your details. Please try again.", 400);
  }

  const parsed = ConsultationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    if (field === "email") return fail("Please enter a valid email address.", 400);
    if (field === "name") return fail("Please tell me your name.", 400);
    return fail("Some answers look invalid. Please check the form.", 400);
  }

  const { honeypot, ...entry } = parsed.data;
  if (honeypot) return fail("Something went wrong. Please try again.", 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return fail("You've sent several requests in a short time. Please try again in an hour.", 429);
  }

  // Unlike the estimator, saving is the whole point here: if WordPress can't
  // take the request, the visitor needs to know so they can try again.
  let id: number;
  try {
    id = await saveConsultation(entry);
  } catch (error) {
    console.error("Saving the consultation request to WordPress failed:", error, entry);
    return fail("Your request didn't go through this time. Please try again in a moment.", 502);
  }

  // Best effort: the request is saved, so a mail failure doesn't fail it.
  const sent = await Promise.allSettled([
    sendConsultationNotification(entry, id),
    sendConsultationAcknowledgement(entry),
  ]);
  for (const result of sent) {
    if (result.status === "rejected") console.error("Sending a consultation email failed:", result.reason, { id });
  }

  return Response.json({ ok: true });
}
