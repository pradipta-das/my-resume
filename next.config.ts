import type { NextConfig } from "next";

// Sent with every page. The CSP only covers what can't break the site's own
// scripts: no framing by other sites, no <base> or plugin tricks, and forms
// that only submit here.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Fonts read from disk by the share-image routes (src/app/lib/og.tsx), some
  // of which render on demand on the server.
  outputFileTracingIncludes: {
    "/**": ["./assets/fonts/*.woff"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logicncolor.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
