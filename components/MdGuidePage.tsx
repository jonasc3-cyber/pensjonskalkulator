import Link from "next/link";
import { GuideCtaLink } from "@/components/GuideCtaLink";
import { GuideMarkdown } from "@/components/GuideMarkdown";
import { JsonLd } from "@/components/JsonLd";
import { formatDateNb } from "@/lib/format";
import { getGuide } from "@/lib/guides";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  type FaqItem,
} from "@/lib/jsonld";
import { loadGuideMarkdown } from "@/lib/loadGuide";

export function MdGuidePage({
  slug,
  path,
  h1,
  faq,
}: {
  slug: string;
  path: string;
  h1: string;
  /** Optional FAQPage schema from real on-page Q&A. */
  faq?: readonly FaqItem[];
}) {
  const { title, description, content } = loadGuideMarkdown(slug);
  const guide = getGuide(slug);
  const lastmod = guide?.lastmod;
  const url = `https://sjekkpensjon.no${path}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: h1,
          description: description || title,
          url,
          dateModified: lastmod,
          authorName: "Jonas Sætre",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd({
          name: h1,
          path,
        })}
      />
      {faq && faq.length > 0 ? <JsonLd data={faqPageJsonLd(faq)} /> : null}
      <p className="text-sm text-muted-foreground">
        <GuideCtaLink
          href="/"
          source="md_guide"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          ← Tilbake til kalkulatoren
        </GuideCtaLink>
        {" · "}
        <Link
          href="/guider"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Guider
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">{h1}</h1>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>
          Av{" "}
          <Link
            href="/om#hvem"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            Jonas Sætre
          </Link>
        </span>
        {lastmod ? (
          <span>
            Sist oppdatert:{" "}
            <time dateTime={lastmod}>{formatDateNb(lastmod)}</time>
          </span>
        ) : null}
      </p>
      <GuideMarkdown markdown={content} />
    </article>
  );
}
