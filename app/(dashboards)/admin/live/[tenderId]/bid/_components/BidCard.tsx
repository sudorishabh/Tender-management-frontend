"use client";
import { formatDistanceToNow } from "date-fns";
import { Building2, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { borderStyle, primaryButtonStyle } from "@/app/styles";
import { cn } from "@/lib/utils";

// Type for the server data structure
interface BidData {
  bid: {
    bid_id: number;
    vendor_id: number;
    tender_id: number;
    technical_doc_key: string | null;
    financial_doc_key: string | null;
    bid_optional_info: string | null;
    bid_rejection_msg: string | null;
    bid_status:
      | "rejected"
      | "approved"
      | "selected"
      | "ranked"
      | "under_review";
    created_at: Date;
    updated_at: Date;
  };
  vendor: {
    vendor_id: number;
  } | null;
  business: {
    biz_trade_name: string | null;
    biz_legal_name: string | null;
    biz_state: string | null;
    biz_city: string | null;
    biz_country: string | null;
  } | null;
}

interface Props {
  bid: BidData;
  tenderId: string;
}

export const BidCard: FC<Props> = ({ bid, tenderId }) => {
  const formattedDate = formatDistanceToNow(bid.bid.created_at, {
    addSuffix: true,
  });

  const businessName =
    bid.business?.biz_legal_name ||
    bid.business?.biz_trade_name ||
    "Business Name";
  const location = [
    bid.business?.biz_city,
    bid.business?.biz_state,
    bid.business?.biz_country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn(
        "group p-5 relative rounded-md bg-white border shadow-sm overflow-hidden hover:shadow-md transition-shadow",
        borderStyle
      )}>
      {/* Header Section */}
      <div className='pb-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-3'>
              <Building2 className='h-4 w-4 text-gray-700' />
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {capitalizeFirstLetter(businessName)}
              </h3>
            </div>
            {location && (
              <div className='flex items-center gap-1 mb-2'>
                <MapPin className='h-3.5 w-3.5 text-gray-500' />
                <p className='text-sm text-gray-600'>{location}</p>
              </div>
            )}
            <span className='text-xs text-gray-500 flex items-center gap-1'>
              Submitted {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className='pt-3 border-t'>
        <Link
          href={`/admin/live/${tenderId}/bid/${bid.bid.bid_id}`}
          className='w-full'>
          <Button
            className={cn(
              primaryButtonStyle,
              "w-full py-2 flex items-center justify-center gap-2 transition-colors"
            )}
            size='sm'>
            View Details
            <ArrowRight className='h-3.5 w-3.5' />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BidCard;
