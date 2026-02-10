import Link from "next/link";

export default function TopBar() {
  return (
    <div className="fixed w-full md:w-[70%] xl:w-[30%]">
      <Link href={"/"}>
        <section className="flex size-full items-center pt-5 lg:pl-4 xl:items-start xl:pl-7">
          <p className="w-3/6 text-sm md:w-2/6 lg:w-3/12 xl:w-5/12 xl:gap-4">
            Vittorio D&apos;Alfonso
          </p>
          <p className="text-sm font-light text-muted">Creative Developer</p>
        </section>
      </Link>
      <div className="hidden md:flex items-center gap-3 pt-2 lg:pl-4 xl:pl-7">
        <a
          href="https://instagram.com/vittodalfo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-black dark:hover:text-white transition-colors"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        </a>
        <a
          href="mailto:v.dalfonso@metrica.dev"
          className="text-muted hover:text-black dark:hover:text-white transition-colors"
          aria-label="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
        <a
          href="https://twitter.com/vittoIam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-black dark:hover:text-white transition-colors"
          aria-label="X"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a
          href="https://github.com/GrandeVx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-black dark:hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
