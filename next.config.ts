import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `NEXT_DIST_DIR=.next-build pnpm build` builds next to a running `next dev` (which owns `.next`).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
