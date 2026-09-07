"use client";
import React from "react";
import DashboardWrapper from "@/components/DashboardWrapper";
import CreateTender from "./_components/CreateTender";

const Create = () => {
  return (
    <DashboardWrapper
      title='Create Tender'
      description='Complete all steps to create a new tender.'>
      <CreateTender />
    </DashboardWrapper>
  );
};

export default Create;
