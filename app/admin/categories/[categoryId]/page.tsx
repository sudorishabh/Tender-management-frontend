import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import CategoryDetails from "@/components/Categories/For-Admin/CategoryDetails";
import Heading from "@/components/Shared/Heading";
import React, { use } from "react";

const Details = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const resolvedParams = use(params);
  const { categoryId } = resolvedParams;

  return (
    <>
      <Heading
        title='Category Details - Teri Tender Management'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <AdminPagesWrapper>
        <CategoryDetails categoryId={categoryId} />
      </AdminPagesWrapper>
    </>
  );
};

export default Details;
