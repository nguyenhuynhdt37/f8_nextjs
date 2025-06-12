/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7217',
        pathname: '/',
      },
    ],
  },
};

export default nextConfig;
