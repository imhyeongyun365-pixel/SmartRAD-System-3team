import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,
  // devIndicators: false,
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/common-codes/:path*",
        destination: `${backendUrl}/common-codes/:path*`,
      },
      {
        source: "/common-codes",
        destination: `${backendUrl}/common-codes`,
      },
    ];
  },
};

export default nextConfig;
