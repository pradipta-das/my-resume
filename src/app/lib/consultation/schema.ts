import { z } from "zod";

/*
 * Shapes shared by the consultation form, the /api/consultation route and the
 * WordPress record. The client only imports types from here.
 */

export const AUDIENCES = ["Individual", "Agency"] as const;
export type Audience = (typeof AUDIENCES)[number];

// Form fields kept with a request, with the question each one answers.
// Anything not listed here is dropped before it reaches WordPress.
export const ANSWER_LABELS = {
  topics: "What they'd like to talk about",
  stage: "Where the project is",
  website_url: "Current website",
  agency_name: "Agency name",
  agency_website: "Agency website",
  agency_size: "Agency team size",
  agency_help: "How they'd like help",
  agency_frequency: "How often they need help",
  message: "In their own words",
  call_format: "Preferred call format",
  days: "Preferred days",
  times: "Preferred time of day",
  timezone: "Time zone",
} as const;

export type AnswerKey = keyof typeof ANSWER_LABELS;

const answerValue = z.union([z.string().max(2000), z.array(z.string().max(200)).max(20)]);

const isAnswerKey = (key: string): key is AnswerKey => key in ANSWER_LABELS;

export const ConsultationRequestSchema = z.object({
  audience: z.enum(AUDIENCES),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional(),
  marketingConsent: z.boolean(),
  // Unknown fields are dropped rather than rejected, so a question added to
  // the form later doesn't break submissions before the server knows it.
  answers: z
    .record(z.string().max(60), answerValue)
    .refine((all) => Object.keys(all).length <= 40)
    .transform(
      (all) =>
        Object.fromEntries(Object.entries(all).filter(([key]) => isAnswerKey(key))) as Partial<
          Record<AnswerKey, string | string[]>
        >,
    ),
  // Hidden from people (and from autofill), so anything in it came from a bot.
  honeypot: z.string().max(500).optional(),
});

export type ConsultationRequest = z.output<typeof ConsultationRequestSchema>;
export type ConsultationAnswers = ConsultationRequest["answers"];

// Answers keyed by their question, skipping empty ones, for the WordPress record.
export function labelAnswers(answers: ConsultationAnswers): Record<string, string | string[]> {
  return Object.fromEntries(
    Object.entries(answers)
      .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value.trim() !== ""))
      .map(([key, value]) => [ANSWER_LABELS[key as AnswerKey], value]),
  );
}
