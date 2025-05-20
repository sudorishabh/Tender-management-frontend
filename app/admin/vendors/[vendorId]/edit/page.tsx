"use client";
import VendorEdit from "@/components/Vendor/For-Admin/VendorEdit";
import { use } from "react";
import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { setActiveVendorDetails } from "@/Redux/vendor/venderSlice";
import { useGetVendorDetailsQuery } from "@/Redux/vendor/vendorApi";
import { LoaderCircle } from "lucide-react";

const Vendor = ({ params }: { params: Promise<{ vendorId: string }> }) => {
  const resolvedParams = use(params);
  const { vendorId } = resolvedParams;

  const { vendorDetailsActive } = useSelector(
    (state: RootState) => state.venderSlice
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
  console.log(data);

  if (isError || data.length === 0) {
    return (
      <div className='w-full mt-40 flex items-center justify-center text-center'>
        <h1 className='text-red-500 text-xl'>Data not available</h1>
      </div>
    );
  }

  return (
    <AdminPagesWrapper>
      <VendorEdit
        vendorId={vendorId}
        data={data}
        active={vendorDetailsActive}
        setActive={setActive}
      />
    </AdminPagesWrapper>
  );
};

export default Vendor;
