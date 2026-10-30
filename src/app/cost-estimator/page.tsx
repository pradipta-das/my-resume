import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph, siteConfig } from "../lib/seo";
import CostEstimatorForm from "../components/CostEstimatorForm";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const description =
  "Get a free, instant ballpark for your website or web app: answer a few questions and see a price range, timeline and what drives the cost.";

export const metadata: Metadata = {
  title: "Website Cost Calculator: Free Website & App Estimate",
  description,
  alternates: pageAlternates("/cost-estimator"),
  openGraph: pageOpenGraph("/cost-estimator"),
};

// For search engines: the estimator is a free tool, made by the site's Person.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Website Cost Calculator",
  url: `${siteConfig.url}/cost-estimator`,
  description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  creator: { "@id": `${siteConfig.url}/#person` },
};

export default function CostEstimatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeHeader />
      <CostEstimatorForm />
      <HomeFooter />
    </>
  );
}
