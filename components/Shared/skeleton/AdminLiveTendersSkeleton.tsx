import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AdminLiveTendersSkeleton = () => {
  return (
    <div className='mx-5 mt-24'>
      <div className='flex flex-col mt-10 gap-3'>
        <Skeleton className='h-6 bg-gray-200/70' />
        <Skeleton className='h-20 bg-gray-200/70' />
        <div className='flex flex-col gap-5 mt-10 w-full'>
          <Skeleton className='h-[12rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[12rem] w-full bg-gray-200/70' />
        </div>
      </div>
    </div>
  );
};

export default AdminLiveTendersSkeleton;
