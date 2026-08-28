import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

import MobileMenu from "@/layouts/MobileMenu";
import DesktopMenu from "@/layouts/DesktopMenu";
import { getJourneys, getProjects, getWorks } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Vittorio D'Alfonso",
  icons: "/favicon.ico",
  description:
    "In computer science, I explore the elegant fusion of creativity and mathematical precision. Coding is an art that follows rules while pushing the boundaries to create something new—a symphony where logic and innovation dance in harmony",
  generator: "Next.js",
  applicationName: "Vittorio D'Alfonso Portfolio",
  keywords: [
    "Vittorio D'Alfonso",
    "vittorio",
    "dalfonso",
    "Portfolio",
    "Developer",
    "Designer",
  ],
  creator: "Vittorio D'Alfonso",
  publisher: "Vittorio D'Alfonso",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    images: "/assets/utils/home.webp",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vittoIam",
    title: "Vittorio D'Alfonso",
    description: "All my projects, work and thoughts in one place.",
    images: ["/assets/utils/home.webp"],
  },
  category: "Portfolio",
  verification: {
    google: "XRkNZEOjB9ARqZ363IyE_xZ5SUjnLmf6TVVI8y7K76g",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const menuProps = {
    works: getWorks()
      .filter((work) => work.language === lang)
      .map(({ _id, title, date, url, redirect, comingSoon, comingSoonDark }) => ({
        _id,
        title,
        date,
        url,
        redirect,
        comingSoon,
        comingSoonDark,
      })),
    projects: getProjects()
      .filter((project) => project.language === lang)
      .map(({ _id, title, date, url, redirect, comingSoon, comingSoonDark }) => ({
        _id,
        title,
        date,
        url,
        redirect,
        comingSoon,
        comingSoonDark,
      })),
    journeys: getJourneys()
      .filter((journey) => journey.language === lang)
      .map(({ _id, title, date, order, url }) => ({
        _id,
        title,
        date,
        order,
        url,
      })),
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "relative bg-background dark:antialiased",
        )}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Mobile View */}
          <main className="site-mobile-shell md:hidden">
            <section className="no-scrollbar overflow-y-scroll">
              {children}
            </section>
            <span className="site-mobile-nav absolute bottom-0">
              <MobileMenu {...menuProps} />
            </span>
          </main>

          {/* md-Desktop View */}
          <main className="site-shell hidden h-screen md:flex lg:hidden">
            <section className="site-page-pane w-3/5">{children}</section>
            <section className="site-nav-pane w-2/5 ">
              <DesktopMenu {...menuProps} />
            </section>
          </main>

          {/* lg-Desktop View */}
          <main className="site-shell hidden h-screen lg:flex xl:hidden">
            <section className="site-page-pane w-[70%]">{children}</section>
            <section className="site-nav-pane w-[30%] ">
              <DesktopMenu {...menuProps} />
            </section>
          </main>

          {/* xl-Desktop View */}
          <main className="site-shell hidden h-screen xl:flex">
            <section className="site-page-pane w-4/5">{children}</section>
            <section className="site-nav-pane w-1/5 ">
              <DesktopMenu {...menuProps} />
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
