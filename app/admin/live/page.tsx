import Heading from "@/components/Shared/Heading";
import LiveTenders from "@/components/Tender/For-Admin/LiveTenders";
import React from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";

const Tenders = async () => {
  return (
    <>
      <Heading
        title='Live Tenders - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <LiveTenders />
      </AdminPagesWrapper>
    </>
  );
};

export default Tenders;
