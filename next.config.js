/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
  },
  webpack: (config, { isServer }) => {
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.json'];
    return config;
  },
}


module.exports = nextConfig

