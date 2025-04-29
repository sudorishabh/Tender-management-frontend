"use client";
import { useGetVendorDetailsQuery } from "@/Redux/vendor/vendorApi";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import React, { FC } from "react";
import ManageVendorCategories from "./ManageVendorCategories";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { setActiveVendorDetails } from "@/Redux/vendor/venderDetailsPageSlice";
import EditVendorInfo from "./EditVendorInfo";
import { useRouter } from "next/navigation";
interface Props {
  vendorId: string;
}

const VendorEdit: FC<Props> = ({ vendorId }) => {
  const router = useRouter();
  const { active } = useSelector(
    (state: RootState) => state.venderDetailsPageSlice
  );
  const { data, isLoading, isError } = useGetVendorDetailsQuery(vendorId);

  const dispatch = useDispatch();
  const setActive = (index: number) => {
    dispatch(setActiveVendorDetails(index));
  };

  if (isLoading)
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <LoaderCircle className='animate-spin mx-auto' />
      </div>
    );

  if (isError || data.length === 0) {
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <h1 className='text-red-500 text-xl'>Data not available</h1>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='w-full bg-white mb-8'>
        <div className='flex items-center mb-4'>
          <button
            onClick={() => router.back()}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-4'>
            <ArrowLeft className='size-6' />
          </button>
          <div className='ml-4'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Edit Vendor Details
            </h1>
            <p className='text-gray-600 mt-1'>
              View and manage details for
              <span className='font-semibold text-gray-900 ml-1'>
                {data?.vendorDetails?.user?.fullname || "this vendor"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className='flex bg-card-darker1 flex-col rounded-lg'>
        <div className='mx-4 border-b pt-2 flex items-center gap-8 font-medium text-gray-700'>
          <button
            className={` py-4 px-6 ${
              active === 0 ? "border-b-2 font-semibold border-primary" : ""
            }
              `}
            onClick={() => setActive(0)}>
            Information
          </button>
          {data && data?.category?.is_sub_category !== true ? (
            <button
              className={`py-4 px-6 ${
                active === 1 ? "border-b-2 font-semibold border-primary" : ""
              }
                `}
              onClick={() => setActive(1)}>
              Category
            </button>
          ) : null}
        </div>

        <div>
          {active === 0 ? (
            <EditVendorInfo
              data={data}
              vendorId={vendorId}
            />
          ) : null}
          {active === 1 ? <ManageVendorCategories id={vendorId} /> : null}
        </div>
      </div>
    </div>
  );
};

export default VendorEdit;
