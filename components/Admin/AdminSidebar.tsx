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
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownUp,
  BadgePlus,
  Blocks,
  ChartBarStacked,
  LayoutDashboard,
  Users,
  LogOut,
  Save,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { useLogoutQuery } from "@/Redux/auth/authApi";
import { useDispatch } from "react-redux";
import { setLogout } from "@/Redux/auth/authSlice";
import { toast } from "sonner";

const adminSidebarLinks = [
  {
    title: "Dashboard",
    link: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Create Tender",
    link: "/admin/create",
    icon: BadgePlus,
  },
  {
    title: "Saved Tenders",
    link: "/admin/saved",
    icon: Save,
  },
  {
    title: "Live Tenders & Bids",
    link: "/admin/live",
    icon: Blocks,
  },
  {
    title: "Manage Vendors",
    link: "/admin/vendors",
    icon: Users,
  },
  {
    title: "Categories",
    link: "/admin/categories",
    icon: ChartBarStacked,
  },
  {
    title: "All Bids",
    link: "/admin/bids",
    icon: ArrowDownUp,
  },
  // {
  //   title: "Admin Settings",
  //   link: "/admin/settings",
  //   icon: Shield,
  // },
];

export function AdminSidebar() {
  const [isLogout, setIsLogout] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useLogoutQuery({}, { skip: isLogout });
  useEffect(() => {
    if (data) {
      if ("success" in data) {
        if (data.success === true) {
          dispatch(setLogout());
          router.push("/");
          toast.success("Logout Successful!");
        }
      }
    }
  }, [data, dispatch, router]);

  return (
    <Sidebar className='pt-[3.8rem] border-r border-gray-200 bg-white shadow-sm'>
      <SidebarGroup>
        <SidebarGroupLabel className='flex flex-col h-auto'>
          <div className='flex flex-col items-center justify-center pt-2 px-4'>
            <Avatar className='size-12 border-2 border-primary/20 mb-3 shadow-sm'>
              <AvatarImage
                src='https://github.com/shadcn.png'
                alt='Admin Avatar'
              />
              <AvatarFallback className='bg-primary/10 text-primary text-xl font-medium'>
                RN
              </AvatarFallback>
            </Avatar>
            <p className='font-semibold text-gray-800 text-base'>
              Rishabh Negi
            </p>
            <span className='text-sm text-gray-500'>Administrator</span>
          </div>
          {/* <Separator className='mt-2' /> */}
        </SidebarGroupLabel>

        <SidebarGroupContent className='mt-6'>
          <ScrollArea className='h-[calc(100vh-14rem)]'>
            <div className='px-4 py-2'>
              <SidebarMenu>
                {adminSidebarLinks.map((item) => {
                  const isActive =
                    item.link === "/admin"
                      ? pathname === item.link
                      : pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-2 py-0.5 rounded-lg ${
                        isActive
                          ? "bg-accent/10 text-accent font-medium"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.link}
                          className='py-2.5 px-4 flex items-center'>
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-accent" : "text-gray-900"
                            }`}
                          />
                          <span
                            className={`${
                              isActive ? "text-accent" : "text-gray-900"
                            }`}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <Separator className='my-1' />
                <SidebarMenuButton asChild>
                  <span
                    onClick={() => setIsLogout(false)}
                    className='py-2.5 text-red-500 px-4 flex items-center cursor-pointer'>
                    <LogOut className='mr-3 h-5 w-5' />
                    Logout
                  </span>
                </SidebarMenuButton>
              </SidebarMenu>
            </div>
          </ScrollArea>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
