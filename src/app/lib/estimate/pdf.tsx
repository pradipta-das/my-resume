import { join } from "node:path";
import { Document, Font, Link, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { siteConfig } from "../seo";
import { formatRange } from "./format";
import type { Estimate, EstimateAnswers } from "./schema";

/*
 * The estimate as a PDF: attached to the email WordPress sends, and offered
 * as a download on the results screen. Server only.
 *
 * Drawn in the brand fonts from assets/fonts (next.config.ts ships them with
 * the server code). The basic Latin files lack the rupee sign, so each family
 * falls back to its Latin Extended file for ₹ (react-pdf picks fonts per
 * character, in the order given).
 */

const font = (file: string) => join(process.cwd(), "assets/fonts", file);

Font.register({
  family: "Manrope",
  fonts: [
    { src: font("Manrope-Regular.woff"), fontWeight: 400 },
    { src: font("Manrope-SemiBold.woff"), fontWeight: 600 },
  ],
});
Font.register({
  family: "ManropeExt",
  fonts: [
    { src: font("Manrope-Regular-LatinExt.woff"), fontWeight: 400 },
    { src: font("Manrope-SemiBold-LatinExt.woff"), fontWeight: 600 },
  ],
});
Font.register({ family: "Cormorant", src: font("CormorantGaramond-Medium.woff") });
Font.register({ family: "CormorantExt", src: font("CormorantGaramond-Medium-LatinExt.woff") });

// Whole words only: the default hyphenation splits words mid-line.
Font.registerHyphenationCallback((word) => [word]);

const SANS = ["Manrope", "ManropeExt"];
const SERIF = ["Cormorant", "CormorantExt"];
const BLUE = "#0813ef";
const MUTED = "#555555";
const RULE = "#d9d9d9";

const styles = StyleSheet.create({
  page: {
    fontFamily: SANS,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#000000",
    paddingTop: 44,
    paddingBottom: 64,
    paddingLeft: 60,
    paddingRight: 48,
  },
  rule: { position: "absolute", top: 0, bottom: 0, left: 0, width: 10, backgroundColor: BLUE },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  name: { fontFamily: SERIF, fontSize: 22, lineHeight: 1 },
  tagline: { marginTop: 4, fontSize: 7.5, color: MUTED },
  headerRight: { alignItems: "flex-end" },
  docTitle: { fontWeight: 600, fontSize: 9 },
  date: { fontSize: 8, color: MUTED },
  label: { fontWeight: 600, fontSize: 7.5, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 },
  hero: { marginTop: 26 },
  range: { fontFamily: SERIF, fontSize: 38, lineHeight: 1.1 },
  timeline: { marginTop: 6, fontSize: 10 },
  summary: { marginTop: 12, fontSize: 10.5, lineHeight: 1.55, maxWidth: 440 },
  columns: { flexDirection: "row", marginTop: 22, gap: 24 },
  column: { flex: 1, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#000000" },
  compareRange: { fontFamily: SERIF, fontSize: 20, lineHeight: 1.2, marginBottom: 4 },
  muted: { color: MUTED },
  section: { marginTop: 24 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  rowItem: { flex: 1, paddingRight: 16 },
  rowValue: {},
  totalRow: { borderBottomWidth: 0, borderTopWidth: 1, borderTopColor: "#000000", marginTop: -0.75 },
  bold: { fontWeight: 600 },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  facts: { flexDirection: "row", flexWrap: "wrap" },
  fact: { width: "50%", paddingRight: 16, marginBottom: 8 },
  factLabel: { fontSize: 7.5, color: MUTED },
  next: { marginTop: 26, padding: 14, backgroundColor: "#f4f4f4" },
  nextTitle: { fontFamily: SERIF, fontSize: 16, lineHeight: 1.2, marginBottom: 4 },
  link: { color: BLUE, textDecoration: "none" },
  // A set height: without one, react-pdf stretches this box to the page's
  // full height and its text ends up off the page.
  footer: {
    position: "absolute",
    left: 60,
    right: 48,
    bottom: 28,
    height: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 0.75,
    borderTopColor: RULE,
    fontSize: 7.5,
    color: MUTED,
  },
});

// AI-written text and visitor answers: no links, nothing the fonts can't draw
// (emoji), and not too long. Anyone can type any address into the form, so
// the PDF mustn't carry links a stranger could plant.
function clean(text: string, limit = 600): string {
  const plain = text
    .replace(/(?:https?:\/\/|www\.)\S+/gi, "")
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > limit ? `${plain.slice(0, limit - 1).trimEnd()}…` : plain;
}

const answer = (value: string | string[] | undefined) =>
  clean(Array.isArray(value) ? value.join(", ") : (value ?? ""), 200);

// The answers worth repeating, in the visitor's terms.
function projectFacts(answers: EstimateAnswers): [string, string][] {
  const features = (["features", "ecommerce", "integrations", "advanced"] as const)
    .flatMap((key) => answers[key] ?? [])
    .join(", ");

  const facts: [string, string][] = [
    ["Project", answer(answers.project_type)],
    ["Pages", answer(answers.pages)],
    ["Features", clean(features, 300)],
    ["Technology", answer(answers.technology)],
    ["Design", answer(answers.design_level)],
    ["Launch timeline", answer(answers.timeline)],
    ["Market", answer(answers.country)],
  ];
  return facts.filter(([, value]) => value !== "");
}

function Bullets({ items }: { items: string[] }) {
  return items.map((item, i) => (
    <View key={i} style={styles.bullet} wrap={false}>
      <Text style={styles.bulletMark}>–</Text>
      <Text style={styles.bulletText}>{clean(item, 200)}</Text>
    </View>
  ));
}

function EstimateDocument({ estimate, answers, date }: { estimate: Estimate; answers: EstimateAnswers; date: Date }) {
  const money = (range: { low: number; high: number }) => formatRange(range, estimate.currency);
  const facts = projectFacts(answers);
  const site = siteConfig.url;

  return (
    <Document title="Website estimate" author={siteConfig.name} creator={siteConfig.name} producer={site}>
      <Page size="A4" style={styles.page}>
        {/* Repeated on every page. */}
        <View fixed style={styles.rule} />
        <View fixed style={styles.footer}>
          <Text>A ballpark for planning, not a quote.</Text>
          <Text>{site.replace(/^https:\/\//, "")}</Text>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{siteConfig.name}</Text>
            <Text style={styles.tagline}>Freelance WordPress, Shopify & Next.js Developer</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>Website estimate</Text>
            <Text style={styles.date}>
              {date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.label}>Your estimate</Text>
          <Text style={styles.range}>{money(estimate)}</Text>
          <Text style={styles.timeline}>
            Estimated build time: {estimate.timeline.minWeeks}–{estimate.timeline.maxWeeks} weeks
          </Text>
          <Text style={styles.summary}>{clean(estimate.summary)}</Text>
        </View>

        {(estimate.phaseOne || estimate.freelance) && (
          <View style={styles.columns} wrap={false}>
            {estimate.phaseOne && (
              <View style={styles.column}>
                <Text style={styles.label}>Start smaller</Text>
                <Text style={styles.compareRange}>{money(estimate.phaseOne)}</Text>
                <Text>{clean(estimate.phaseOne.scope, 300)}</Text>
              </View>
            )}
            {estimate.freelance && (
              <View style={styles.column}>
                <Text style={styles.label}>Typical freelance price</Text>
                <Text style={[styles.compareRange, styles.muted]}>{money(estimate.freelance)}</Text>
                <Text>The same hours at typical rates for experienced freelancers in your market.</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section} wrap={false}>
          <Text style={styles.label}>Cost breakdown</Text>
          {estimate.breakdown.map((row, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.rowItem}>{clean(row.item, 80)}</Text>
              <Text style={styles.rowValue}>{money(row)}</Text>
            </View>
          ))}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.rowItem, styles.bold]}>Total</Text>
            <Text style={[styles.rowValue, styles.bold]}>{money(estimate)}</Text>
          </View>
        </View>

        <View style={styles.columns} wrap={false}>
          <View style={styles.column}>
            <Text style={styles.label}>What drives the cost</Text>
            <Bullets items={estimate.costDrivers} />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Assumptions</Text>
            <Bullets items={estimate.assumptions} />
          </View>
        </View>

        {facts.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.label}>Your project</Text>
            <View style={styles.facts}>
              {facts.map(([label, value]) => (
                <View key={label} style={styles.fact}>
                  <Text style={styles.factLabel}>{label}</Text>
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.next} wrap={false}>
          <Text style={styles.nextTitle}>Want to talk it through?</Text>
          <Text>
            Every project has details a questionnaire can&apos;t capture, and the real number depends on them. Reply
            to the email with your estimate, or book a free consultation call at{" "}
            <Link src={`${site}/free-consultation`} style={styles.link}>
              {site.replace(/^https:\/\//, "")}/free-consultation
            </Link>
            .
          </Text>
        </View>

      </Page>
    </Document>
  );
}

export async function renderEstimatePdf(estimate: Estimate, answers: EstimateAnswers, date = new Date()): Promise<Buffer> {
  return renderToBuffer(<EstimateDocument estimate={estimate} answers={answers} date={date} />);
}
