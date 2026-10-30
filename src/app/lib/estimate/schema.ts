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

// What Claude returns: effort in hours, never money (lib/estimate/pricing
// turns hours into prices). Descriptions are sent with the schema, so they
// double as field-level instructions.
const hours = (what: string) => z.number().describe(`${what}, in hours`);

export const EffortSchema = z.object({
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
        lowHours: hours("Low end of the effort for this part"),
        highHours: hours("High end of the effort for this part"),
      }),
    )
    .describe("3 to 7 parts of the work that together make up the whole project"),
  phaseOne: z
    .object({
      scope: z
        .string()
        .describe("One sentence, addressed to the client as 'you', describing the essential first version"),
      lowHours: hours("Low end of the effort for the first version"),
      highHours: hours("High end of the effort for the first version"),
    })
    .describe("A smaller first version the client could launch with and grow from"),
  costDrivers: z.array(z.string()).describe("2 to 5 short phrases naming what pushes the effort up or down"),
  assumptions: z.array(z.string()).describe("2 to 5 short assumptions, especially for unanswered questions"),
  summary: z.string().describe("2 to 3 sentences addressed to the client as 'you', with no prices or hours"),
});

export type Effort = z.infer<typeof EffortSchema>;

type Range = { low: number; high: number };

// What the visitor sees, WordPress stores and the email repeats: the effort
// priced at my rates, in the client's currency.
export type Estimate = Range & {
  currency: string;
  timeline: Effort["timeline"];
  breakdown: (Range & { item: string })[];
  // Only when it's meaningfully smaller than the full project.
  phaseOne?: Range & { scope: string };
  // The same hours at typical freelance rates in the client's market.
  freelance?: Range;
  rush: boolean;
  costDrivers: string[];
  assumptions: string[];
  summary: string;
};

// The PDF's file name, for the email attachment and the download button.
export const ESTIMATE_PDF_FILENAME = "Pradipta-Das-website-estimate.pdf";

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
