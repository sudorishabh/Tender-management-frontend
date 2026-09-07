import DashboardWrapper from "@/components/DashboardWrapper";
import React from "react";
import ManageBids from "./_components/ManageTenders";

const AllTenders = () => {
  return (
    <DashboardWrapper title="Review Tenders" description="Review and manage all tenders">
        <ManageBids />
    </DashboardWrapper>
  );
};

export default AllTenders;
