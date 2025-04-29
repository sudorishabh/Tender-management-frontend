"use client";
import Heading from "@/components/Shared/Heading";
import React from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import dynamic from "next/dynamic";
import CreateTenderSkeleton from "@/components/Shared/skeleton/CreateTenderSkeleton";
const CreateTender = dynamic(
  () => import("@/components/Tender/For-Admin/CreateTender"),
  {
    loading: () => <CreateTenderSkeleton />,
  }
);

const Create = () => {
  return (
    <>
      <Heading
        title='Create Tender - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <CreateTender />
      </AdminPagesWrapper>
    </>
  );
};

export default Create;
