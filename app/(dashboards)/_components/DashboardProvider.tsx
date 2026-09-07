"use client";
import React, { useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/_components/ui/sidebar";
import { RoleSidebar, DashboardRole } from "@/_components/AppSidebar";
import ProtectedRoute from "@/_components/ProtectedRoute";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  hasRoutePermission,
  getRoleDashboard,
  mapDbRoleToUi,
} from "@/lib/auth/types";
import type { DbRole } from "@/lib/auth/types";
import PageLoading from "@/_components/Shared/PageLoading";

const sidebarStyle: React.CSSProperties = {
  backgroundColor: "gray",
  borderRadius: "0.5rem",
  padding: "0.4rem",
  opacity: "0.6",
  color: "white",
};

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const userRole = session?.user?.role;
  const role: DashboardRole | null = userRole ? mapDbRoleToUi(userRole) : null;

  useEffect(() => {
    // Only validate after session is loaded
    if (status === "loading") return;

    // If no session, ProtectedRoute will handle redirect
    if (!session?.user || !userRole) return;

    // Validate that current route matches user's role
    if (!hasRoutePermission(userRole as DbRole, pathname)) {
      const dashboardPath = getRoleDashboard(userRole as DbRole);
      router.replace(dashboardPath);
    }
  }, [status, session, userRole, pathname, router]);

  // Show loading during validation
  if (status === "loading" || !role) {
    return <PageLoading />;
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <RoleSidebar role={role} />
        <div className='w-full max-w-[100%]'>
          <SidebarTrigger
            className='fixed top-2 left-2.5 z-40 mt-0'
            style={sidebarStyle}
          />
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default DashboardProvider;
