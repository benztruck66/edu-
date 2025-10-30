import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${host}/sitemap.xml`,
  };
}


