import TopBar from "@/layouts/TopBar";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between first-line:text-foreground xl:flex-row">
      <section className="h-[7%] w-[90%] xl:h-full xl:w-4/6">
        <TopBar />
      </section>
      <main className="mt-8 flex h-[93%] w-full items-start justify-center md:pr-[25%] lg:pl-[26.5%] lg:pr-[15%] xl:mt-0 xl:px-[10%]">
        <p className="mx-4 text-start font-sans text-sm">
          At the intersection of brand awareness, technical understanding, and
          visual reductiveness, useful software is built and maintained.
        </p>
      </main>
    </main>
  );
}
