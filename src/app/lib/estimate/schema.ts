import { z } from "zod";

/*
 * Shapes shared by the estimator form, the /api/estimate route, the AI call and
 * the WordPress record. The client only imports types from here.
 */

// Form fields the estimate is based on, with the question each one answers.
// Anything not listed here is dropped before it reaches the AI or WordPress.
export const ANSWER_LABELS = {
  project_type: "Project type",
  project_action: "What they're doing with the website",
  pages: "Approximate number of pages",
  layouts: "Distinct page layouts",
  features: "Core features",
  ecommerce: "E-commerce features",
  integrations: "Integrations",
  advanced: "Advanced functionality",
  not_sure_features: "Unsure which features they need",
  design_level: "Design level",
  motion: "Motion / animation",
  technology: "Preferred technology",
  has_website: "Has an existing website",
  website_url: "Existing website URL",
  hosting: "Has hosting",
  country: "Business country",
  region: "City / region",
  audience: "Primary audience",
  team_region: "Where they expect the development team to be",
  timeline: "Launch timeline",
  speed: "Importance of speed",
  budget: "Budget in mind",
} as const;

export type AnswerKey = keyof typeof ANSWER_LABELS;

const answerValue = z.union([z.string().max(500), z.array(z.string().max(200)).max(30)]);

const isAnswerKey = (key: string): key is AnswerKey => key in ANSWER_LABELS;

export const EstimateRequestSchema = z.object({
  email: z.email().max(254),
  marketingConsent: z.boolean(),
  // Unknown fields are dropped rather than rejected, so a question added to
  // the form later doesn't break submissions before the server knows it.
  answers: z
    .record(z.string().max(60), answerValue)
    .refine((all) => Object.keys(all).length <= 60)
    .transform(
      (all) =>
        Object.fromEntries(Object.entries(all).filter(([key]) => isAnswerKey(key))) as Partial<
          Record<AnswerKey, string | string[]>
        >,
    ),
  // Hidden from people (and from autofill), so anything in it came from a bot.
  honeypot: z.string().max(500).optional(),
});

export type EstimateRequest = z.output<typeof EstimateRequestSchema>;
export type EstimateAnswers = EstimateRequest["answers"];

// What Claude returns. Descriptions are sent with the schema, so they double as
// field-level instructions.
export const EstimateSchema = z.object({
  currency: z
    .string()
    .describe("ISO 4217 code of the currency the estimate is in, e.g. INR, USD, GBP, CAD, AUD"),
  low: z.number().describe("Low end of the total project cost, in that currency"),
  high: z.number().describe("High end of the total project cost, in that currency"),
  timeline: z
    .object({
      minWeeks: z.number().describe("Shortest realistic build time in weeks"),
      maxWeeks: z.number().describe("Longest realistic build time in weeks"),
    })
    .describe("Realistic build time"),
  breakdown: z
    .array(
      z.object({
        item: z.string().describe("Short name of a part of the work, e.g. Design, Development, Integrations"),
        low: z.number(),
        high: z.number(),
      }),
    )
    .describe("3 to 7 parts of the work whose ranges roughly add up to the total"),
  costDrivers: z.array(z.string()).describe("2 to 5 short phrases naming what pushes the cost up or down"),
  assumptions: z.array(z.string()).describe("2 to 5 short assumptions, especially for unanswered questions"),
  summary: z.string().describe("2 to 3 sentences addressed to the client as 'you'"),
});

export type Estimate = z.infer<typeof EstimateSchema>;

// Relabels the answers with their questions and drops empty ones, so the AI
// and the WordPress record read naturally.
export function labelAnswers(answers: EstimateAnswers): Record<string, string | string[]> {
  const labelled: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(answers) as [AnswerKey, string | string[]][]) {
    const empty = Array.isArray(value) ? value.length === 0 : value.trim() === "";
    if (!empty) labelled[ANSWER_LABELS[key]] = value;
  }

  return labelled;
}
