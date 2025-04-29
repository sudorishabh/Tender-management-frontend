import Heading from "@/components/Shared/Heading";
import BidDetails from "@/components/Bid/For-Admin/BidDetails";
import React, { use } from "react";

const Details = ({ params }: { params: Promise<{ bidId: string }> }) => {
  const resolvedParams = use(params);
  const { bidId } = resolvedParams;

  return (
    <div className='pt-[3.8rem]'>
      <Heading
        title='TERI - Tender Management'
        description='A platform for venders to bid'
        keywords='Tender, Vender, Projects'
      />
      <BidDetails bidId={bidId} />
    </div>
  );
};

export default Details;
