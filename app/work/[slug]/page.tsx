import { allWorks } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-components";
import TopBar from "@/layouts/TopBar";

export const generateStaticParams = async () =>
  allWorks.map((work) => ({ slug: work._raw.flattenedPath }));

const workLayout = ({ params }: { params: { slug: string } }) => {
  const work = allWorks.find(
    (work) => work._raw.flattenedPath === "work/" + params.slug,
  );
  if (!work) return;

  return (
    <main className="flex h-screen flex-col items-center justify-between first-line:text-foreground xl:flex-row">
      <section className="h-[7%] w-[92%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[60%] ">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col pt-20 selection:bg-orange-400/40  md:w-[90%] md:pr-[15%] md:pt-16 lg:pl-[23%] lg:pr-[15%] xl:px-[3%] xl:pt-8">
        <article className="prose pb-16 dark:prose-invert prose-h1:text-sm prose-p:text-pretty prose-p:text-sm md:pb-8">
          <Mdx code={work.body.code} />
        </article>
      </main>
    </main>
  );
};

export default workLayout;
