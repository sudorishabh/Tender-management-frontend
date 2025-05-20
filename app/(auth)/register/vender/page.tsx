"use client";
import VenderRegistration from "@/components/Auth/Registration/VenderRegistration";
import { RootState } from "@/Redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { isAgreementValid } from "@/Redux/vendor/venderSlice";

const VenderAgreement = () => {
  const router = useRouter();
  const venderRegistrationSlice = useSelector(
    (state: RootState) => state.venderSlice
  );
  const isAgreement = isAgreementValid(venderRegistrationSlice);

  useEffect(() => {
    if (!isAgreement) {
      router.push("/register");
    }
  }, [isAgreement, router]);

  if (!isAgreement) {
    return null;
  }

  return <VenderRegistration />;
};

export default VenderAgreement;
