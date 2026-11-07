import TopBar from "@/layouts/TopBar";
import { Metadata } from "next";
import main from "@/public/assets/about/main.webp";
import main2 from "@/public/assets/about/main2.webp";
import Link from "next/link";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import PortraitReveal from "@/components/about/PortraitReveal";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About | Vittorio D'Alfonso",
  description: "Everything you need to know about me... and more!",
  openGraph: {
    images: "/assets/utils/about.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "About | Vittorio D'Alfonso",
    description: "Everything you need to know about me... and more!",
    images: ["/assets/utils/about.webp"],
  },
};

export default async function About({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <main className="relative flex min-h-dvh flex-col bg-background text-primary xl:grid xl:grid-cols-[42%_58%]">
      <section className="h-16 shrink-0 px-4 xl:h-auto">
        <TopBar />
      </section>
      <div className="min-w-0 px-4 pb-28 pt-5 md:px-8 md:pt-12 xl:pt-8">
        <SectionHeader title={dictionary.about.title} intro={dictionary.about.headerIntro} contact={dictionary.about.headerContact} />
        <div className="mt-14 flex w-full gap-4">
          <PortraitReveal
            src={main2}
            priority
            description={
              lang === "it"
                ? "Vittorio D'Alfonso all'aperto"
                : "Vittorio D'Alfonso outdoors"
            }
            revealLabel={lang === "it" ? "Foto a colori" : "Color photo"}
          />
          <PortraitReveal
            src={main}
            description={
              lang === "it"
                ? "Vittorio D'Alfonso davanti allo specchio"
                : "Vittorio D'Alfonso in a mirror"
            }
            revealLabel={lang === "it" ? "Foto a colori" : "Color photo"}
          />
        </div>

        <p className="mt-8 text-pretty text-base leading-[1.55]">
          {dictionary.about.intro[0]}{" "}
          <Link className="underline underline-offset-4" href="https://corsi.unisa.it/Informatica">
            {dictionary.about.intro[1]}
          </Link>
          {dictionary.about.intro[2]}
        </p>

        <p className="mt-6 text-pretty text-base leading-[1.55]">
          {dictionary.about.digitalCreative}
        </p>

        <p className="mt-6 text-pretty text-base leading-[1.55]">
          {dictionary.about.challenges}
        </p>

        <p className="mt-6 text-pretty text-base leading-[1.55]">
          {dictionary.about.journey}
        </p>

        <div className="flex items-center gap-4 pb-16 pt-6">
          <a
            href="https://instagram.com/vittodalfo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-black dark:hover:text-white"
          >
            Instagram
          </a>
          <a
            href="https://twitter.com/vittoIam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-black dark:hover:text-white"
          >
            X
          </a>
          <a
            href="https://github.com/GrandeVx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-black dark:hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
