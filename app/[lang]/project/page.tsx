import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allProjects, Project } from "contentlayer/generated";
import TopBar from "@/layouts/TopBar";
import Image from "next/image";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export const metadata: Metadata = {
  title: "Project | Vittorio D'Alfonso",
  description: "All my Personal Projects...",
  openGraph: {
    images: "/assets/utils/project.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "Project | Vittorio D'Alfonso",
    description: "All my Personal Projects...",
    images: ["/assets/utils/project.webp"],
  },
};

function ProjectCard(project: Project) {
  return (
    <Link
      href={project.redirect ? project.redirect : project.url}
      className="flex cursor-pointer flex-col gap-3"
    >
      <section className="relative">
        <Image
          src={project.cover}
          alt={project.attributes ? project.attributes : project.title}
          about={project.attributes ? project.attributes : project.title}
          width={1000}
          height={1000}
        />
      </section>
      <section className="flex w-full items-center justify-between">
        <p className="mb-1 text-sm">{project.title}</p>
        <time
          dateTime={project.date}
          className="mb-2 block text-sm text-gray-400/70"
        >
          {format(parseISO(project.date), "yyyy")}
        </time>
      </section>
    </Link>
  );
}

export default async function project({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  let projects = allProjects.sort((a: Project, b: Project) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  projects = projects.filter(
    (project: Project, idx: number, self: Project[]) => {
      return idx === self.findIndex((t) => t.title === project.title);
    },
  );

  projects.forEach((project: Project) => {
    project.url = project.url.replace("/en", "");
    project.url = project.url.replace("/it", "");
  });

  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col gap-3 pt-3 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="text-pretty font-sans text-sm">
          {dictionary.project.main}
        </p>
        <p className="text-pretty font-sans text-sm  text-black/40 dark:text-white/40">
          {dictionary.project.sub}{" "}
          <Link
            href="mailto:v.dalfonso@metrica.dev"
            className="cursor-pointer underline"
          >
            v.dalfonso@metrica.dev
          </Link>
        </p>

        <section className="mt-8 flex flex-col gap-6 pb-16">
          {projects.map((project: Project, idx: number) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </section>
      </main>
    </main>
  );
  {
    /*
        <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">Next.js + Contentlayer Example</h1>
      {projects.map((project : any, idx : any) => (
        <projectCard key={idx} {...project} />
      ))}
    </div>
      */
  }
}
