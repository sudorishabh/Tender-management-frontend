"use client";
import React, { use, useEffect } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { useRef, useState } from "react";
import {
  useGetTenderBidsQuery,
  useSetBidStatusMutation,
} from "@/Redux/bid/bidApi";
import { useRouter } from "next/navigation";
import { IBidsOnTenderResponse } from "@/Types/Bid-Types";
import { NextRouter } from "next/router";
import { ErrorCodes } from "@/lib/errorCodes";
import { toast } from "sonner";
import { ApiError } from "@/Types";
import dynamic from "next/dynamic";
import AdminBidsOnTenderSkeleton from "@/components/Shared/skeleton/AdminBidsOnTenderSkeleton";

const BidsOnTender = dynamic(
  () => import("@/components/Bid/For-Admin/BidsOnTender")
);

const Bids = ({ params }: { params: Promise<{ tenderId: string }> }) => {
  const resolvedParams = use(params);
  const { tenderId } = resolvedParams;

  const pageRef = useRef(1);
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    bidId: string;
    status: string;
    ranking?: number;
  }>({
    isOpen: false,
    bidId: "",
    status: "",
  });
  const router = useRouter();

  const { data, isLoading, refetch, isFetching } = useGetTenderBidsQuery({
    tenderId,
    scoreFilter,
    page: pageRef.current,
    limit: 10,
  });
  const [setBidStatus, { isLoading: isSettingBidStatus }] =
    useSetBidStatusMutation();

  useEffect(() => {
    refetch();
  }, [refetch, scoreFilter]);

  async function confirmSetBidStatus() {
    try {
      await setBidStatus({
        bidId: confirmDialog.bidId,
        status: confirmDialog.status,
        ranking: confirmDialog.ranking,
      }).unwrap();
      toast.success("Bid status set successfully");
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Bid status set failed. Please try again.");
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  }

  if (isLoading) return <AdminBidsOnTenderSkeleton />;

  return (
    <AdminPagesWrapper>
      <BidsOnTender
        data={data as IBidsOnTenderResponse}
        tenderId={tenderId}
        isLoading={isLoading}
        refetch={refetch}
        isFetching={isFetching}
        pageRef={pageRef}
        setConfirmDialog={setConfirmDialog}
        confirmDialog={confirmDialog}
        setBidStatus={setBidStatus}
        isSettingBidStatus={isSettingBidStatus}
        router={router as unknown as NextRouter}
        confirmSetBidStatus={confirmSetBidStatus}
        scoreFilter={scoreFilter}
        setScoreFilter={setScoreFilter}
      />
    </AdminPagesWrapper>
  );
};

export default Bids;
