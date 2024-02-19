import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-components";
import TopBar from "@/layouts/TopBar";

import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  /* const project = allProjects.find(
    (project) => project._raw.flattenedPath === "project/" + slug, 
  );*/
  return {
    title: `${slug} | Vittorio D'Alfonso`,
    description: "Work for client",
    applicationName: `${slug} | Vittorio D'Alfonso`,
    creator: "Vittorio D'Alfonso",
    publisher: "Vittorio D'Alfonso",
    referrer: "origin-when-cross-origin",
    keywords: [
      "Vittorio D'Alfonso",
      "Portfolio",
      "Developer",
      "Designer",
      // project!.title,
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

    twitter: {
      card: "summary_large_image",
      creator: "@vittoIam",
      title: `${slug} | Vittorio D'Alfonso`,
      description: "All my projects, work and thoughts in one place.",
    },
    category: "Portfolio",
  };
}

export const generateStaticParams = async () =>
  allProjects.map((project) => ({ slug: project._raw.flattenedPath }));

const projectLayout = ({ params }: { params: { slug: string } }) => {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === "project/" + params.slug,
  );
  if (!project) return;

  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col pt-20 selection:bg-orange-400/30 selection:text-orange-600  md:w-[90%] md:pr-[15%] md:pt-16 lg:pl-[23%] lg:pr-[15%] xl:px-[3%] xl:pt-8">
        <Mdx code={project.body.code} />
      </main>
    </main>
  );
};

export default projectLayout;
