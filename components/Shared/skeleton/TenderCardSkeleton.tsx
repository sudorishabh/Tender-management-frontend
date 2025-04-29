import { Skeleton } from "@/components/ui/skeleton";

const TenderCardSkeleton = () => {
  return (
    <div className='flex flex-col gap-5 mt-6'>
      <div className='flex flex-col max-w-[55rem] mb-4 space-y-3'>
        <Skeleton className='h-[10rem] rounded-xl bg-gray-200/70 ' />
        <div className='space-y-2 flex flex-col gap-2'>
          <div>
            <Skeleton className='h-10 bg-gray-200/70 ' />
          </div>
        </div>
      </div>
      <div className='flex flex-col max-w-[55rem] mb-4 space-y-3'>
        <Skeleton className='h-[10rem] rounded-xl bg-gray-200/70   ' />
        <div className='space-y-2 flex flex-col gap-2'>
          <div>
            <Skeleton className='h-10 bg-gray-200/70 ' />
          </div>
        </div>
      </div>
      <div className='flex flex-col max-w-[55rem] mb-4 space-y-3'>
        <Skeleton className='h-[10rem] rounded-xl bg-gray-200/70 ' />
        <div className='space-y-2 flex flex-col gap-2'>
          <div>
            <Skeleton className='h-10 bg-gray-200/70 ' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderCardSkeleton;
