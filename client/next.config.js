/** @type {import('next').NextConfig} */
const environment = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: false,
  // productionBrowserSourceMpas: true,
  distDir: 'build',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/ex_api/:path*',
          destination: environment
            ? `https://weblog-app.onrender.com/:path*`
            : `http://127.0.0.1:8080/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
