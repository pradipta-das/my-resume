import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Content from "@/components/Content";
import { getPage, plainText } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string[] }> };

// WordPress pages, at the same path as in WordPress (/about, /about/team).
// Built on first visit, then cached until WordPress says they changed.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: plainText(page.title.rendered),
    description: plainText(page.excerpt.rendered).slice(0, 160) || undefined,
    alternates: { canonical: `/${slug.join("/")}` },
  };
}

export default async function WordPressPage({ params }: Props) {
  const page = await getPage((await params).slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">{plainText(page.title.rendered)}</h1>
      {page.content.protected ? <p>This page is password protected.</p> : <Content html={page.content.rendered} />}
    </article>
  );
}
