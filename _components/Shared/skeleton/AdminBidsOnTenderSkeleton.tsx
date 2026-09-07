import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AdminBidsOnTenderSkeleton = () => {
  return (
    <div className='flex flex-col gap-3 mt-10 mx-auto'>
      <Skeleton className='h-[5rem] w-full bg-gray-200/70' />
      <div className='flex mt-6 items-center gap-6'>
        <div className='flex flex-col gap-3 w-[33%]'>
          <Skeleton className='h-[15rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[15rem] w-full bg-gray-200/70' />
        </div>
        <div className='flex flex-col gap-3 w-[33%]'>
          <Skeleton className='h-[15rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[15rem] w-full bg-gray-200/70' />
        </div>
        <div className='flex flex-col gap-3 w-[33%]'>
          <Skeleton className='h-[15rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[15rem] w-full bg-gray-200/70' />
        </div>
      </div>
    </div>
  );
};

export default AdminBidsOnTenderSkeleton;
