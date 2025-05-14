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
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', port: '', pathname: '/**' },
      // News API - More specific domains are better if known, these are examples
      { protocol: 'https', hostname: '**.com', port: '', pathname: '/**' }, // General for .com domains
      { protocol: 'https', hostname: '**.org', port: '', pathname: '/**' }, // General for .org domains
      { protocol: 'https', hostname: '**.net', port: '', pathname: '/**' }, // General for .net domains
      // Add specific known news source domains here if possible
      // e.g. { protocol: 'https', hostname: 's.abcnews.com', port: '', pathname: '/**' },
    ],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {},
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
