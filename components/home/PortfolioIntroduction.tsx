import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpenText,
  BriefcaseBusiness,
  Shapes,
  UserRound,
  type LucideIcon,
} from "lucide-react";
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
  icon: LucideIcon;
};

function revealStyle(index: number): CSSProperties {
  return {
    animation: `home-word-in 180ms ease-out ${index * WORD_DELAY_MS}ms both`,
  };
}

function SourceChip({
  source,
  style,
}: {
  source: SiteSource;
  style?: CSSProperties;
}) {
  const Icon = source.icon;

  return (
    <Link
      href={source.href}
      className="mx-0.5 inline-flex h-[18px] translate-y-[-1px] items-center gap-1 rounded-[5px] border border-border bg-primary/[0.035] px-1 align-middle font-mono text-[10px] text-muted transition-colors hover:border-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
      style={style}
    >
      <span className="flex size-3 items-center justify-center rounded-[3px] bg-selected text-black">
        <Icon aria-hidden="true" size={9} strokeWidth={1.8} />
      </span>
      <span>{source.domain}</span>
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
      icon: BriefcaseBusiness,
    },
    {
      href: `/${lang}/project`,
      label: labels.projects,
      domain: "projects/",
      icon: Shapes,
    },
    {
      href: `/${lang}/journey`,
      label: labels.journey,
      domain: "journey/",
      icon: BookOpenText,
    },
    {
      href: `/${lang}/about`,
      label: labels.about,
      domain: "about/",
      icon: UserRound,
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
      <SourceChip
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
  const aboutChip = chip(sources[3]);
  const bridge = words(copy.sub[6]);
  const finalWorkChip = chip(sources[0]);
  const revealDelay = tokenIndex * WORD_DELAY_MS + 100;

  return (
    <header className="flex flex-col gap-3">
      <p className="text-pretty text-start font-sans text-sm">
        {main}
      </p>
      <p className="text-pretty font-sans text-sm">
        {workLead}
        {workChip}
        {projectLead}
        {projectChip}
        {projectTail}
      </p>
      <p className="font-sans text-sm">
        {aboutChip}
        {bridge}
        {finalWorkChip}.
      </p>

      <details
        className="group/sources mt-1"
        style={{
          animation: `home-section-in 260ms ease-out ${revealDelay}ms both`,
        }}
      >
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-xs text-muted transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected [&::-webkit-details-marker]:hidden">
          <span className="flex -space-x-1" aria-hidden="true">
            {sources.map((source) => {
              const Icon = source.icon;

              return (
                <span
                  key={source.href}
                  className="flex size-4 items-center justify-center rounded-full border border-background bg-primary text-background"
                >
                  <Icon aria-hidden="true" size={9} strokeWidth={1.8} />
                </span>
              );
            })}
          </span>
          <span>
            {String(sources.length).padStart(2, "0")} {copy.navigation.sources}
          </span>
          <span
            aria-hidden="true"
            className="text-[10px] transition-transform group-open/sources:rotate-180"
          >
            ↓
          </span>
        </summary>

        <div className="mt-1.5 flex flex-col border-y border-border py-1">
          {sources.map((source) => {
            const Icon = source.icon;

            return (
              <Link
                key={source.href}
                href={source.href}
                className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-xs text-muted transition-colors hover:bg-primary/[0.035] hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-selected"
              >
                <span className="flex size-4 items-center justify-center rounded-[4px] bg-selected text-black">
                  <Icon aria-hidden="true" size={10} strokeWidth={1.8} />
                </span>
                <span>{source.label}</span>
                <span className="ml-auto font-mono text-[10px]">
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
        <p className="text-xs font-medium text-muted">{copy.navigation.followUps}</p>
        <div className="mt-0.5 flex flex-col">
          {sources.map((source, index) => (
            <Link
              key={source.href}
              href={source.href}
              className="group/followup -mx-1.5 flex items-center gap-2 border-b border-border px-1.5 py-1.5 text-left text-[12.5px] transition-colors hover:bg-primary/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-selected"
            >
              <svg
                aria-hidden="true"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-muted transition-transform group-hover/followup:translate-x-0.5"
              >
                <path d="M9 10 4 15l5 5" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
              {copy.navigation.questions[index]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
