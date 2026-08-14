import type { Metadata } from "next";
import { headers } from "next/headers";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  const role: MemberRole | null = session ? (session.role === "abonnent" ? "abonnent" : "intern") : null;
  const host = (await headers()).get("host");
  const portalMode = isPortalHost(host);

  return (
    <html
      lang="de"
      className={`${montserrat.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header loggedIn={!!session} role={role} portalMode={portalMode} />
        <main className="flex-1">{children}</main>
        <Footer portalMode={portalMode} />
      </body>
    </html>
  );
}
