"use client";
import VendorRegistration from "@/components/Auth/Registration/VendorRegistration";
import { RootState } from "@/Redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { isAgreementValid } from "@/Redux/vendor/vendorSlice";

const VendorAgreement = () => {
  const router = useRouter();
  const vendorRegistrationSlice = useSelector(
    (state: RootState) => state.vendorSlice
  );
  const isAgreement = isAgreementValid(vendorRegistrationSlice);

  useEffect(() => {
    if (!isAgreement) {
      router.push("/register");
    }
  }, [isAgreement, router]);

  if (!isAgreement) {
    return null;
  }

  return <VendorRegistration />;
};

export default VendorAgreement;
