"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpenText,
  BriefcaseBusiness,
  Shapes,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const NOTIFICATION_DELAY_MS = 3200;

export type RecommendationOption = {
  key: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  signal: number;
  icon: "journey" | "work" | "projects" | "about";
};

const OPTION_ICONS: Record<RecommendationOption["icon"], LucideIcon> = {
  journey: BookOpenText,
  work: BriefcaseBusiness,
  projects: Shapes,
  about: UserRound,
};

type RecommendationCardProps = {
  title: string;
  exploreLabel: string;
  alternativesLabel: string;
  otherOptionsLabel: string;
  openLabel: string;
  closeLabel: string;
  options: RecommendationOption[];
};

function Meter({ signal }: { signal: number }) {
  return (
    <span className="flex items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className={`w-1 rounded-full transition-colors ${bar < signal ? "bg-selected" : "bg-border"}`}
          style={{ height: 6 + bar * 2 }}
        />
      ))}
    </span>
  );
}

export default function RecommendationCard({
  title,
  exploreLabel,
  alternativesLabel,
  otherOptionsLabel,
  openLabel,
  closeLabel,
  options,
}: RecommendationCardProps) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const active = options[selected];
  const ActiveIcon = OPTION_ICONS[active.icon];
  const alternatives = options
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => index !== selected);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setVisible(true),
      NOTIFICATION_DELAY_MS,
    );

    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      aria-label={title}
      className="home-recommendation-card fixed bottom-[4.75rem] left-3 right-3 z-40 max-h-[calc(100vh-5.5rem)] overflow-y-auto font-sans md:bottom-5 md:left-5 md:right-auto md:w-[340px]"
    >
      <div className="relative p-3">
        <p className="pr-7 text-sm font-medium">{title}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label={closeLabel}
          className="home-recommendation-control absolute right-2 top-2 flex size-7 items-center justify-center rounded-md text-base leading-none"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div
          key={active.key}
          className="mt-1.5 min-h-12 text-[13px] leading-relaxed text-[color:var(--recommendation-ink-2)]"
          style={{ animation: "home-card-option-in 180ms ease-out both" }}
        >
          <span>{exploreLabel} </span>
          <span className="mx-0.5 inline-flex h-6 translate-y-[1px] items-center gap-1.5 rounded-md bg-[var(--recommendation-inset)] px-1.5 align-middle text-[13px] font-medium text-[color:var(--recommendation-ink)] shadow-[0_0_0_1px_var(--recommendation-line)]">
            <span className="flex size-4 items-center justify-center rounded-[5px] bg-selected font-mono text-[8px] text-black">
              <ActiveIcon aria-hidden="true" size={11} strokeWidth={1.8} />
            </span>
            {active.title}
          </span>{" "}
          <span>{active.description}</span>
        </div>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--recommendation-line)] px-2 py-2">
            <p className="px-1.5 pb-1 text-[11px] font-medium text-[color:var(--recommendation-ink-3)]">
              {otherOptionsLabel}
            </p>
            {alternatives.map(({ option, index }) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelected(index)}
                className="home-recommendation-control flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-selected"
              >
                <Meter signal={option.signal} />
                <span className="min-w-0 flex-1 truncate text-[12.5px]">
                  {option.title}
                </span>
                <span className="shrink-0 text-[11px] text-[color:var(--recommendation-ink-3)]">
                  {option.eyebrow}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 p-2.5 pl-3">
        <span className="flex min-w-0 items-center gap-2 text-[12.5px] font-medium text-[color:var(--recommendation-ink-2)]">
          <Meter signal={active.signal} />
          <span className="truncate">{active.eyebrow}</span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="home-recommendation-secondary rounded-lg px-3 py-1.5 text-[12.5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
          >
            {alternativesLabel}
          </button>
          <Link
            href={active.href}
            className="home-recommendation-primary rounded-lg px-3 py-1.5 text-[12.5px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
          >
            {openLabel} <span aria-hidden="true">↗</span>
          </Link>
        </span>
      </footer>
    </aside>
  );
}
