import ManageApprovedBids from "./_components/ManageApprovedBids";
import DashboardWrapper from "@/_components/DashboardWrapper";
import React from "react";

const ApprovedBidsPage = () => {
  return (
    <DashboardWrapper
      title='Approved Bids'
      description='View and manage all approved bid submissions.'>
      <ManageApprovedBids />
    </DashboardWrapper>
  );
};

export default ApprovedBidsPage;
