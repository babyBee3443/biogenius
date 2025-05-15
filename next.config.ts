
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
      // News API & CollectAPI - More specific domains are better if known
      { protocol: 'https', hostname: '**.com', pathname: '/**' }, 
      { protocol: 'https', hostname: '**.org', pathname: '/**' }, 
      { protocol: 'https', hostname: '**.net', pathname: '/**' },
      // For CollectAPI images (if they serve from a specific domain, add it here)
      // Example: { protocol: 'https', hostname: 'cdn.collectapi.com', pathname: '/**' },
      // Using a very broad pattern for now, refine if CollectAPI image source domain is known
      { protocol: 'http', hostname: '**.com', pathname: '/**' }, // Added for potential http image sources from CollectAPI
      { protocol: 'http', hostname: '**.org', pathname: '/**' },
      { protocol: 'http', hostname: '**.net', pathname: '/**' },
    ],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Keep cache short for news
  },
  experimental: {},
  // reactStrictMode: true, // Already set in next.config.js, can be removed if both files are kept in sync.
  // productionBrowserSourceMaps: false, // Already set in next.config.js
};

export default nextConfig;
