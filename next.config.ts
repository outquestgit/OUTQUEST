import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
