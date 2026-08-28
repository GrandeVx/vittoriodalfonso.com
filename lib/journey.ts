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
