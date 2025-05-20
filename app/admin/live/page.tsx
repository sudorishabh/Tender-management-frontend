"use client";
import React, { useEffect, useRef } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { useGetTendersQuery } from "@/Redux/tender/tenderApi";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { ILiveTenders } from "@/Types/Tender-Types";
import dynamic from "next/dynamic";
import AdminLiveTendersSkeleton from "@/components/Shared/skeleton/AdminLiveTendersSkeleton";

const LiveTenders = dynamic(
  () => import("@/components/Tender/For-Admin/LiveTenders")
);

const Tenders = () => {
  const pageRef = useRef(1);

  const {
    tenderAdminFilter: { searchQuery, category, department },
  } = useSelector((state: RootState) => state.tenderSlice);

  const { data, isLoading, isFetching, refetch } = useGetTendersQuery({
    search: searchQuery,
    category: category,
    department: department,
    page: pageRef.current,
    limit: 5,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, category, department, refetch]);

  if (isLoading) return <AdminLiveTendersSkeleton />;

  return (
    <AdminPagesWrapper>
      <LiveTenders
        data={data as ILiveTenders}
        isLoading={isLoading}
        refetch={refetch}
        isFetching={isFetching}
        pageRef={pageRef}
      />
    </AdminPagesWrapper>
  );
};

export default Tenders;
