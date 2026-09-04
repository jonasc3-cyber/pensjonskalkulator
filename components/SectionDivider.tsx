type Props = {
  src: string;
  /** Decorative by default — leave empty. */
  alt?: string;
  className?: string;
  /** Light navy fade; on by default. */
  overlay?: boolean;
};

/**
 * Thin photo band between form sections — not a full-page background.
 * Uses plain <img> to avoid next/image INVALID_IMAGE_OPTIMIZE_REQUEST on some mobile views.
 */
export function SectionDivider({
  src,
  alt = "",
  className = "",
  overlay = true,
}: Props) {
  return (
    <div
      className={`relative h-[120px] overflow-hidden rounded-2xl sm:h-[160px] ${className}`}
      aria-hidden={alt ? undefined : true}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
      {overlay ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
