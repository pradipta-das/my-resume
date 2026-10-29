import type { MetadataRoute } from "next";

import { fetchAllPosts } from "./lib/wordpress";
import { getCategories } from "./lib/blog";
import { getCaseStudies } from "./lib/case-studies";
import { RESOURCES } from "./lib/resources";
import { withBuildFallback } from "./lib/build-fallback";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, caseStudies, categories] = await Promise.all([
    withBuildFallback("Blog posts", fetchAllPosts, []),
    withBuildFallback("Case studies", getCaseStudies, []),
    withBuildFallback("Blog categories", getCategories, []),
  ]);

  // No lastModified on pages without a real date: one that always says "now"
  // teaches search engines to ignore the field.
  const staticPages = [
   {
      url: "https://pradipta.online",
      changeFrequency: "weekly" as const,
      priority: 1,
    },

    {
      url: "https://pradipta.online/about",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },

    {
      url: "https://pradipta.online/case-studies",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },

    {
      url: "https://pradipta.online/blog",
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/resources",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/free-consultation",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/cost-estimator",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/privacy-policy",
      lastModified: new Date("2026-10-29"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },

    {
      url: "https://pradipta.online/terms-and-conditions",
      lastModified: new Date("2026-10-28"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },

    /* {
      url: "https://pradipta.online/services",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },*/
  ];

  const blogPages = posts.map((post) => ({
    url: `https://pradipta.online/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseStudyPages = caseStudies.map((study) => ({
    url: `https://pradipta.online/case-studies/${study.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: `https://pradipta.online/blog?category=${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const resourcePages = RESOURCES.map((resource) => ({
    url: `https://pradipta.online/resources/${resource.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...caseStudyPages,
    ...resourcePages,
    ...blogPages,
    ...categoryPages,
  ];
}