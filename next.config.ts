import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Study content and past papers are read from disk at request time so that
  // dropping a new PDF into /public/papers shows up without a rebuild.
  reactStrictMode: true,
  // The floating dev badge sits on top of the mobile bottom navigation
  devIndicators: false,
};

export default nextConfig;
