/** V2 forside-hero: illustrasjon + tillitsstripe + personvern-callout (copy-only BankID). */

const chips = [
  {
    label: "Uten innlogging",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    label: "Alt lokalt i nettleseren",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    label: "Intervall ikke fasit",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none">
      <div
        className="relative aspect-square overflow-hidden rounded-full bg-gradient-to-b from-[#d7e6f2] via-[#c5dceb] to-[#b7d4e4] shadow-inner ring-1 ring-primary/10"
        aria-hidden
      >
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0 h-full w-full"
          role="presentation"
        >
          {/* Sky wash */}
          <circle cx="160" cy="160" r="160" fill="#D6E7F3" />
          <circle cx="160" cy="160" r="160" fill="url(#heroSky)" />
          {/* Distant mountains */}
          <path
            d="M0 178 L55 128 L95 158 L140 112 L185 150 L230 118 L280 155 L320 138 L320 320 L0 320 Z"
            fill="#9BB8CF"
            opacity="0.85"
          />
          <path
            d="M0 205 L70 155 L115 185 L165 145 L210 178 L265 150 L320 175 L320 320 L0 320 Z"
            fill="#7FA3BC"
          />
          {/* Lake */}
          <ellipse cx="160" cy="245" rx="130" ry="42" fill="#A9C9DE" />
          <ellipse cx="160" cy="248" rx="110" ry="28" fill="#BFD6E8" opacity="0.7" />
          {/* Hills / shore */}
          <path
            d="M0 230 C40 210 80 220 120 235 C150 248 180 248 210 235 C250 218 285 225 320 240 L320 320 L0 320 Z"
            fill="#6F9A7E"
          />
          <path
            d="M0 250 C50 235 90 245 130 258 C170 270 210 265 250 250 C280 240 300 245 320 255 L320 320 L0 320 Z"
            fill="#5E8A6C"
          />
          {/* Cabin */}
          <rect x="138" y="208" width="44" height="28" rx="2" fill="#E8EEF4" />
          <path d="M132 210 L160 188 L188 210 Z" fill="#0B2A4A" />
          <rect x="154" y="218" width="12" height="18" rx="1" fill="#1E4A73" />
          <rect x="142" y="214" width="10" height="8" rx="1" fill="#A9C9DE" />
          <rect x="168" y="214" width="10" height="8" rx="1" fill="#A9C9DE" />
          {/* Pines */}
          <g fill="#3F6B52">
            <path d="M78 250 L90 210 L102 250 Z" />
            <path d="M82 235 L90 205 L98 235 Z" />
            <rect x="87" y="248" width="6" height="10" fill="#4A5C48" />
            <path d="M218 248 L232 200 L246 248 Z" />
            <path d="M223 232 L232 195 L241 232 Z" />
            <rect x="229" y="246" width="6" height="12" fill="#4A5C48" />
            <path d="M248 252 L258 220 L268 252 Z" />
            <rect x="255" y="250" width="5" height="8" fill="#4A5C48" />
          </g>
          <defs>
            <radialGradient id="heroSky" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#EAF3F9" />
              <stop offset="100%" stopColor="#C5DCEB" />
            </radialGradient>
          </defs>
        </svg>

        {/* Central shield + lock */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-[42%] w-[42%] items-center justify-center rounded-[28%] bg-primary/90 shadow-lg ring-4 ring-white/70">
            <svg
              width="48%"
              height="48%"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                fill="#EAF1ED"
                stroke="#4F7A68"
                strokeWidth="1.5"
              />
              <path
                d="M8 11V8a4 4 0 0 1 8 0v3"
                stroke="#4F7A68"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="15.5" r="1.4" fill="#0B2A4A" />
            </svg>
          </div>
        </div>
      </div>

      {/* Personvern callout */}
      <aside className="relative z-10 mx-3 -mt-10 rounded-2xl border border-border bg-card p-3.5 shadow-md sm:absolute sm:bottom-2 sm:right-0 sm:mx-0 sm:mt-0 sm:max-w-[240px] sm:p-4 lg:max-w-[260px]">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
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
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">
              Ditt personvern er viktig
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              Alle beregninger gjøres lokalt i nettleseren din. Vi ser eller
              lagrer ingen av opplysningene dine.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="border-b border-border/60 bg-card"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
        <div className="max-w-xl">
          <h1
            id="hero-heading"
            className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
          >
            Pensjonskalkulator uten BankID
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">
            Raskt intervallanslag. Ingen BankID. Ingenting lagres på server.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6">
            {chips.map((chip) => (
              <li
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-primary-soft/80 px-3 py-1.5 text-xs font-medium text-primary sm:text-sm"
              >
                <span className="text-accent">{chip.icon}</span>
                {chip.label}
              </li>
            ))}
          </ul>

          <p className="mt-6 sm:mt-8">
            <a
              href="#skjema"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Se estimat
              <span aria-hidden>→</span>
            </a>
          </p>
        </div>

        <div className="justify-self-center lg:justify-self-end lg:pr-2">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
