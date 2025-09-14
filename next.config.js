const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**'
      }
    ],
    // Optional: Configure additional image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60, // Cache images for 60 seconds
    dangerouslyAllowSVG: false // Keep SVG handling secure
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/img/:path*',
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
            value: 'public, max-age=300' // 5 minutes for API responses
          }
        ]
      }
    ]
  }
}

module.exports = withNextIntl(nextConfig)
