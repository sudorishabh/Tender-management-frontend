import AddEditVendorCategory from "@/components/Vendor/For-Admin/AddEditVenderCategory";
import React, { use } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";

const Category = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;

  return (
    <AdminPagesWrapper>
      <AddEditVendorCategory
        vendorId={vendorId}
        isEditMode={false}
      />
    </AdminPagesWrapper>
  );
};

export default Category;
