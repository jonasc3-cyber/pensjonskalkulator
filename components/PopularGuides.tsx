import Link from "next/link";
import type { ReactNode } from "react";

type GuideCard = {
  href: string;
  title: string;
  blurb: string;
  icon: ReactNode;
};

const GUIDES: GuideCard[] = [
  {
    href: "/guider/nar-ta-ut-pensjon",
    title: "Når ta ut pensjon",
    blurb: "Når lønner det seg å ta ut pensjon? Se scenarier og virkninger.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3 10h18M8 3v4M16 3v4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/guider/ips-eller-ask",
    title: "IPS eller ASK",
    blurb: "Sammenlign sparefordeler og skattemessige virkninger.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3a9 9 0 1 0 9 9h-9V3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3.2A9 9 0 0 1 20.8 10H14V3.2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/guider/pensjonskalkulator-uten-innlogging",
    title: "Uten BankID",
    blurb: "Slik beregner du pensjon uten innlogging eller BankID.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/** Mid-page featured guides for Editorial A forside. */
export function PopularGuides() {
  return (
    <section
      className="w-full"
      aria-labelledby="popular-guides-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-[4.5rem]">
        <h2
          id="popular-guides-heading"
          className="text-center text-xl font-semibold tracking-tight text-primary sm:text-2xl"
        >
          Populære guider
        </h2>
        <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary-soft/30 sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  {g.icon}
                </span>
                <span className="mt-4 text-base font-semibold text-primary">
                  {g.title}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {g.blurb}
                </span>
                <span className="mt-4 text-sm font-medium text-primary">
                  Les guiden →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
