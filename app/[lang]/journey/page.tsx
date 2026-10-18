import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { getJourneys } from "@/lib/content";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import TopBar from "@/layouts/TopBar";
import JourneyIndex from "@/components/journey/JourneyIndex";

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
    .sort(
      (a, b) => b.date.localeCompare(a.date) || (b.order ?? 0) - (a.order ?? 0),
    )
    .map((journey) => {
      const previewPath = path.join(
        process.cwd(),
        "public/journey/previews",
        `${journey.slug}.jpg`,
      );

      return {
        url: journey.url,
        title: journey.title,
        description: journey.description,
        date: journey.date,
        kind: journey.kind,
        preview:
          journey.pdf && existsSync(previewPath)
            ? `/journey/previews/${journey.slug}.jpg`
            : null,
      };
    });

  return (
    <main className="relative flex min-h-dvh flex-col bg-background text-primary xl:grid xl:grid-cols-[42%_58%]">
      <section className="h-16 shrink-0 px-4 xl:h-auto">
        <TopBar />
      </section>
      <JourneyIndex
        entries={journeys}
        lang={lang}
        labels={dictionary.journey}
      />
    </main>
  );
}
