import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (
    pathname.includes("/assets/") ||
    pathname.startsWith("/journey/papers/") ||
    pathname.startsWith("/journey/data/") ||
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("sitemap.xml") ||
    pathname.includes("robots.txt") ||
    pathname.includes("CV")
  ) {
    if (pathname.includes("/en/")) {
      return NextResponse.redirect(
        new URL(pathname.replace("/en/", "/"), request.url),
      );
    }

    if (pathname.includes("/it/")) {
      return NextResponse.redirect(
        new URL(pathname.replace("/it/", "/"), request.url),
      );
    }

    return NextResponse.next();
  }

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
