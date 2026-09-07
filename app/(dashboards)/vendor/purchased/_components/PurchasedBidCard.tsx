import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDisplayDateTime } from "@/utils/dateUtils";

interface Bid {
  bid_id: number;
  tender_id: number;
  bid_status: string;
  created_at: Date | string;
  bid_rejection_msg?: string | null;
}

interface Tender {
  tender_id: number;
  tender_number?: string | null;
  tender_title?: string | null;
  tender_department?: string | null;
  tender_location?: string | null;
  tender_type?: string | null;
  tender_scope?: string | null;
  tender_bid_submission_deadline?: Date | string | null;
}

interface BidCardProps {
  bid: Bid;
  tender: Tender | null;
}

const PurchasedBidCard: React.FC<BidCardProps> = ({ bid, tender }) => {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-300";
      case "selected":
      case "ranked":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "under_review":
        return "Under Review";
      case "ranked":
        return "Selected";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "selected":
        return "Selected";
      default:
        return status;
    }
  };

  const openMessageDialog = () => {
    setMessageDialogOpen(true);
  };

  return (
    <>
      <Card className='overflow-hidden transition-all duration-300 hover:shadow-lg border-l-2 border-l-primary'>
        <CardContent className='p-0'>
          <div className='flex flex-col lg:flex-row w-full'>
            {/* Left section - Tender Information */}
            <div className='bg-white p-4 lg:w-2/5 flex flex-col justify-between border-r'>
              <div>
                <div className='flex items-center gap-1.5 mb-2'>
                  <FileText className='h-4 w-4 text-primary' />
                  <h3 className='font-semibold text-gray-700 text-xs'>
                    Tender #{tender?.tender_number || bid.tender_id}
                  </h3>
                </div>
                <h2 className='font-bold text-base text-gray-900 mb-2 line-clamp-2'>
                  {tender?.tender_title || "Tender Title"}
                </h2>
                <p className='text-xs text-gray-600 mb-1.5'>
                  <span className='font-medium'>Department:</span>{" "}
                  {tender?.tender_department || "N/A"}
                </p>
                <p className='text-xs text-gray-600'>
                  <span className='font-medium'>Location:</span>{" "}
                  {tender?.tender_location || "N/A"}
                </p>
              </div>
              <div className='flex flex-wrap gap-1.5 mt-3'>
                {tender?.tender_type && (
                  <Badge
                    variant='outline'
                    className='text-xs px-2 py-0.5 text-primary border-primary/30 bg-primary/5'>
                    {tender.tender_type}
                  </Badge>
                )}
                {tender?.tender_scope && (
                  <Badge
                    variant='outline'
                    className='text-xs px-2 py-0.5 bg-gray-50 text-gray-700 border-gray-300'>
                    {tender.tender_scope}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right section - Bid Details & Status */}
            <div className='p-4 lg:w-3/5 flex flex-col justify-between bg-gray-50/50'>
              <div className='space-y-2'>
                {/* Bid Status */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-medium text-gray-600'>
                      Status:
                    </span>
                    <Badge
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 border",
                        getStatusColor(bid.bid_status)
                      )}>
                      {getStatusText(bid.bid_status)}
                    </Badge>
                  </div>
                </div>

                {/* Bid Submitted Date */}
                <div className='flex items-center gap-1.5 text-xs'>
                  <Calendar className='h-3.5 w-3.5 text-gray-500' />
                  <span className='text-gray-600'>Submitted:</span>
                  <span className='font-medium text-gray-900'>
                    {formatDisplayDateTime(bid.created_at)}
                  </span>
                </div>

                {/* Submission Deadline */}
                {tender?.tender_bid_submission_deadline && (
                  <div className='flex items-center gap-1.5 text-xs'>
                    <span className='text-gray-600'>Deadline:</span>
                    <span className='font-medium text-gray-900'>
                      {formatDisplayDateTime(tender.tender_bid_submission_deadline)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-200'>
                {bid.bid_status === "rejected" && bid.bid_rejection_msg && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs h-7 text-red-700 hover:text-red-800 hover:bg-red-50'
                    onClick={openMessageDialog}>
                    <MessageSquare className='h-3.5 w-3.5 mr-1' />
                    View Rejection Reason
                  </Button>
                )}
                <div className='flex-1'></div>
                <Link
                  href={`/tender/${tender?.tender_id ?? ''}`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs h-7 text-primary hover:text-primary/80 hover:bg-primary/10'>
                    View Details <ChevronRight className='ml-1 h-3.5 w-3.5' />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription>
              Bid #{bid.bid_id} for Tender #
              {tender?.tender_number || bid.tender_id}
            </DialogDescription>
          </DialogHeader>
          <div className='mt-3 p-3 bg-red-50 rounded-md border border-red-200'>
            <p className='text-sm text-gray-800'>
              {bid.bid_rejection_msg || "No rejection reason provided."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchasedBidCard;
