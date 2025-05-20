"use client";
import React, { useRef, useState } from "react";
import {
  useDeleteSavedTenderMutation,
  useGetSavedTendersQuery,
} from "@/Redux/tender/tenderApi";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { ISavedTender } from "@/Types/Tender-Types";
import dynamic from "next/dynamic";
import AdminSavedTendersSkeleton from "@/components/Shared/skeleton/AdminSavedTendersSkeleton";
import SavedTenderDeleteDialog from "@/components/Tender/For-Admin/SavedTender/SavedTenderDeleteDialog";

const SavedTenders = dynamic(
  () => import("@/components/Tender/For-Admin/SavedTender/SavedTenders")
);

const SavedTendersPage = () => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const pageRef = useRef(1);
  const { data, isLoading, refetch, isFetching } = useGetSavedTendersQuery({
    page: pageRef?.current,
    limit: 8,
  });
  const [deleteSavedTender] = useDeleteSavedTenderMutation();

  if (isLoading) {
    return <AdminSavedTendersSkeleton />;
  }

  const handleConfirmDelete = async (id: number) => {
    setDeleteId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleOnClose = () => {
    setIsConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleOnConfirm = async () => {
    await deleteSavedTender(deleteId);
    handleOnClose();
  };

  return (
    <>
      <AdminPagesWrapper>
        <SavedTenders
          data={data as ISavedTender}
          refetch={refetch}
          isFetching={isFetching}
          pageRef={pageRef}
          handleConfirmDelete={handleConfirmDelete}
        />
      </AdminPagesWrapper>
      <SavedTenderDeleteDialog
        isOpen={isConfirmDeleteOpen}
        onClose={handleOnClose}
        onConfirm={handleOnConfirm}
      />
    </>
  );
};

export default SavedTendersPage;
