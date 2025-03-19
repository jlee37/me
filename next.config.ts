import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
  },
  async redirects() {
    return [
      {
        source: "/",         // root URL
        destination: "/about", // target URL
        permanent: true,     // true = 308 redirect, good for SEO
      },
    ];
  },
};

export default nextConfig;
