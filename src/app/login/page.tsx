import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Login | VTG Rheinland-Pfalz" };

export default function LoginPage() {
  return (
    <>
      <PageHero title="Mitglieder-Login" subtitle="Melden Sie sich mit Ihren Zugangsdaten an." />
      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <LoginForm />
      </section>
    </>
  );
}
