"use client";
import React, { useState } from "react";
import Heading from "@/_components/Shared/Heading";
import PageLoading from "@/_components/Shared/PageLoading";
import PageError from "@/_components/Shared/PageError";
import { trpc } from "@/lib/trpc";
import VendorProfileView from "./_components/VendorProfileView";
import VendorProfileEdit from "./_components/VendorProfileEdit";

const VendorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError, refetch } =
    trpc.vendor.getMyProfile.useQuery();

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError || !data?.vendorDetails) {
    return (
      <PageError
        title='Profile Not Found'
        message='Unable to load your profile. Please try again later.'
        onRetry={() => refetch()}
      />
    );
  }

  const handleEditSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  return (
    <div className='px-4 md:px-8 py-6'>
      <Heading
        title='Vendor Profile'
        description='Your vendor profile and business information'
        keywords='Profile, Vendor, Business'
      />

      <div className='mt-6'>
        {isEditing ? (
          <VendorProfileEdit
            data={data.vendorDetails}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <VendorProfileView
            data={data.vendorDetails}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default VendorProfilePage;
