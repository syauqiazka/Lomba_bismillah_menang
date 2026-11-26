import type { NextConfig } from "next";
import { getSecurityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
<<<<<<< HEAD
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
=======
        headers: getSecurityHeaders(),
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
      },
    ];
  },
};

export default nextConfig;
