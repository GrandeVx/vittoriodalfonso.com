import { getJourney, type Journey } from "@/lib/content";

export type JourneyKind = "paper" | "note" | "experiment" | "article";

export type JourneyParams = {
  lang: string;
  slug: string;
};

export function getJourneySlug(journey: Journey) {
  return journey.slug;
}

export function findJourney({ lang, slug }: JourneyParams) {
  return getJourney(lang, slug);
}

export function getJourneyPath({ lang, slug }: JourneyParams) {
  return `/${lang}/journey/${slug}`;
}

export function getJourneyAnalysis(body: string) {
  const notesHeadings = ["## Appunti di lettura", "## Reading notes"];
  const notesIndex = notesHeadings.reduce((firstMatch, heading) => {
    const index = body.indexOf(`\n${heading}`);

    if (index < 0) return firstMatch;
    return firstMatch < 0 ? index : Math.min(firstMatch, index);
  }, -1);

  return (notesIndex < 0 ? body : body.slice(0, notesIndex)).trim();
}
