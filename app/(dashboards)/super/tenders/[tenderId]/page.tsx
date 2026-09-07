"use client";

import React from "react";
import { useParams } from "next/navigation";
import TenderDetailClient from "./_components/TenderDetailClient";
import DashboardWrapper from "@/_components/DashboardWrapper";
import PageLoading from "@/_components/Shared/PageLoading";

export default function ReviewTenderDetail() {
  const params = useParams();
  const idParam = params?.tenderId;
  console.log(idParam);
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) return <PageLoading />;

  return (
    <DashboardWrapper
      title='Tender Details'
      description='View detailed information about the selected tender.'
      showBackButton={true}>
      <TenderDetailClient tenderId={id} />
    </DashboardWrapper>
  );
}
