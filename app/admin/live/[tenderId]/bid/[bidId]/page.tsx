import Heading from "@/components/Shared/Heading";
import BidDetails from "@/components/Bid/For-Admin/BidDetails";
import React, { use } from "react";

const Details = ({ params }: { params: Promise<{ bidId: string }> }) => {
  const resolvedParams = use(params);
  const { bidId } = resolvedParams;

  return (
    <div className='pt-[3.8rem]'>
      <Heading
        title='Bid Details - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <BidDetails bidId={bidId} />
    </div>
  );
};

export default Details;
