import type { MetadataRoute } from "next";

import { fetchAllPosts } from "./lib/wordpress";
import { getCaseStudies } from "./lib/case-studies";
import { RESOURCES } from "./lib/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, caseStudies] = await Promise.all([fetchAllPosts(), getCaseStudies()]);

  const staticPages = [
   {
      url: "https://pradipta.online",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },

    {
      url: "https://pradipta.online/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },

    {
      url: "https://pradipta.online/case-studies",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },

    {
      url: "https://pradipta.online/blog",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/resources",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/free-consultation",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/cost-estimator",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/privacy-policy",
      lastModified: new Date("2026-10-28"),
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
      lastModified: new Date(),
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
  ];
}