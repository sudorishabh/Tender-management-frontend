"use client";
import React, { useRef } from "react";
import { Plus, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetSavedTendersQuery } from "@/Redux/tender/tenderApi";
import SavedTenderCard from "@/components/Tender/For-Admin/savedTenderCard";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { Button } from "@/components/ui/button";
import { primaryButtonStyle, secondaryButtonStyle2 } from "@/app/Styles";
import InfiniteScroll from "@/components/Shared/InfiniteScroll";
import { ISavedTenderCard } from "@/app/Types/Tender-Types";

const SavedTendersPage = () => {
  const pageRef = useRef(1);
  const { data, isLoading, refetch, isFetching } = useGetSavedTendersQuery({
    page: pageRef?.current,
    limit: 8,
  });

  return (
    <AdminPagesWrapper>
      <div className=''>
        <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-[3rem]'>
          <div className='mb-8 border-b border-gray-200 pb-5'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Saved Tenders
                </h1>
                <p className='mt-2 text-gray-600 max-w-4xl'>
                  Continue editing your saved tenders or create a new one to
                  publish to the marketplace
                </p>
              </div>
              <Link href='/admin/create'>
                <Button className={primaryButtonStyle}>
                  <Plus className='h-5 w-5 mr-2' />
                  Create New Tender
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='h-8 w-8 text-primary animate-spin' />
              <span className='ml-2 text-gray-600'>
                Loading saved tenders...
              </span>
            </div>
          ) : (
            <div>
              <InfiniteScroll
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                isFetching={isFetching}
                refetch={refetch}
                hasMore={data?.hasMore || false}
                pageRef={pageRef}>
                {data && data?.savedTenders.length > 0 && !isLoading && (
                  <Link
                    href='/admin/create'
                    className='block group'>
                    <div className='h-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:bg-primary/5 cursor-pointer'>
                      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors'>
                        <Plus className='h-8 w-8 text-primary' />
                      </div>
                      <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                        Create New Tender
                      </h3>
                      <p className='text-gray-600 text-center'>
                        Start a fresh tender creation process
                      </p>
                    </div>
                  </Link>
                )}
                {data?.savedTenders.map((savedTender: ISavedTenderCard) => (
                  <SavedTenderCard
                    key={savedTender.id}
                    savedTender={savedTender}
                  />
                ))}
              </InfiniteScroll>
            </div>
          )}

          {data?.savedTenders.length === 0 && !isLoading && (
            <div className='bg-white rounded-xl p-10 text-center shadow-sm border border-gray-200'>
              <div className='mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100'>
                <FileText className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No saved tenders
              </h3>
              <p className='text-gray-600 mb-6'>
                You haven&apos;t created any draft tenders yet.
              </p>
              <Link href='/admin/create-tender'>
                <Button className={secondaryButtonStyle2}>
                  <Plus className='h-5 w-5 mr-2' />
                  Create your first tender
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminPagesWrapper>
  );
};

export default SavedTendersPage;
