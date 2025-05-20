import PublicProtected from "@/components/Auth/PublicProtected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicProtected>
      <main className='pt-14'>{children}</main>;
    </PublicProtected>
  );
}
