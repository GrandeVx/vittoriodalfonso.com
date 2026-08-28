import Link from "next/link";
import type { Metadata } from "next";
import { getJourneys } from "@/lib/content";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import TopBar from "@/layouts/TopBar";
import { getJourneySlug } from "@/lib/journey";

export const metadata: Metadata = {
  title: "The Journey | Vittorio D'Alfonso",
  description:
    "AI experiments, annotated papers, and research notes by Vittorio D'Alfonso.",
};

export default async function JourneyIndexPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const journeys = getJourneys()
    .filter((journey) => journey.language === lang)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.order ?? 0) - (a.order ?? 0));

  return (
    <main className="flex h-screen flex-col items-center gap-16 bg-background text-primary first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-1/2">
        <TopBar />
      </section>

      <main className="flex h-screen w-[92%] flex-col gap-3 pt-3 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-12 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <header className="flex flex-col gap-3">
          <p className="text-pretty font-sans text-sm">
            {dictionary.journey.intro}
          </p>
          <p className="text-pretty font-sans text-sm text-black/40 dark:text-white/40">
            {dictionary.journey.sub}{" "}
            <Link
              href="mailto:v.dalfonso@metrica.dev"
              className="cursor-pointer underline"
            >
              v.dalfonso@metrica.dev
            </Link>
          </p>
        </header>

        <section
          aria-label={dictionary.journey.papers}
          className="mt-8 flex flex-col gap-6 pb-16"
        >
          {journeys.map((journey) => {
            const slug = getJourneySlug(journey);

            return (
              <Link
                key={journey._id}
                href={`/${lang}/journey/${slug}`}
                className="group flex min-w-0 flex-col gap-3 outline-none"
              >
                <article className="flex min-h-52 flex-col justify-between border border-border p-5 transition-colors group-hover:border-muted group-focus-visible:border-selected">
                  <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.14em] text-muted">
                    <span>{dictionary.journey.title}</span>
                    <span>{String(journey.order ?? 0).padStart(2, "0")}</span>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-balance text-2xl leading-tight tracking-[-0.035em] transition-opacity group-hover:opacity-60">
                      {journey.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                      {journey.description}
                    </p>
                  </div>
                </article>

                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 text-sm">
                  <p className="min-w-0 truncate" title={journey.title}>
                    {journey.title}
                  </p>
                  <time
                    dateTime={journey.date}
                    className="whitespace-nowrap text-muted"
                  >
                    {journey.date.slice(0, 4)}
                  </time>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </main>
  );
}
