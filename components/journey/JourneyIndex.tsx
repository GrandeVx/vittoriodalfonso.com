"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n-config";
import type { JourneyKind } from "@/lib/journey";

type JourneyIndexEntry = {
  url: string;
  title: string;
  description: string;
  date: string;
  kind: JourneyKind;
  preview: string | null;
};

type JourneyIndexLabels = {
  title: string;
  intro: string;
  sub: string;
  paper: string;
  papers: string;
  note: string;
  experiment: string;
  article: string;
  openEntry: string;
};

export default function JourneyIndex({
  entries,
  lang,
  labels,
}: {
  entries: JourneyIndexEntry[];
  lang: Locale;
  labels: JourneyIndexLabels;
}) {
  const [activeUrl, setActiveUrl] = useState(entries[0]?.url);
  const activeEntry =
    entries.find((entry) => entry.url === activeUrl) ?? entries[0];
  const kindLabels: Record<JourneyKind, string> = {
    paper: labels.paper,
    note: labels.note,
    experiment: labels.experiment,
    article: labels.article,
  };
  const dateFormatter = new Intl.DateTimeFormat(
    lang === "it" ? "it-IT" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <>
      {activeEntry ? (
        <aside className="fixed left-[clamp(2rem,4vw,4rem)] top-[19vh] hidden w-[min(29vw,23rem)] xl:block">
          <Link
            href={activeEntry.url}
            className="group/preview block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-selected"
            aria-label={`${labels.openEntry}: ${activeEntry.title}`}
          >
            {activeEntry.preview ? (
              <div className="journey-index-preview relative aspect-[0.773] w-full overflow-hidden bg-white">
                <Image
                  key={activeEntry.preview}
                  src={activeEntry.preview}
                  alt={`${activeEntry.title} — ${labels.paper}`}
                  fill
                  sizes="368px"
                  className="object-contain"
                  priority={activeEntry.url === entries[0]?.url}
                />
              </div>
            ) : (
              <p className="max-w-[18ch] text-balance text-[clamp(1.75rem,2.7vw,2.5rem)] leading-tight tracking-[-0.035em]">
                {activeEntry.description}
              </p>
            )}
            <span className="mt-5 inline-block text-sm text-muted underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-200 group-hover/preview:decoration-current group-focus-visible/preview:decoration-current">
              {labels.openEntry}
            </span>
          </Link>
        </aside>
      ) : null}

      <div className="min-w-0 px-4 pb-28 pt-5 md:px-8 md:pt-12 xl:px-8 xl:pt-8">
        <header className="max-w-[62ch]">
          <h1 className="text-[clamp(2.8rem,4vw,4.5rem)] leading-[0.95] tracking-[-0.055em]">
            {labels.title}
          </h1>
          <p className="mt-8 max-w-[43ch] text-pretty text-[17px] leading-normal">
            {labels.intro}
          </p>
          <p className="mt-5 max-w-[56ch] text-pretty text-sm leading-[1.6] text-muted">
            {labels.sub}{" "}
            <a
              href="mailto:v.dalfonso@metrica.dev"
              className="decoration-primary/40 text-primary underline underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
            >
              v.dalfonso@metrica.dev
            </a>
          </p>
        </header>

        <section aria-label={labels.papers} className="mt-14 space-y-3">
          {entries.map((entry, index) => (
            <Link
              key={entry.url}
              href={entry.url}
              title={entry.title}
              style={{ animationDelay: `${Math.min(index, 8) * 65}ms` }}
              onMouseEnter={() => setActiveUrl(entry.url)}
              onFocus={() => setActiveUrl(entry.url)}
              className={`journey-index-entry group -mx-3 block px-3 py-5 outline-none transition-[background-color,transform] duration-200 hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-selected active:translate-x-1 ${activeUrl === entry.url ? "xl:bg-surface" : ""}`}
            >
              <article className="flex min-w-0 items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 text-balance text-[clamp(1.3rem,1.7vw,1.75rem)] leading-[1.15] tracking-[-0.035em]">
                    {entry.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-pretty text-base leading-[1.55] text-muted">
                    {entry.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] leading-5 text-muted">
                    <span>{kindLabels[entry.kind]}</span>
                    <time dateTime={entry.date} className="tabular-nums">
                      {dateFormatter.format(new Date(`${entry.date}T12:00:00`))}
                    </time>
                  </div>
                </div>
                {entry.preview ? (
                  <div className="relative aspect-[0.773] w-[76px] shrink-0 overflow-hidden bg-white md:w-[92px] xl:hidden">
                    <Image
                      src={entry.preview}
                      alt=""
                      fill
                      sizes="(min-width: 810px) 92px, 76px"
                      className="object-cover object-top"
                    />
                  </div>
                ) : null}
              </article>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
