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

const Venders = () => {
  const pageRef = useRef(1);

  const { manageVendorStatus, manageVendorCategory } = useSelector(
    (state: RootState) => state.venderSlice
  );

  // const { categories } = useSelector((state: RootState) => state.categorySlice);

  // const { data: categoryData } = useGetCategoriesNamesQuery(
  //   {},
  //   {
  //     skip: !categories,
  //   }
  // );

  const { data, isLoading, isFetching, refetch } = useGetVendorsQuery({
    page: pageRef.current,
    limit: 10,
    status: manageVendorStatus,
    category: manageVendorCategory,
  });

  useEffect(() => {
    pageRef.current = 1;
    refetch();
  }, [manageVendorStatus, manageVendorCategory, refetch]);

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

export default Venders;
