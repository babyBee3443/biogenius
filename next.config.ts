
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Add image optimization options
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Common device widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller image sizes for responsive images
    formats: ['image/avif', 'image/webp'], // Prefer modern image formats
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
  },
  // Experimental features (use with caution, may change)
  experimental: {
    // Enable appDir for improved routing and performance (if you are using it)
    // appDir: true, 
    
    // Consider enabling these for potential performance gains, but test thoroughly
    //isrMemoryCacheSize: 0, // Disable in-memory cache for ISR (if using ISR heavily and have memory issues)
    // PPR (Partial Prerendering) - for future Next.js versions
    // ppr: true, 
  },
  // For production, consider further optimizations
  // reactStrictMode: true, // Helps catch potential problems in your components
  // productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle sizes
};

export default nextConfig;

