"use client";

import Image from "next/image";
import { useState } from "react";
import type { Book } from "@/lib/books";
import type { Locale } from "@/i18n-config";
import SectionHeader from "@/components/SectionHeader";

type Labels = {
  title: string;
  intro: string;
  sub: string;
  yearPending: string;
  undatedHeading: string;
  source: string;
  selectBook: string;
  unfinished: string;
  inProgress: string;
  unread: string;
};

function readingStatusLabel(book: Book, labels: Labels) {
  if (book.readStatus === "unfinished") return labels.unfinished;
  if (book.readStatus === "in-progress") return labels.inProgress;
  if (book.readStatus === "unread") return labels.unread;
  return null;
}

function coverSourceName(book: Book) {
  const source = book.cover?.sourceUrl ?? "";
  if (source.includes("mondolibro.de")) return "MondoLibro";
  if (source.includes("hoepli.it")) return "Hoepli";
  if (source.includes("feltrinellieditore.it")) return "Feltrinelli";
  if (source.includes("books.google.com")) return "Google Books";
  return "Open Library";
}

function BookSpotlight({
  book,
  lang,
  labels,
}: {
  book: Book;
  lang: Locale;
  labels: Labels;
}) {
  return (
    <div className="flex w-full flex-col items-start px-6 py-8">
      <div key={book.photoPosition} className="books-volume-stage ml-2">
        <div className="books-volume">
          {book.cover ? (
            <Image
              src={book.cover.url}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1430px) 290px, 220px"
              className="books-volume-cover bg-[#dfded8] object-contain"
            />
          ) : (
            <div className="books-volume-cover books-volume-fallback flex flex-col justify-between p-5">
              <span className="text-sm leading-snug">{book.author}</span>
              <span className="text-balance text-[clamp(1.5rem,2.5vw,2.3rem)] leading-[1.05] tracking-[-0.045em]">
                {book.title}
              </span>
              <span className="text-sm">Vittorio D’Alfonso · Libri</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 w-full text-left" aria-live="polite">
        <p className="text-pretty text-[clamp(1.25rem,1.7vw,1.55rem)] leading-[1.2] tracking-[-0.035em]">
          {book.title}
        </p>
        <p className="mt-2 text-sm text-muted">{book.author}</p>
        {readingStatusLabel(book, labels) ? (
          <p className="mt-2 text-sm text-muted">
            {readingStatusLabel(book, labels)}
          </p>
        ) : null}
        {book.comment?.[lang] ? (
          <blockquote className="mt-6 max-w-[55ch] text-pretty text-[15px] leading-[1.65]">
            {book.comment[lang]}
          </blockquote>
        ) : null}
        {book.cover ? (
          <a
            href={book.cover.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-xs text-muted underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-selected"
          >
            {labels.source} · {coverSourceName(book)}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function BooksIndex({
  entries,
  lang,
  labels,
}: {
  entries: Book[];
  lang: Locale;
  labels: Labels;
}) {
  const years = Array.from(new Set(entries.map((book) => book.readYear))).sort(
    (a, b) => (b ?? -Infinity) - (a ?? -Infinity),
  );
  const [activePosition, setActivePosition] = useState(
    entries.find((book) => book.readYear === years[0])?.photoPosition ??
      entries[0]?.photoPosition,
  );
  const activeBook =
    entries.find((book) => book.photoPosition === activePosition) ?? entries[0];

  return (
    <>
      {activeBook ? (
        <aside className="no-scrollbar fixed left-[clamp(2rem,4vw,4rem)] top-[12vh] hidden max-h-[86vh] w-[min(29vw,23rem)] overflow-y-auto xl:block">
          <BookSpotlight book={activeBook} lang={lang} labels={labels} />
        </aside>
      ) : null}

      <div className="min-w-0 px-4 pb-28 pt-5 md:px-8 md:pt-12 xl:pt-8">
        <SectionHeader title={labels.title} intro={labels.intro} contact={labels.sub} />

        <div className="mt-14">
          {years.map((year) => (
            <section
              key={year ?? "pending"}
              className="mb-14"
              aria-label={year === null ? labels.yearPending : String(year)}
            >
              <div className="mb-6 flex items-baseline justify-between gap-5">
                <h2 className="text-[clamp(1.6rem,2vw,2rem)] leading-none -tracking-wider">
                  {year ?? labels.undatedHeading}
                </h2>
                <span className="text-sm tabular-nums text-muted">
                  {entries.filter((book) => book.readYear === year).length}
                </span>
              </div>
              {year === null ? (
                <p className="mb-5 text-sm text-muted">{labels.yearPending}</p>
              ) : null}
              <div className="space-y-1">
                {entries
                  .filter((book) => book.readYear === year)
                  .map((book) => (
                    <div key={book.photoPosition}>
                      <button
                        type="button"
                        aria-pressed={
                          activeBook?.photoPosition === book.photoPosition
                        }
                        aria-label={`${labels.selectBook}: ${book.title}`}
                        onClick={() => setActivePosition(book.photoPosition)}
                        className="books-row group flex w-full items-center gap-5 px-3 py-4 text-left outline-none hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-selected aria-pressed:bg-surface"
                      >
                        <span className="relative block h-[74px] w-[52px] shrink-0 overflow-hidden bg-[#30383a]">
                          {book.cover ? (
                            <Image
                              src={book.cover.url}
                              alt=""
                              fill
                              unoptimized
                              sizes="52px"
                              className="bg-[#dfded8] object-contain"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-4xl leading-none text-white">
                              {book.title[0]}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-balance text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.15] tracking-[-0.035em]">
                            {book.title}
                          </span>
                          <span className="mt-1.5 block text-sm text-muted">
                            {book.author}
                          </span>
                          {readingStatusLabel(book, labels) ? (
                            <span className="mt-1 block text-sm text-muted">
                              {readingStatusLabel(book, labels)}
                            </span>
                          ) : null}
                        </span>
                        <span aria-hidden="true" className="text-xl text-muted">
                          ↗
                        </span>
                      </button>
                      {activeBook?.photoPosition === book.photoPosition ? (
                        <div className="mt-2 bg-surface xl:hidden">
                          <BookSpotlight book={book} lang={lang} labels={labels} />
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
