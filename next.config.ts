import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
