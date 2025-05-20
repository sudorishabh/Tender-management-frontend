"use client";

import { RootState } from "@/Redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import HeaderDropdown from "./HeaderDropdown";
import { LayoutDashboard, LogIn } from "lucide-react";
import {
  borderStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "@/app/Styles";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import SearchResultBox from "./SearchResultBox";
import NotificationDropdown from "./NotificationDropdown";
import HeaderSkeleton from "../Shared/skeleton/HeaderSkeleton";

const Header = () => {
  const {
    isLoggedIn,
    isRefreshing: isLoading,
    user: { role },
  } = useSelector((state: RootState) => state.authSlice);

  return (
    <header
      className={cn(
        "fixed border-b bg-white/60 backdrop-blur-sm top-0 left-0 flex items-center w-full px-20 z-[50] h-12",
        borderStyle
      )}>
      <div className='flex justify-between items-center w-full '>
        <div className='flex items-center gap-8'>
          <Link
            href='/'
            className='flex items-center gap-2'>
            <span>
              <Image
                src='/TERI_LOGO.png'
                alt='TERI Logo'
                height={120}
                width={120}
                className='w-12 h-11'
              />
            </span>
          </Link>

          <SearchResultBox />
        </div>

        <div className='flex items-center gap-5 font-medium text-text-secondary-color'>
          {!isLoading ? (
            <>
              {isLoggedIn ? (
                <>
                  {role === "admin" && (
                    <Link href={"/admin"}>
                      <Button className={cn(secondaryButtonStyle, "h-8")}>
                        <LayoutDashboard />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  {role === "vendor" && (
                    <Link href={"/vendor-board"}>
                      <Button className={cn(secondaryButtonStyle, "h-8")}>
                        <LayoutDashboard />
                        Vendor Dashboard
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href={"/sign-in"}>
                    <Button className={cn(secondaryButtonStyle, "h-8")}>
                      <LogIn />
                      Sign In
                    </Button>
                  </Link>
                  <Link href={"/register"}>
                    <Button className={cn("h-8", primaryButtonStyle)}>
                      Register Now
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <HeaderSkeleton />
          )}
          {isLoggedIn ? (
            <>
              <NotificationDropdown />

              <HeaderDropdown />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
