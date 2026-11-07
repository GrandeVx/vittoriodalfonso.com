import type { ReactNode } from "react";

export default function SectionHeader({
  title,
  intro,
  contact,
}: {
  title: string;
  intro: ReactNode;
  contact: string;
}) {
  return (
    <header className="max-w-[62ch]">
      <h1 className="page-display-title text-[clamp(2.8rem,4vw,4.5rem)] leading-[0.95]">
        {title}
      </h1>
      <p className="mt-8 max-w-[43ch] text-pretty text-[17px] leading-normal">
        {intro}
      </p>
      <p className="mt-5 max-w-[56ch] text-pretty text-sm leading-[1.6] text-muted">
        {contact}{" "}
        <a
          href="mailto:v.dalfonso@metrica.dev"
          className="decoration-primary/40 text-primary underline underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
        >
          v.dalfonso@metrica.dev
        </a>
      </p>
    </header>
  );
}
