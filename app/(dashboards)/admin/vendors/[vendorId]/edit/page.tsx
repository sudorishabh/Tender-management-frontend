"use client";
import { use } from "react";
import { trpc } from "@/lib/trpc";
import PageLoading from "@/_components/Shared/PageLoading";
import EditVendorInfo from "./_components/EditVendorInfo";
import DashboardWrapper from "@/components/DashboardWrapper";

const Vendor = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;

  const { data, isLoading, isError } =
    trpc.vendor.getDetails.useQuery(vendorId);

  if (isLoading)
    return <PageLoading />;

  if (isError || !data) {
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <h1 className='text-red-500 text-xl'>Data not available</h1>
      </div>
    );
  }

  return (
    <DashboardWrapper
      title='Edit Vendor Details'
      description={`View and manage details for ${data?.user?.full_name || "this vendor"
        }`}
      showBackButton={true}>
      <EditVendorInfo
        user={data.user}
        business={data.business}
        vendorId={vendorId}
      />
    </DashboardWrapper>
  );
};

export default Vendor;
