"use client";
import Heading from "@/components/Shared/Heading";
import BuyTender from "@/components/Tender/BuyTender";
import { RootState } from "@/Redux/store";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Buy = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const toastShown = React.useRef(false);

  const {
    isLoggedIn,
    user: { role },
  } = useSelector((state: RootState) => state.authSlice);

  React.useEffect(() => {
    const isUnauthorized = !isLoggedIn || role !== "vendor";
    if (isUnauthorized && !toastShown.current) {
      toastShown.current = true;
      toast.error(
        "You must be a vendor to buy a tender, Please register first"
      );
      router.push("/register");
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role !== "vendor") {
    return null;
  }

  return (
    <div className='pt-[3.5rem]'>
      <Heading
        title='TERI - Tender Management'
        description='A platform for venders to bid'
        keywords='Tender, Vender, Projects'
      />
      <BuyTender tenderId={id} />
    </div>
  );
};

export default Buy;
