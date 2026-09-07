import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AdminBidDetailsSkeleton = () => {
  return (
    <div className='flex flex-col mt-10 gap-3 mx-auto'>
      <Skeleton className='h-[5rem] w-full bg-gray-200/70' />
      <Skeleton className='h-[2rem] w-full bg-gray-200/70' />
      <div className='flex mt-6 items-center gap-6'>
        <div className='flex flex-col gap-3 w-[25%]'>
          <Skeleton className='h-[10rem] w-full bg-gray-200/70' />
        </div>
        <div className='flex flex-col gap-3 w-[25%]'>
          <Skeleton className='h-[10rem] w-full bg-gray-200/70' />
        </div>
        <div className='flex flex-col gap-3 w-[25%]'>
          <Skeleton className='h-[10rem] w-full bg-gray-200/70' />
        </div>
        <div className='flex flex-col gap-3 w-[25%]'>
          <Skeleton className='h-[10rem] w-full bg-gray-200/70' />
        </div>
      </div>
      <div className='flex gap-3 w-full'>
        <Skeleton className='h-[10rem]  w-[70%] bg-gray-200/70' />
        <Skeleton className='h-[10rem] w-[30%] bg-gray-200/70' />
      </div>
      <div className='flex gap-3 w-full'>
        <Skeleton className='h-[10rem]  w-[70%] bg-gray-200/70' />
        <Skeleton className='h-[10rem] w-[30%] bg-gray-200/70' />
      </div>
    </div>
  );
};

export default AdminBidDetailsSkeleton;
