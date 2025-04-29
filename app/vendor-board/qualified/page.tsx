"use client";
import Heading from "@/components/Shared/Heading";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  IApprovedBidCard,
  useGetVendorApprovedBidsQuery,
} from "@/Redux/bid/bidApi";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";
import ApprovedBidCard from "@/components/Bid/ApprovedBidCard";

const QualifiedTendersPage = () => {
  const { id } = useSelector((state: RootState) => state.authSlice.user);
  const pageRef = useRef(1);
  const { data, isLoading, isFetching, refetch } =
    useGetVendorApprovedBidsQuery({
      vendorId: id,
      page: pageRef.current,
      limit: 5,
    });

  if (isLoading) return "Loading...";

  return (
    <div className='pt-[3.8rem] px-8 py-6'>
      <Heading
        title='Qualified Tenders'
        description='Tenders you have qualified for bidding'
        keywords='Qualified, Tenders, Vendor'
      />

      <div className='mt-6'>
        <h1 className='text-2xl font-bold mb-6'>Your Qualified Tenders</h1>

        {data && data?.approvedTenders.length > 0 ? (
          <InfiniteScroll
            hasMore={data?.hasMore}
            isFetching={isFetching}
            refetch={refetch}
            pageRef={pageRef}
            className='flex flex-col gap-5 mb-10'>
            {data?.approvedTenders.map((bid: IApprovedBidCard) => (
              <ApprovedBidCard
                key={bid.id}
                bid={bid}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <div className='text-center py-10'>
            <p className='text-gray-500 mb-4'>
              You haven&apos;t qualified for any tenders yet.
            </p>
            <Button className='bg-green-600 hover:bg-green-700'>
              Browse Available Tenders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualifiedTendersPage;
