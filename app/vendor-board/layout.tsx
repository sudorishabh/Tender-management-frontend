import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/Vendor/For-Vendor/VendorSidebar";
import Protected from "@/components/Auth/Protected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected allowedRoles={["vendor"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
          } as React.CSSProperties
        }>
        <VendorSidebar />
        <div className='w-full max-w-[100%]'>
          <SidebarTrigger className='fixed ml-0.5 h-5 w-8 -top-[1.1rem] bg-gray-400 text-white hover:text-white hover:bg-gray-600' />
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </Protected>
  );
}
