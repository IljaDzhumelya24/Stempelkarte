import type { NextConfig } from "next";
import { appHeaders, appRewrites } from "./scripts/stampnow-routing.mjs";

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: appRewrites(), afterFiles: [], fallback: [] };
  },
  async headers() {
    return appHeaders();
  },
};

export default nextConfig;
