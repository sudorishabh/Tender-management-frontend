import VendorEdit from "@/components/Vendor/For-Admin/VendorEdit";
import Heading from "@/components/Shared/Heading";
import { use } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";

const Vendor = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;

  return (
    <>
      <Heading
        title='TERI - Tender Management'
        description='A platform for vendors to bid'
        keywords='Tender, Vendor, Projects'
      />
      <AdminPagesWrapper>
        <VendorEdit vendorId={vendorId} />
      </AdminPagesWrapper>
    </>
  );
};

export default Vendor;
