/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repositoryName = 'pokemon-guide';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: isProd ? `/${repositoryName}` : '',
  assetPrefix: isProd ? `/${repositoryName}/` : '',
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Asegúrate de que las rutas funcionen correctamente
  publicRuntimeConfig: {
    basePath: isProd ? `/${repositoryName}` : '',
  },
}

export default nextConfig
