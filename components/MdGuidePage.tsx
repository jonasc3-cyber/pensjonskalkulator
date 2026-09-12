import Link from "next/link";
import { GuideMarkdown } from "@/components/GuideMarkdown";
import { JsonLd } from "@/components/JsonLd";
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
  const url = `https://sjekkpensjon.no${path}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: h1,
          description: description || title,
          url,
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
        <Link
          href="/"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          ← Tilbake til kalkulatoren
        </Link>
        {" · "}
        <Link
          href="/guider"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Guider
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">{h1}</h1>
      <GuideMarkdown markdown={content} />
    </article>
  );
}
