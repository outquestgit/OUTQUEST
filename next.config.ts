import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "joinoutquest.com" }],
        destination: "https://www.joinoutquest.com/:path*",
        permanent: true, // 301
      },
    ];
  },
  images: {
    // Prefer modern formats per spec (AVIF first, WebP fallback).
    formats: ["image/avif", "image/webp"],
    // Supabase Storage public URLs. Tighten the hostname to your project ref
    // once known (e.g. `<ref>.supabase.co`).
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
