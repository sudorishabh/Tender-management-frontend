import React, { use } from "react";
import VendorPreview from "@/components/Vendor/For-Admin/VendorPreview";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
const Vendor = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;
  return (
    <AdminPagesWrapper>
      <VendorPreview vendorId={vendorId} />
    </AdminPagesWrapper>
  );
};

export default Vendor;
