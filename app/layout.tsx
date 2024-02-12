import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

import MobileMenu from "@/layouts/MobileMenu";
import DesktopMenu from "@/layouts/DesktopMenu";

export const metadata: Metadata = {
  title: "Vittorio D'Alfonso",
  description: "All my projects, work and thoughts in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "relative bg-background")}>
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
