"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { setAgreementForm } from "@/Redux/vendor/venderSlice";
import { useRouter } from "next/navigation";

import Agreement from "@/components/Auth/Registration/Agreement";

const Registration = () => {
  const [isAgreementFormErr, setIsAgreementFormErr] = useState({
    termErr: false,
    accPrivacyErr: false,
    businessEthicsErr: false,
  });

  const {
    isAcceptPrivacyChecked,
    isBusinessEthicsChecked,
    isTermServiceChecked,
  } = useSelector((state: RootState) => state.venderSlice);

  const dispatch = useDispatch();
  const router = useRouter();

  function handleAgreementForm() {
    if (!isTermServiceChecked) {
      setIsAgreementFormErr((prev) => ({ ...prev, termErr: true }));
    } else {
      setIsAgreementFormErr((prev) => ({ ...prev, termErr: false }));
    }
    if (!isAcceptPrivacyChecked) {
      setIsAgreementFormErr((prev) => ({ ...prev, accPrivacyErr: true }));
    } else {
      setIsAgreementFormErr((prev) => ({ ...prev, accPrivacyErr: false }));
    }
    if (!isBusinessEthicsChecked) {
      setIsAgreementFormErr((prev) => ({ ...prev, businessEthicsErr: true }));
    } else {
      setIsAgreementFormErr((prev) => ({ ...prev, businessEthicsErr: false }));
    }

    if (
      isTermServiceChecked &&
      isAcceptPrivacyChecked &&
      isBusinessEthicsChecked
    )
      router.push("/register/vender");
  }

  const setIsTermServiceChecked = (val: boolean) => {
    dispatch(
      setAgreementForm({
        isAcceptPrivacyChecked,
        isBusinessEthicsChecked,
        isTermServiceChecked: val,
      })
    );
  };
  const setIsAcceptPrivacyChecked = (val: boolean) => {
    dispatch(
      setAgreementForm({
        isAcceptPrivacyChecked: val,
        isBusinessEthicsChecked,
        isTermServiceChecked,
      })
    );
  };
  const setIsBusinessEthicsChecked = (val: boolean) => {
    dispatch(
      setAgreementForm({
        isAcceptPrivacyChecked,
        isBusinessEthicsChecked: val,
        isTermServiceChecked,
      })
    );
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Agreement
        handleAgreementForm={handleAgreementForm}
        isAgreementFormErr={isAgreementFormErr}
        isTermServiceChecked={isTermServiceChecked}
        setIsTermServiceChecked={setIsTermServiceChecked}
        isAcceptPrivacyChecked={isAcceptPrivacyChecked}
        setIsAcceptPrivacyChecked={setIsAcceptPrivacyChecked}
        isBusinessEthicsChecked={isBusinessEthicsChecked}
        setIsBusinessEthicsChecked={setIsBusinessEthicsChecked}
      />
    </div>
  );
};

export default Registration;
