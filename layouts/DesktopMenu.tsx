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

export default function DesktopMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = React.useState<string>("");
  const position = pathname.split("/")[2];

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

  let projects = allProjects.sort((a: Project, b: Project) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  projects = projects.filter(
    (project: Project, idx: number, self: Project[]) => {
      return idx === self.findIndex((t) => t.title === project.title);
    },
  );

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
              onClick={() => router.push("/work")}
              className="flex w-full cursor-pointer justify-between gap-24 px-4 hover:text-black dark:hover:text-white"
            >
              <p className="">Work</p>
              <p>
                {works.length} {works.length > 1 ? "works" : "work"}
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
                  <span className="mr-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-muted-foreground">
                    Coming Soon
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
              onClick={() => router.push("/project")}
              className="flex w-full cursor-pointer justify-between  gap-24 px-4 hover:text-black dark:hover:text-white"
            >
              <p>Projects</p>
              <p>
                {projects.length} {projects.length > 1 ? "projects" : "project"}
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
                  <span className="mr-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-muted-foreground">
                    Coming Soon
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
              onClick={() => router.push("/about")}
              className="flex w-full cursor-pointer justify-between  gap-24 px-4 hover:text-black dark:hover:text-white"
            >
              <p>About</p>
              <p>
                {differenceInYears(new Date(), new Date(2003, 6, 22))} years
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              key={1}
              href="/CV.pdf"
              download="Vittorio_DAlfonso_CV.pdf"
              className="cursor-pointer hover:text-black dark:hover:text-white"
            >
              Curriculum Vitae
            </Link>
            <Link
              key={2}
              href="https://twitter.com/vittoIam" // https://github.com/
              className="cursor-pointer hover:text-blue-400 dark:hover:text-blue-400"
            >
              Twitter
            </Link>

            <Link
              key={3}
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
          onClick={() => router.push("/colophon")}
          className="flex w-full cursor-pointer justify-between  gap-24 px-4 hover:text-black dark:hover:text-white"
        >
          <p>Colophon</p>
          <p>3 topics</p>
        </div>
      </Accordion>
    </section>
  );
}
