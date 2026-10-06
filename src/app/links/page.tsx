import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getLinksByCategory } from "@/lib/links";

export const metadata: Metadata = { title: "Links | VTG Rheinland-Pfalz" };

export default async function LinksPage() {
  const categories = await getLinksByCategory();
  return (
    <>
      <PageHero title="Links" subtitle="Nützliche Verweise rund um die Flurbereinigung." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-10">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="font-heading text-xl font-bold text-neutral-900">
              {cat.title}
            </h2>
            <ul className="mt-4 space-y-4">
              {cat.items.map((item) => (
                <li key={item.id} className="border-b border-neutral-100 pb-3">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-vtg-orange hover:underline"
                  >
                    {item.label}
                  </a>
                  {item.description && (
                    <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
