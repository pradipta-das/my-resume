import { decodeEntities, stripHtml } from "../lib/blog";
import { withBuildFallback } from "../lib/build-fallback";
import { fetchFeedPosts } from "../lib/wordpress";
import { siteConfig } from "../lib/seo";

// RSS 2.0 feed of the journal. Built once, then refreshed every ten minutes.
export const dynamic = "force-static";
export const revalidate = 600;

const xml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = await withBuildFallback("Feed posts", () => fetchFeedPosts(20), []);
  const self = `${siteConfig.url}/feed.xml`;

  const items = posts
    .map((post) => {
      const link = `${siteConfig.url}/blog/${post.slug}`;
      const categories = post.categories
        .filter((term) => term.slug !== "uncategorized")
        .map((term) => `<category>${xml(decodeEntities(term.name))}</category>`)
        .join("");
      return `<item><title>${xml(decodeEntities(post.title))}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description>${xml(stripHtml(post.excerpt).replace(/\s*\[(…|\.\.\.)\]$/, "…"))}</description>${categories}</item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>The Journal by Pradipta Das</title><link>${siteConfig.url}/blog</link><description>${xml(siteConfig.description)}</description><language>en-in</language><atom:link href="${self}" rel="self" type="application/rss+xml"/>${posts[0] ? `<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>` : ""}${items}</channel></rss>`;

  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
