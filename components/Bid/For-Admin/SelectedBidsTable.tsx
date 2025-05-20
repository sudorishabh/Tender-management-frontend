import { IBidCard } from "@/Types/Bid-Types";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSetBidRankingMutation } from "@/Redux/bid/bidApi";
import SelectBidRank from "./SelectBidRank";
const getScoreClass = (score: number) => {
  if (score >= 3) return "text-green-600";
  if (score === 3) return "text-yellow-600";
  return "text-red-600";
};

const SelectedBidsTable = ({
  bids,
  tenderId,
}: {
  bids: IBidCard[];
  tenderId: string;
}) => {
  const [setBidRanking] = useSetBidRankingMutation();

  const handleSetRanking = async (bidId: string, rank: number) => {
    try {
      await setBidRanking({ bidId, ranking: rank });
    } catch (error) {
      console.error("Error setting ranking:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Overall Score</TableHead>
          <TableHead>Business Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>Actions</TableHead>
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
            <TableCell>
              <span
                className={cn(
                  "rounded-mmd flex items-center gap-1",
                  getScoreClass(bid.total_score)
                )}>
                <span>Scored:</span>
                <span className='font-bold'>{Math.abs(+bid.total_score)}</span>
              </span>
            </TableCell>
            <TableCell>{bid.business_classification}</TableCell>
            <TableCell>
              {format(new Date(bid.created_at), "dd MMM yyyy")}
            </TableCell>
            <TableCell>
              <SelectBidRank
                bid={bid}
                handleSetRanking={handleSetRanking}
              />
            </TableCell>
            <TableCell>
              <div className='flex gap-2'>
                <Link href={`/admin/live/${tenderId}/bid/${bid.id}`}>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-accent bg-accent/5 hover:bg-accent/10 hover:text-accent'>
                    <Eye className='size-3.5' />
                    Details
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SelectedBidsTable;
