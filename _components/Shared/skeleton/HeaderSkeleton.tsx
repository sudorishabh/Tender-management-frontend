import { Skeleton } from "@/_components/ui/skeleton";
import React from "react";

const HeaderSkeleton = () => {
  return (
    <div className='flex flex-col  w-56 gap-1'>
      <Skeleton className='h-6 bg-gray-200/70' />
      <Skeleton className='h-2 bg-gray-200/70' />
    </div>
  );
};

export default HeaderSkeleton;
