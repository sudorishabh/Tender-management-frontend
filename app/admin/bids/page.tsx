import Heading from "@/components/Shared/Heading";
import ManageBids from "@/components/Bid/For-Admin/ManageBids";
import React from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
const Bids = () => {
  return (
    <>
      <Heading
        title='Bids - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <ManageBids />
      </AdminPagesWrapper>
    </>
  );
};

export default Bids;
