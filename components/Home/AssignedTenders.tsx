import { useGetAssignedTendersQuery } from "@/Redux/tender/tenderApi";
import React, { useRef } from "react";
import TenderCardSkeleton from "../Shared/skeleton/TenderCardSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import TenderCard from "../Tender/TenderCard";
import { ITenderCard } from "@/Types/Tender-Types";
import { cn } from "@/lib/utils";
import { borderStyle } from "@/app/Styles";
import InfiniteScroll from "../Shared/InfiniteScroll";

const AssignedTenders = () => {
  const pageRef = useRef(1);

  const {
    user: { id, role },
  } = useSelector((state: RootState) => state.authSlice);

  const { data, isLoading, isFetching, refetch } = useGetAssignedTendersQuery(
    {
      id: id,
      page: pageRef.current,
      limit: 5,
    },
    {
      skip: role !== "vendor",
    }
  );

  const hasTenders = data?.tenders && data.tenders.length > 0;
  if (isLoading) return <TenderCardSkeleton />;

  return (
    <div>
      {role === "admin" && (
        <div className='flex flex-col mt-20 items-center justify-center'>
          <h1 className='text-2xl font-semibold'>
            You are not authorized to view this page
          </h1>
          <p className='text-gray-500'>
            Only vendors can view their assigned tenders
          </p>
        </div>
      )}

      {!isLoading && !hasTenders && role === "vendor" && (
        <div className='flex flex-col mt-20 items-center justify-center'>
          <h1 className='text-2xl font-semibold'>No tenders found</h1>
          <p className='text-gray-500'>No admin-assigned tenders available</p>
        </div>
      )}

      {!isLoading && hasTenders && role === "vendor" && (
        <InfiniteScroll
          hasMore={data?.hasMore}
          isFetching={isFetching}
          refetch={refetch}
          pageRef={pageRef}
          className='flex flex-col gap-2 mb-10'>
          {data.tenders.map((tender: ITenderCard) => (
            <div
              key={tender.id}
              className={cn("border-b", borderStyle)}>
              <TenderCard tender={tender} />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default AssignedTenders;
