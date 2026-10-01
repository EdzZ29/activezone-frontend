import type { NextConfig } from "next";

// The NestJS API (activezone-backend). Set BACKEND_URL in Vercel → Settings → Environment Variables.
const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

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

  // Proxy /api/* to the backend so the login cookie belongs to this site's domain.
  async rewrites() {
    if (!backendUrl) return [];
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;
