/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@auth/prisma-adapter'],
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
};

export default nextConfig;
