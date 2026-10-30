import type { MetadataRoute } from "next";
import { getAll, localUrl } from "@/lib/wordpress";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Every published post and page, from WordPress.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages] = await Promise.all([getAll("posts"), getAll("pages")]);

  return [
    { url: SITE_URL },
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: `${post.modified_gmt}Z` })),
    ...pages.map((page) => ({
      url: `${SITE_URL}${localUrl(page.link).replace(/\/$/, "")}`,
      lastModified: `${page.modified_gmt}Z`,
    })),
  ];
}
