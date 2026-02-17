/** @type {import('next').NextConfig} */

const namespace = process.env.NEXT_PUBLIC_ASSET_PREFIX_NAMESPACE;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_ASSET_PREFIX_DISABLED
    ? undefined
    : `/${namespace}`,
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
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'treva-api.somee.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; img-src 'self' data: https://ui-avatars.com https://innovarionstr.blob.core.windows.net https://www.shutterstock.com https://treva-api.somee.com;`,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  // output: "export",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/auth/sign-in',
      //   permanent: false,
      // },
      // {
      //   source: `/${namespace}`,
      //   destination: `/${namespace}/auth/sign-in`,
      //   permanent: false,
      // },
      {
        source: '/',
        destination: '/onboarding-type',
        permanent: false,
      },
      {
        source: `/${namespace}`,
        destination: `/${namespace}/onboarding-type`,
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: `/${namespace}/auth/sign-in`,
        destination: `/${namespace}/index/auth/sign-in`,
      },
      {
        source: '/_next/static/:path*',
        destination: '/_next/static/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
