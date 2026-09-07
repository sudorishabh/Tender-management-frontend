import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://etender.teri.res.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Static pages with SEO priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sign-in`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Note: For dynamic tender pages, you would typically fetch from database
  // Example of how to add dynamic routes:
  // const tenders = await fetchAllTenders();
  // const tenderPages = tenders.map((tender) => ({
  //   url: `${BASE_URL}/tender/${tender.id}`,
  //   lastModified: tender.updatedAt,
  //   changeFrequency: "daily" as const,
  //   priority: 0.9,
  // }));

  return [...staticPages];
}

// For generating dynamic sitemap with tender data, create this API route:
// app/api/sitemap/route.ts
