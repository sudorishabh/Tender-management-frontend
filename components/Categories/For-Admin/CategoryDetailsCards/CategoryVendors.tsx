import React, { FC, useRef } from "react";
import { useGetCategoryVendorsQuery } from "@/Redux/vendor/vendorApi";
import VendorsTable from "@/components/Vendor/For-Admin/VendorsTable";
import { LoaderCircle } from "lucide-react";

interface Props {
  categoryId: string;
}
const CategoryVendors: FC<Props> = ({ categoryId }) => {
  const pageRef = useRef(1);
  const { data, isLoading, isError, isFetching, refetch } =
    useGetCategoryVendorsQuery({
      id: categoryId,
      page: pageRef.current,
      limit: 10,
    });

  if (isLoading)
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <LoaderCircle className='animate-spin mx-auto' />
      </div>
    );

  if (isError || (data && data?.vendors?.length === 0)) {
    return (
      <div className='w-full my-10 flex items-center justify-center text-center'>
        <h1 className='text-red-500 text-xl'>Data not available</h1>
      </div>
    );
  }

  return (
    <VendorsTable
      data={
        data?.vendors
          ? {
              vendors: data?.vendors,
              totalVendors: data?.totalVendors,
              hasMore: data?.hasMore,
              page: data?.page,
            }
          : undefined
      }
      hasMore={data?.hasMore || false}
      isFetching={isFetching}
      refetch={refetch}
      pageRef={pageRef}
      // isFromCategoryDetails={true}
      // categoryId={categoryId}
    />
  );
};

export default CategoryVendors;
