/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'], // Allow images from GitHub avatars
  },
};

module.exports = nextConfig;
