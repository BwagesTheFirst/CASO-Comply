import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://casocomply.com";
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/services/pdf-remediation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/solutions/government`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/solutions/higher-education`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/enterprise`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-scan`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/resources/ada-title-ii-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/competitors`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/solutions/states/florida`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/states/illinois`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/states/minnesota`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/states/new-york`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/states/north-dakota`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/states/south-carolina`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/states/texas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
