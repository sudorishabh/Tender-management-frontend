import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, UserCircle, Trophy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryButtonStyle } from "@/app/Styles";
import { IBidCard } from "@/app/Types/Bid-Types";
import {
  useApproveBidMutation,
  useGetRankedBidsQuery,
  useIsBidApprovedQuery,
} from "@/Redux/bid/bidApi";
import PageLoading from "@/components/Shared/PageLoading";
import { toast } from "sonner";
import RankMessageDialog from "./RankMessageDialog";

const BidRankingDialog = ({
  rankedBidsDialogOpen,
  setRankedBidsDialogOpen,
  tenderId,
}: {
  rankedBidsDialogOpen: boolean;
  setRankedBidsDialogOpen: (open: boolean) => void;
  tenderId: string;
}) => {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [approveBid, { isLoading: isApproveBidLoading }] =
    useApproveBidMutation();
  const [isMessageSelectedBid, setIsMessageSelectedBid] =
    useState<IBidCard | null>(null);

  const { data: rankedBids, isLoading: isRankedBidsLoading } =
    useGetRankedBidsQuery(tenderId);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBidInfo, setSelectedBidInfo] = useState<{
    id: string;
    businessName: string;
  } | null>(null);
  const { data: isBidApproved, isLoading: isBidApprovedLoading } =
    useIsBidApprovedQuery(tenderId);

  if (isRankedBidsLoading || isBidApprovedLoading) return <PageLoading />;

  const openConfirmDialog = (bid: IBidCard) => {
    setSelectedBidInfo({
      id: bid.id,
      businessName: bid.business_name,
    });
    setConfirmDialogOpen(true);
  };

  const handleApproveBid = async (bidId: string) => {
    try {
      await approveBid(bidId).unwrap();
      toast.success("Bid approved successfully");
      setConfirmDialogOpen(false);
    } catch {
      toast.error("Failed to approve bid");
    }
  };
 
  return (
    <>
      <Dialog
        open={rankedBidsDialogOpen}
        onOpenChange={setRankedBidsDialogOpen}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='flex justify-between items-center gap-2'>
              <span className='flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-yellow-500' />
                Ranked Bids
              </span>
              {isBidApproved?.isApproved && rankedBids?.bids.length > 0 && (
                <span className='text-green-700 mr-3 rounded-md bg-green-100 px-2 py-1'>
                  Bid is already approved
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Review and manage the ranking of all selected bids
            </DialogDescription>
          </DialogHeader>

          <div className='py-2 max-h-[60vh] overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankedBids?.bids.map((bid: IBidCard) => (
                  <TableRow
                    key={bid.id}
                    //   className={getRankBackgroundClass(getBidRank(bid))}
                  >
                    <TableCell className='text-center font-bold w-24 '>
                      {bid.ranking === 0 ? (
                        <span className='text-gray-400'>-</span>
                      ) : (
                        <span>0{bid.ranking}</span>
                      )}
                    </TableCell>
                    <TableCell>
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
                      <div className='flex w-min p-1 rounded-md items-center gap-1 bg-green-100'>
                        <span>Score:</span>
                        <span className='font-medium'>
                          {Math.abs(+bid.total_score)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className='flex gap-5 w-min'>
                      <Button
                        size='sm'
                        className='text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'
                        onClick={() => {
                          setIsMessageSelectedBid(bid);
                          setMessageDialogOpen(true);
                        }}>
                        <Mail className='h-3.5 w-3.5' />
                        <span>Send Mail</span>
                      </Button>
                      <Button
                        disabled={isBidApproved?.isApproved}
                        size='sm'
                        className='text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'
                        onClick={() => openConfirmDialog(bid)}>
                        <Check className='h-3.5 w-3.5' />
                        <span>Approve</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className='flex items-center justify-between'>
            <Button
              variant='outline'
              onClick={() => setRankedBidsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className={primaryButtonStyle}
              onClick={() => {}}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-yellow-500' />
              Confirm Bid Approval
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve the bid from{" "}
              <span className='font-medium'>
                {selectedBidInfo?.businessName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex items-center justify-between mt-4'>
            <Button
              variant='outline'
              onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedBidInfo && handleApproveBid(selectedBidInfo.id)
              }
              className={`${primaryButtonStyle} bg-green-600 hover:bg-green-700`}
              disabled={isApproveBidLoading}>
              {isApproveBidLoading ? "Approving..." : "Approve Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RankMessageDialog
        messageDialogOpen={messageDialogOpen}
        setMessageDialogOpen={setMessageDialogOpen}
        selectedBid={isMessageSelectedBid}
      />
    </>
  );
};

export default BidRankingDialog;
