import TopBar from "@/layouts/TopBar";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between first-line:text-foreground xl:flex-row">
      <section className="h-[7%] w-[92%] md:w-[90%] lg:w-[95%] xl:w-[50%] xl:h-full ">
        <TopBar />
      </section>
      <main className="mt-8 flex flex-col h-screen w-[92%] md:w-[90%] gap-3 md:pr-[15%] lg:pl-[23%] lg:pr-[15%] xl:px-[12%] selection:bg-orange-400/40">
        <p className=" text-start font-sans text-sm">
          At the intersection of brand awareness, technical understanding, and
          visual reductiveness, useful software is built and maintained.
        </p>
        <p className=" text-ed font-sans text-sm">
        Crafting thoughtful interfaces takes time, and it is only through slow design that we are able to refine, polish, engineer, and successfully launch great products.
        </p>
        <p className=" text-ed font-sans text-sm">
        <span className="underline"> Read about me</span>  or <span className="underline"> inspect my work</span>.
        </p>
      </main>
    </main>
  );
}
