/** @type {import('next').NextConfig} */

const withYaml = require('next-plugin-yaml');

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['.'],
  },
};

module.exports = withYaml(nextConfig);
