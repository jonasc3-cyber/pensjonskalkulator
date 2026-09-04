import Image from "next/image";

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
      aria-hidden
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        className="object-cover object-center"
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
