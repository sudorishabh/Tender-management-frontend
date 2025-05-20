"use client";
import { format, formatDistanceToNow } from "date-fns";
import {
  Star,
  Building2,
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/lib/helper";
import { Button } from "../ui/button";
import { IBidCard } from "@/Types/Bid-Types";
import { FC } from "react";
import {
  borderStyle,
  primaryButtonStyle,
  secondaryButtonStyle2,
} from "@/app/Styles";
import { cn } from "@/lib/utils";

interface Props {
  bid: IBidCard;
  tenderId: string;
  setBidStatus: ({
    bidId,
    status,
    ranking,
  }: {
    bidId: string;
    status: string;
    ranking?: number;
  }) => Promise<void>;
  isSettingBidStatus: boolean;
}

export const BidCard: FC<Props> = ({
  bid,
  tenderId,
  setBidStatus,
  isSettingBidStatus,
}) => {
  const formattedDate = formatDistanceToNow(new Date(bid.created_at), {
    addSuffix: true,
  });

  const hasScores =
    bid.technical_score !== undefined && bid.financial_score !== undefined;

  const handleSelectBid = () => {
    setBidStatus({ bidId: bid.id, status: "selected" });
  };

  return (
    <div
      className={cn(
        "group p-5 relative rounded-xl bg-white border shadow-sm overflow-hidden",
        borderStyle
      )}>
      <div className='absolute top-1.5  right-2 z-10'>
        <input
          type='checkbox'
          className='w-4 h-4 cursor-pointer'
        />
      </div>
      {/* Header Section */}
      <div className='pb-3 mt-3.5'>
        <div className='flex items-start justify-between gap-4'>
          <div className='w-[78%]'>
            <div className='flex items-center gap-2 mb-3'>
              <Building2 className='h-4 w-4 text-gray-700' />
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {capitalizeFirstLetter(bid.business_name) || "Business Name"}
              </h3>
            </div>
            <p className='text-sm text-gray-700 mb-2'>
              {bid.business_classification || "Business Classification"}
            </p>
            <span className='text-sm text-gray-700 flex items-center gap-1'>
              {/* <Calendar className='h-3 w-3' /> */}
              {capitalizeFirstLetter(formattedDate)}
            </span>
          </div>
          {hasScores && (
            <div
              className={cn(
                "flex w-[22%] font-medium text-center justify-center items-center text-xs rounded-lg py-1",
                Math.abs(Number(bid?.total_score)) > 3.5
                  ? "bg-green-600/10 text-green-800"
                  : Math.abs(Number(bid?.total_score)) > 2.5
                  ? "bg-yellow-600/10 text-yellow-800"
                  : "bg-red-600/10 text-red-800"
              )}>
              {Math.abs(Number(bid?.total_score)) == 0 && (
                <span className=' text-xs px-1 font-semibold'>Not Scored</span>
              )}

              {Math.abs(Number(bid?.total_score)) > 0 && (
                <span className='flex flex-col gap-1'>
                  <span>Score:</span>
                  <span className='text-sm font-semibold'>
                    {Math.abs(Number(bid?.total_score)) + "/5"}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className={cn(" pt-3 border-t ", borderStyle)}>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center gap-2'>
            <div className='p-2 mr-1.5 bg-primary/10 flex items-center justify-center rounded-full'>
              <FileCheck className='text-gray-700 size-4' />
            </div>
            <div>
              <p className='text-xs text-gray-700 '>DD Number</p>
              <p className='text-[0.85rem] font-medium text-gray-900'>
                {bid.dd_number}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 mr-1.5 bg-primary/10 flex items-center justify-center rounded-full'>
              <Calendar className='text-gray-700 size-4' />
            </div>
            <div>
              <p className='text-xs text-gray-700'>DD Date</p>
              <p className='text-[0.85rem] font-medium text-gray-900'>
                {format(bid.dd_date, "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>

        {hasScores && (
          <div className='mt-4 grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <div className='p-2 mr-1.5 bg-primary/10 flex items-center justify-center rounded-full'>
                <Award className='text-gray-700 size-4' />
              </div>
              <div>
                <p className='text-xs text-gray-700'>Technical Score</p>
                <div className='flex  items-center mt-1'>
                  <Star className='h-3 w-3 text-yellow-600 fill-yellow-600 mr-1' />
                  <p className='text-[0.85rem] font-medium text-gray-900'>
                    {Math.abs(bid.technical_score)}/5
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='p-2 mr-1.5 bg-primary/10 flex items-center justify-center rounded-full'>
                <Award className='text-gray-700 size-4' />
              </div>
              <div>
                <p className='text-xs text-gray-700'>Financial Score</p>
                <div className='flex items-center mt-1'>
                  <Star className='h-3 w-3 text-yellow-600 fill-yellow-600 mr-1' />
                  <p className='text-[0.85rem] font-medium text-gray-900'>
                    {Math.abs(bid.financial_score)}/5
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='pt-5 flex items-center gap-2 w-full'>
        <Button
          className={cn(
            secondaryButtonStyle2,
            "w-full py-1.5 flex items-center justify-center transition-colors"
          )}
          size='sm'
          onClick={handleSelectBid}
          disabled={isSettingBidStatus}>
          Select Bid
          <CheckCheck className=' h-3.5 w-3.5' />
        </Button>
        <Link
          href={`/admin/live/${tenderId}/bid/${bid.id}`}
          className='w-full'>
          <Button
            className={cn(
              primaryButtonStyle,
              "w-full py-1.5 flex items-center justify-center transition-colors"
            )}
            size='sm'>
            View Details
            <ArrowRight className=' h-3.5 w-3.5' />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BidCard;
