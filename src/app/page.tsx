import type { Metadata } from "next";
import HomeHeader from "./components/HomeHeader";
import HomeBody from "./components/HomeBody";
import HomeFooter from "./components/HomeFooter";
import { pageAlternates, pageOpenGraph, siteConfig } from "./lib/seo";

export const metadata: Metadata = {
  alternates: pageAlternates("/"),
  openGraph: pageOpenGraph("/"),
};

const { url } = siteConfig;
const SKILLS = ["WordPress", "Shopify", "Next.js", "React", "Tailwind CSS", "MySQL", "Headless CMS", "Technical SEO", "Web performance", "AI integrations"];

// For search engines: who runs the site and what they offer. The Person is the
// same one the About page describes (same @id).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en-IN",
      publisher: { "@id": `${url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${url}/#person`,
      name: siteConfig.name,
      url,
      image: `${url}/img-5.png`,
      jobTitle: "Freelance Web Developer & Consultant",
      knowsAbout: SKILLS,
      sameAs: Object.values(siteConfig.profiles),
    },
    {
      "@type": "ProfessionalService",
      "@id": `${url}/#service`,
      name: "Pradipta Das, Web Development & Consulting",
      url,
      image: `${url}/img-5.png`,
      description:
        "Freelance web development and consulting: WordPress sites, Shopify stores and Next.js web applications, built and looked after by one experienced developer.",
      founder: { "@id": `${url}/#person` },
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      areaServed: ["India", "United States", "United Kingdom", "Canada", "Australia"].map((name) => ({ "@type": "Country", name })),
      knowsAbout: SKILLS,
      sameAs: Object.values(siteConfig.profiles),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeHeader />
      <HomeBody />
      <HomeFooter />
    </>
  );
}
