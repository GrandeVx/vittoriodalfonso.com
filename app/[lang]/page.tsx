import TopBar from "@/layouts/TopBar";
import Link from "next/link";
import { Locale } from "i18n-config";
import { getDictionary } from "@/get-dictionary";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pt-4  selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className=" text-pretty text-start font-sans text-sm">
          {dictionary.home.main}
        </p>
        <p className="text-pretty font-sans text-sm">
          {dictionary.home.sub[0]}{" "}
          <Link href={"/work"} className="underline">
            {dictionary.home.sub[1]}
          </Link>
          {dictionary.home.sub[2]}{" "}
          <Link href={"project"} className="underline">
            {dictionary.home.sub[3]}
          </Link>
          {dictionary.home.sub[4]}
        </p>
        <p className="font-sans text-sm">
          <Link href={"/about"} className="underline">
            {dictionary.home.sub[5]}
          </Link>{" "}
          {dictionary.home.sub[6]}{" "}
          <Link href={"/work"} className="underline">
            {dictionary.home.sub[7]}
          </Link>
          .
        </p>
      </main>
    </main>
  );
}
