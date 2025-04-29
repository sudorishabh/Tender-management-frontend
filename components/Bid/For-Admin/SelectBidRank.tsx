import React, { useState } from "react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Medal, Trophy } from "lucide-react";
import { IBidCard } from "@/app/Types/Bid-Types";

const SelectBidRank = ({
  bid,
  handleSetRanking,
}: {
  bid: IBidCard;
  handleSetRanking: (bidId: string, rank: number) => void;
}) => {
  const [ranking, setRanking] = useState(bid.ranking);

  return (
    <div className='flex items-center gap-2'>
      <Select
        value={String(ranking)}
        onValueChange={(value) => {
          setRanking(+value);
          handleSetRanking(bid.id, +value);
        }}>
        <SelectTrigger
          className={cn(
            "w-28 h-8 rounded-mmd",
            ranking === 1 && "border-yellow-400 bg-yellow-50",
            ranking === 2 && "border-gray-300 bg-gray-50",
            ranking === 3 && "border-amber-600 bg-amber-50",
            ranking === 0 && "border-gray-200"
          )}>
          <SelectValue placeholder='Set Rank' />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value='0'>Unranked</SelectItem> */}
          {[0, 1, 2, 3, 4, 5].map((rank) => (
            <SelectItem
              key={rank}
              value={String(rank)}>
              {rank === 0 && (
                <div className='flex items-center gap-2'>
                  <span>Unranked</span>
                </div>
              )}
              {rank === 1 && (
                <div className='flex items-center gap-2'>
                  <Trophy className='h-3.5 w-3.5 text-yellow-500 fill-yellow-500' />
                  <span>1st Place</span>
                </div>
              )}
              {rank === 2 && (
                <div className='flex items-center gap-2'>
                  <Medal className='h-3.5 w-3.5 text-gray-400 fill-gray-400' />
                  <span>2nd Place</span>
                </div>
              )}
              {rank === 3 && (
                <div className='flex items-center gap-2'>
                  <Medal className='h-3.5 w-3.5 text-amber-700 fill-amber-700' />
                  <span>3rd Place</span>
                </div>
              )}
              {rank > 3 && `Rank ${rank}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBidRank;
