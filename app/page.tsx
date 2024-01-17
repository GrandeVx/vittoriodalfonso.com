import TopBar from "@/layouts/TopBar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between text-foreground xl:flex-row">
      <section className="h-[7%] w-full xl:h-full xl:w-4/6">
        <TopBar />
      </section>
      <main className="mt-8 flex h-[93%] w-full items-start justify-center md:pr-[25%] lg:pl-[26.5%] lg:pr-[15%] xl:mt-0 xl:pl-[10%] xl:pr-[10%]">
        <p className="ml-4 mr-4 text-start font-sans text-sm">
          At the intersection of brand awareness, technical understanding, and
          visual reductiveness, useful software is built and maintained.
        </p>
      </main>
    </main>
  );
}
