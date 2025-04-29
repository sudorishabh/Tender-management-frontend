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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UserCircle,
  LogOut,
  BadgeCheck,
} from "lucide-react";

const vendorSidebarLinks = [
  {
    title: "Dashboard",
    link: "/vendor-board",
    icon: LayoutDashboard,
    category: "main",
  },
  {
    title: "Purchased Tenders",
    link: "/vendor-board/purchased",
    icon: ShoppingBag,
    category: "tenders",
  },
  {
    title: "Qualified Tenders",
    link: "/vendor-board/qualified",
    icon: BadgeCheck,
    category: "tenders",
  },
  {
    title: "Profile",
    link: "/vendor-board/profile",
    icon: UserCircle,
    category: "account",
  },
];

export const VendorSidebar = () => {
  const pathname = usePathname();

  const mainLinks = vendorSidebarLinks.filter(
    (item) => item.category === "main"
  );
  const tenderLinks = vendorSidebarLinks.filter(
    (item) => item.category === "tenders"
  );
  const accountLinks = vendorSidebarLinks.filter(
    (item) => item.category === "account"
  );

  return (
    <Sidebar className='border-r border-gray-200 bg-white shadow-sm pt-14'>
      <SidebarGroup>
        <SidebarGroupLabel className='flex flex-col h-auto'>
          <div className='flex flex-col items-center justify-center pt-2 px-4'>
            <Avatar className='size-12 border-2 border-primary/20 mb-3 shadow-sm'>
              <AvatarImage
                src='/avatar.png'
                alt='Vendor Avatar'
              />
              <AvatarFallback className='bg-primary/10 text-primary font-medium'>
                VS
              </AvatarFallback>
            </Avatar>
            <p className='font-semibold text-gray-800 text-base'>
              Vendor Portal
            </p>
            <span className='text-sm text-gray-500'>Manage your tenders</span>
          </div>
        </SidebarGroupLabel>

        <SidebarGroupContent className='mt-6'>
          <ScrollArea className='h-[calc(100vh-14rem)]'>
            <div className='px-3 py-2'>
              <SidebarMenu>
                {mainLinks.map((item) => {
                  const isActive =
                    item.link === "/vendor-board"
                      ? pathname === item.link
                      : pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 rounded-lg ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-primary" : "text-gray-500"
                            }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              <SidebarMenu>
                {tenderLinks.map((item) => {
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 rounded-lg ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-primary" : "text-gray-500"
                            }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              <SidebarMenu>
                {accountLinks.map((item) => {
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 rounded-lg ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-primary" : "text-gray-500"
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
                      href='/logi'
                      className='py-2.5 px-4 flex items-center'>
                      <LogOut className='mr-3 h-5 w-5 text-red-500' />
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
};
