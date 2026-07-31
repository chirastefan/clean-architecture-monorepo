/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@clean/cart',
    '@clean/auth',
    '@clean/logger',
    '@clean/telemetry',
    '@clean/ui-logic',
    '@clean/web-ui-components',
  ],
};

module.exports = nextConfig;
