import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

import MobileMenu from "@/layouts/MobileMenu";
import DesktopMenu from "@/layouts/DesktopMenu";

export const metadata: Metadata = {
  metadataBase: new URL("https://vittoriodalfonso-com.vercel.app"),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <main className="md:hidden">
            <section className="no-scrollbar overflow-y-scroll">
              {children}
            </section>
            <span className="absolute bottom-0">
              <MobileMenu />
            </span>
          </main>

          {/* md-Desktop View */}
          <main className="hidden h-screen md:flex lg:hidden">
            <section className="w-[60%]">{children}</section>
            <section className="w-[40%] ">
              <DesktopMenu />
            </section>
          </main>

          {/* lg-Desktop View */}
          <main className="hidden h-screen lg:flex xl:hidden">
            <section className="w-[70%]">{children}</section>
            <section className="w-[30%] ">
              <DesktopMenu />
            </section>
          </main>

          {/* xl-Desktop View */}
          <main className="hidden h-screen xl:flex">
            <section className="w-[80%]">{children}</section>
            <section className="w-[20%] ">
              <DesktopMenu />
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
