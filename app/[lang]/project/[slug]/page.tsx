import { getProject, getProjects } from "@/lib/content";
import { Mdx } from "@/components/mdx-components";
import TopBar from "@/layouts/TopBar";
import { notFound } from "next/navigation";
import { getSiteUrl } from "@/lib/site-url";

import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;

  const project = getProject(lang, slug.replace("%2F", "/"));

  return {
    metadataBase: getSiteUrl(),
    title: `${project ? project.title : slug} | Vittorio D'Alfonso`,
    description: project ? project.description : "project for client",
    applicationName: `${project ? project.title : slug}  | Vittorio D'Alfonso`,
    creator: "Vittorio D'Alfonso",
    publisher: "Vittorio D'Alfonso",
    referrer: "origin-when-cross-origin",
    keywords: [
      "Vittorio D'Alfonso",
      "Portfolio",
      "Developer",
      "Designer",
      project ? project.title : slug,
    ],
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      images: [project ? project.cover : ""],
    },

    twitter: {
      card: "summary_large_image",
      creator: "@vittoIam",
      title: `${project ? project.title : slug}  | Vittorio D'Alfonso`,
      description: project ? project.description : "project for client",
      images: [project ? project.cover : ""],
    },
    category: "Portfolio",
  };
}

export const generateStaticParams = async () =>
  getProjects().map((project) => ({
    lang: project.language,
    slug: project.slug,
  }));

const projectLayout = async ({ params }: Props) => {
  const { slug, lang } = await params;

  const project = getProject(lang, slug.replace("%2F", "/"));
  if (!project) notFound();

  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col pt-20 selection:bg-orange-400/30 selection:text-selected  md:w-[90%] md:pr-[15%] md:pt-16 lg:pl-[23%] lg:pr-[15%] xl:px-[3%] xl:pt-8">
        <Mdx source={project.body} />
      </main>
    </main>
  );
};

export default projectLayout;
