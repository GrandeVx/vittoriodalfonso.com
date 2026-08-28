import TopBar from "@/layouts/TopBar";
import { Metadata } from "next";
import main from "@/public/assets/about/main.webp";
import main2 from "@/public/assets/about/main2.webp";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

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
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pt-8 selection:bg-orange-400/30 selection:text-selected md:mt-8 md:w-[90%] md:pr-[15%] md:pt-8 lg:mt-0 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="text-pretty text-start font-sans text-sm">
          {dictionary.about.intro[0]}{" "}
          <Link
            className="underline"
            href={"https://corsi.unisa.it/Informatica"}
          >
            {dictionary.about.intro[1]}
          </Link>
          {dictionary.about.intro[2]}
        </p>

        <div className="mt-6 flex w-full flex-row gap-4 pr-2 md:flex-col lg:flex-row">
          <Image
            src={main2}
            alt="Vittorio D'Alfonso"
            className="h-fit w-1/2 md:w-full lg:w-1/2"
          />
          <Image
            src={main}
            alt="Vittorio D'Alfonso"
            className="h-full w-1/2 object-fill md:size-full lg:w-1/2"
          />
        </div>

        <p className="mt-6 text-pretty text-start font-sans text-sm">
          {dictionary.about.digitalCreative}
        </p>

        <p className="text-pretty text-start font-sans text-sm">
          {dictionary.about.challenges}
        </p>

        <p className="text-pretty text-start font-sans text-sm">
          {dictionary.about.journey}
        </p>

        <div className="flex items-center gap-4 pb-16 pt-6">
          <a
            href="mailto:v.dalfonso@metrica.dev"
            className="text-sm underline hover:text-black dark:hover:text-white"
          >
            {dictionary.about.contactMe}
          </a>
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
      </main>
    </main>
  );
}
