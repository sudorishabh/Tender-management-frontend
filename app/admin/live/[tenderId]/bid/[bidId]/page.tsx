"use client";
import React, { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  useGetBidByIdQuery,
  useUpdateBidScoreMutation,
  useSetBidStatusMutation,
} from "@/Redux/bid/bidApi";

import { useRouter } from "next/navigation";
import { ErrorCodes } from "@/lib/errorCodes";
import { ApiError } from "@/Types";
import { toast } from "sonner";
import AdminBidDetailsSkeleton from "@/components/Shared/skeleton/AdminBidDetailsSkeleton";
import { NextRouter } from "next/router";

const BidDetails = dynamic(
  () => import("@/components/Bid/For-Admin/BidDetails")
);

const Details = ({ params }: { params: Promise<{ bidId: string }> }) => {
  const [technicalScore, setTechnicalScore] = useState<number>(0);
  const [financialScore, setFinancialScore] = useState<number>(0);
  const [previousTechnicalScore, setPreviousTechnicalScore] =
    useState<number>(0);
  const [previousFinancialScore, setPreviousFinancialScore] =
    useState<number>(0);
  const [updateBidScore, { isLoading: isUpdatingScore }] =
    useUpdateBidScoreMutation();
  const [setBidStatus, { isLoading: isSettingBidStatus }] =
    useSetBidStatusMutation();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    status: string;
  }>({
    isOpen: false,
    status: "",
  });
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const resolvedParams = use(params);
  const { bidId } = resolvedParams;

  const router = useRouter();

  const { data, isLoading: isLoadingBid } = useGetBidByIdQuery(bidId);

  useEffect(() => {
    if (data?.bidsDetails) {
      const { bidData } = data.bidsDetails;
      const techScore = Math.min(Math.abs(bidData?.technical_score || 0), 5);
      const finScore = Math.min(Math.abs(bidData?.financial_score || 0), 5);
      setTechnicalScore(techScore);
      setFinancialScore(finScore);
      setPreviousTechnicalScore(techScore);
      setPreviousFinancialScore(finScore);
    }
  }, [data]);

  const handleTechnicalScoreChange = async (newScore: number) => {
    setPreviousTechnicalScore(technicalScore);
    setTechnicalScore(newScore);
    try {
      await updateBidScore({
        bidId,
        technicalScore: newScore,
        financialScore,
      }).unwrap();
      toast.success("Technical score updated successfully");
    } catch (error) {
      setTechnicalScore(previousTechnicalScore);
      toast.error("Failed to update technical score");
      console.error("Error updating technical score:", error);
    }
  };

  const handleFinancialScoreChange = async (newScore: number) => {
    setPreviousFinancialScore(financialScore);
    setFinancialScore(newScore);
    try {
      await updateBidScore({
        bidId,
        technicalScore,
        financialScore: newScore,
      }).unwrap();
      toast.success("Financial score updated successfully");
    } catch (error) {
      setFinancialScore(previousFinancialScore);
      toast.error("Failed to update financial score");
      console.error("Error updating financial score:", error);
    }
  };

  const handleUpdateStatus = (status: "selected" | "rejected") => {
    if (status === "selected") {
      setConfirmDialog({
        isOpen: true,
        status,
      });
    } else if (status === "rejected") {
      setRejectDialog({
        isOpen: true,
        message: "",
      });
    }
  };

  const confirmSetBidStatus = async () => {
    try {
      await setBidStatus({
        bidId,
        status: confirmDialog.status,
      }).unwrap();
      toast.success(`Bid ${confirmDialog.status.toLowerCase()} successfully`);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error(`Failed to ${confirmDialog.status.toLowerCase()} bid`);
        console.error(
          `Error updating status to ${confirmDialog.status}:`,
          error
        );
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  const handleSelectTemplate = (template: string) => {
    setRejectDialog({ ...rejectDialog, message: template });
  };

  const confirmRejectBid = async () => {
    if (!rejectDialog.message.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      await setBidStatus({
        bidId,
        status: "rejected",
        message: rejectDialog.message,
      }).unwrap();
      toast.success("Bid rejected successfully");
      setRejectDialog({ ...rejectDialog, isOpen: false });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      } else {
        toast.error("Failed to reject bid");
        console.error("Error rejecting bid:", error);
      }
    }
  };
  console.log(data);
  if (isLoadingBid) {
    return <AdminBidDetailsSkeleton />;
  }

  return (
    <div className='pt-[3.8rem]'>
      <BidDetails
        data={data}
        handleTechnicalScoreChange={handleTechnicalScoreChange}
        handleFinancialScoreChange={handleFinancialScoreChange}
        handleUpdateStatus={handleUpdateStatus}
        confirmSetBidStatus={confirmSetBidStatus}
        confirmRejectBid={confirmRejectBid}
        handleSelectTemplate={handleSelectTemplate}
        isUpdatingScore={isUpdatingScore}
        isSettingBidStatus={isSettingBidStatus}
        technicalScore={technicalScore}
        financialScore={financialScore}
        setRejectDialog={setRejectDialog}
        rejectDialog={rejectDialog}
        setConfirmDialog={setConfirmDialog}
        confirmDialog={confirmDialog}
        router={router as unknown as NextRouter}
      />
    </div>
  );
};

export default Details;
