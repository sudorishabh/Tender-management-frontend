import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import CreateEditCategory from "@/components/Categories/For-Admin/CreateEditCategory";
import Heading from "@/components/Shared/Heading";
import React from "react";

const Add = () => {
  return (
    <>
      <Heading
        title='Add Category - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <CreateEditCategory />
      </AdminPagesWrapper>
    </>
  );
};

export default Add;
