import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import CategoryDetails from "@/components/Categories/For-Admin/CategoryDetails";
import React, { use } from "react";

const Details = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const resolvedParams = use(params);
  const { categoryId } = resolvedParams;

  return (
    <AdminPagesWrapper>
      <CategoryDetails categoryId={categoryId} />
    </AdminPagesWrapper>
  );
};

export default Details;
