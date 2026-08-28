"use client";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useRouter, usePathname } from "next/navigation";
import { compareDesc, differenceInYears } from "date-fns";
import Link from "next/link";
import enDict from "@/dictionaries/en.json";
import itDict from "@/dictionaries/it.json";

export type MenuPortfolioItem = {
  _id: string;
  title: string;
  date: string;
  url: string;
  redirect?: string;
  comingSoon: boolean;
  comingSoonDark: boolean;
};

export type MenuJourneyItem = {
  _id: string;
  title: string;
  date: string;
  order: number;
  url: string;
};

export type DesktopMenuProps = {
  works: MenuPortfolioItem[];
  projects: MenuPortfolioItem[];
  journeys: MenuJourneyItem[];
};

function accordionItemFor(position: string | undefined) {
  switch (position) {
    case "work":
      return "item-1";
    case "project":
      return "item-2";
    case "journey":
      return "item-3";
    case "about":
      return "item-4";
    default:
      return "";
  }
}

export default function DesktopMenu({
  works: workItems,
  projects: projectItems,
  journeys: journeyItems,
}: DesktopMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const position = pathname.split("/")[2];
  const lang = pathname.split("/")[1]; // Estrae la lingua dal pathname
  const dict = lang === "it" ? itDict : enDict;

  // sort by date (newest first) and remove duplicates
  const works = [...workItems]
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .filter(
      (work, idx, arr) =>
        arr.findIndex((candidate) => candidate.title === work.title) === idx,
    );

  const projects = [...projectItems]
    .sort((a, b) =>
      compareDesc(new Date(a.date), new Date(b.date)),
    )
    .filter(
      (project, idx, items) =>
        idx === items.findIndex((candidate) => candidate.title === project.title),
    );

  const journeys = [...journeyItems]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.order - a.order,
    );

  return (
    <section
      className="size-full overflow-x-hidden px-4"
      suppressHydrationWarning
    >
      <Accordion
        key={position}
        type="single"
        collapsible
        defaultValue={accordionItemFor(position)}
        className="flex size-full flex-col items-center justify-start gap-2 pt-6 text-sm font-light text-muted"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div
              id="work"
              onClick={() => router.push(`/${lang}/work`)}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-5 px-4 text-left hover:text-black dark:hover:text-white"
            >
              <p className="">{dict.menu.work}</p>
              <p className="whitespace-nowrap text-right">
                {works.length}{" "}
                {works.length > 1 ? dict.menu.works : dict.menu.workSingular}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="min-w-0 pr-4">
            {works.map((work, idx) => (
              <div
                key={idx}
                className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2"
              >
                <p
                  id={work._id}
                  title={work.title}
                  onClick={() => {
                    if (!work.comingSoon) {
                      router.push(work.url);
                    }
                  }}
                  className={`truncate ${
                    work.comingSoon
                      ? "cursor-not-allowed text-muted"
                      : "cursor-pointer hover:text-black dark:hover:text-white"
                  }`}
                >
                  {work.title}
                </p>
                {work.comingSoon && (
                  <span
                    className={`mr-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      work.comingSoonDark
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-muted-foreground"
                    }`}
                  >
                    {dict.menu.comingSoon}
                  </span>
                )}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div
              id="projects"
              onClick={() => router.push(`/${lang}/project`)}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-5 px-4 text-left hover:text-black dark:hover:text-white"
            >
              <p>{dict.menu.projects}</p>
              <p className="whitespace-nowrap text-right">
                {projects.length}{" "}
                {projects.length > 1
                  ? dict.menu.projectsPlural
                  : dict.menu.projectSingular}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="min-w-0 pr-4">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2"
              >
                <p
                  id={project._id}
                  title={project.title}
                  onClick={() => {
                    if (!project.comingSoon) {
                      router.push(
                        project.redirect ? project.redirect : project.url,
                      );
                    }
                  }}
                  className={`truncate ${
                    project.comingSoon
                      ? "cursor-not-allowed text-muted"
                      : "cursor-pointer hover:text-black dark:hover:text-white"
                  }`}
                >
                  {project.title}
                </p>
                {project.comingSoon && (
                  <span
                    className={`mr-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      project.comingSoonDark
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-muted-foreground"
                    }`}
                  >
                    {dict.menu.comingSoon}
                  </span>
                )}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div
              id="journey"
              onClick={() => router.push(`/${lang}/journey`)}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-5 px-4 text-left hover:text-black dark:hover:text-white"
            >
              <p>{dict.menu.journey}</p>
              <p className="whitespace-nowrap text-right">
                {journeys.length}{" "}
                {journeys.length === 1 ? dict.menu.paper : dict.menu.papers}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="min-w-0 pr-4">
            {journeys.map((journey) => {
              return (
                <button
                  key={journey._id}
                  type="button"
                  onClick={() => router.push(journey.url)}
                  aria-label={journey.title}
                  className="block w-full min-w-0 cursor-pointer truncate text-left hover:text-black dark:hover:text-white"
                  title={journey.title}
                >
                  {journey.title}
                </button>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            <div
              id="about"
              onClick={() => router.push(`/${lang}/about`)}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-5 px-4 text-left hover:text-black dark:hover:text-white"
            >
              <p>{dict.menu.about}</p>
              <p className="whitespace-nowrap text-right">
                {differenceInYears(new Date(), new Date(2003, 6, 22))}{" "}
                {dict.menu.years}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <a
              key={1}
              href="/CV.pdf"
              download="Vittorio_DAlfonso_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-black dark:hover:text-white"
            >
              {dict.menu.cv}
            </a>
            <a
              key={2}
              href="https://instagram.com/vittodalfo"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-pink-500 dark:hover:text-pink-400"
            >
              Instagram
            </a>
            <a
              key={3}
              href="mailto:v.dalfonso@metrica.dev"
              className="cursor-pointer hover:text-black dark:hover:text-white"
            >
              {dict.about.contactMe}
            </a>
            <Link
              key={4}
              href="https://twitter.com/vittoIam"
              className="cursor-pointer hover:text-blue-400 dark:hover:text-blue-400"
            >
              Twitter
            </Link>
            <Link
              key={5}
              href="https://github.com/GrandeVx"
              className="cursor-pointer hover:text-black/60 dark:hover:text-white"
            >
              GitHub
            </Link>
          </AccordionContent>
        </AccordionItem>

        <div className="my-4 w-full px-4">
          <Separator />
        </div>

        <div
          id="colophon"
          onClick={() => router.push(`/${lang}/colophon`)}
          className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-5 px-4 text-left hover:text-black dark:hover:text-white"
        >
          <p>{dict.menu.colophon}</p>
          <p className="whitespace-nowrap text-right">3 {dict.menu.topics}</p>
        </div>
      </Accordion>
    </section>
  );
}
