import React from "react";
import DashboardWrapper from "@/components/DashboardWrapper";
import dynamic from "next/dynamic";

const EditLiveTender = dynamic(
  () => import("./_components/EditLiveTender"),
);

const EditLiveTenderPage = ({
  params,
}: {
  params: Promise<{ tenderId: string }>;
}) => {
  return (
    <DashboardWrapper
      title="Edit Live Tender"
      description="Update the details of this published tender."
      showBackButton={true}>
      <EditLiveTender paramsPromise={params} />
    </DashboardWrapper>
  );
};

export default EditLiveTenderPage;
