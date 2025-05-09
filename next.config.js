/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Enable SWC minifier for faster builds
  typescript: {
    ignoreBuildErrors: true, // Consider setting to false for production builds
  },
  eslint: {
    ignoreDuringBuilds: true, // Consider setting to false for production builds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    // appDir: true, // Already default in newer Next.js versions
  },
  reactStrictMode: true, // Helps catch potential problems
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  // Note for the user: For better performance, ensure your hosting provider
  // serves your site over HTTP/2 or HTTP/3. This is a server-level configuration.
};

module.exports = nextConfig;