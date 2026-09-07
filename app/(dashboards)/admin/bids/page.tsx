import DashboardWrapper from "@/_components/DashboardWrapper";
import React from "react";
import ManageBids from "./_components/ManageBids";

const Bids = () => {
  return (
    <DashboardWrapper
      title='Manage Bids'
      description='Review and manage all bid submissions across tenders.'>
      <ManageBids />
    </DashboardWrapper>
  );
};

export default Bids;
