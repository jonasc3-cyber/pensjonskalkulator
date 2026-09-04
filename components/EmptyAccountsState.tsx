type Props = {
  title: string;
  description: string;
  ctaLabel: string;
  onAdd: () => void;
  illustration?: "tp" | "saving";
};

function EmptyIllustration({ variant }: { variant: "tp" | "saving" }) {
  if (variant === "tp") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="mx-auto h-14 w-14 text-primary/35"
        fill="none"
        aria-hidden
      >
        <rect
          x="12"
          y="18"
          width="40"
          height="32"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M20 28h24M20 36h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="44" cy="40" r="8" fill="var(--primary-soft)" stroke="currentColor" strokeWidth="2" />
        <path
          d="M44 37v6M41 40h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="mx-auto h-14 w-14 text-primary/35"
      fill="none"
      aria-hidden
    >
      <path
        d="M18 42V26c0-1.1.9-2 2-2h24c1.1 0 2 .9 2 2v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="14"
        y="42"
        width="36"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M32 16v8M28 20h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="34" r="4" fill="var(--accent-soft)" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function EmptyAccountsState({
  title,
  description,
  ctaLabel,
  onAdd,
  illustration = "saving",
}: Props) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-primary-soft/40 px-4 py-8 text-center sm:px-6">
      <EmptyIllustration variant={illustration} />
      <p className="mt-3 text-sm font-medium text-primary">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span aria-hidden className="text-base leading-none">
          +
        </span>
        {ctaLabel}
      </button>
    </div>
  );
}
