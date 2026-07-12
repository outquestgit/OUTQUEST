import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "joinoutquest.com" }],
        destination: "https://www.joinoutquest.com/:path*",
        statusCode: 301,
      },
    ];
  },
  images: {
    // Prefer modern formats per spec (AVIF first, WebP fallback).
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 82, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
