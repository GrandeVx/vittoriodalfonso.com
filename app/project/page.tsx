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
          This section serves as a showcase for the projects I've crafted over
          the years, underscoring my dedication to hands-on learning and the
          development of practical, functional solutions that resonate in
          various domains of application.
        </p>
        <p className="text-pretty font-sans text-sm  text-black/40 dark:text-white/40">
          For any inquiries regarding these projects or if you are interested in
          potential collaboration, feel free to reach out to me at{" "}
          <Link
            href="mailto:v.dalfonso@metrica.dev"
            className="cursor-pointer underline"
          >
            v.dalfonso@metrica.dev
          </Link>
        </p>

        <section className="mt-8 flex flex-col gap-6 pb-16">
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
