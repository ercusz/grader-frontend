/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    domains: [
      'i.pravatar.cc',
      'source.unsplash.com',
      'images.unsplash.com',
      'localhost',
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
};

module.exports = () => {
  return removeImports({
    ...nextConfig,
  });
};
