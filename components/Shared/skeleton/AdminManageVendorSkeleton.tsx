import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AdminManageVendorSkeleton = () => {
  return (
    <div className='mx-5 mt-24'>
      <div className='flex flex-col mt-10 gap-3'>
        <Skeleton className='h-8 bg-gray-200/70' />
        <Skeleton className='h-32 bg-gray-200/70' />
        <div className='flex flex-col gap-5 mt-5 w-full'>
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
          <Skeleton className='h-[3rem] w-full bg-gray-200/70' />
        </div>
      </div>
    </div>
  );
};

export default AdminManageVendorSkeleton;
