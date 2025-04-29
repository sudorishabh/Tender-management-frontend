import AdminDashboard from "@/components/Admin/AdminDashboard";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import Heading from "@/components/Shared/Heading";
import React from "react";

const Admin = () => {
  return (
    <>
      <Heading
        title='Admin - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <AdminDashboard />
      </AdminPagesWrapper>
    </>
  );
};

export default Admin;
