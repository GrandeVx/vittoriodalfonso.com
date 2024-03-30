import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import TopBar from "@/layouts/TopBar";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colophon | Vittorio D'Alfonso",
  description: "All about the tech stack and design choices.",
  openGraph: {
    images: "/assets/utils/colophon.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "Colophon | Vittorio D'Alfonso",
    description: "All about the tech stack and design choices.",
    images: ["/assets/utils/colophon.webp"],
  },
};

export default async function Colpohon({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pb-20 pt-6 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="text-pretty font-sans text-sm">
          Everything about this website.
        </p>
        <p className="text-sm text-muted">Last updated Feb 19, 2024</p>

        <section className="mt-10 flex flex-col gap-1 text-pretty md:mt-20">
          <p className="text-sm text-muted">Technical</p>
          <p className="text-sm">
            {dictionary.colophon.techincal[0]}{" "}
            <Link href={"https://nextjs.org/"} className="underline">
              Next-js
            </Link>
            ,{" "}
            <Link href={"https://contentlayer.dev/"} className="underline">
              Contentlayer
            </Link>
            , {dictionary.colophon.techincal[1]}{" "}
            <Link href={"https://tailwindcss.com/"} className="underline">
              Tailwind
            </Link>
            .
          </p>
          <p className="text-sm">
            {dictionary.colophon.techincal[2]}{" "}
            <Link href={"https://vercel.com/"} className="underline">
              Vercel
            </Link>
            {dictionary.colophon.techincal[3]}{" "}
            <Link
              href={"https://github.com/GrandeVx/vittoriodalfonso.com"}
              className="underline"
            >
              Github
            </Link>
          </p>
        </section>

        <section className="mt-10 flex flex-col gap-1 text-pretty md:mt-20">
          <p className="text-sm text-muted">Photography</p>
          <p className=" text-sm">{dictionary.colophon.Photography}</p>
        </section>

        <section className="mt-10 flex flex-col gap-2 text-pretty md:mt-20">
          <p className="text-sm text-[rgb(98,98,98)]">Inspiration</p>
          <p className="text-pretty text-sm">
            {dictionary.colophon.Inspiration[0]}{" "}
            <Link href={"https://linusrogge.com/"} className="underline">
              Linus Rogge
            </Link>
            {dictionary.colophon.Inspiration[1]}
          </p>
          <p className="text-sm">{dictionary.colophon.Inspiration[2]}</p>
        </section>
      </main>
    </main>
  );
}
