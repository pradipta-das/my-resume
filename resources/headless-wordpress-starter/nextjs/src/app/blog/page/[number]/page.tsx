import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/wordpress";
import { POSTS_PER_PAGE } from "@/lib/site";

type Props = { params: Promise<{ number: string }> };

// Pages are built on first visit, then cached like everything else.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `Posts, page ${number}`, alternates: { canonical: `/blog/page/${number}` } };
}

export default async function PostsPage({ params }: Props) {
  const { number } = await params;
  const page = Number(number);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) permanentRedirect("/");

  const { items, totalPages } = await getPosts(page, POSTS_PER_PAGE);
  if (items.length === 0) notFound();

  return (
    <>
      <h1 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Page {page}</h1>
      <PostList posts={items} />
      <Pagination page={page} totalPages={totalPages} />
    </>
  );
}
