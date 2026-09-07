import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CreateTenderSkeleton = () => {
  return (
    <div className='flex flex-col gap-3 mt-10 mx-auto'>
      <Skeleton className='h-6 bg-gray-200/70' />
      <Skeleton className='h-6 bg-gray-200/70' />
      <Skeleton className='h-24 bg-gray-200/70' />
      <div className='flex mt-6 items-center gap-6'>
        <div className='flex flex-col gap-3 w-[35%]'>
          <Skeleton className='h-8 bg-gray-200/70' />
          <Skeleton className='h-[5rem] w-full bg-gray-200/70' />
        </div>
        <div className='flex flex-col gap-3 flex-1'>
          <Skeleton className='h-8 bg-gray-200/70' />
          <Skeleton className='h-[5rem] w-full bg-gray-200/70' />
        </div>
      </div>
    </div>
  );
};

export default CreateTenderSkeleton;
