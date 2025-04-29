"use client";
import React, { useEffect, useRef } from "react";
import LiveTendersFilterBar from "@/components/Tender/For-Admin/LiveTendersFilterBar";
import { useGetTendersQuery } from "@/Redux/tender/tenderApi";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { SearchX } from "lucide-react";
import PageLoading from "@/components/Shared/PageLoading";
import TenderCardWithActions from "./TenderCardWithActions";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";
import { IAllTenderCard } from "@/app/Types/Tender-Types";

const LiveTenders = () => {
  const pageRef = useRef(1);

  const {
    tenderAdminFilter: { searchQuery, category, department },
  } = useSelector((state: RootState) => state.tenderSlice);

  const { data, isLoading, isFetching, refetch } = useGetTendersQuery({
    search: searchQuery,
    category: category,
    department: department,
    page: pageRef.current,
    limit: 5,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, category, department, refetch]);

  if (isLoading) return <PageLoading />;

  return (
    <div>
      <div className='w-full'>
        <div className='container mx-auto px-6 pt-8 pb-5'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Manage Live Tenders
          </h1>
          <p className='text-gray-600 mt-2 max-w-2xl'>
            Review, edit and track all tenders in one place. Use the filters
            below to find specific tenders.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-6 space-y-6 mb-12'>
        <LiveTendersFilterBar />

        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          {data && data?.tenders?.length > 0 ? (
            <InfiniteScroll
              hasMore={data?.hasMore}
              isFetching={isFetching}
              refetch={refetch}
              pageRef={pageRef}>
              {data?.tenders?.map((tender: IAllTenderCard) => (
                <TenderCardWithActions
                  key={tender.id}
                  tender={tender}
                />
              ))}
            </InfiniteScroll>
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
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTenders;
