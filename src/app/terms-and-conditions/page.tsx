import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph } from "../lib/seo";
import Link from "next/link";
import LegalPage, { type LegalSection } from "../components/LegalPage";
import { LEGAL } from "../lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms for using ${LEGAL.site}, including the free cost estimator and consultation calls offered by ${LEGAL.owner}.`,
  alternates: pageAlternates("/terms-and-conditions"),
  openGraph: pageOpenGraph("/terms-and-conditions"),
};

const Email = () => <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms cover your use of {LEGAL.site}, run by {LEGAL.owner} (&ldquo;I&rdquo;, &ldquo;me&rdquo;). By using
          the website, you agree to them. If you don&apos;t agree, please don&apos;t use the website.
        </p>
        <p>
          They cover the website only. If we work together on a project, that work is covered by a separate written
          proposal or agreement, which takes priority over these terms.
        </p>
      </>
    ),
  },
  {
    id: "using-the-website",
    title: "Using the website",
    body: (
      <>
        <p>You&apos;re welcome to browse, read and share links to anything here. Please don&apos;t:</p>
        <ul>
          <li>use the website for anything unlawful, or to send spam, malicious code or false information;</li>
          <li>try to break, overload or get around the security of the website or its forms;</li>
          <li>send automated requests to the cost estimator or the consultation form;</li>
          <li>copy large parts of the website, or present its content as your own.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cost-estimates",
    title: "Cost estimates",
    body: (
      <>
        <p>
          The cost estimator gives you a free ballpark figure, worked out by AI from your answers and typical market
          rates. It&apos;s there to help you plan. It isn&apos;t a quote or an offer to do the work.
        </p>
        <p>
          The real cost of a project depends on details only a proper conversation can uncover. A price is only agreed
          once I&apos;ve sent you a written proposal and you&apos;ve accepted it.
        </p>
      </>
    ),
  },
  {
    id: "consultations",
    title: "Free consultations",
    body: (
      <p>
        Consultation calls are free and come with no obligation on either side. Booking a call doesn&apos;t create an
        agreement to work together. I&apos;ll do my best to find a time that suits you, but calls depend on my
        availability, and I may decline a request, for example if your project isn&apos;t a good fit for what I do.
      </p>
    ),
  },
  {
    id: "content",
    title: "Content and ownership",
    body: (
      <>
        <p>
          The text, design, images and code of this website belong to me unless stated otherwise. You may quote short
          extracts with a link back to the original page.
        </p>
        <p>
          Client names, logos, screenshots and websites shown in the case studies belong to their respective owners
          and appear only to illustrate my work.
        </p>
      </>
    ),
  },
  {
    id: "journal",
    title: "Articles and advice",
    body: (
      <p>
        Articles in the <Link href="/blog">journal</Link>, and anything else on this website, are general information
        rather than professional advice for your situation. I try to keep everything accurate and up to date, but
        technology moves quickly, so please check anything important before relying on it.
      </p>
    ),
  },
  {
    id: "other-websites",
    title: "Links to other websites",
    body: (
      <p>
        Some pages link to other websites, such as clients&apos; sites in the case studies. I don&apos;t control those
        websites and I&apos;m not responsible for their content or how they handle your information.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <>
        <p>
          The website is provided &ldquo;as is&rdquo;. I work to keep it available and accurate, but I can&apos;t
          promise it will always be uninterrupted, error-free or up to date.
        </p>
        <p>
          As far as the law allows, I&apos;m not liable for any loss arising from your use of the website, including
          decisions made on the basis of a cost estimate or an article. Nothing in these terms limits liability that
          can&apos;t be limited by law.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Your privacy",
    body: (
      <p>
        The <Link href="/privacy-policy">privacy policy</Link> explains what information I collect through the website
        and how I use it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        I may update these terms from time to time. The date at the top shows when they last changed, and the version
        on this page is the one that applies.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of {LEGAL.country}, and the courts of {LEGAL.country} have jurisdiction over
        any dispute about them. If you live elsewhere, you keep any protections your local consumer laws give you.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms? Email <Email />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The ground rules for using this website, the cost estimator and free consultations. Short, and in plain English."
      sections={sections}
      related={{ href: "/privacy-policy", label: "Privacy Policy" }}
    />
  );
}
