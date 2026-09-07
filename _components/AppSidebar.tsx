"use client";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ScrollArea } from "@/_components/ui/scroll-area";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  useSidebar,
} from "@/_components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Separator } from "@/_components/ui/separator";
import {
  LayoutDashboard,
  BadgePlus,
  Blocks,
  CircleCheckBig,
  Save,
  Users,
  ArrowDownUp,
  LogOut,
  ShoppingBag,
  BadgeCheck,
  UserCircle,
  Share2,
  ClipboardList,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useLogout from "@/hooks/useLogout";

// Roles supported
export type DashboardRole = "admin" | "vendor" | "super";

interface RoleSidebarProps {
  role: DashboardRole;
}

interface LinkItem {
  title: string;
  link: string;
  icon: any; // lucide icon component
  group?: string; // for vendor grouping
}

const adminLinks: LinkItem[] = [
  { title: "Dashboard", link: "/admin", icon: LayoutDashboard },
  { title: "Create Tender", link: "/admin/create", icon: BadgePlus },
  { title: "Live Tenders & Bids", link: "/admin/live", icon: Blocks },
  { title: "Approved Bids", link: "/admin/approved", icon: CircleCheckBig },
  { title: "Saved & Reviewed Tenders", link: "/admin/saved", icon: Save },
  { title: "Manage Vendors", link: "/admin/vendors", icon: Users },
  { title: "All Bids", link: "/admin/bids", icon: ArrowDownUp },
];

const vendorLinks: LinkItem[] = [
  { title: "Dashboard", link: "/vendor", icon: LayoutDashboard, group: "main" },
  {
    title: "Purchased Tenders",
    link: "/vendor/purchased",
    icon: ShoppingBag,
    group: "tenders",
  },
  {
    title: "Profile",
    link: "/vendor/profile",
    icon: UserCircle,
    group: "account",
  },
];

const superLinks: LinkItem[] = [
  { title: "Invite Admin", link: "/super/invite", icon: Share2 },
  { title: "Manage Admins", link: "/super/admins", icon: Users },
  { title: "Review Tender", link: "/super/tenders", icon: ClipboardList },
];

// Avatar/header config per role
const roleHeaderConfig: Record<
  DashboardRole,
  { image?: string; fallback: string; nameLine1: string; nameLine2: string }
> = {
  admin: {
    image: "https://github.com/shadcn.png",
    fallback: "TERI",
    nameLine1: "TERI",
    nameLine2: "Administrator",
  },
  vendor: {
    image: "/avatar.png",
    fallback: "VS",
    nameLine1: "Vendor Portal",
    nameLine2: "Manage your tenders",
  },
  super: {
    image: "https://github.com/shadcn.png",
    fallback: "RN",
    nameLine1: "Super Admin",
    nameLine2: "Dashboard",
  },
};

export const RoleSidebar = ({ role }: RoleSidebarProps) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { logout, isLoggingOut } = useLogout();

  // Pick links for role
  const links: LinkItem[] = useMemo(() => {
    if (role === "admin") return adminLinks;
    if (role === "vendor") return vendorLinks;
    return superLinks;
  }, [role]);

  // Vendor grouping
  const vendorGroupsOrder = ["main", "tenders", "account"];
  const groupedVendorLinks: Record<string, LinkItem[]> = useMemo(() => {
    if (role !== "vendor") return {};
    return vendorGroupsOrder.reduce(
      (acc, grp) => {
        acc[grp] = links.filter((l) => l.group === grp);
        return acc;
      },
      {} as Record<string, LinkItem[]>,
    );
  }, [links, role]);

  // Render helper for a single link item
  const renderLink = (item: LinkItem) => {
    const isActive =
      item.link === (role === "admin" ? `/${role}` : `/${role}`)
        ? pathname === item.link
        : pathname.startsWith(item.link);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={item.title}
          className={`w-full pl-5 my-0.5 py-[1rem] rounded-sm ${
            isActive
              ? " text-primary font-medium hover:"
              : "hover:bg-gray-100 text-gray-600"
          }`}>
          <Link
            href={item.link}
            className='w-full flex'>
            <item.icon
              className={cn(isActive ? "text-primary" : "text-gray-700")}
            />
            <span
              className={cn(
                "text-[12.5px]",
                isActive ? "text-primary" : "text-gray-700",
              )}>
              {item.title}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  // Safely access roleHeaderConfig with a fallback for invalid roles
  const headerConfig = roleHeaderConfig[role as DashboardRole] || {
    fallback: "U",
    nameLine1: "User",
    nameLine2: "Dashboard",
  };
  const { image, fallback, nameLine1, nameLine2 } = headerConfig;

  return (
    <Sidebar
      collapsible='icon'
      className='pt-2 h-screen border-r  border-gray-200 bg-white shadow-sm'>
      <SidebarContent>
        <SidebarGroup className='h-[calc(100vh-0.5rem)] p-0'>
          <SidebarGroupLabel className='flex flex-col h-auto px-2 mt-2'>
            <div className='flex items-center gap-2.5 justify-center'>
              <Avatar
                className={`border-2 border-primary/20 mb-1 shadow-sm transition-all ${
                  state === "collapsed" ? "size-8" : "size-10"
                }`}>
                {/* <AvatarImage
                  src={image}
                  alt={nameLine1}
                /> */}
                <AvatarFallback
                  className={`bg-primary/10 text-gray-500 font-medium ${
                    state === "collapsed" ? "text-xs" : "text-base"
                  }`}>
                  {fallback}
                </AvatarFallback>
              </Avatar>
              {state === "expanded" && (
                <span className='flex flex-col items-start gap-0'>
                  <p className='font-semibold text-sm text-gray-500'>
                    {nameLine1}
                  </p>
                  <p className='text-xs text-gray-500'>{nameLine2}</p>
                </span>
              )}
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent
            className={`${state === "collapsed" ? "mt-10" : "mt-5"}`}>
            <ScrollArea
              className={`h-[calc(100vh-10rem)] ${
                state !== "collapsed" ? "pr-3 ml-3" : "pr-0 ml-0"
              }`}>
              <SidebarMenu>
                {role === "vendor" ? (
                  // Vendor grouped sections
                  Object.entries(groupedVendorLinks).map(
                    ([groupKey, groupLinks], idx) => (
                      <div
                        key={groupKey}
                        className='w-full'>
                        {groupLinks.map(renderLink)}
                        {idx < vendorGroupsOrder.length - 1 && (
                          <Separator className='my-3' />
                        )}
                      </div>
                    ),
                  )
                ) : (
                  // Admin & Super (flat)
                  <>{links.map(renderLink)}</>
                )}

                <Separator className='my-2' />
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip='Logout'
                    className='w-full pl-6 text-red-500 hover:bg-red-50'
                    disabled={isLoggingOut}
                    onClick={logout}>
                    <LogOut />
                    {isLoggingOut ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      "Logout"
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
