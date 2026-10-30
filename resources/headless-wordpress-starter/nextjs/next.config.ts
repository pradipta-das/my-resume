import type { NextConfig } from "next";

// Images come from the WordPress media library, so next/image may optimise
// files from that host (and only that host).
const wordpress = new URL(process.env.WORDPRESS_URL || "https://cms.example.com");

// A WordPress on your own machine (LocalWP, wp-env, ...) resolves to a local IP
// address, which next/image refuses by default. Allow that only when the
// configured WordPress is itself local; a live site keeps the protection.
const localWordPress =
  ["localhost", "127.0.0.1", "[::1]"].includes(wordpress.hostname) || /\.(local|test)$/.test(wordpress.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: wordpress.protocol.replace(":", "") as "http" | "https",
        hostname: wordpress.hostname,
        port: wordpress.port,
        pathname: "/wp-content/uploads/**",
      },
    ],
    dangerouslyAllowLocalIP: localWordPress,
  },
};

export default nextConfig;
