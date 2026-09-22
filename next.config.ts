import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Erlaubt next/image, von Admins hochgeladene Personenfotos aus dem
    // oeffentlichen Vercel-Blob-Store zu laden (siehe src/lib/personen.ts).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
