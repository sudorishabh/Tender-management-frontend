"use client";

import { JsonLd } from "@/_components/SEO/JsonLd";
import {
  generateTenderSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { BASE_URL } from "@/lib/seo.config";
import { ITender } from "@/_types/tender";

interface TenderJsonLdProps {
  tender: ITender;
}

/**
 * Renders JSON-LD structured data for tender detail pages
 * Improves SEO by providing rich snippets for search engines
 */
const TenderJsonLd = ({ tender }: TenderJsonLdProps) => {
  // Generate tender product schema
  const tenderSchema = generateTenderSchema({
    id: tender.tender_id,
    title: tender.tender_title || "",
    description: tender.tender_description || undefined,
    department: tender.tender_department || undefined,
    bidStartDate: tender.tender_release_date
      ? new Date(tender.tender_release_date)
      : undefined,
    bidEndDate: tender.tender_bid_submission_deadline ? new Date(tender.tender_bid_submission_deadline) : undefined,
    estimatedValue: undefined,
    status: tender.tender_status || undefined,
    referenceNumber: tender.tender_number || undefined,
  });

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Tenders", url: `${BASE_URL}/` },
    {
      name: tender.tender_title || "Tender Details",
      url: `${BASE_URL}/tender/${tender.tender_id}`,
    },
  ]);

  return <JsonLd data={[tenderSchema, breadcrumbSchema]} />;
};

export default TenderJsonLd;
