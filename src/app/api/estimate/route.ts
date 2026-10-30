import Anthropic from "@anthropic-ai/sdk";
import { estimateProject } from "../../lib/estimate/ai";
import { EstimateRequestSchema, type Estimate } from "../../lib/estimate/schema";
import { renderEstimatePdf } from "../../lib/estimate/pdf";
import { saveEstimate } from "../../lib/estimate/wordpress";
import { sendEstimateEmail } from "../../lib/estimate/email";

// An estimate takes Claude a while to think through; give it room.
export const maxDuration = 60;

/*
 * POST /api/estimate
 * Body: EstimateRequest (email, marketing consent, questionnaire answers).
 * Returns { estimate, pdf } on success (pdf: the estimate as a base64 PDF,
 * left out if it couldn't be made), { error } with a visitor-facing message
 * otherwise.
 */

// Each estimate costs an AI call, so cap how often one address can ask.
// In memory, so it's per server instance: a speed bump, not a guarantee.
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
    return fail("Something went wrong sending your answers. Please try again.", 400);
  }

  const parsed = EstimateRequestSchema.safeParse(body);
  if (!parsed.success) {
    const emailInvalid = parsed.error.issues.some((issue) => issue.path[0] === "email");
    return fail(emailInvalid ? "Please enter a valid email address." : "Some answers look invalid. Please check the form.", 400);
  }

  const { email, marketingConsent, answers, honeypot } = parsed.data;
  if (honeypot) return fail("Something went wrong. Please try again.", 400);

  // Counted only once a request is valid, since only those reach the AI.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return fail("You've requested several estimates in a short time. Please try again in an hour.", 429);
  }

  let estimate: Estimate;
  try {
    estimate = await estimateProject(answers);
  } catch (error) {
    console.error("Estimate failed:", error);

    if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError) {
      return fail("The estimator is busy right now. Please try again in a minute.", 503);
    }
    // Declined or unusable output (EstimateUnavailableError), other API
    // errors, and setup problems such as a missing API key all end here; the
    // log above has the detail.
    return fail("We couldn't calculate an estimate this time. Please try again.", 502);
  }

  // The PDF is a copy, not the estimate itself: without it the visitor still
  // gets the estimate on screen and by email.
  let pdf: Buffer | undefined;
  try {
    pdf = await renderEstimatePdf(estimate, answers);
  } catch (error) {
    console.error("Making the estimate PDF failed:", error);
  }

  // Best effort too: the estimate is on screen, with the PDF to download.
  let emailed = false;
  try {
    await sendEstimateEmail(email, estimate, pdf);
    emailed = true;
  } catch (error) {
    console.error("Emailing the estimate failed:", error);
  }

  // The visitor still gets their estimate if saving fails; the log keeps the
  // lead so it can be recovered.
  try {
    await saveEstimate({ email, marketingConsent, answers, estimate, emailed, pdfAttached: emailed && Boolean(pdf) });
  } catch (error) {
    console.error("Saving the estimate to WordPress failed:", error, { email, marketingConsent, answers, estimate });
  }

  return Response.json({ estimate, pdf: pdf?.toString("base64") });
}
