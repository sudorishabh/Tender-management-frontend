"use client";
import { setAgreementForm } from "@/Redux/vendor/venderSlice";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const RegistrationSuccessful = dynamic(
  () => import("@/components/Auth/registrationSuccessful")
);

const RegistrationPendingMsg = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setAgreementForm({
        isTermServiceChecked: false,
        isAcceptPrivacyChecked: false,
        isBusinessEthicsChecked: false,
      })
    );
  }, [dispatch]);

  return <RegistrationSuccessful />;
};

export default RegistrationPendingMsg;
