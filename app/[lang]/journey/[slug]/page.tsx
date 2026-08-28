import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJourneys } from "@/lib/content";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { findJourney, getJourneyPath, type JourneyParams } from "@/lib/journey";
import PaperReader from "@/components/journey/PaperReaderClient";
import type { ResearchAnnotation } from "@/components/journey/PaperReader";
import { Mdx } from "@/components/mdx-components";
import TopBar from "@/layouts/TopBar";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<JourneyParams> };

async function getAnnotations(
  annotationPath: string,
): Promise<ResearchAnnotation[]> {
  const publicDirectory = path.resolve(process.cwd(), "public");
  const filePath = path.resolve(publicDirectory, `.${annotationPath}`);

  if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
    return [];
  }

  try {
    const contents = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(contents);

    if (Array.isArray(parsed)) {
      return parsed as ResearchAnnotation[];
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "annotations" in parsed &&
      Array.isArray(parsed.annotations)
    ) {
      return parsed.annotations as ResearchAnnotation[];
    }
  } catch {
    // Annotations are optional at render time so an incomplete import does not hide the paper.
  }

  return [];
}

export function generateStaticParams() {
  return getJourneys().map((journey) => ({
    lang: journey.language,
    slug: journey.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const journey = findJourney(resolvedParams);

  if (!journey) {
    return {};
  }

  const path = getJourneyPath(resolvedParams);
  const image = new URL(`${path}/opengraph-image`, getSiteUrl()).toString();
  const alternatePaths = {
    it: getJourneyPath({ lang: "it", slug: resolvedParams.slug }),
    en: getJourneyPath({ lang: "en", slug: resolvedParams.slug }),
  };

  return {
    title: `${journey.title} | The Journey`,
    description: journey.description,
    alternates: {
      canonical: path,
      languages: alternatePaths,
    },
    openGraph: {
      type: "article",
      url: path,
      title: journey.title,
      description: journey.description,
      siteName: "Vittorio D'Alfonso",
      locale: resolvedParams.lang === "it" ? "it_IT" : "en_US",
      publishedTime: journey.date,
      authors: ["Vittorio D'Alfonso"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${journey.title} — The Journey`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@vittoIam",
      title: journey.title,
      description: journey.description,
      images: [image],
    },
  };
}

export default async function JourneyPaperPage({ params }: Props) {
  const resolvedParams = await params;
  const journey = findJourney(resolvedParams);

  if (!journey) {
    notFound();
  }

  if (journey.kind !== "paper") {
    return (
      <main className="flex min-h-screen flex-col items-center gap-16 bg-background text-primary md:gap-0 xl:flex-row">
        <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-1/2">
          <TopBar />
        </section>
        <main className="flex min-h-screen w-[92%] flex-col pt-20 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-16 lg:pl-[23%] lg:pr-[15%] xl:px-[8%] xl:pt-12">
          <header className="mb-10 border-b border-border pb-8">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
              The Journey · {journey.kind}
            </p>
            <h1 className="mt-5 text-balance text-4xl leading-tight tracking-[-0.04em]">
              {journey.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-muted">
              {journey.description}
            </p>
            <time dateTime={journey.date} className="mt-5 block text-xs text-muted">
              {journey.date}
            </time>
          </header>
          <Mdx source={journey.body} />
        </main>
      </main>
    );
  }

  if (!journey.pdf) {
    notFound();
  }

  const [annotations, dictionary] = await Promise.all([
    journey.annotations ? getAnnotations(journey.annotations) : [],
    getDictionary(resolvedParams.lang as Locale),
  ]);

  return (
    <main className="journey-reader-page min-h-screen bg-background text-primary">
      <PaperReader
        title={journey.title}
        pdfUrl={journey.pdf}
        annotations={annotations}
        backHref={`/${resolvedParams.lang}/journey`}
        labels={{
          back: dictionary.journey.back,
          notes: dictionary.journey.notes,
          analysis: dictionary.journey.analysis,
          openAnalysis: dictionary.journey.openAnalysis,
          closeAnalysis: dictionary.journey.closeAnalysis,
          resizeAnalysis: dictionary.journey.resizeAnalysis,
          page: dictionary.journey.page,
          loadError: dictionary.journey.loadError,
          source: dictionary.journey.source,
        }}
        analysis={
          <section aria-label={dictionary.journey.analysis} className="prose">
            <h2>{dictionary.journey.whyItMatters}</h2>
            <p>{journey.abstract ?? journey.description}</p>
          </section>
        }
        year={journey.paperYear}
        sourceUrl={journey.sourceUrl || undefined}
      />
    </main>
  );
}
