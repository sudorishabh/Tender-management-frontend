import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AssignTabSkeleton = () => {
  return (
    <div className='flex ml-8 flex-col items-center justify-center w-[12rem] gap-1'>
      <Skeleton className='h-1.5 bg-gray-200/70 w-full' />
      <Skeleton className='h-1.5 bg-gray-200/70 w-full' />
      <Skeleton className='h-1.5 bg-gray-200/70 w-full' />
    </div>
  );
};

export default AssignTabSkeleton;
