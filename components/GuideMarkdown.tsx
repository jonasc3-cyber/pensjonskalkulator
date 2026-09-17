import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { ReactNode } from "react";

function textFromChildren(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }
  if (typeof children === "object" && "props" in children) {
    return textFromChildren(
      (children as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

function resolveHeadingId(
  text: string,
  headingIds?: Record<string, string>,
): string | undefined {
  if (headingIds?.[text]) return headingIds[text];
  // Cookie banner "Les mer" → /personvern#cookies
  if (/^cookies\b/i.test(text.trim())) return "cookies";
  return undefined;
}

function buildComponents(headingIds?: Record<string, string>): Components {
  return {
    a: ({ href, children }) => {
      if (!href) return <span>{children}</span>;
      const external =
        /^https?:\/\//.test(href) && !href.startsWith("https://sjekkpensjon.no");
      const internalAbsolute = href.startsWith("https://sjekkpensjon.no");
      const to = internalAbsolute
        ? href.replace("https://sjekkpensjon.no", "") || "/"
        : href;
      if (external) {
        return (
          <a
            href={href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={to}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          {children}
        </Link>
      );
    },
    h1: () => null, // title rendered by page shell
    h2: ({ children }) => {
      const text = textFromChildren(children);
      const id = resolveHeadingId(text, headingIds);
      return (
        <h2
          id={id}
          className={`mt-8 text-lg font-semibold text-primary${id ? " scroll-mt-24" : ""}`}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => (
      <h3 className="mt-5 text-base font-semibold text-primary">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-3 text-slate-600 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600 leading-relaxed">
        {children}
      </ol>
    ),
    li: ({ children }) => <li>{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    hr: () => <hr className="my-8 border-border" />,
    table: ({ children }) => (
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-border bg-muted/50">{children}</thead>
    ),
    tbody: ({ children }) => <tbody className="text-slate-600">{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border last:border-0">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2.5 font-semibold text-primary">{children}</th>
    ),
    td: ({ children }) => <td className="px-3 py-2.5 align-top">{children}</td>,
    blockquote: ({ children }) => (
      <blockquote className="mt-3 border-l-4 border-primary/30 pl-4 text-slate-600">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-slate-800">
        {children}
      </code>
    ),
  };
}

/** Strip leading H1 so page shell owns the title. */
function stripLeadingH1(md: string): string {
  return md.replace(/^#\s+[^\n]+\n+/, "");
}

export function GuideMarkdown({
  markdown,
  headingIds,
}: {
  markdown: string;
  /** Exact heading text → element id (e.g. cookies section for banner Les mer). */
  headingIds?: Record<string, string>;
}) {
  return (
    <div className="guide-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={buildComponents(headingIds)}
      >
        {stripLeadingH1(markdown)}
      </ReactMarkdown>
    </div>
  );
}
