/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  output: "standalone",
  webpack: (config: WebpackConfig) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve?.fallback || {}),
        canvas: false,
      },
    };

    // Add rule for binary modules
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
      type: "javascript/auto",
    });

    return config;
  },
};

export default nextConfig;
