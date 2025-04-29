// import dynamic from "next/dynamic";
import Heading from "@/components/Shared/Heading";
import React from "react";
import ManageCategories from "@/components/Categories/For-Admin/ManageCategories";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";

const Categories = () => {
  return (
    <>
      <Heading
        title='Categories - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <ManageCategories />
      </AdminPagesWrapper>
    </>
  );
};

export default Categories;
