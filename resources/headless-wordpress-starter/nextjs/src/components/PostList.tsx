import Image from "next/image";
import Link from "next/link";
import { featuredImage, plainText, type WpEntry } from "@/lib/wordpress";

export default function PostList({ posts }: { posts: WpEntry[] }) {
  if (posts.length === 0) return <p className="text-zinc-600">No posts yet.</p>;

  return (
    <ul className="divide-y divide-zinc-200">
      {posts.map((post) => {
        const image = featuredImage(post);
        return (
          <li key={post.id} className="py-8">
            <article className="grid gap-5 sm:grid-cols-[1fr_200px]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {plainText(post.title.rendered)}
                  </Link>
                </h2>
                <time dateTime={`${post.date_gmt}Z`} className="mt-1 block text-sm text-zinc-500">
                  {new Date(`${post.date_gmt}Z`).toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "UTC" })}
                </time>
                <p className="mt-3 text-zinc-700">{plainText(post.excerpt.rendered)}</p>
              </div>
              {image && (
                <Image
                  src={image.source_url}
                  alt={image.alt_text}
                  width={image.media_details?.width ?? 800}
                  height={image.media_details?.height ?? 500}
                  sizes="(min-width: 640px) 200px, 100vw"
                  className="aspect-[4/3] w-full rounded-lg object-cover sm:order-last"
                />
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
