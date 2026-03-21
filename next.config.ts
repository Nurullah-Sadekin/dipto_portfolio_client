import type { NextConfig } from "next";
import path from "node:path";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "dipto_portfolio_client";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
