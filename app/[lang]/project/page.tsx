import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { getProjects, type Project } from "@/lib/content";
import TopBar from "@/layouts/TopBar";
import SafeImage from "@/components/SafeImage";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import SectionHeader from "@/components/SectionHeader";

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
  if (project.comingSoon) {
    return (
      <div className="flex cursor-not-allowed flex-col gap-3 ">
        <section className="relative">
          <SafeImage
            src={project.cover}
            alt={project.attributes ? project.attributes : project.title}
            about={project.attributes ? project.attributes : project.title}
            width={1000}
            height={1000}
          />
          <span
            className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
              project.comingSoonDark
                ? "bg-black/60 text-white"
                : "bg-background/90 text-muted-foreground"
            }`}
          >
            Coming Soon
          </span>
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
      </div>
    );
  }

  return (
    <Link
      href={project.redirect ? project.redirect : project.url}
      className="flex cursor-pointer flex-col gap-3"
    >
      <section className="relative">
        <SafeImage
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
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  let projects = getProjects()
    .filter((project) => project.language === lang)
    .sort((a: Project, b: Project) =>
      compareDesc(new Date(a.date), new Date(b.date)),
    );

  projects = projects.filter(
    (project: Project, idx: number, self: Project[]) => {
      return idx === self.findIndex((t) => t.title === project.title);
    },
  );

  return (
    <main className="relative flex min-h-dvh flex-col bg-background text-primary xl:grid xl:grid-cols-[42%_58%]">
      <section className="h-16 shrink-0 px-4 xl:h-auto">
        <TopBar />
      </section>
      <div className="min-w-0 px-4 pb-28 pt-5 md:px-8 md:pt-12 xl:pt-8">
        <SectionHeader title={dictionary.project.title} intro={dictionary.project.main} contact={dictionary.project.sub} />
        <section className="mt-14 flex flex-col gap-6">
          {projects.map((project: Project, idx: number) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </section>
      </div>
    </main>
  );
}
