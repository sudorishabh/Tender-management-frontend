import React from "react";
import DashboardWrapper from "@/components/DashboardWrapper";
import dynamic from "next/dynamic";

const LiveTenders = dynamic(() => import("./_components/LiveTenders"));

const Tenders = () => {
  return (
    <DashboardWrapper
      title='Manage Live Tenders'
      description='Review, edit and track all tenders in one place.'>
      <LiveTenders />
    </DashboardWrapper>
  );
};

export default Tenders;
