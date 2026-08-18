import type { Metadata } from "next";

export const siteConfig = {
  name: "Pradipta Das",
  title: "Pradipta Das | Freelance Web Developer",
  description:
    "Freelance web developer specializing in Next.js, React, WordPress, Shopify, performance optimization and scalable web development.",
  url: "https://pradipta.online",
  ogImage: "/og/default.jpg",
};

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function generateSEO({
  title,
  description,
  path = "",
  image = siteConfig.ogImage,
  noIndex = false,
}: SEOProps): Metadata {
  const canonical = `${siteConfig.url}${path}`;

  return {
    title,
    description,

    metadataBase: new URL(siteConfig.url),

    alternates: {
      canonical,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}