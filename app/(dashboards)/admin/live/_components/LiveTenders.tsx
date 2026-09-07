"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useTenderContext } from "@/context/TenderContext";
import AdminLiveTendersSkeleton from "@/components/Shared/skeleton/AdminLiveTendersSkeleton";
import LiveTendersFilterBar from "./LiveTendersFilterBar";
import { SearchX, Clock, CheckCircle, Calendar } from "lucide-react";
import LiveTenderCard from "./LiveTenderCard";
import PaginationComponent from "@/components/Shared/Pagination";
import { cn } from "@/lib/utils";

const LiveTenders = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Derive activeTab directly from URL
  const tabFromUrl = searchParams.get("tab") as
    | "active"
    | "pending"
    | "upcoming"
    | null;
  const activeTab: "active" | "pending" | "upcoming" =
    tabFromUrl && ["active", "pending", "upcoming"].includes(tabFromUrl)
      ? tabFromUrl
      : "active";

  const {
    tenderAdminFilter: { searchQuery, department },
  } = useTenderContext();

  const liveTenderLimit = 50;
  const { data, isLoading, isFetching } = trpc.tender.getAdminLive.useQuery(
    {
      query: searchInput,
      department,
      page: currentPage.toString(),
      limit: liveTenderLimit.toString(),
      tab: activeTab,
    },
    {
      placeholderData: (previousData) => previousData,
    },
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setSearchInput(searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, department]);

  // Handle tab change by updating URL
  const handleTabChange = (tab: "active" | "pending" | "upcoming") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPage(1); // Reset to page 1 when tab changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <AdminLiveTendersSkeleton />;

  return (
    <div className='space-y-6 mb-12'>
      <LiveTendersFilterBar />

      {/* Tab Navigation */}
      <div className='flex items-center gap-2 border-b border-gray-200'>
        <button
          onClick={() => handleTabChange("active")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "active"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          )}>
          <CheckCircle className='h-4 w-4' />
          <span>Ready for Review</span>
          {data?.tab === "active" && (
            <span className='bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full'>
              {data?.totalCount || 0}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange("pending")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "pending"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          )}>
          <Clock className='h-4 w-4' />
          <span>Accepting Bids</span>
          {data?.tab === "pending" && (
            <span className='bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full'>
              {data?.totalCount || 0}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange("upcoming")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "upcoming"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          )}>
          <Calendar className='h-4 w-4' />
          <span>Upcoming Releases</span>
          {data?.tab === "upcoming" && (
            <span className='bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full'>
              {data?.totalCount || 0}
            </span>
          )}
        </button>
      </div>

      {/* Tab Description */}
      <div
        className={cn(
          "p-3 rounded-lg text-sm flex items-start gap-2",
          activeTab === "active"
            ? "bg-green-50 border border-green-200 text-green-800"
            : activeTab === "pending"
              ? "bg-amber-50 border border-amber-200 text-amber-800"
              : "bg-blue-50 border border-blue-200 text-blue-800",
        )}>
        {activeTab === "active" && (
          <>
            <CheckCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
            <span>
              <strong>Ready for Review:</strong> These tenders have passed their
              bid submission deadline. You can now view and evaluate submitted
              bids.
            </span>
          </>
        )}
        {activeTab === "pending" && (
          <>
            <Clock className='h-4 w-4 mt-0.5 flex-shrink-0' />
            <span>
              <strong>Accepting Bids:</strong> These tenders are still open for
              bid submissions. Bids will be visible for review after the
              submission deadline passes.
            </span>
          </>
        )}
        {activeTab === "upcoming" && (
          <>
            <Calendar className='h-4 w-4 mt-0.5 flex-shrink-0' />
            <span>
              <strong>Upcoming Releases:</strong> These tenders are approved but
              scheduled for a future release date. They are not yet visible to
              vendors for bidding.
            </span>
          </>
        )}
      </div>

      <div className='bg-white overflow-hidden relative'>
        {/* Filter refetch loading overlay */}
        {isFetching && !isLoading && (
          <div className='absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center'>
            <div className='flex flex-col items-center gap-3'>
              <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
              <p className='text-sm font-medium text-gray-600'>
                Applying filters...
              </p>
            </div>
          </div>
        )}

        {data && data?.tenders?.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {data?.tenders?.map((tender) => (
              <LiveTenderCard
                key={tender.tender_id}
                tender={tender}
                showBidDeadline={activeTab === "pending"}
              />
            ))}
          </div>
        ) : (
          <div className='bg-white p-20 flex flex-col items-center justify-center'>
            <SearchX
              className='mb-4 text-gray-400'
              size={48}
            />
            <h3 className='text-gray-700 font-medium text-lg mb-1'>
              No tenders found
            </h3>
            <p className='text-gray-500'>
              {activeTab === "active"
                ? "No tenders are ready for bid review yet"
                : activeTab === "pending"
                  ? "No tenders are currently accepting bids"
                  : "No upcoming tenders found"}
            </p>
          </div>
        )}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={data?.totalPages || 1}
          onPageChange={handlePageChange}
          isLoading={isFetching}
          className='py-8'
        />
      </div>
    </div>
  );
};

export default LiveTenders;
