"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BadgeCheck,
  CheckCircle2,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetVendorDashboardStatsQuery } from "@/Redux/vendor/vendorApi";
import { formatDistanceToNow } from "date-fns";

// Define activity type
interface Activity {
  id: number | string;
  type: string;
  status: string;
  createdAt: string;
  tenderId: number | string;
  tenderTitle: string;
  tenderNumber: string;
}

const VendorDashboard = () => {
  const {
    data: statsData,
    isLoading,
    error,
  } = useGetVendorDashboardStatsQuery({});

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-96'>
        <LoaderCircle className='h-10 w-10 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-8 py-6'>
        <h1 className='text-2xl font-bold mb-6'>Vendor Dashboard</h1>
        <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
          <p className='text-red-700'>
            There was an error loading dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {
    purchasedTenders: 0,
    qualifiedTenders: 0,
    participatedTenders: 0,
    activeBids: 0,
    recentActivities: [],
  };

  const getActivityIcon = (type: string, status: string) => {
    if (type === "purchase")
      return <ShoppingBag className='h-4 w-4 text-blue-600' />;
    if (status === "qualified")
      return <BadgeCheck className='h-4 w-4 text-green-600' />;
    return <CheckCircle2 className='h-4 w-4 text-purple-600' />;
  };

  const getActivityBorderColor = (type: string, status: string) => {
    if (type === "purchase") return "border-blue-500";
    if (status === "qualified") return "border-green-500";
    return "border-purple-500";
  };

  const getActivityText = (
    type: string,
    status: string,
    tenderTitle: string
  ) => {
    if (type === "purchase") return `Documents purchased for ${tenderTitle}`;
    if (status === "qualified") return `You qualified for ${tenderTitle}`;
    return `Bid submitted for ${tenderTitle}`;
  };

  return (
    <div className='px-8 py-6'>
      <h1 className='text-2xl font-bold mb-6'>Vendor Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Purchased Tenders Card */}
        <Card className='bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-medium flex items-center'>
              <ShoppingBag className='h-5 w-5 mr-2 text-blue-600' />
              Purchased Tenders
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col justify-between'>
            <div>
              <div className='text-3xl font-bold mb-2'>
                {stats.purchasedTenders}
              </div>
              <p className='text-sm text-gray-600 mb-4'>
                Tenders you have purchased documents for
              </p>
            </div>
            <Link href='/vendor-board/purchased'>
              <Button className='w-full bg-primary hover:bg-primary/90 text-white'>
                View Purchased Tenders
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Qualified Tenders Card */}
        <Card className='bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-medium flex items-center'>
              <BadgeCheck className='h-5 w-5 mr-2 text-green-600' />
              Qualified Tenders
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col justify-between'>
            <div>
              <div className='text-3xl font-bold mb-2'>
                {stats.qualifiedTenders}
              </div>
              <p className='text-sm text-gray-600 mb-4'>
                Tenders you&apos;ve qualified for bidding
              </p>
            </div>
            <Link href='/vendor-board/qualified'>
              <Button className='w-full bg-primary hover:bg-primary/90 text-white'>
                View Qualified Tenders
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Participated Tenders Card */}
        <Card className='bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-medium flex items-center'>
              <CheckCircle2 className='h-5 w-5 mr-2 text-purple-600' />
              Participated Tenders
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col justify-between'>
            <div>
              <div className='text-3xl font-bold mb-2'>
                {stats.participatedTenders}
              </div>
              <p className='text-sm text-gray-600 mb-4'>
                Tenders you have submitted bids for
              </p>
            </div>
            <Link href='/vendor-board/participated'>
              <Button className='w-full bg-primary hover:bg-primary/90 text-white'>
                View Participated Tenders
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Bids Card */}
        <Card className='bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-medium flex items-center'>
              <CheckCircle2 className='h-5 w-5 mr-2 text-orange-600' />
              Active Bids
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col justify-between'>
            <div>
              <div className='text-3xl font-bold mb-2'>{stats.activeBids}</div>
              <p className='text-sm text-gray-600 mb-4'>
                Your bids currently under review
              </p>
            </div>
            <Link href='/vendor-board/bids'>
              <Button className='w-full bg-primary hover:bg-primary/90 text-white'>
                View Active Bids
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity section */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
        <Card className='bg-white shadow-sm'>
          <CardContent className='pt-6'>
            {stats.recentActivities && stats.recentActivities.length > 0 ? (
              <div className='space-y-4'>
                {stats.recentActivities.map((activity: Activity) => (
                  <div
                    key={`${activity.id}-${activity.type}`}
                    className={`border-l-4 ${getActivityBorderColor(
                      activity.type,
                      activity.status
                    )} pl-4 py-2`}>
                    <div className='flex items-start'>
                      {getActivityIcon(activity.type, activity.status)}
                      <div className='ml-2'>
                        <p className='font-medium'>
                          {getActivityText(
                            activity.type,
                            activity.status,
                            activity.tenderTitle
                          )}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {activity.tenderNumber}
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-4'>
                No recent activities found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
