import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stock photography is served from Unsplash until ActiveZone's own photos are added to /public.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    qualities: [75],
  },
};

export default nextConfig;
