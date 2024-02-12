import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allProjects, Project } from "contentlayer/generated";
import TopBar from "@/layouts/TopBar";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project | Vittorio D'Alfonso",
  description: "All my Work for clients.",
};

function WorkCard(work: Project) {
  return (
    <Link href={work.url} className="flex cursor-pointer flex-col gap-3">
      <Image src={work.cover} alt={work.title} width={1000} height={1000} />
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

export default function Work() {
  const projects = allProjects.sort((a: Project, b: Project) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col gap-3 pt-3 selection:bg-orange-400/30 selection:text-orange-600 md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="text-pretty font-sans text-sm">
          Ventures are projects founded by yours truly, or in collaboration with
          other great minds. They provoke change, make life more joyful, and aim
          to reduce day-to-day problems.
        </p>
        <p className=" text-pretty font-sans text-sm text-black/40 dark:text-white/40 ">
          if you want to collaborate with me, feel free to reach out
          <span className="cursor-pointer underline">
            {" "}
            <Link href="mailto:v.dalfonso@metrica.dev">
              v.dalfonso@metrica.dev
            </Link>
          </span>
        </p>

        <section className="mt-16 pb-16">
          {projects.map((project: Project, idx: number) => (
            <WorkCard key={idx} {...project} />
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
