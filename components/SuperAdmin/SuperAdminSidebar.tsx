"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownUp,
  Blocks,
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";

const adminSidebarLinks = [
  {
    title: "Dashboard",
    link: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Tenders",
    link: "/super-admin/tenders",
    icon: Blocks,
  },
  {
    title: "Manage Vendors",
    link: "/super-admin/vendors",
    icon: Users,
  },
  {
    title: "Manage Admins",
    link: "/super-admin/admins",
    icon: Users,
  },
  {
    title: "Bids",
    link: "/super-admin/bids",
    icon: ArrowDownUp,
  },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className='pt-[3.8rem] border-r border-gray-200 bg-white shadow-sm'>
      <SidebarGroup>
        <SidebarGroupLabel className='flex flex-col h-auto'>
          <div className='flex flex-col items-center justify-center pt-2 px-4'>
            <Avatar className='size-12 border-2 border-primary/20 mb-3 shadow-sm'>
              <AvatarImage
                src='https://github.com/shadcn.png'
                alt='Super Admin Avatar'
              />
              <AvatarFallback className='bg-primary/10 text-primary text-xl font-medium'>
                RN
              </AvatarFallback>
            </Avatar>
            <p className='font-semibold text-gray-800 text-base'>
              Rishabh Negi
            </p>
            <span className='text-sm text-gray-500'>Super Admin</span>
          </div>
          {/* <Separator className='mt-2' /> */}
        </SidebarGroupLabel>

        <SidebarGroupContent className='mt-6'>
          <ScrollArea className='h-[calc(100vh-14rem)]'>
            <div className='px-3 py-2'>
              <h3 className='text-xs font-semibold text-gray-500 uppercase  tracking-wider px-4 mb-2'>
                Main Menu
              </h3>
              <SidebarMenu>
                {adminSidebarLinks.slice(0, 4).map((item) => {
                  const isActive =
                    item.link === "/super-admin"
                      ? pathname === item.link
                      : pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 rounded-lg ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-primary" : "text-gray-800"
                            }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2 mt-6'>
                Management
              </h3>
              <SidebarMenu>
                {adminSidebarLinks.slice(4, 7).map((item) => {
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 rounded-lg ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-primary" : "text-gray-800"
                            }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2 mt-6'>
                System
              </h3>
              <SidebarMenu>
                {adminSidebarLinks.slice(7).map((item) => {
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 rounded-lg ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-primary" : "text-gray-800"
                            }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                <SidebarMenuItem className='mb-1 rounded-lg hover:bg-red-50 text-red-600'>
                  <SidebarMenuButton asChild>
                    <Link
                      href='/auth/login'
                      className='py- px-4 flex items-center'>
                      <LogOut className='mr-3 h-5 w-5 text-red-600' />
                      <span>Logout</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </ScrollArea>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
