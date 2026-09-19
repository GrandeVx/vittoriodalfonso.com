import TopBar from "@/layouts/TopBar";
import { Locale } from "i18n-config";
import { getDictionary } from "@/get-dictionary";
import PortfolioIntroduction from "@/components/home/PortfolioIntroduction";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

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
      </main>
    </main>
  );
}
