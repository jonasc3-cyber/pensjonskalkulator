import Image from "next/image";
import Link from "next/link";

/**
 * Editorial A — light hero with Grafisk abstract brand graphic (no stock photo).
 */
export function Hero() {
  return (
    <section
      className="w-full border-b border-border/50 bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div className="max-w-xl">
          <h1
            id="hero-heading"
            className="font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-primary sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]"
          >
            Pensjonskalkulator uten BankID
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
            Få oversikt over pensjonsutbetalinger og valgalternativer uten
            innlogging. Enkelt, trygt og uavhengig.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8 sm:gap-5">
            <a
              href="#kalkulator"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Start kalkulator
            </a>
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
    </section>
  );
}
