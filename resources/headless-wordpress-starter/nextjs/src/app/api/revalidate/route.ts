import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/lib/wordpress";

/*
 * POST /api/revalidate, called by the WordPress theme when content is
 * published, updated, unpublished or deleted, or a menu changes. It marks
 * everything fetched from WordPress as stale, and each page refreshes on its
 * next visit. The header must carry REVALIDATE_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = request.headers.get("x-revalidate-secret") ?? "";

  const valid =
    secret.length > 0 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!valid) return Response.json({ revalidated: false }, { status: 401 });

  // expire: 0, so the next visitor gets the new version rather than one more
  // stale copy while it rebuilds.
  revalidateTag(CACHE_TAG, { expire: 0 });

  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
