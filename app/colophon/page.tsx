import TopBar from "@/layouts/TopBar";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colophon | Vittorio D'Alfonso",
  description: "All about the tech stack and design choices.",
  openGraph: {
    images: "/assets/utils/colophon.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "Colophon | Vittorio D'Alfonso",
    description: "All about the tech stack and design choices.",
    images: ["/assets/utils/colophon.webp"],
  },
};

export default function About() {
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pt-6 selection:bg-orange-400/30 selection:text-selected md:w-[90%] md:pr-[15%] md:pt-8 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="text-pretty font-sans text-sm">
          Everything about this website.
        </p>
        <p className="text-sm text-muted">Last updated Feb 19, 2024</p>

        <section className="mt-20 flex flex-col gap-1 text-pretty">
          <p className="text-sm text-muted">Technical</p>
          <p className="text-sm">
            Built with{" "}
            <Link href={"https://nextjs.org/"} className="underline">
              Next-js
            </Link>
            ,{" "}
            <Link href={"https://contentlayer.dev/"} className="underline">
              Contentlayer
            </Link>
            , and{" "}
            <Link href={"https://tailwindcss.com/"} className="underline">
              Tailwind
            </Link>
            .
          </p>
          <p className="text-sm">
            Deployed and hosted on{" "}
            <Link href={"https://vercel.com/"} className="underline">
              Vercel
            </Link>
            . The Code is Open Source on{" "}
            <Link
              href={"https://github.com/GrandeVx/vittoriodalfonso.com"}
              className="underline"
            >
              Github
            </Link>
          </p>
        </section>

        <section className="mt-20 flex flex-col gap-1 text-pretty">
          <p className="text-sm text-muted">Photography</p>
          <p className=" text-sm">
            All visuals on this site have been either captured or designed by
            Vittorio D'Alfonso, unless explicitly mentioned otherwise. I strive
            to credit the sources of all images; however, the complexities of
            the internet and various visual inspiration platforms may
            occasionally pose challenges to this attribution.
          </p>
        </section>

        <section className="mt-20 flex flex-col gap-2 text-pretty">
          <p className="text-sm text-[rgb(98,98,98)]">Inspiration</p>
          <p className="text-pretty text-sm">
            The profound inspiration for this website stems from{" "}
            <Link href={"https://linusrogge.com/"} className="underline">
              Linus Rogge
            </Link>
            . Upon exploring his work, I found a meaningful connection with my
            creative vision
          </p>
          <p className="text-sm">
            It's crucial to note that while drawing inspiration from his style
            and approach, I have entirely reimagined the website code section.
          </p>
        </section>
      </main>
    </main>
  );
}
