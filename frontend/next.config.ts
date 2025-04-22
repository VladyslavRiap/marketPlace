import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "example.com",
      "www.sportvision.bg",
      "marketplace-my-1-2-3-4.s3.eu-north-1.amazonaws.com",
    ],

    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "marketplace-my-1-2-3-4.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  compress: true,
  productionBrowserSourceMaps: true,
};

export default nextConfig;
