import React from "react";
import dynamic from "next/dynamic";
import DashboardWrapper from "@/components/DashboardWrapper";
const ManageVendors = dynamic(() => import("./_components/ManageVendors"));

const Vendors = () => {
  return (
    <DashboardWrapper
      title='Manage Vendors'
      description='View and manage all registered vendors in one place.'>
      <ManageVendors />
    </DashboardWrapper>
  );
};

export default Vendors;
