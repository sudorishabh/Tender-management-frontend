"use client";
import React, { useEffect, useRef } from "react";
import { useGetVendorsQuery } from "@/Redux/vendor/vendorApi";
import dynamic from "next/dynamic";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { IVendorsResponse } from "@/Types/Vendor-Types";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
// import { useGetCategoriesNamesQuery } from "@/Redux/category/categoryApi";
import AdminManageVendorSkeleton from "@/components/Shared/skeleton/AdminManageVendorSkeleton";
const ManageVendors = dynamic(
  () => import("@/components/Vendor/For-Admin/ManageVendors")
);

const Vendors = () => {
  const pageRef = useRef(1);

  const { manageVendorStatus, manageVendorSearch } = useSelector(
    (state: RootState) => state.vendorSlice
  );

  // const { categories } = useSelector((state: RootState) => state.categorySlice);

  // const { data: categoryData } = useGetCategoriesNamesQuery(
  //   {},
  //   {
  //     skip: !categories,
  //   }
  // );
  console.log(manageVendorStatus, manageVendorSearch);
  const { data, isLoading, isFetching, refetch } = useGetVendorsQuery({
    page: pageRef.current,
    limit: 10,
    status: manageVendorStatus,
    search: manageVendorSearch,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      pageRef.current = 1;
      refetch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [manageVendorStatus, manageVendorSearch, refetch]);

  if (isLoading) return <AdminManageVendorSkeleton />;

  return (
    <AdminPagesWrapper>
      <ManageVendors
        data={data as IVendorsResponse}
        isFetching={isFetching}
        refetch={refetch}
        pageRef={pageRef}
        // categoryData={
        //   categories.length > 0 ? categories : categoryData?.categories
        // }
      />
    </AdminPagesWrapper>
  );
};

export default Vendors;
