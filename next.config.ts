import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/local", destination: "/impostor/local", permanent: true },
      { source: "/online", destination: "/impostor/online", permanent: true },
      { source: "/sala/:codigo", destination: "/impostor/sala/:codigo", permanent: true },
    ];
  },
};

export default nextConfig;
