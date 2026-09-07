import type { Metadata } from "next";
import DashboardProvider from "./_components/DashboardProvider";
import { generatePageMetadata } from "@/lib/seo.config";

// Generate comprehensive metadata for dashboard section
export const metadata: Metadata = {
  ...generatePageMetadata(
    "Dashboard",
    "Manage your tenders, bids, and vendor activities. Access comprehensive analytics and tender management tools.",
    "/dashboard",
    ["Dashboard", "Tender Management", "Vendor Portal", "Bid Management"]
  ),
  robots: {
    index: false, // Dashboard pages should not be indexed
    follow: false,
  },
};

export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
