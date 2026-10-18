import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/i18n-config";

const WORD_DELAY_MS = 24;

type IntroductionCopy = {
  main: string;
  sub: string[];
  navigation: {
    sources: string;
    followUps: string;
    questions: string[];
  };
};

type PortfolioIntroductionProps = {
  lang: Locale;
  copy: IntroductionCopy;
  labels: {
    work: string;
    projects: string;
    journey: string;
    about: string;
  };
};

type SiteSource = {
  href: string;
  label: string;
  domain: string;
};

function revealStyle(index: number): CSSProperties {
  return {
    animation: `home-word-in 180ms ease-out ${index * WORD_DELAY_MS}ms both`,
  };
}

function SourceLink({
  source,
  style,
}: {
  source: SiteSource;
  style?: CSSProperties;
}) {
  return (
    <Link
      href={source.href}
      className="decoration-primary/40 mx-0.5 inline text-primary underline underline-offset-[3px] transition-[text-decoration-color] duration-200 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
      style={style}
    >
      {source.domain}
    </Link>
  );
}

export default function PortfolioIntroduction({
  lang,
  copy,
  labels,
}: PortfolioIntroductionProps) {
  const sources: SiteSource[] = [
    {
      href: `/${lang}/work`,
      label: labels.work,
      domain: "work/",
    },
    {
      href: `/${lang}/project`,
      label: labels.projects,
      domain: "projects/",
    },
    {
      href: `/${lang}/journey`,
      label: labels.journey,
      domain: "journey/",
    },
    {
      href: `/${lang}/about`,
      label: labels.about,
      domain: "about/",
    },
  ];
  let tokenIndex = 0;

  function words(text: string): ReactNode[] {
    return text
      .trim()
      .split(/\s+/)
      .map((word) => {
        const index = tokenIndex++;

        return (
          <span
            key={`${index}-${word}`}
            className="inline-block"
            style={revealStyle(index)}
          >
            {word}&nbsp;
          </span>
        );
      });
  }

  function chip(source: SiteSource) {
    const revealIndex = tokenIndex++;

    return (
      <SourceLink
        key={source.href}
        source={source}
        style={revealStyle(revealIndex)}
      />
    );
  }

  const main = words(copy.main);
  const workLead = words(copy.sub[0]);
  const workChip = chip(sources[0]);
  const projectLead = words(copy.sub[2]);
  const projectChip = chip(sources[1]);
  const projectTail = words(copy.sub[4]);
  const aboutLead = words(copy.sub[5]);
  const aboutChip = chip(sources[3]);
  const bridge = words(copy.sub[6]);
  const finalWorkChip = chip(sources[0]);
  const revealDelay = tokenIndex * WORD_DELAY_MS + 100;

  return (
    <header className="flex flex-col gap-3">
      <p className="text-pretty text-start font-sans text-sm">{main}</p>
      <p className="text-pretty font-sans text-sm">
        {workLead}
        {workChip}
        {projectLead}
        {projectChip}
        {projectTail}
      </p>
      <p className="font-sans text-sm">
        {aboutLead}
        {aboutChip} {bridge}
        {finalWorkChip}.
      </p>

      <details
        className="group/sources mt-1"
        style={{
          animation: `home-section-in 260ms ease-out ${revealDelay}ms both`,
        }}
      >
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 py-1 text-sm text-muted transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected [&::-webkit-details-marker]:hidden">
          <span>{copy.navigation.sources}</span>
          <span
            aria-hidden="true"
            className="transition-transform group-open/sources:rotate-180"
          >
            ↓
          </span>
        </summary>

        <div className="mt-1.5 flex flex-col py-1">
          {sources.map((source) => {
            return (
              <Link
                key={source.href}
                href={source.href}
                className="flex items-center gap-2 p-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-selected"
              >
                <span>{source.label}</span>
                <span className="ml-auto text-sm text-muted">
                  {source.domain}
                </span>
              </Link>
            );
          })}
        </div>
      </details>

      <nav
        aria-label={copy.navigation.followUps}
        className="mt-1"
        style={{
          animation: `home-section-in 260ms ease-out ${revealDelay + 90}ms both`,
        }}
      >
        <p className="text-sm font-medium text-muted">
          {copy.navigation.followUps}
        </p>
        <div className="mt-0.5 flex flex-col">
          {sources.map((source, index) => (
            <Link
              key={source.href}
              href={source.href}
              className="-mx-1.5 flex items-center gap-2 p-1.5 text-left text-sm transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-selected"
            >
              {copy.navigation.questions[index]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
