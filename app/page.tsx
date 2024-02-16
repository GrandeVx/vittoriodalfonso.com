import TopBar from "@/layouts/TopBar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pt-4  selection:bg-orange-400/30 selection:text-orange-600 md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className=" text-pretty text-start font-sans text-sm">
          At the intersection of brand awareness, technical understanding, and
          visual reductiveness, useful software is built and maintained.
        </p>
        <p className="text-pretty font-sans text-sm">
          Crafting thoughtful interfaces takes time, and it is only through slow
          design that we are able to refine, polish, engineer, and successfully
          launch great products.
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
