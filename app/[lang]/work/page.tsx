import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { getWorks, type Work } from "@/lib/content";
import TopBar from "@/layouts/TopBar";
import SafeImage from "@/components/SafeImage";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SectionHeader from "@/components/SectionHeader";

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

async function WorkCard(props: Work & { lang: Locale }) {
  const { lang, ...work } = props;
  const dictionary = await getDictionary(lang);
  const renderBadge = () => {
    if (work.comingSoon) {
      return (
        <span className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${work.comingSoonDark
          ? "bg-black/60 text-white"
          : "bg-background/90 text-muted-foreground"
          }`}>
          Coming Soon
        </span>
      );
    }

    if (work.refer) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="absolute right-2 top-2 cursor-help rounded-full bg-blue-500/40 px-3 py-1 text-xs font-medium text-white shadow-sm">
                {dictionary.work.agencyBadge}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{dictionary.work.agencyTooltip} {work.refer}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return null;
  };

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
          {renderBadge()}
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
      <section className="relative">
        <SafeImage
          src={work.cover}
          alt={work.attributes ? work.attributes : work.title}
          about={work.attributes ? work.attributes : work.title}
          width={1000}
          height={1000}
        />
        {renderBadge()}
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
    </Link>
  );
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // sort by date (newest first) and remove duplicates
  const works = getWorks()
    .filter((work) => work.language === lang)
    .sort((a: Work, b: Work) => compareDesc(new Date(a.date), new Date(b.date)))
    .filter(
      (work: Work, idx: number, arr: Work[]) =>
        arr.findIndex((w: Work) => w.title === work.title) === idx,
    );

  return (
    <main className="relative flex min-h-dvh flex-col bg-background text-primary xl:grid xl:grid-cols-[42%_58%]">
      <section className="h-16 shrink-0 px-4 xl:h-auto">
        <TopBar />
      </section>
      <div className="min-w-0 px-4 pb-28 pt-5 md:px-8 md:pt-12 xl:pt-8">
        <SectionHeader title={dictionary.work.title} intro={dictionary.work.main} contact={dictionary.work.sub} />
        <section className="mt-14 flex flex-col gap-6">
          {works.map((work: Work, idx: number) => (
            <WorkCard key={idx} {...work} lang={lang} />
          ))}
        </section>
      </div>
    </main>
  );
}
