import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  //@ts-expect-error locales is readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // allow assets to be served without locale
  if (
    pathname.includes("/assets/") ||
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("sitemap.xml") ||
    pathname.includes("robots.txt") ||
    pathname.includes("CV")
  ) {
    // redirect to the url but remove it or en if exist
    if (pathname.includes("/en/")) {
      return NextResponse.redirect(
        new URL(
          pathname.replace("/en/", "/"),
          request.url,
        ),
      );
    }
    if (pathname.includes("/it/")) {
      return NextResponse.redirect(
        new URL(
          pathname.replace("/it/", "/"),
          request.url,
        ),
      );
    }
    else {
      return NextResponse.next();
    }
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
