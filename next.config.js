/** @type {import('next').NextConfig} */

const namespace = process.env.NEXT_PUBLIC_ASSET_PREFIX_NAMESPACE;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_ASSET_PREFIX_DISABLED ? undefined : `/${namespace}`,
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
        "destination": "/auth/sign-in",
        "permanent": false
      },
      {
        "source": `/${namespace}`,
        "destination": `/${namespace}/auth/sign-in`,
        "permanent": false
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: `/${namespace}/auth/sign-in`,
        destination: `/${namespace}/index/auth/sign-in`
      },
      {
        source: '/_next/static/:path*',
        destination: '/_next/static/:path*',
      },
    ];
  }
};

module.exports = nextConfig;
