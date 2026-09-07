import PublicProtected from "@/_components/PublicProtected";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo.config";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Sign In",
    "Sign in to TERI Tenders to access your vendor dashboard, submit bids, and manage your tender applications.",
    "/sign-in",
    ["TERI Tenders Login", "Vendor Sign In", "Tender Portal Access"]
  ),
  robots: {
    index: true,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicProtected>
      <main className='pt-14'>{children}</main>
    </PublicProtected>
  );
}
