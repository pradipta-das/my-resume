import Link from "next/link";

const href = (page: number) => (page === 1 ? "/" : `/blog/page/${page}`);

export default function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-between text-sm font-semibold">
      {page > 1 ? <Link href={href(page - 1)} rel="prev">← Newer posts</Link> : <span />}
      <span className="text-zinc-500">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? <Link href={href(page + 1)} rel="next">Older posts →</Link> : <span />}
    </nav>
  );
}
