import { useGetAssignedTendersQuery } from "@/Redux/tender/tenderApi";
import React, { useRef } from "react";
import TenderCardSkeleton from "../Shared/skeleton/TenderCardSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import TenderCard from "../Tender/TenderCard";
import { ITenderCard } from "@/app/Types/Tender-Types";
import { cn } from "@/lib/utils";
import { borderStyle } from "@/app/Styles";
import InfiniteScroll from "../Shared/InfiniteScroll";

const AssignedTenders = () => {
  const pageRef = useRef(1);

  const {
    user: { id },
  } = useSelector((state: RootState) => state.authSlice);

  const { data, isLoading, isFetching, refetch } = useGetAssignedTendersQuery({
    id: id,
    page: pageRef.current,
    limit: 5,
  });

  const hasTenders = data?.tenders && data.tenders.length > 0;

  return (
    <div>
      {isLoading && <TenderCardSkeleton />}

      {!isLoading && !hasTenders && (
        <div className='flex flex-col mt-20 items-center justify-center'>
          <h1 className='text-2xl font-semibold'>No tenders found</h1>
          <p className='text-gray-500'>No admin-assigned tenders available</p>
        </div>
      )}

      {!isLoading && hasTenders && (
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
