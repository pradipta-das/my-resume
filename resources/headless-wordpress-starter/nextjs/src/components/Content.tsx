import { localizeLinks } from "@/lib/wordpress";

// Post or page HTML from WordPress. It comes from your own editors, so it's
// rendered as is; internal links are pointed at this site.
export default function Content({ html }: { html: string }) {
  return (
    <div
      className="wp-content prose prose-zinc max-w-none prose-a:text-zinc-900 prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: localizeLinks(html) }}
    />
  );
}
