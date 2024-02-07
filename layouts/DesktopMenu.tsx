"use client";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useRouter } from "next/navigation";
import { Work, allWorks } from "@/.contentlayer/generated";
import { compareDesc } from "date-fns";

/*
      <nav className=" flex size-full flex-col items-center justify-start gap-2 pt-6 text-sm font-light text-gray-400 ">
        <div
          href={"/work"}
          className="flex w-full cursor-pointer justify-between gap-24 pl-4 pr-4 hover:text-black dark:hover:text-white"
        >
          <p className="">Work</p>
          <p>4 projects</p>
        </div>

        <div
          href={"/ventures"}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>Ventures</p>
          <p>3 ideas</p>
        </div>
        <div
          href={"/timeline"}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>Timeline</p>
          <p>23 entries</p>
        </div>
        <div
          href={"/about"}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>About</p>
          <p>20 years</p>
        </div>
        <div
          href={"/resources"}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>Resources</p>
          <p>9 entries</p>
        </div>

        <div className="mb-4 mt-4 w-full pl-4 pr-4">
          <Separator />
        </div>

        <div
          href={"/colophon"}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>Colophon</p>
          <p>5 topics</p>
        </div>

        <div
          href={"/imprint"}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>Imprint</p>
        </div>
      </nav>
*/
export default function DesktopMenu() {
  const router = useRouter();
  const works = allWorks.sort((a: Work, b: Work) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );
  return (
    <section className="md:fixed" suppressHydrationWarning>
      <Accordion
        type="single"
        collapsible
        className="flex size-full flex-col items-center justify-start gap-2 pt-6 text-sm font-light text-gray-400"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div
              id="work"
              onClick={() => router.push("/work")}
              className="flex w-full cursor-pointer justify-between gap-24 pl-4 pr-4 hover:text-black dark:hover:text-white"
            >
              <p className="">Work</p>
              <p>4 projects</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {works.map((work: Work, idx: number) => (
              <p
                id={work._id}
                onClick={() => router.push(work.url)}
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
              id="ventures"
              onClick={() => router.push("/ventures")}
              className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
            >
              <p>Ventures</p>
              <p>3 ideas</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div
              id="timeline"
              onClick={() => router.push("/timeline")}
              className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
            >
              <p>Timeline</p>
              <p>23 entries</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            <div
              id="about"
              onClick={() => router.push("/about")}
              className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
            >
              <p>About</p>
              <p>20 years</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            <div
              id="resources"
              onClick={() => router.push("/resources")}
              className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
            >
              <p>Resources</p>
              <p>9 entries</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <div className="mb-4 mt-4 w-full pl-4 pr-4">
          <Separator />
        </div>

        <AccordionItem value="item-6">
          <AccordionTrigger>
            <div
              id="colophon"
              onClick={() => router.push("/colophon")}
              className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
            >
              <p>Colophon</p>
              <p>5 topics</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <div
          id="imprint"
          onClick={() => router.push("/imprint")}
          className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
        >
          <p>Imprint</p>
        </div>
      </Accordion>
    </section>
  );
}
