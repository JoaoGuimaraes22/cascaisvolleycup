import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const cspDirectives: string[] = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${
    isDev ? " 'unsafe-eval'" : ""
  } https://va.vercel-scripts.com https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://cdn.sanity.io",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com${
    isDev ? " ws: wss:" : ""
  }`,
  "frame-src 'self' https://vercel.live",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];
if (!isDev) cspDirectives.push("upgrade-insecure-requests");
const cspValue = cspDirectives.join("; ");

const studioCspValue = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://lh3.googleusercontent.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://api.sanity.io https://apicdn.sanity.io https://core.sanity-cdn.com",
  "frame-src 'self' https://*.sanity.io",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 65, 70, 75, 80, 85, 90, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ["react-icons"],
  },

  async headers() {
    return [
      {
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/docs/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()",
          },
          { key: "Content-Security-Policy", value: cspValue },
        ],
      },
      {
        source: "/studio/:path*",
        headers: [
          { key: "Content-Security-Policy", value: studioCspValue },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
