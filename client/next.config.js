/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // productionBrowserSourceMpas: true,
  distDir: 'build',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/ex_api/:path*',
          destination: `https://weblog-app.onrender.com/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
