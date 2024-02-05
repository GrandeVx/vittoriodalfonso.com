import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allWorks, Work } from "contentlayer/generated";
import TopBar from "@/layouts/TopBar";
import Image from "next/image";
function WorkCard(work: Work) {
  return (
    <Link href={work.url} className="flex cursor-pointer flex-col gap-3">
      <Image src={work.cover} alt={work.title} width={1000} height={1000} />
      <section className="flex w-full items-center justify-between">
        <p className="mb-1 text-sm">{work.title}</p>
        <time dateTime={work.date} className="mb-2 block text-sm text-gray-600">
          {format(parseISO(work.date), "yyyy")}
        </time>
      </section>
    </Link>
  );
}

export default function Work() {
  const works = allWorks.sort((a: any, b: any) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );
  return (
    <main className="flex h-screen flex-col items-center justify-between first-line:text-foreground xl:flex-row">
      <section className="h-[7%] w-[92%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%] ">
        <TopBar />
      </section>
      <main className="flex h-screen w-[92%] flex-col gap-3 pt-16 selection:bg-orange-400/40 md:w-[90%] md:pr-[15%] lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="font-sans text-sm">
          My work includes research, conception, interface and motion design,
          and front-end development. I have also worked on brand systems in the
          past, but my strength lies in forming user-applicable interfaces for
          mobile and desktop.
        </p>
        <p className="font-sans text-sm text-white/40">
          Work archive includes both freelance and studio projects. More
          projects available upon request.
        </p>

        <section className=" mt-16 pb-16">
          {works.map((work: any, idx: any) => (
            <WorkCard key={idx} {...work} />
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
