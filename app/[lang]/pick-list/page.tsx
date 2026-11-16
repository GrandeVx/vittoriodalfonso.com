import type { Metadata } from "next";
import Image from "next/image";
import TopBar from "@/layouts/TopBar";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { pickList } from "@/lib/pick-list";

type PageProps = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const { pickList: labels } = await getDictionary(lang);
  return {
    title: `${labels.title} | Vittorio D'Alfonso`,
    description: labels.intro,
  };
}

export default async function PickListPage({ params }: PageProps) {
  const { lang } = await params;
  const { pickList: labels } = await getDictionary(lang);

  return (
    <main className="relative flex min-h-dvh flex-col bg-background text-primary">
      <div className="xl:grid xl:min-h-[224px] xl:grid-cols-[42%_58%]">
        <section className="h-16 shrink-0 px-4 xl:h-auto">
          <TopBar mobileStatic />
        </section>
        <header className="min-w-0 px-4 pt-5 md:px-8 md:pt-12 xl:pt-8">
          <h1 className="page-display-title text-[clamp(2.8rem,4vw,4.5rem)] leading-[0.95]">
            {labels.title}
          </h1>
          <p className="mt-8 max-w-[43ch] text-pretty text-[17px] leading-normal">
            {labels.intro}
          </p>
        </header>
      </div>

      <div className="min-w-0 px-4 pb-28 md:px-8">
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 min-[600px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
          {pickList.map((item) => (
            <li key={item.id} className="min-w-0">
              <article>
                <div className="relative aspect-square overflow-hidden bg-[#f0efec]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt[lang]}
                    fill
                    loading="eager"
                    sizes="(min-width: 810px) 190px, (min-width: 600px) 180px, calc(50vw - 24px)"
                    className="object-contain"
                  />
                </div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${labels.source}: ${item.brand} ${item.model[lang]}`}
                  className="mt-3 inline-block text-xs text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-selected"
                >
                  {item.brand}
                </a>
                <h2 className="mt-1 text-pretty text-sm leading-snug tracking-[-0.02em]">
                  {item.model[lang]}
                </h2>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
