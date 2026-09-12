"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/ga";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  href?: string;
  source?: string;
};

/** Primary CTA back to the calculator — fires guide_cta_click. */
export function GuideCtaLink({
  href = "/",
  source = "guide",
  children,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      onClick={() => track("guide_cta_click", { source })}
      {...rest}
    >
      {children}
    </Link>
  );
}
