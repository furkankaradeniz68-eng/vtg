import Image from "next/image";
import Link from "next/link";
import { footerNav } from "@/lib/nav";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Image
              src="/images/logo/vtg-schrift.png"
              alt="VTG Rheinland-Pfalz Logo"
              width={4006}
              height={1558}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-neutral-400">
              Gemeinsam für geordnete Bodenentwicklung in Rheinland-Pfalz.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              Service
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {footerNav.service.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-vtg-yellow">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              Über den VTG
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {footerNav.uebersicht.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-vtg-yellow">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-800 pt-6 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {year} Verband der Teilnehmergemeinschaften
            Rheinland-Pfalz.
          </p>
          <ul className="flex flex-wrap gap-4">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-vtg-yellow">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
