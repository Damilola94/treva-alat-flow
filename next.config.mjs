/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'innovarionstr.blob.core.windows.net',
      },
    ],
  },
  async redirects() {
    return [
      {
        "source": "/",
        "destination": "/auth/login",
        "permanent": false
      },
      {
        "source": "/streak-web",
        "destination": "/streak-web/auth/login",
        "permanent": false
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/streak-web/',
        destination: '/streak-web/index'
      }
    ];
  }
};

export default nextConfig;
