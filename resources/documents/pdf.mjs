// Shared look for the downloadable PDFs: the brand fonts, the blue rule, and
// the building blocks (sections, checklist items, code). Written with
// createElement rather than JSX so the build runs on plain Node.
import { createElement as h } from "react";
import { fileURLToPath } from "node:url";
import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const font = (file) => fileURLToPath(new URL(`../../assets/fonts/${file}`, import.meta.url));

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
// Monospace for code: Courier is built into every PDF reader. Note: the fonts
// have no arrow (→); write "›" or words instead.
Font.registerHyphenationCallback((word) => [word]);

export const SITE = "pradipta.online";
const SANS = ["Manrope", "ManropeExt"];
const SERIF = ["Cormorant", "CormorantExt"];
const BLUE = "#0813ef";
const MUTED = "#555555";
const RULE = "#d9d9d9";

const styles = StyleSheet.create({
  page: { fontFamily: SANS, fontSize: 9.5, lineHeight: 1.45, paddingTop: 44, paddingBottom: 64, paddingLeft: 60, paddingRight: 48 },
  rule: { position: "absolute", top: 0, bottom: 0, left: 0, width: 10, backgroundColor: BLUE },
  // A set height: without one, react-pdf stretches a fixed footer to the full page.
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
  header: { paddingBottom: 16, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#000" },
  eyebrow: { fontWeight: 600, fontSize: 7.5, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 },
  title: { fontFamily: SERIF, fontSize: 34, lineHeight: 1.1 },
  intro: { marginTop: 10, fontSize: 10.5, lineHeight: 1.55, maxWidth: 440 },
  section: { marginTop: 20 },
  sectionHead: { flexDirection: "row", alignItems: "center", paddingBottom: 6, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#000" },
  sectionNumber: { fontWeight: 600, fontSize: 9, color: BLUE, width: 24, paddingTop: 2 },
  sectionTitle: { fontFamily: SERIF, fontSize: 18, lineHeight: 1.2, flex: 1 },
  sectionNote: { color: MUTED, marginBottom: 6 },
  check: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 0.75, borderBottomColor: RULE },
  box: { width: 9, height: 9, borderWidth: 0.9, borderColor: "#000", marginTop: 2.5, marginRight: 10 },
  checkBody: { flex: 1 },
  checkText: { fontWeight: 600 },
  checkDetail: { color: MUTED, marginTop: 1 },
  paragraph: { marginBottom: 6 },
  term: { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 0.75, borderBottomColor: RULE },
  termName: { fontFamily: "Courier", fontSize: 9, width: 150, paddingRight: 10, paddingTop: 0.5 },
  termText: { flex: 1 },
  code: {
    fontFamily: "Courier",
    fontSize: 8,
    lineHeight: 1.35,
    backgroundColor: "#f4f4f4",
    paddingVertical: 7,
    paddingHorizontal: 9,
    marginTop: 3,
    marginBottom: 7,
  },
  inlineCode: { fontFamily: "Courier", fontSize: 9 },
  closing: { marginTop: 24, padding: 14, backgroundColor: "#f4f4f4" },
  closingTitle: { fontFamily: SERIF, fontSize: 16, lineHeight: 1.2, marginBottom: 4 },
  link: { color: BLUE, textDecoration: "none" },
});

// Text with `code` spans (backticks) set in monospace.
export function rich(text, style) {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return h(
    Text,
    { style },
    parts.map((part, i) =>
      part.startsWith("`") ? h(Text, { key: i, style: styles.inlineCode }, part.slice(1, -1)) : part,
    ),
  );
}

export function Section({ number, title, note, children, breakBefore = false }) {
  return h(
    View,
    { style: styles.section, break: breakBefore },
    // The heading stays with the first item below it.
    h(
      View,
      { wrap: false, minPresenceAhead: 60 },
      h(View, { style: styles.sectionHead }, h(Text, { style: styles.sectionNumber }, String(number).padStart(2, "0")), h(Text, { style: styles.sectionTitle }, title)),
      note ? rich(note, styles.sectionNote) : null,
    ),
    children,
  );
}

export function Check({ text, detail }) {
  return h(
    View,
    { style: styles.check, wrap: false },
    h(View, { style: styles.box }),
    h(View, { style: styles.checkBody }, rich(text, styles.checkText), detail ? rich(detail, styles.checkDetail) : null),
  );
}

export const Paragraph = ({ text }) => rich(text, styles.paragraph);

export const Code = ({ children }) => h(Text, { style: styles.code, wrap: false }, children.trim());

// A term and its meaning, side by side (for EXPLAIN columns and the like).
export function Term({ term, text }) {
  return h(
    View,
    { style: styles.term, wrap: false },
    h(Text, { style: styles.termName }, term),
    rich(text, styles.termText),
  );
}

export const Subhead = ({ text }) => h(Text, { style: [styles.checkText, { marginTop: 6, marginBottom: 2 }] }, text);

export function Closing({ title, text, href, label }) {
  return h(
    View,
    { style: styles.closing, wrap: false },
    h(Text, { style: styles.closingTitle }, title),
    h(Text, null, text, " ", h(Link, { src: href, style: styles.link }, label), "."),
  );
}

// A document in the house style: header with eyebrow, title and intro, then
// the content, with the blue rule and a footer on every page.
export function BrandDocument({ title, eyebrow, intro, footerNote, children }) {
  return h(
    Document,
    { title, author: "Pradipta Das", creator: "Pradipta Das", producer: SITE },
    h(
      Page,
      { size: "A4", style: styles.page },
      h(View, { fixed: true, style: styles.rule }),
      h(View, { fixed: true, style: styles.footer }, h(Text, null, footerNote), h(Text, null, SITE)),
      h(
        View,
        { style: styles.header },
        h(Text, { style: styles.eyebrow }, eyebrow),
        h(Text, { style: styles.title }, title),
        rich(intro, styles.intro),
      ),
      children,
    ),
  );
}
