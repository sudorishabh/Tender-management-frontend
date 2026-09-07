import React, { use } from "react";
import VendorPreview from "./_components/VendorPreview";
import DashboardWrapper from "@/components/DashboardWrapper";
const Vendor = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;
  return (
    <DashboardWrapper
      title='Vendor Details'
      description='View detailed information about the selected vendor.' showBackButton={true}>
      <VendorPreview vendorId={vendorId} />
    </DashboardWrapper>
  );
};

export default Vendor;
