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
  // /api/vob-vol/pdf liest das Logo-PNG zur Laufzeit per fs.readFileSync aus
  // public/ (fuer das Einbetten ins PDF via pdf-lib). Der public/-Ordner wird
  // sonst nur statisch ausgeliefert und ist im Serverless-Function-Bundle
  // nicht automatisch enthalten -- ohne diesen Hinweis wuerde das auf Vercel
  // mit ENOENT fehlschlagen, obwohl es lokal funktioniert.
  outputFileTracingIncludes: {
    "/api/vob-vol/pdf": ["./public/images/logo/vtg-schrift.png"],
  },
};

export default nextConfig;
