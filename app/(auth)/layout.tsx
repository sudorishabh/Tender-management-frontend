import PublicProtected from "@/components/Auth/PublicProtected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicProtected>
      <main>{children}</main>;
    </PublicProtected>
  );
}
