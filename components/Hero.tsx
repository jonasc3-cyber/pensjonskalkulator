import Image from "next/image";

const chips = [
  {
    title: "Uten innlogging",
    text: "Du trenger ikke BankID eller å opprette konto.",
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
    title: "Alt lokalt i nettleseren",
    text: "Ingen data lagres eller sendes. Dine tall forblir dine.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Intervall ikke fasit",
    text: "Resultatet er et estimat basert på forenklede satser og forutsetninger.",
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
] as const;

/** Variant B: full-bleed navy + photo; copy stays in max-w-6xl. */
export function Hero() {
  return (
    <>
      <section
        className="relative isolate w-full overflow-hidden bg-primary"
        aria-labelledby="hero-heading"
      >
        {/* Full-viewport photo on the right half (md+); full-bleed under text on mobile */}
        <div
          className="pointer-events-none absolute inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[52%] lg:w-[55%]"
        >
          <Image
            src="/hero-couple-b-bright.webp"
            alt="Par som sjekker pensjon sammen på laptop"
            fill
            priority
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover object-[55%_30%] sm:object-[60%_28%] md:object-[40%_28%]"
          />
        </div>
        {/* Navy wash: solid on left, soft blend into photo */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary from-0% via-primary/95 via-40% to-primary/20 to-100% md:via-primary md:via-[45%] md:to-transparent md:to-[72%]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[200px] w-full max-w-6xl flex-col justify-center px-4 py-8 sm:min-h-[280px] sm:px-6 sm:py-10 lg:min-h-[320px] lg:py-12">
          <div className="max-w-xl text-primary-foreground">
            <h1
              id="hero-heading"
              className="text-[28px] font-bold leading-tight tracking-tight sm:text-4xl lg:text-[40px]"
            >
              Pensjonskalkulator uten BankID
            </h1>
            <p className="mt-3 text-base leading-relaxed text-primary-foreground/90 sm:mt-4">
              Få et raskt estimat på hva du kan få i pensjon – helt uten
              innlogging. Alt beregnes{" "}
              <strong className="font-semibold text-white">lokalt</strong> i
              nettleseren din. Enkelt, privat og uten sporing.
            </p>
          </div>
        </div>
      </section>

      <section
        className="w-full border-b border-border/60 bg-[#F3F5F8]"
        aria-label="Hvorfor sjekkpensjon.no"
      >
        <ul className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3 sm:gap-5 sm:px-6 sm:py-8">
          {chips.map((chip) => (
            <li
              key={chip.title}
              className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                {chip.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">{chip.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                  {chip.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
