/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.net = false
      config.resolve.fallback.child_process = false
    }

    return config
  },
  env: {
    NEXT_PUBLIC_GOOGLE_SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
    NEXT_PUBLIC_GOOGLE_SHEET_CLIENT_EMAIL: process.env.NEXT_PUBLIC_GOOGLE_SHEET_CLIENT_EMAIL,
    NEXT_PUBLIC_GOOGLE_SHEET_PRIVATE_KEY: process.env.NEXT_PUBLIC_GOOGLE_SHEET_PRIVATE_KEY,
    BASE_URL: process.env.BASE_URL,
  }
}

module.exports = nextConfig
