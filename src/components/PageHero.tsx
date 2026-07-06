import Image from "next/image";

export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden sm:h-80">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-neutral-900/60" />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base text-neutral-100 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
