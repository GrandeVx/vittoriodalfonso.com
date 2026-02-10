"use client";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useRouter, usePathname } from "next/navigation";
import {
  Work,
  allWorks,
  Project,
  allProjects,
} from "@/.contentlayer/generated";
import { compareDesc, differenceInYears } from "date-fns";
import React, { useEffect } from "react";
import Link from "next/link";
import enDict from "@/dictionaries/en.json";
import itDict from "@/dictionaries/it.json";

export default function DesktopMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = React.useState<string>("");
  const position = pathname.split("/")[2];
  const lang = pathname.split("/")[1]; // Estrae la lingua dal pathname
  const dict = lang === "it" ? itDict : enDict;

  useEffect(() => {
    setValue(() => {
      switch (position) {
        case "work":
          return "item-1";
        case "project":
          return "item-2";
        case "about":
          return "item-3";

        default:
          return "";
      }
    });
  }, [pathname]);

  // sort by date (newest first) and remove duplicates
  const works = [...allWorks]
    .sort((a: Work, b: Work) => compareDesc(new Date(a.date), new Date(b.date)))
    .filter(
      (work: Work, idx: number, arr: Work[]) =>
        arr.findIndex((w: Work) => w.title === work.title) === idx,
    );

  // Genera URL corretti basati sulla lingua corrente
  works.forEach((work: Work) => {
    const filename = work._raw.flattenedPath.split('/').pop();
    work.url = `${lang}/work/${filename}`;
  });

  const projects = [...allProjects]
    .sort((a: Project, b: Project) => compareDesc(new Date(a.date), new Date(b.date)))
    .filter(
      (project: Project, idx: number, self: Project[]) =>
        idx === self.findIndex((t) => t.title === project.title),
    );

  // Genera URL corretti per i progetti basati sulla lingua corrente
  projects.forEach((project: Project) => {
    const filename = project._raw.flattenedPath.split('/').pop();
    project.url = `${lang}/project/${filename}`;
  });

  return (
    <section
      className="md:fixed md:w-2/5 md:px-4 lg:w-[30%] xl:w-1/5"
      suppressHydrationWarning
    >
      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
        className="flex size-full flex-col items-center justify-start gap-2 pt-6 text-sm font-light text-muted"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div
              id="work"
              onClick={() => router.push(`/${lang}/work`)}
              className="flex w-full cursor-pointer justify-between gap-24 px-4 hover:text-black dark:hover:text-white"
            >
              <p className="">{dict.menu.work}</p>
              <p>
                {works.length} {works.length > 1 ? dict.menu.works : dict.menu.workSingular}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {works.map((work: Work, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between"
              >
                <p
                  id={work._id}
                  onClick={() => {
                    if (!work.comingSoon) {
                      router.push("/" + work.url);
                    }
                  }}
                  className={`${work.comingSoon
                    ? "cursor-not-allowed text-muted"
                    : "cursor-pointer hover:text-black dark:hover:text-white"
                    }`}
                >
                  {work.title}
                </p>
                {work.comingSoon && (
                  <span className={`mr-2 rounded-full px-2 py-0.5 text-xs ${
                    work.comingSoonDark
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-muted-foreground"
                  }`}>
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
              className="flex w-full cursor-pointer justify-between  gap-24 px-4 hover:text-black dark:hover:text-white"
            >
              <p>{dict.menu.projects}</p>
              <p>
                {projects.length} {projects.length > 1 ? dict.menu.projectsPlural : dict.menu.projectSingular}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {projects.map((project: Project, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between"
              >
                <p
                  id={project._id}
                  onClick={() => {
                    if (!project.comingSoon) {
                      router.push(
                        project.redirect ? project.redirect : "/" + project.url,
                      );
                    }
                  }}
                  className={`${project.comingSoon
                    ? "cursor-not-allowed text-muted"
                    : "cursor-pointer hover:text-black dark:hover:text-white"
                    }`}
                >
                  {project.title}
                </p>
                {project.comingSoon && (
                  <span className={`mr-2 rounded-full px-2 py-0.5 text-xs ${
                    project.comingSoonDark
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-muted-foreground"
                  }`}>
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
              id="about"
              onClick={() => router.push(`/${lang}/about`)}
              className="flex w-full cursor-pointer justify-between  gap-24 px-4 hover:text-black dark:hover:text-white"
            >
              <p>{dict.menu.about}</p>
              <p>
                {differenceInYears(new Date(), new Date(2003, 6, 22))} {dict.menu.years}
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
          className="flex w-full cursor-pointer justify-between  gap-24 px-4 hover:text-black dark:hover:text-white"
        >
          <p>{dict.menu.colophon}</p>
          <p>3 {dict.menu.topics}</p>
        </div>
      </Accordion>
    </section>
  );
}
