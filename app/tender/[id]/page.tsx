"use client";
import Heading from "@/components/Shared/Heading";
import PageError from "@/components/Shared/PageError";
import PageLoading from "@/components/Shared/PageLoading";
import TenderDetails from "@/components/Tender/TenderDetails";
import { useGetTenderDetailsQuery } from "@/Redux/tender/tenderApi";
import React, { use } from "react";

const Tender = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data, isLoading, isError } = useGetTenderDetailsQuery(id);

  if (isLoading) return <PageLoading />;

  if (isError || data.success === false) return <PageError />;

  return (
    <div className='pt-[3.5rem]'>
      <Heading
        title='TERI - Tender Management'
        description='A platform for vendors to bid'
        keywords='Tender, Vendor, Projects'
      />
      <TenderDetails tenderData={data} />
    </div>
  );
};

export default Tender;
