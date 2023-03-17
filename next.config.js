/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  experimental: {
    modularizeImports: {
      '@mui/material': {
        transform: '@mui/material/{{member}}',
      },
      '@mui/icons-material': {
        transform: '@mui/icons-material/{{member}}',
      },
      '@mui/styles': {
        transform: '@mui/styles/{{member}}',
      },
      '@mui/lab': {
        transform: '@mui/lab/{{member}}',
      },
    },
  },
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    domains: [
      'i.pravatar.cc',
      'source.unsplash.com',
      'images.unsplash.com',
      'localhost',
      process.env.HOST,
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/p/@:username',
        destination: '/profiles/:username',
      },
    ];
  },
};

module.exports = () => {
  return removeImports({
    ...nextConfig,
  });
};
