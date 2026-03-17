import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during build - using standalone ESLint instead
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

