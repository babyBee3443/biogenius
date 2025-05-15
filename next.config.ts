
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
      // Removed broad patterns for News/Collect API
    ],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {},
  // reactStrictMode: true, // Already set in next.config.js, can be removed if both files are kept in sync.
  // productionBrowserSourceMaps: false, // Already set in next.config.js
};

export default nextConfig;

