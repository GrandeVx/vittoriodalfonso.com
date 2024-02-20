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
import { compareDesc } from "date-fns";
import React, { useEffect } from "react";
import Link from "next/link";

export default function DesktopMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = React.useState<string>("");
  const position = pathname.split("/")[1];

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

  const works = allWorks.sort((a: Work, b: Work) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  const projects = allProjects.sort((a: Project, b: Project) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  return (
    <section
      className="md:fixed md:w-[40%] md:px-4 lg:w-[30%] xl:w-[20%]"
      suppressHydrationWarning
    >
      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
        className="flex size-full flex-col items-center justify-start gap-2 pt-6 text-sm font-light text-[rgb(98,98,98)]"
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
              <p
                id={work._id}
                key={idx}
                onClick={() => {
                  router.push("/" + work.url);
                }}
                className="cursor-pointer hover:text-black dark:hover:text-white"
              >
                {work.title}
              </p>
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
              <p
                id={project._id}
                key={idx}
                onClick={() => {
                  router.push("/" + project.url);
                }}
                className="cursor-pointer hover:text-black dark:hover:text-white"
              >
                {project.title}
              </p>
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
              <p>{new Date().getFullYear() - 2003} years</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              key={1}
              href="/CV.pdf"
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
