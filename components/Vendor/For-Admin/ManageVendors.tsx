import React from "react";
import VendorsTable from "./VendorsTable";
import { Building, Users, SearchX } from "lucide-react";
import { IVendorsResponse } from "@/Types/Vendor-Types";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/Redux/store";
import { setManageVendorStatus } from "@/Redux/vendor/venderSlice";

interface Props {
  data: IVendorsResponse;
  isFetching: boolean;
  refetch: () => void;
  pageRef: React.MutableRefObject<number>;
}

const ManageVendors = ({ data, isFetching, refetch, pageRef }: Props) => {
  const dispatch = useDispatch();
  const { manageVendorStatus } = useSelector(
    (state: RootState) => state.venderSlice
  );
  return (
    <div>
      <div className='w-full bg-white mb-4'>
        <div className='container mx-auto px-6 pt-8 pb-4'>
          <h1 className='text-3xl font-bold text-gray-900'>Manage Vendors</h1>
          <p className='text-gray-600 mt-2 max-w-2xl'>
            View and manage all registered vendors in one place. Review vendor
            information, track their status, and manage their accounts.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-6 space-y-6'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
          <div className='p-4 bg-gray-50 border-b flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Users
                size={18}
                className='text-primary'
              />
              <h2 className='font-semibold text-gray-900'>Vendors List</h2>
              <div className='flex items-center gap-3'>
                <select
                  className='py-1.5 px-3 bg-white border border-gray-300 rounded-mmd text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary focus:border-primary'
                  value={manageVendorStatus}
                  onChange={(e) =>
                    dispatch(setManageVendorStatus(e.target.value))
                  }>
                  <option value='all'>Sort by Status</option>
                  <option value='pending'>Pending</option>
                  <option value='approved'>Approved</option>
                  <option value='rejected'>Rejected</option>
                </select>
                {/* <select
                  className='py-1.5 px-3 bg-white border border-gray-300 rounded-mmd text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary focus:border-primary'
                  value={manageVendorCategory}
                  onChange={(e) =>
                    dispatch(setManageVendorCategory(e.target.value))
                  }>
                  <option value='all'>Sort by Category</option>
                  {categoryData?.map((category) => (
                    <option
                      key={category.name}
                      value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select> */}
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <Building
                size={16}
                className='text-gray-400'
              />
              <span>Total Vendors: {data?.totalVendors || 0}</span>
            </div>
          </div>

          {data && data?.vendors?.length > 0 ? (
            <VendorsTable
              hasMore={data?.hasMore}
              isFetching={isFetching}
              refetch={refetch}
              pageRef={pageRef}
              data={data}
            />
          ) : (
            <div className='bg-white p-20 flex flex-col items-center justify-center'>
              <SearchX
                className='mb-4 text-gray-400'
                size={48}
              />
              <h3 className='text-gray-700 font-medium text-lg mb-1'>
                No vendors found
              </h3>
              <p className='text-gray-500'>
                There are currently no registered vendors in the system
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVendors;
