import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/associar",
        destination: "/participe-do-conecta-associados",
        permanent: true,
      },
      {
        source: "/associar/:path*",
        destination: "/participe-do-conecta-associados",
        permanent: true,
      },
      {
        source: "/conecta-associados/cadastro",
        destination: "/participe-do-conecta-associados",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
