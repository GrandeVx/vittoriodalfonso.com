import TopBar from "@/layouts/TopBar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="selection:text-selected flex h-full w-[92%] flex-col gap-3  pt-4 selection:bg-orange-400/30 md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className=" text-pretty text-start font-sans text-sm">
          In computer science, I explore the elegant fusion of creativity and
          mathematical precision. Coding is an art that follows rules while
          pushing the boundaries to create something new—a symphony where logic
          and innovation dance in harmony.
        </p>
        <p className="text-pretty font-sans text-sm">
          In my{" "}
          <Link href={"/work"} className="underline">
            work
          </Link>
          , I concentrate the artistic precision of coding into projects for
          clients and{" "}
          <Link href={"project"} className="underline">
            autonomous pursuits
          </Link>
          . Each project is a canvas where creativity meets technology,
          producing unique and visionary solutions.
        </p>
        <p className="font-sans text-sm">
          <Link href={"/about"} className="underline">
            Discover me
          </Link>{" "}
          or{" "}
          <Link href={"/work"} className="underline">
            View my Work
          </Link>
          .
        </p>
      </main>
    </main>
  );
}
