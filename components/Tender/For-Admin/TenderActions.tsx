import { borderStyle } from "@/app/Styles";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Edit, Text } from "lucide-react";
import router from "next/router";
import React, { FC } from "react";

interface props {
  tenderId: string;
}

const TenderActions: FC<props> = ({ tenderId }) => {
  return (
    <div
      className={cn(
        "z-10 flex items-center gap-5 px-4 py-2 border- border-gray-200",
        borderStyle
      )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            className='flex items-center gap-2 bg-gray-100 rounded-full py-1 px-2 cursor-pointer hover:bg-gray-200 transition-colors'
            onClick={() => router.push(`/admin/tenders/edit/${tenderId}`)}>
            <span>
              <Button
                variant='ghost'
                size='icon'
                className='size-8 p-0 flex items-center justify-center rounded-full bg-white shadow-sm border border-blue-100 '
                aria-label='Edit tender'>
                <Edit className='size-3.5 text-blue-600' />
              </Button>
              <p className='font-medium text-gray-800'>Edit</p>
            </span>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            <p className='text-xs'>Edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            className='flex items-center gap-2 bg-gray-100 rounded-full py-1 px-2 cursor-pointer hover:bg-gray-200 transition-colors'
            onClick={() => router.push(`/admin/tenders/bids/${tenderId}`)}>
            <span>
              <Button
                variant='ghost'
                size='icon'
                className='size-8 p-0 flex items-center justify-center rounded-full bg-white shadow-sm border border-purple-100'
                aria-label='View bids'>
                <Text className='size-3.5 text-purple-600' />
              </Button>
              <p className='font-medium text-gray-800'>Bids</p>
            </span>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            <p className='text-xs'>Bids</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TenderActions;
