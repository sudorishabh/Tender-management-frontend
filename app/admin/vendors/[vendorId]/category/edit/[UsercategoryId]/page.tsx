import AddEditVendorCategory from "@/components/Vendor/For-Admin/AddEditVenderCategory";
import Heading from "@/components/Shared/Heading";
import React, { use } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";

const Edit = ({
  params,
}: {
  params: Promise<{ vendorId: string; userCategoryId: string }>;
}) => {
  const resolvedParams = use(params);
  const { vendorId, userCategoryId } = resolvedParams;

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
          isEditMode={true}
          userCategoryId={userCategoryId}
        />
      </AdminPagesWrapper>
    </>
  );
};

export default Edit;
