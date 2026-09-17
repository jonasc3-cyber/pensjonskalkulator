import Link from "next/link";
import { GuideMarkdown } from "@/components/GuideMarkdown";
import { loadContentMarkdown } from "@/lib/loadGuide";

export function LegalMdPage({
  slug,
  h1,
  headingIds,
  related,
}: {
  slug: string;
  /** Canonical path — reserved for callers/metadata; not rendered. */
  path: string;
  h1: string;
  headingIds?: Record<string, string>;
  related?: { href: string; label: string }[];
}) {
  const { content } = loadContentMarkdown(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          ← Tilbake til kalkulatoren
        </Link>
        {related?.map((r) => (
          <span key={r.href}>
            {" · "}
            <Link
              href={r.href}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              {r.label}
            </Link>
          </span>
        ))}
      </p>
      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">{h1}</h1>
      <GuideMarkdown markdown={content} headingIds={headingIds} />
    </article>
  );
}
