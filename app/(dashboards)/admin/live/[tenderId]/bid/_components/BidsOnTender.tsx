"use client";
import { FC } from "react";
import AdminBidsOnTenderSkeleton from "@/components/Shared/skeleton/AdminBidsOnTenderSkeleton";

import { trpc } from "@/lib/trpc";
import { BidCard } from "./BidCard";
import { SearchX, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDisplayDateTime } from "@/utils/dateUtils";

interface Props {
  tenderId: string;
}

const BidsOnTender: FC<Props> = ({ tenderId }) => {
  const { data, isLoading } = trpc.bid.getTenderBids.useQuery({
    tenderId,
  });

  const bidsInfo = data?.data?.bids;
  const tenderTimeline = data?.data?.tenderTimeline;
  // Check if bid submission deadline has passed - bids should only be visible after deadline
  const isBidSubmissionClosed = tenderTimeline?.isBidSubmissionClosed;

  if (isLoading) return <AdminBidsOnTenderSkeleton />;

  // Show message if bid submission deadline has not passed yet
  // When deadline hasn't passed, isBidSubmissionClosed will be undefined or false
  if (!isBidSubmissionClosed) {
    const deadline = tenderTimeline?.bidSubmissionDeadline;
    const bidCount = data?.data?.bidCount ?? 0;

    return (
      <div className='mx-auto mb-12'>
        <div className='bg-white rounded-md shadow-sm border border-amber-200 overflow-hidden py-16 text-center'>
          <div className='h-16 w-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center'>
            <Lock className='h-8 w-8 text-amber-600' />
          </div>
          <h3 className='text-xl font-medium text-gray-900 mb-2'>
            Bids Not Yet Available
          </h3>
          <p className='text-gray-500 max-w-md mx-auto mb-4'>
            Bids will be visible after the submission deadline has passed.
          </p>

          {/* Bid Count Display */}
          <div className='mb-4'>
            <div className='inline-flex items-center gap-2 px-3.5 py-2.5 bg-primary/10 rounded-lg'>
              <div className='size-7 rounded-full bg-primary/20 flex items-center justify-center'>
                <span className='text-sm font-bold text-primary'>
                  {bidCount}
                </span>
              </div>
              <div className='text-left'>
                <p className='text-xs font-semibold text-gray-900'>
                  {bidCount === 1 ? "Bid" : "Bids"} Received
                </p>
                <p className='text-xs text-gray-500'>So far</p>
              </div>
            </div>
          </div>

          {deadline && (
            <div className='flex items-center justify-center gap-2 text-amber-700 bg-amber-50 py-2 px-4 rounded-md mx-auto w-fit'>
              <Clock className='h-4 w-4' />
              <span className='text-sm font-medium'>
                Deadline: {formatDisplayDateTime(deadline)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto mb-12'>
      {/* Timeline indicator for document visibility */}
      {tenderTimeline && (
        <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <h4 className='text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2'>
            <Clock className='h-4 w-4' />
            Document Visibility Timeline
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
            <div
              className={`flex items-center gap-2 ${
                tenderTimeline.canShowTechnicalDoc
                  ? "text-green-700"
                  : "text-gray-500"
              }`}>
              <div
                className={`h-2 w-2 rounded-full ${
                  tenderTimeline.canShowTechnicalDoc
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span>
                Technical Documents:{" "}
                {tenderTimeline.canShowTechnicalDoc
                  ? "Visible"
                  : "Hidden until " +
                    (tenderTimeline.technicalBidOpening
                      ? formatDisplayDateTime(
                          tenderTimeline.technicalBidOpening
                        )
                      : "N/A")}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                tenderTimeline.canShowFinancialDoc
                  ? "text-green-700"
                  : "text-gray-500"
              }`}>
              <div
                className={`h-2 w-2 rounded-full ${
                  tenderTimeline.canShowFinancialDoc
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span>
                Financial Documents:{" "}
                {tenderTimeline.canShowFinancialDoc
                  ? "Visible"
                  : "Hidden until " +
                    (tenderTimeline.financialBidOpening
                      ? formatDisplayDateTime(
                          tenderTimeline.financialBidOpening
                        )
                      : "N/A")}
              </span>
            </div>
          </div>
        </div>
      )}

      {bidsInfo?.length === 0 ? (
        <div className='bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden py-16 text-center'>
          <SearchX className='mx-auto h-12 w-12 text-gray-400 mb-4' />
          <h3 className='text-xl font-medium text-gray-900 mb-2'>
            No Bids Found
          </h3>
          <p className='text-gray-500 max-w-md mx-auto mb-6'>
            There are no bids matching your criteria for this tender.
          </p>
          <Button
            variant='outline'
            className='border-primary text-primary'>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className='bg-white rounded-md shadow-sm overflow-hidden'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {bidsInfo?.map((bid) => (
              <BidCard
                key={bid.bid.bid_id}
                bid={bid}
                tenderId={tenderId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BidsOnTender;
