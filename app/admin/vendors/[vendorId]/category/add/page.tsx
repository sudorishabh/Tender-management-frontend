import AddEditVendorCategory from "@/components/Vendor/For-Admin/AddEditVenderCategory";
import Heading from "@/components/Shared/Heading";
import React, { use } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";

const Category = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;

  return (
    <>
      <Heading
        title='TERI - Tender Management'
        description='A platform for venders to bid'
        keywords='Tender, Vender, Projects'
      />
      <AdminPagesWrapper>
        <AddEditVendorCategory
          vendorId={vendorId}
          isEditMode={false}
        />
      </AdminPagesWrapper>
    </>
  );
};

export default Category;
