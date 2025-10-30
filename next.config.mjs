/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_HAS_OPENAI: process.env.OPENAI_API_KEY ? "true" : "false",
  },
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
