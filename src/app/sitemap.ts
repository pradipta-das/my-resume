import type { MetadataRoute } from "next";

import { fetchAllPosts } from "./lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  const staticPages = [
   {
      url: "https://pradipta.online",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },

    /* {
      url: "https://pradipta.online/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: "https://pradipta.online/services",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },*/
  ];

  const blogPages = posts.map((post) => ({
    url: `https://pradipta.online/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...blogPages,
  ];
}