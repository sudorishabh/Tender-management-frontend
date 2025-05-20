import { FC } from "react";
import { BidCard } from "@/components/Bid/BidCard";
import { IBidCard, IBidsOnTenderResponse } from "@/Types/Bid-Types";
import { SearchX, ListOrdered, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { primaryButtonStyle } from "@/app/Styles";
import BidStatusConfirmDialog from "@/components/Bid/For-Admin/BidStatusConfirmDialog";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";
import { NextRouter } from "next/router";

interface Props {
  data: IBidsOnTenderResponse;
  isLoading: boolean;
  refetch: () => void;
  isFetching: boolean;
  pageRef: React.MutableRefObject<number>;
  setConfirmDialog: (confirmDialog: {
    isOpen: boolean;
    bidId: string;
    status: string;
    ranking?: number;
  }) => void;
  confirmDialog: {
    isOpen: boolean;
    bidId: string;
    status: string;
    ranking?: number;
  };
  tenderId: string;
  setBidStatus: (bidStatus: {
    bidId: string;
    status: string;
    ranking?: number;
  }) => void;
  isSettingBidStatus: boolean;
  router: NextRouter;
  scoreFilter: string;
  setScoreFilter: (scoreFilter: string) => void;
  confirmSetBidStatus: () => void;
}

const BidsOnTender: FC<Props> = ({
  data,
  refetch,
  isFetching,
  pageRef,
  setConfirmDialog,
  confirmDialog,
  isSettingBidStatus,
  router,
  scoreFilter,
  setScoreFilter,
  tenderId,
  confirmSetBidStatus,
}) => {
  async function handleSetBidStatus({
    bidId,
    status,
    ranking,
  }: {
    bidId: string;
    status: string;
    ranking?: number;
  }) {
    setConfirmDialog({
      isOpen: true,
      bidId,
      status,
      ranking,
    });
  }

  return (
    <div>
      <div className='w-full bg-white mb-7'>
        <div className='container mx-auto px-6 pt-8'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => router.back()}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
                <ArrowLeft className='size-6' />
              </button>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Review Tender Bids
                </h1>
                <p className='text-gray-600 mt-2 max-w-2xl'>
                  Review and evaluate bids based on technical and financial
                  scores. Filter by score ranges to identify top performing
                  vendors and make informed selection decisions.
                </p>
              </div>
            </div>

            <Button
              className={primaryButtonStyle}
              onClick={() =>
                router.push(`/admin/live/${tenderId}/bid/reviewed`)
              }>
              <ListOrdered />
              <p>Reviewed Bids</p>
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 mb-12'>
        <div className='bg-white rounded-xl border-gray-100 overflow-hidden mb-6'>
          <div className='flex items-center text-sm gap-2'>
            <span
              className={cn(
                "bg-gray-100 py-2 px-5 rounded-full cursor-pointer hover:bg-gray-200 transition-all duration-300",
                scoreFilter === "all" &&
                  "bg-primary text-white hover:bg-primary"
              )}
              onClick={() => setScoreFilter("all")}>
              All
            </span>
            <span
              className={cn(
                "bg-gray-100 py-2 px-5 rounded-full cursor-pointer hover:bg-gray-200 transition-all duration-300",
                scoreFilter === "high" &&
                  "bg-primary text-white hover:bg-primary"
              )}
              onClick={() => setScoreFilter("high")}>
              High (4-5)
            </span>
            <span
              className={cn(
                "bg-gray-100 py-2 px-5 rounded-full cursor-pointer hover:bg-gray-200 transition-all duration-300",
                scoreFilter === "medium" &&
                  "bg-primary text-white hover:bg-primary"
              )}
              onClick={() => setScoreFilter("medium")}>
              Medium (3)
            </span>
            <span
              className={cn(
                "bg-gray-100 py-2 px-5 rounded-full cursor-pointer hover:bg-gray-200 transition-all duration-300",
                scoreFilter === "low" &&
                  "bg-primary text-white hover:bg-primary"
              )}
              onClick={() => setScoreFilter("low")}>
              Low (&lt;3)
            </span>
          </div>
        </div>
        <div className='flex w-full items-center mb-6 gap-2 mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100'>
          <Info className='h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0' />
          <p className='text-sm text-blue-700'>
            <span className='font-semibold'>Note:</span> Bids marked as
            &apos;Rejected&apos; or &apos;Selected&apos; will be automatically
            moved to the Reviewed Bids section for further evaluation and
            processing.
          </p>
        </div>

        {data?.bids.length === 0 ? (
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden py-16 text-center'>
            <SearchX className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className='text-xl font-medium text-gray-900 mb-2'>
              No Bids Found
            </h3>
            <p className='text-gray-500 max-w-md mx-auto mb-6'>
              There are no bids matching your criteria for this tender.
            </p>
            <Button
              variant='outline'
              // onClick={clearFilters}
              className='border-primary text-primary'>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <InfiniteScroll
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              hasMore={data?.hasMore || false}
              isFetching={isFetching}
              refetch={refetch}
              pageRef={pageRef}>
              {data?.bids.map((bid: IBidCard) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  tenderId={tenderId}
                  setBidStatus={handleSetBidStatus}
                  isSettingBidStatus={isSettingBidStatus}
                />
              ))}
            </InfiniteScroll>
          </div>
        )}
      </div>

      <BidStatusConfirmDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          setConfirmDialog({ ...confirmDialog, isOpen })
        }
        status={confirmDialog.status}
        onConfirm={confirmSetBidStatus}
        isProcessing={isSettingBidStatus}
      />
    </div>
  );
};

export default BidsOnTender;
