"use client";
import React from "react";
import DashboardWrapper from "@/components/DashboardWrapper";
import { Plus } from "lucide-react";
import SavedTenders from "./_components/SavedTenders";
import { useRouter } from "next/navigation";

const SavedTendersPage = () => {
  const router = useRouter();
  return (
    <DashboardWrapper
      title='Saved Tenders'
      description='Continue editing your saved tenders or create a new one to publish to the marketplace'
      showBackButton={true}
      button={{
        label: "Create New Tender",
        icon: Plus,
        onClick: () => {
          router.push("/admin/create");
        },
      }}>
      <SavedTenders />
    </DashboardWrapper>
  );
};

export default SavedTendersPage;
