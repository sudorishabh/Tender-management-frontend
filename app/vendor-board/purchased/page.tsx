"use client";
import Heading from "@/components/Shared/Heading";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  IPurchasedBidCard,
  useGetVendorPurchasedBidsQuery,
} from "@/Redux/bid/bidApi";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";
import PurchasedBidCard from "@/components/Bid/PurchasedBidCard";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";

const PurchasedTendersPage = () => {
  const { id } = useSelector((state: RootState) => state.authSlice.user);
  const pageRef = useRef(1);
  const { data, isLoading, isFetching, refetch } =
    useGetVendorPurchasedBidsQuery({
      vendorId: id,
      page: pageRef.current,
      limit: 5,
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const purchasedTenders = data?.purchasedTenders;

  return (
    <div className='pt-[3.8rem] px-8 py-6'>
      <Heading
        title='Purchased Tenders'
        description='Tenders you have purchased documents for'
        keywords='Purchased, Tenders, Vendor'
      />

      <div className='mt-6'>
        <h1 className='text-2xl font-bold mb-6'>Your Purchased Tenders</h1>

        {purchasedTenders && purchasedTenders.length > 0 ? (
          <InfiniteScroll
            hasMore={data?.hasMore}
            isFetching={isFetching}
            refetch={refetch}
            pageRef={pageRef}
            className='flex flex-col gap-5 mb-10'>
            {purchasedTenders.map((bid: IPurchasedBidCard) => (
              <PurchasedBidCard
                key={bid.id}
                bid={bid}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <div className='text-center py-10'>
            <p className='text-gray-500 mb-4'>
              You haven&apos;t purchased any tender documents yet.
            </p>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              Browse Available Tenders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedTendersPage;
