"use client";
import ManageBids from "@/components/Bid/For-Admin/ManageBids";
import React, { useState } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { toast } from "sonner";
import PageError from "@/components/Shared/PageError";
import { useDeleteBidsMutation, useGetAllBidsQuery } from "@/Redux/bid/bidApi";
import AdminManageVendorSkeleton from "@/components/Shared/skeleton/AdminManageVendorSkeleton";

const Bids = () => {
  const [isBidDelete, setIsBidDelete] = useState<string[]>([]);
  const { data, isLoading, isError } = useGetAllBidsQuery({});
  const [deleteBids, { isLoading: deletingMultiple }] = useDeleteBidsMutation();

  async function handleDeleteBids() {
    try {
      const deleted = await deleteBids(isBidDelete).unwrap();
      if (deleted.success) {
        toast.success("Bids Deleted Successfully");
        setIsBidDelete([]);
      }
    } catch {
      toast.error("Error Deleting Bids");
    }
  }

  if (isLoading) return <AdminManageVendorSkeleton />;

  if (isError) {
    return <PageError message='Error fetching bids' />;
  }

  return (
    <AdminPagesWrapper>
      <ManageBids
        data={data}
        handleDeleteBids={handleDeleteBids}
        deletingMultiple={deletingMultiple}
        isBidDelete={isBidDelete}
        setIsBidDelete={setIsBidDelete}
      />
    </AdminPagesWrapper>
  );
};

export default Bids;
