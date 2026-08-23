import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.BUILD_DIR || ".next",
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,


  cacheComponents: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "framer-motion",
      "recharts",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins: ["localhost:3000"],
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",

    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "erp.e-laeltd.com",
      },
      {
        protocol: "https",
        hostname: "e-laeltd.com",
      },
      {
        protocol: "https",
        hostname: "erp.e-laeltd.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "www.citypng.com",
      },
      {
        protocol: "https",
        hostname: "elt-back.promisemart.com",
        pathname: "/storage/images/**",
      },
      {
        protocol: "https",
        hostname: "images.seeklogo.com",
      },
      {
        protocol: "https",
        hostname: "images.seeklogo.com",
      },
      {
        protocol: "https",
        hostname: "nagad.com.bd",
      },
      {
        protocol: "https",
        hostname: "coderstrust.global",
      },
      {
        protocol: "https",
        hostname: "coderstrust.global",
      },
      {
        protocol: "https",
        hostname: "elt-back.promisemart.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "erp-back.e-laeltd.com",
      },
      {
        protocol: "https",
        hostname: "beta.e-laeltd.com",
      },
      {
        protocol: "https",
        hostname: "jubo64.e-laeltd.com",
      },
      {
        protocol: "https",
        hostname: "jubo64-new.e-laeltd.com",
      },
    ],
  },

  // Cache headers (SAFE VERSION)
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  logging: {
    browserToTerminal: true,
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;