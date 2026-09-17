"use client";

import type { ReactNode } from "react";
import { openCookieSettings } from "@/lib/cookieConsent";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function CookieSettingsLink({
  className,
  children = "Cookies",
}: Props) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}
