import { IBidCard } from "@/Types/Bid-Types";
import {
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Star, UserCircle, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RejectedBidsTable = ({
  bids,
  tenderId,
}: {
  bids: IBidCard[];
  tenderId: string;
}) => {
  const [selectedBid, setSelectedBid] = useState<IBidCard | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const getScoreClass = (score: number) => {
    if (score >= 3) return "text-green-600";
    if (score === 3) return "text-yellow-600";
    return "text-red-600";
  };

  const openMessageDialog = (bid: IBidCard) => {
    setSelectedBid(bid);
    setCurrentMessage(bid.rejection_message || "No rejection reason provided.");
    setMessageDialogOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Overall Score</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Rejection Reason</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid: IBidCard) => (
            <TableRow key={bid.id}>
              <TableCell className='font-medium'>
                <div className='flex items-center gap-2'>
                  <UserCircle
                    size={16}
                    className='text-primary'
                  />
                  {bid.business_name}
                </div>
              </TableCell>
              <TableCell>{bid.business_classification}</TableCell>

              <TableCell>
                <div className='flex items-center gap-1'>
                  <Star
                    className={`h-3.5 w-3.5 ${getScoreClass(
                      bid.total_score
                    )} fill-current`}
                  />
                  <span className='font-medium'>
                    {Math.abs(+bid.total_score)}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                {format(new Date(bid.created_at), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                {bid.rejection_message ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className='flex items-center gap-1 text-primary hover:text-primary/80'
                          onClick={() => openMessageDialog(bid)}>
                          <MessageSquare className='h-4 w-4' />
                          <span>View reason</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='max-w-xs'>
                          {bid.rejection_message.length > 50
                            ? `${bid.rejection_message.substring(0, 50)}...`
                            : bid.rejection_message}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className='text-gray-500 text-sm italic'>
                    No reason provided
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Link href={`/admin/live/${tenderId}/bid/${bid.id}`}>
                  <Button
                    size='sm'
                    className='text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

export default RejectedBidsTable;
