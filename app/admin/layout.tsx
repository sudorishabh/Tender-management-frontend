import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import Protected from "@/components/Auth/Protected";
import { Menu, PanelLeftClose } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected allowedRoles={["admin"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            // "--sidebar-width-mobile": "20rem",
          } as React.CSSProperties
        }>
        <AdminSidebar />
        <div className='w-full max-w-[100%]'>
          <SidebarTrigger
            className='fixed ml-1 size-8 -top-[1.7rem] rounded-full bg-gray-400/60 text-white hover:text-white hover:bg-gray-400'
            iconOpen={<PanelLeftClose className='size-3' />}
            iconClosed={<Menu className='size-3' />}
          />
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </Protected>
  );
}
