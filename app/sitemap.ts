import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sjekkpensjon.no";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/om`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/guider`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${base}/guider/hvor-mye-far-jeg-i-pensjon`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
