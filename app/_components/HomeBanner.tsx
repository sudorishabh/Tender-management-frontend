"use client";
import Link from "next/link";
import React from "react";
import { ChevronRight, LayoutDashboard, FileText, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { getRoleDashboard } from "@/lib/auth/types";
import type { DbRole } from "@/lib/auth/types";
import { trpc } from "@/lib/trpc";

/**
 * Headline counts under the hero copy.
 *
 * Hidden while loading, and also hidden when nothing is currently open - a
 * hero advertising "0 open tenders" is worse than no strip at all. The list
 * below still reports the real count either way.
 */
const HomeBannerStats = () => {
  const { data } = trpc.tender.getHomeStats.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  if (!data || data.openTenders === 0) return null;

  const stats = [
    { value: data.openTenders, label: "Open tenders" },
    { value: data.departments, label: "Departments" },
    { value: data.closingThisWeek, label: "Closing this week" },
  ];

  return (
    <dl className='flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-4'>
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className='text-[0.7rem] uppercase tracking-wider text-white/70'>
            {stat.label}
          </dt>
          <dd className='text-xl font-bold text-white md:text-2xl'>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

const HomeBanner = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isRefreshing = status === "loading";

  if (isRefreshing) return null;

  // Authenticated user banner
  if (isAuthenticated) {
    const userName = session?.user?.name || "User";
    const userRole = session?.user?.role;
    const dashboardLink = getRoleDashboard(userRole as DbRole);

    return (
      <div className='relative mb-5 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/90 shadow-md'>
        {/* Decorative elements */}
        <div className='absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-10'></div>
        <div className='absolute bottom-0 left-0 h-24 w-24 -translate-x-1/4 translate-y-1/4 rounded-full bg-white opacity-5'></div>

        {/* Top accent line */}
        <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/50 via-white to-white/50'></div>

        <div className='relative z-10 px-4 md:px-6 py-3 md:py-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
            {/* Welcome message */}
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
                <User className='h-4 w-4 text-white' />
              </div>
              <div>
                <h2 className='text-sm font-semibold text-white'>
                  Welcome back, {userName}!
                </h2>
                <p className='text-xs text-white/80'>
                  Ready to explore new tender opportunities?
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className='flex items-center gap-2'>
              <Link href={dashboardLink}>
                <button className='flex items-center gap-1.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-white/25 hover:border-white/50'>
                  <LayoutDashboard className='h-3.5 w-3.5' />
                  <span>Dashboard</span>
                </button>
              </Link>
              {userRole === "vendor" && (
                <Link href='/vendor/purchased'>
                  <button className='flex items-center gap-1.5 rounded-lg bg-white border-2 border-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-all hover:shadow-md hover:scale-[1.02]'>
                    <FileText className='h-3.5 w-3.5' />
                    <span>My Bids</span>
                  </button>
                </Link>
              )}
              {(userRole === "admin" || userRole === "super_admin") && (
                <Link href='/admin/bids'>
                  <button className='flex items-center gap-1.5 rounded-lg bg-white border-2 border-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-all hover:shadow-md hover:scale-[1.02]'>
                    <FileText className='h-3.5 w-3.5' />
                    <span>Manage Bids</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated user banner
  return (
    <div className='relative mb-5 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/90 shadow-lg'>
      {/* Decorative element */}
      <div className='absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-10'></div>

      {/* Top accent line */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/50 via-white to-white/50'></div>

      <div className='relative z-10 px-5 md:px-8 py-6 md:py-9'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-2.5 text-2xl font-bold leading-tight text-white md:text-4xl'>
            TERI Official eTender Portal
          </h1>

          <p className='mb-6 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base'>
            Welcome to The Energy and Resources Institute (TERI) tender portal.
            Discover, bid, and manage tenders for sustainable development,
            energy research, and environmental projects.
          </p>

          <HomeBannerStats />

          <div className='mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
            <div className='flex gap-2.5'>
              <Link href='/register'>
                <button className='rounded-lg bg-white px-4 py-2 text-xs font-semibold text-primary shadow-md transition-all hover:shadow-lg hover:scale-105'>
                  Register Now
                </button>
              </Link>
              <Link href='/sign-in'>
                <button className='rounded-lg border-2 border-white/60 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/20 hover:border-white'>
                  Sign In
                </button>
              </Link>
            </div>
            <Link
              href='/about'
              className='flex items-center text-white/90 text-xs font-medium hover:text-white transition-colors group'>
              <span className='underline-offset-4 group-hover:underline'>
                Learn More
              </span>
              <ChevronRight className='h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
