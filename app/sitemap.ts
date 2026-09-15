import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";

const SITE = "https://sjekkpensjon.no";

/** Build-time lastmod for core pages (bump when content changes). */
const CORE: {
  path: string;
  lastmod: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", lastmod: "2026-09-10", changeFrequency: "weekly", priority: 1 },
  { path: "/om", lastmod: "2026-09-15", changeFrequency: "monthly", priority: 0.6 },
  {
    path: "/redaksjon",
    lastmod: "2026-09-15",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/annonsering",
    lastmod: "2026-09-15",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/personvern",
    lastmod: "2026-09-10",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/satser",
    lastmod: "2026-09-10",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/guider",
    lastmod: "2026-09-12",
    changeFrequency: "weekly",
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const core = CORE.map((p) => ({
    url: `${SITE}${p.path === "/" ? "/" : p.path}`,
    lastModified: p.lastmod,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const guides = GUIDES.map((g) => ({
    url: `${SITE}${g.path}`,
    lastModified: g.lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...core, ...guides];
}
