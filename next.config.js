const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable SWC minification for better performance
  swcMinify: true,

  // ✅ Compiler optimizations
  compiler: {
    // Remove console.logs in production (keep errors and warnings)
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
    // ✅ Remove React properties in production
    reactRemoveProperties: process.env.NODE_ENV === 'production'
  },

  // ✅ IMPROVED: Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**'
      }
    ],
    // ✅ AVIF first for better compression (60% smaller than WebP)
    formats: ['image/avif', 'image/webp'],

    // ✅ More granular device sizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // ✅ 1 year cache for images (was 60 seconds!)
    minimumCacheTTL: 31536000,

    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // ✅ IMPROVED: Headers with better caching and security
  async headers() {
    return [
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      },
      {
        source: '/docs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600'
          }
        ]
      },
      // ✅ Security headers for all pages
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // ✅ Experimental features for better performance
  experimental: {
    // Optimize CSS loading
    optimizeCss: true,

    // Tree-shake these packages to only import what's used
    optimizePackageImports: [
      'react-icons',
      '@radix-ui/react-icons',
      'keen-slider'
    ]
  },

  // ✅ Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,

  // ✅ Enable React strict mode
  reactStrictMode: true,

  // ✅ Optimize output
  poweredByHeader: false // Remove X-Powered-By header
}

module.exports = withNextIntl(nextConfig)
