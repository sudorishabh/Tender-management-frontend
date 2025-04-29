import Heading from "@/components/Shared/Heading";
import BidsOnTender from "@/components/Bid/For-Admin/BidsOnTender";
import React, { use } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
const Bids = ({ params }: { params: Promise<{ tenderId: string }> }) => {
  const resolvedParams = use(params);
  const { tenderId } = resolvedParams;

  return (
    <>
      <Heading
        title='Bids on Tender - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <BidsOnTender tenderId={tenderId} />
      </AdminPagesWrapper>
    </>
  );
};

export default Bids;
