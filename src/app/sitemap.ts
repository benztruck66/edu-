import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  return [
    "",
    "/universities",
    "/rankings",
    "/programs",
    "/compare",
    "/about",
  ].map((p) => ({ url: base + p, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}


