import Heading from "@/components/Shared/Heading";
import React from "react";
import dynamic from "next/dynamic";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import PageLoading from "@/components/Shared/PageLoading";
const ManageVendors = dynamic(
  () => import("@/components/Vendor/For-Admin/ManageVendors"),
  {
    loading: () => <PageLoading />,
  }
);

const Venders = () => {
  return (
    <>
      <Heading
        title='Vendors - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <ManageVendors />
      </AdminPagesWrapper>
    </>
  );
};

export default Venders;
