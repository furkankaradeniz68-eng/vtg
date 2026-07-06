import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Über uns | VTG Rheinland-Pfalz" };

export default function UeberUnsPage() {
  return <PageHero title="Über uns" />;
}
