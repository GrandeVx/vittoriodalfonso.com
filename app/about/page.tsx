import TopBar from "@/layouts/TopBar";
import { Metadata } from "next";
import main from "@/public/assets/about/main.webp";
import main2 from "@/public/assets/about/main2.webp";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Vittorio D'Alfonso",
  description: "Everything you need to know about me... and more!",
  openGraph: {
    images: "/assets/utils/about.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "About | Vittorio D'Alfonso",
    description: "Everything you need to know about me... and more!",
    images: ["/assets/utils/about.webp"],
  },
};

export default function About() {
  return (
    <main className="flex h-screen flex-col items-center gap-16 first-line:text-foreground md:gap-0 xl:flex-row">
      <section className="w-[92%] md:h-[4%] md:w-[90%] lg:w-[95%] xl:h-full xl:w-[50%]">
        <TopBar />
      </section>
      <main className="flex h-full w-[92%] flex-col gap-3 pt-8 selection:bg-orange-400/30 selection:text-selected md:mt-8 md:w-[90%] md:pr-[15%] md:pt-8 lg:mt-0 lg:pl-[23%] lg:pr-[15%] xl:px-[12%]">
        <p className="text-pretty text-start font-sans text-sm">
          I am a self-taught Creative Developer with a passion for exploring
          diverse scenarios within the IT industry. Currently pursuing my
          studies in IT at{" "}
          <Link
            className="underline"
            href={"https://corsi.unisa.it/Informatica"}
          >
            UNISA
          </Link>
          , I am actively engaged in working on projects and consistently
          seeking new opportunities to collaborate with talented individuals.
        </p>

        <div className="mt-6 flex w-full flex-row gap-4 pr-2 md:flex-col lg:flex-row">
          <Image
            src={main2}
            alt="Vittorio D'Alfonso"
            className="h-fit w-1/2 md:w-full lg:w-1/2"
            loading="lazy"
            placeholder="blur"
          />
          <Image
            src={main}
            alt="Vittorio D'Alfonso"
            className="h-full w-1/2 object-fill md:size-full lg:w-1/2"
            loading="lazy"
            placeholder="blur"
          />
        </div>

        <p className="mt-6 text-pretty text-start font-sans text-sm">
          As a Digital Creative, I consider computer science my canvas for
          ongoing exploration and creation. My forte lies in versatile
          knowledge, and I am driven by a relentless curiosity to experiment and
          innovate.
        </p>

        <p className="text-pretty text-start font-sans text-sm">
          Challenges are not obstacles but gateways to growth. Prioritizing the
          journey over the destination, I adapt swiftly to new environments.
        </p>

        <p className="text-pretty pb-16 text-start font-sans text-sm">
          Let's embark on a journey of continuous experimentation, pushing
          boundaries and transforming challenges into rewarding experiences.
        </p>
      </main>
    </main>
  );
}
