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
      // News API & CollectAPI - More specific domains are better if known
      { protocol: 'https', hostname: '**.com', port: '', pathname: '/**' }, 
      { protocol: 'https', hostname: '**.org', port: '', pathname: '/**' }, 
      { protocol: 'https', hostname: '**.net', port: '', pathname: '/**' },
      // For CollectAPI images (if they serve from a specific domain, add it here)
      // Example: { protocol: 'https', hostname: 'cdn.collectapi.com', port: '', pathname: '/**' },
      // Using a very broad pattern for now, refine if CollectAPI image source domain is known
      { protocol: 'http', hostname: '**.com', port: '', pathname: '/**' }, // Added for potential http image sources from CollectAPI
      { protocol: 'http', hostname: '**.org', port: '', pathname: '/**' },
      { protocol: 'http', hostname: '**.net', port: '', pathname: '/**' },
    ],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Keep cache short for news
  },
  experimental: {},
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
