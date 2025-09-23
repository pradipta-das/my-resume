import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
