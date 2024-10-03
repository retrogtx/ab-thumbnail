    /** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@auth/prisma-adapter'],
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    PRISMA_ACCELERATE_URL: process.env.PRISMA_ACCELERATE_URL,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, '@prisma/client']
    }
    return config
  },
};

export default nextConfig;
