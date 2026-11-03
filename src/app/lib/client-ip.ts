// The visitor's IP address, for rate limits and the Turnstile check. Netlify
// sets x-nf-client-connection-ip itself; the first x-forwarded-for entry can
// be written by the client, so it's only a fallback off Netlify (e.g. locally).
export function clientIp(request: Request): string | undefined {
  return (
    request.headers.get("x-nf-client-connection-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined
  );
}
