import Link from "next/link";
import { format, parseISO } from "date-fns";
import { allWorks, Work } from "contentlayer/generated";
import TopBar from "@/layouts/TopBar";
import SafeImage from "@/components/SafeImage";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export const metadata: Metadata = {
  title: "Work | Vittorio D'Alfonso",
  description:
    'Discover my portfolio of client-centric projects on the "/work" page. From initial concepts to final execution',
  openGraph: {
    images: "/assets/utils/work.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "Work | Vittorio D'Alfonso",
    description:
      'Discover my portfolio of client-centric projects on the "/work" page. From initial concepts to final execution',
    images: ["/assets/utils/work.webp"],
  },
};

function WorkCard(work: Work) {
  if (work.comingSoon) {
    return (
      <div className="flex cursor-not-allowed flex-col gap-3">
        <section className="relative">
          <SafeImage
            src={work.cover}
            alt={work.attributes ? work.attributes : work.title}
            about={work.attributes ? work.attributes : work.title}
            width={1000}
            height={1000}
          />
          <span className="bg-background/90 absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            Coming Soon
          </span>
        </section>
        <section className="flex w-full items-center justify-between">
          <p className="mb-1 text-sm">{work.title}</p>
          <time
            dateTime={work.date}
            className="mb-2 block text-sm text-gray-400/70"
          >
            {format(parseISO(work.date), "yyyy")}
          </time>
        </section>
      </div>
    );
  }

  return (
    <Link
      href={work.redirect ? work.redirect : work.url}
      className="flex cursor-pointer flex-col gap-3"
    >
      <SafeImage
        src={work.cover}
        alt={work.attributes ? work.attributes : work.title}
        about={work.attributes ? work.attributes : work.title}
        width={1000}
        height={1000}
      />
      <section className="flex w-full items-center justify-between">
        <p className="mb-1 text-sm">{work.title}</p>
        <time
          dateTime={work.date}
          className="mb-2 block text-sm text-gray-400/70"
        >
          {format(parseISO(work.date), "yyyy")}
        </time>
      </section>
    </Link>
  );
}

export default async function WorkPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  // remove duplicates
  const works = allWorks.filter(
    (work: Work, idx: number, arr: Work[]) =>
      arr.findIndex((w: Work) => w.title === work.title) === idx,
  );

  // remove /lang from url
  works.forEach((work: Work) => {
    work.url = work.url.replace("/en", "");
    work.url = work.url.replace("/it", "");
  });
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col gap-3 pt-3 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-16 lg:pl-[23%] lg:pr-[15%] xl:px-[12%] xl:pt-6">
        <p className="text-pretty font-sans text-sm">{dictionary.work.main} </p>
        <p className="text-pretty font-sans text-sm  text-black/40 dark:text-white/40">
          {dictionary.work.sub}{" "}
          <Link
            href="mailto:v.dalfonso@metrica.dev"
            className="cursor-pointer underline"
          >
            v.dalfonso@metrica.dev
          </Link>
        </p>

        <section className="mt-8 flex flex-col gap-6 pb-16">
          {works.map((work: Work, idx: number) => (
            <WorkCard key={idx} {...work} />
          ))}
        </section>
      </main>
    </main>
  );
  {
    /*
        <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">Next.js + Contentlayer Example</h1>
      {works.map((work : any, idx : any) => (
        <WorkCard key={idx} {...work} />
      ))}
    </div>
      */
  }
}
