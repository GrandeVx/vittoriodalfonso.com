import type { Metadata } from "next";
import BooksIndex from "@/components/books/BooksIndex";
import { books } from "@/lib/books";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import TopBar from "@/layouts/TopBar";

export const metadata: Metadata = {
  title: "Reading | Vittorio D'Alfonso",
  description:
    "Books read by Vittorio D'Alfonso, with occasional personal notes.",
};

export default async function BooksPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <main className="relative flex min-h-dvh flex-col bg-background text-primary xl:grid xl:grid-cols-[42%_58%]">
      <section className="h-16 shrink-0 px-4 xl:h-auto">
        <TopBar />
      </section>
      <BooksIndex entries={books} lang={lang} labels={dictionary.books} />
    </main>
  );
}
