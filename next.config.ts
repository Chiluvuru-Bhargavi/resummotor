import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { serverComponentsExternalPackages: ["@google/genai"] }
};

export default nextConfig;
