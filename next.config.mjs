// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },

      // Brandfetch CDN (logos)
      { protocol: 'https', hostname: 'cdn.brandfetch.io' },
    ],
  },
};

export default nextConfig;
