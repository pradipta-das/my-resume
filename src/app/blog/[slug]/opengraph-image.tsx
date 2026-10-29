import { getArticle } from "../../lib/blog";
import { shareImage } from "../../lib/og";

export const alt = "An article from The Journal by Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Like the post pages: drawn on first request, then cached and revalidated.
export async function generateStaticParams() {
  return [];
}

// The post's title, with its featured image alongside once it has one.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  return shareImage({ label: "The Journal", title: article?.title ?? "The Journal", image: article?.image });
}
