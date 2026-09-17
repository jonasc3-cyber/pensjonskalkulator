import Image from "next/image";
import Link from "next/link";
import { StartCalculatorCta } from "./StartCalculatorCta";

const trustItems = [
  {
    title: "Ingen innlogging",
    text: "Ingen BankID. Ingen spor.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
  {
    title: "Alt lokalt",
    text: "Tallene forblir i nettleseren.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="5"
          y="11"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 11V8a4 4 0 0 1 8 0v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Offisielle satser",
    text: "Intervallanslag, ikke fasit.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5M4 19h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="7" y="11" width="3" height="5" rx="0.5" fill="currentColor" />
        <rect x="12" y="8" width="3" height="8" rx="0.5" fill="currentColor" />
        <rect x="17" y="6" width="3" height="10" rx="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

/**
 * Polish-v2 quieter hero — H1 + one muted line + one primary CTA,
 * thin trust strip (not cards), abstract brand graphic.
 */
export function Hero() {
  return (
    <section
      className="w-full border-b border-border/50 bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <div className="max-w-xl">
          <h1
            id="hero-heading"
            className="font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-primary sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]"
          >
            Pensjonskalkulator uten BankID
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            Få oversikt over pensjon og sparing – enkelt, trygt og uten
            innlogging.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-8">
            <StartCalculatorCta className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
            <Link
              href="/guider"
              className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-mid"
            >
              Les guider
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <Image
            src="/hero-abstract-brand.webp"
            alt=""
            width={560}
            height={420}
            priority
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 100vw"
            className="h-auto w-full"
            aria-hidden
          />
        </div>
      </div>

      {/* Thin trust strip — icon + 2 lines, no large cards */}
      <div
        className="border-t border-border/40"
        aria-label="Hvorfor sjekkpensjon.no"
      >
        <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:gap-8 sm:px-6 sm:py-10 lg:gap-10 lg:py-12">
          {trustItems.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
