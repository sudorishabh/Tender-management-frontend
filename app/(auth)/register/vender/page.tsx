"use client";
import VenderRegistration from "@/components/Auth/Registration/VenderRegistration";
import Heading from "@/components/Shared/Heading";
import { RootState } from "@/Redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { isAgreementValid } from "@/Redux/vendor/venderRegistrationSlice";

const VenderAgreement = () => {
  const router = useRouter();
  const venderRegistrationSlice = useSelector(
    (state: RootState) => state.venderRegistrationSlice
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

  return (
    <div className='pt-[3.8rem]'>
      <Heading
        title='TERI - Tender Management'
        description='A platform for venders to bid'
        keywords='Tender, Vender, Projects'
      />
      <VenderRegistration />
    </div>
  );
};

export default VenderAgreement;
