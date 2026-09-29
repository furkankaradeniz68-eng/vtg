import { requireBauleiterSession } from "@/lib/auth";
import AdminLogoutButton from "@/components/AdminLogoutButton";

// Eigenstaendiges, vom oeffentlichen Header/Footer und vom /admin-Bereich
// komplett getrenntes Dashboard (siehe SiteChrome.tsx-Bypass). Einzige
// Faehigkeit des Bauleiter-Accounts: VOB/VOL-Zeilen-CRUD, siehe page.tsx.
export default async function BauleiterLayout({ children }: { children: React.ReactNode }) {
  const session = await requireBauleiterSession();

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b-4 border-vtg-yellow bg-neutral-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="font-heading text-lg font-bold text-white">VTG Bauleiter-Dashboard</p>
            <p className="text-xs text-neutral-400">Angemeldet als {session.username}</p>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
