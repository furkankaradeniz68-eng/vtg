import type { Metadata } from "next";
import { headers } from "next/headers";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSession } from "@/lib/auth";
import { isPortalHost } from "@/lib/site-mode";
import type { MemberRole } from "@/lib/nav";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "VTG Rheinland-Pfalz | Verband der Teilnehmergemeinschaften",
  description:
    "Der Verband der Teilnehmergemeinschaften Rheinland-Pfalz (VTG) ist der Dachverband der Teilnehmergemeinschaften von Bodenordnungsverfahren in Rheinland-Pfalz.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  // "bauleiter" ist absichtlich weder "abonnent" noch "intern" — das
  // Bauleiter-Dashboard (/bauleiter) hat ohnehin eigene Chrome (siehe
  // SiteChrome.tsx) und soll auf keiner oeffentlichen Seite die interne
  // Header2-Navigationsleiste einblenden, falls doch mal eine oeffentliche
  // Seite direkt aufgerufen wird.
  const role: MemberRole | null = !session
    ? null
    : session.role === "abonnent"
      ? "abonnent"
      : session.role === "dlr" || session.role === "admin"
        ? "intern"
        : null;
  const isAdmin = session?.role === "admin";
  const host = (await headers()).get("host");
  const portalMode = isPortalHost(host);

  return (
    <html
      lang="de"
      className={`${montserrat.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteChrome loggedIn={!!session} role={role} isAdmin={isAdmin} portalMode={portalMode}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
