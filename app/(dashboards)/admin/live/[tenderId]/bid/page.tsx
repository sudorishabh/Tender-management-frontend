"use client";
import React, { use } from "react";
import DashboardWrapper from "@/components/DashboardWrapper";
import BidsOnTender from "./_components/BidsOnTender";

const Bids = ({ params }: { params: Promise<{ tenderId: string }> }) => {
  const resolvedParams = use(params);
  const { tenderId } = resolvedParams;

  return (
    <DashboardWrapper
      title='Review Tender Bids'
      description='Review and evaluate bids based on technical and financial scores.'
      showBackButton={true}>
      <BidsOnTender tenderId={tenderId} />
    </DashboardWrapper>
  );
};

export default Bids;
