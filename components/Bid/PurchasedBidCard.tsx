import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight, MessageSquare } from "lucide-react";
import { format } from "date-fns";
// import BidDetailsModal from "./BidDetailsModal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPurchasedBidCard } from "@/Redux/bid/bidApi";

interface BidCardProps {
  bid: IPurchasedBidCard;
}

const PurchasedBidCard: React.FC<BidCardProps> = ({ bid }) => {
  const [selectedBid, setSelectedBid] = useState<IPurchasedBidCard | null>(
    null
  );
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };

  const openMessageDialog = (bid: IPurchasedBidCard) => {
    setSelectedBid(bid);
    setCurrentMessage(bid.rejection_message || "No rejection reason provided.");
    setMessageDialogOpen(true);
  };

  return (
    <>
      <Card className='overflow-hidden transition-shadow duration-300 border-l-4 border-l-accent'>
        <CardContent className='p-0'>
          <div className='flex flex-col md:flex-row w-full'>
            {/* Left section with tender info */}
            <div className='bg-white p-4 md:p-6 md:w-1/3 flex flex-col justify-between'>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <FileText className='h-5 w-5 text-accent' />
                  <h3 className='font-semibold text-gray-700 text-sm'>
                    Tender #{bid.tender_number}
                  </h3>
                </div>
                <h2 className='font-bold text-lg text-gray-900 mb-3 line-clamp-2'>
                  {bid.tender_title}
                </h2>
                <p className='text-gray-600 text-sm mb-2'>
                  <span className='font-medium'>Value:</span> ₹
                  {bid.tender_value.toLocaleString()}
                </p>
              </div>
              <div className='flex flex-wrap gap-2 mt-2'>
                <Badge
                  variant='outline'
                  className='bg-accent/5 text-accent hover:bg-accent/10'>
                  {bid.tender_category}
                </Badge>
                <Badge
                  variant='outline'
                  className='bg-gray-50 text-gray-700 hover:bg-gray-100'>
                  {bid.tender_location}
                </Badge>
              </div>
            </div>

            {/* Right section with bid details */}
            <div className='p-4 md:p-6 md:w-2/3 flex flex-col md:flex-row'>
              <div className='flex-1'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>DD Number</p>
                    <p className='font-medium text-gray-900'>{bid.dd_number}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>DD Date</p>
                    <p className='font-medium text-gray-900'>
                      {formatDate(bid.dd_date)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Bank</p>
                    <p className='font-medium text-gray-900'>
                      {bid.bank_number}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Branch</p>
                    <p className='font-medium text-gray-900'>
                      {bid.bank_branch}
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-4 md:mt-0 md:ml-4 flex flex-row md:flex-col items-end md:justify-between'>
                <Badge
                  className={cn(
                    "text-xs font-medium px-3 py-1",
                    getStatusColor(bid.status)
                  )}>
                  {bid.status === "under_review"
                    ? "under review"
                    : bid.status === "ranked"
                    ? "selected"
                    : bid.status}
                </Badge>
                <div className='flex gap-4 items-center justify-end mt-3'>
                  {bid.status === "rejected" && (
                    <button
                      className='flex items-center gap-1 text-red-700   hover:text-red-800/80'
                      onClick={() => openMessageDialog(bid)}>
                      <MessageSquare className='h-4 w-4' />
                      <span>Rejection reason</span>
                    </button>
                  )}
                  <Link href={`/vendor-board/purchased/${bid.id}`}>
                    <Button className='text-accent hover:text-accent/80 bg-accent/5'>
                      Details <ChevronRight className='ml-1 h-4 w-4' />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription>For bid from:</DialogDescription>
            {selectedBid && (
              <div className='mb-2 font-medium'>
                {selectedBid.business_name}
              </div>
            )}
          </DialogHeader>
          <div className='mt-2 p-4 bg-gray-50 rounded-md border border-gray-200'>
            <p className='text-gray-800'>{currentMessage}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchasedBidCard;
