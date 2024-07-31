/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_ASSET_PREFIX_DISABLED ? undefined : '/streak-web',
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
        source: '/streak-web/auth/login',
        destination: '/streak-web/index/auth/login'
      }
    ];
  }
};

module.exports = nextConfig;
