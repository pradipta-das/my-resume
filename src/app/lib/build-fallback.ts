import { PHASE_PRODUCTION_BUILD } from "next/constants";

/*
 * WordPress being briefly unreachable shouldn't fail a deploy. During
 * `next build`, a failed load falls back (the page fills in on its first
 * revalidation after launch). At runtime the error is rethrown, so Next.js
 * keeps serving the last good version of the page instead of caching an
 * empty one.
 */
export async function withBuildFallback<T>(what: string, load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;

    console.warn(`${what} unavailable during the build; using a fallback until the page revalidates.`, error);
    return fallback;
  }
}
