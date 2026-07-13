import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    "playwright",
    "puppeteer",
    "remark-mermaidjs",
    "mermaid-isomorphic",
  ],
};

export default nextConfig;
