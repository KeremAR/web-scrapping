/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i0.shbdn.com',
      },
    ],
  },
}

module.exports = nextConfig 