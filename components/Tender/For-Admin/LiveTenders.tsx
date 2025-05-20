import React, { FC } from "react";
import LiveTendersFilterBar from "@/components/Tender/For-Admin/LiveTendersFilterBar";
import { SearchX } from "lucide-react";
import TenderCardWithActions from "./TenderCardWithActions";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";
import { IAllTenderCard, ILiveTenders } from "@/Types/Tender-Types";

interface Props {
  data: ILiveTenders;
  isLoading: boolean;
  refetch: () => void;
  isFetching: boolean;
  pageRef: React.MutableRefObject<number>;
}

const LiveTenders: FC<Props> = ({ data, refetch, isFetching, pageRef }) => {
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
