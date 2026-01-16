import type { NextConfig } from "next/dist/server/config-shared";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

// next-intl plugin
const withNextIntl = createNextIntlPlugin();

// PWA plugin
const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
});

export default withPwaConfig(withNextIntl(nextConfig));
