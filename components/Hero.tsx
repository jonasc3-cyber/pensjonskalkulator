import Image from "next/image";

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="relative h-[200px] sm:h-[280px] lg:h-[300px]">
        <Image
          src="/hero-couple.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_40%] sm:object-[75%_35%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-6 sm:px-6 sm:py-8">
          <div className="max-w-xl text-primary-foreground">
            <h1
              id="hero-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            >
              Pensjonskalkulator
            </h1>
            <p className="mt-2 text-sm leading-snug text-primary-foreground/90 sm:mt-3 sm:text-base sm:leading-relaxed">
              <span className="sm:hidden">
                Estimer pensjon som et intervall. Alt regnes i nettleseren.
              </span>
              <span className="hidden sm:inline">
                Estimer alderspensjon fra folketrygd, tjenestepensjon, AFP og
                egen sparing. Du får et{" "}
                <strong className="font-semibold text-white">intervall</strong>{" "}
                — ikke ett falskt presist tall. Alle beregninger skjer hos deg i
                nettleseren.
              </span>
            </p>
            <p className="mt-3 inline-flex items-center rounded-full border border-white/25 bg-accent/90 px-3 py-1 text-xs font-medium text-white shadow-sm sm:mt-4 sm:text-sm">
              Personvern først · lokalt i nettleseren
            </p>
            <p className="mt-4 sm:hidden">
              <a
                href="#results"
                className="inline-flex items-center gap-1 text-sm font-medium text-white/95 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
              >
                Se estimat ↓
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
