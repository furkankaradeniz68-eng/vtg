"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { MemberRole } from "@/lib/nav";

// Das Admin-Dashboard (/admin) ist bewusst von der oeffentlichen Website
// abgekoppelt — kein Haupt-Header/Footer, eigene Chrome in src/app/admin/layout.tsx.
export default function SiteChrome({
  children,
  loggedIn,
  role,
  isAdmin,
  portalMode,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
  role: MemberRole | null;
  isAdmin: boolean;
  portalMode: boolean;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header loggedIn={loggedIn} role={role} isAdmin={isAdmin} portalMode={portalMode} />
      <main className="flex-1">{children}</main>
      <Footer portalMode={portalMode} />
    </>
  );
}
