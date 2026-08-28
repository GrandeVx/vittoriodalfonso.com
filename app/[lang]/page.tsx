import TopBar from "@/layouts/TopBar";
import { Locale } from "i18n-config";
import { getDictionary } from "@/get-dictionary";
import { getJourneys } from "@/lib/content";
import PortfolioIntroduction from "@/components/home/PortfolioIntroduction";
import RecommendationCard from "@/components/home/RecommendationCard";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const journeys = getJourneys().filter(
    (journey) => journey.language === lang,
  );
  const startingJourney =
    journeys.find((journey) => journey.order === 1) ?? journeys[0];

  return (
    <main className="flex min-h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row xl:items-start">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pb-16 pt-8 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-16 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <PortfolioIntroduction
          lang={lang}
          copy={dictionary.home}
          labels={{
            work: dictionary.menu.work,
            projects: dictionary.menu.projects,
            journey: dictionary.menu.journey,
            about: dictionary.menu.about,
          }}
        />

        {startingJourney ? (
          <RecommendationCard
            title={dictionary.home.recommendation.title}
            exploreLabel={dictionary.home.recommendation.explore}
            alternativesLabel={dictionary.home.recommendation.alternatives}
            otherOptionsLabel={dictionary.home.recommendation.otherOptions}
            openLabel={dictionary.home.recommendation.open}
            closeLabel={dictionary.home.recommendation.close}
            options={[
              {
                key: "journey",
                href: startingJourney.url,
                eyebrow: dictionary.home.journey.eyebrow,
                title: dictionary.menu.journey,
                description: `${dictionary.home.journey.startWith} “${startingJourney.title}”. ${dictionary.home.journey.description}`,
                signal: 3,
                icon: "journey",
              },
              {
                key: "work",
                href: `/${lang}/work`,
                eyebrow: dictionary.home.recommendation.options[0].eyebrow,
                title: dictionary.menu.work,
                description:
                  dictionary.home.recommendation.options[0].description,
                signal: 2,
                icon: "work",
              },
              {
                key: "projects",
                href: `/${lang}/project`,
                eyebrow: dictionary.home.recommendation.options[1].eyebrow,
                title: dictionary.menu.projects,
                description:
                  dictionary.home.recommendation.options[1].description,
                signal: 2,
                icon: "projects",
              },
              {
                key: "about",
                href: `/${lang}/about`,
                eyebrow: dictionary.home.recommendation.options[2].eyebrow,
                title: dictionary.menu.about,
                description:
                  dictionary.home.recommendation.options[2].description,
                signal: 1,
                icon: "about",
              },
            ]}
          />
        ) : null}
      </main>
    </main>
  );
}
